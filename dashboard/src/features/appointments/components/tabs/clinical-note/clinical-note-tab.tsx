import { IconLock, IconPlus } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

import { Spinner } from "@/components/common/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProceduresTable } from "@/features/appointments/components/tabs/clinical-exam/treatment-plan-step";
import { NoteBlockField } from "@/features/appointments/components/tabs/clinical-note/note-block-field";
import { useAppointment } from "@/features/appointments/hooks/use-appointment";
import {
	useAppointmentNotes,
	useClinicalNoteMutations,
	useResolvedTemplate,
} from "@/features/appointments/hooks/use-clinical-notes";
import { MedicationsPanel } from "@/features/pharmacy/components/medications-panel";
import { useExamTemplates } from "@/features/settings/exam-templates/hooks/use-exam-templates";
import {
	type ClinicalNoteResponse,
	type ExamBlock,
	type NoteAnswers,
	type NoteAnswerValue,
	SOAP_SECTIONS,
	type SoapSection,
} from "@sanad/contracts/runtime/server/clinical-notes/clinical-notes.type";

/**
 * [S4] سجلّ الزيارة كملاحظة SOAP.
 *
 * يحلّ محلّ المعالج ذي الخطوات الأربع حين تكون راية `soapNotes` مرفوعة. الفروق
 * التي تهمّ، لا الشكل:
 *
 *  ١) الشكل يأتي من القالب لا من الشيفرة، فيختلف باختلاف الشكوى.
 *  ٢) الملاحظة **تُقفل**. اليوم يبقى الفحص «المكتمل» قابلًا للتعديل عبر مسارات
 *     PATCH نفسها إلى الأبد؛ هنا يجمّد التوثيق النصّ ويصير التصحيح مُلحَقًا.
 *  ٣) الزيارة تحتمل أكثر من ملاحظة — إعادة فحص، أو رأي مدرّب ثانٍ.
 *
 * وما لا يتغيّر: جداول الطلبات والأدوية هي نفسها المستوردة من خطوة الخطة، لا نسخة
 * منها. تلك الأسلاك تعمل، وإعادة بنائها كانت ستكون خسارة صافية.
 */

const SECTION_TITLES: Record<SoapSection, string> = {
	S: "الشكوى والتاريخ",
	O: "الفحص الموضوعي",
	A: "التقييم",
	P: "الخطة",
};

/** كم ننتظر بعد آخر ضغطة مفتاح قبل حفظ المسوّدة */
const AUTOSAVE_MS = 1200;

export const ClinicalNoteTab = ({ appointmentId }: { appointmentId: string }) => {
	const { appointment } = useAppointment(appointmentId);
	const { notes, isLoading } = useAppointmentNotes(appointmentId);
	// بالشكوى ونوع الكشف. `AppointmentResponse` لا يحمل نوع الطفل، والمُحلّل
	// يتدبّر الغياب — القالب المقيَّد بنوع يُستبعد، والعامّ يبقى مُرشَّحًا.
	const { template: suggested } = useResolvedTemplate(
		appointment?.reason ?? null,
		null,
		appointment?.consultationType?.id ?? null,
		!!appointment,
	);
	// كل القوالب المتاحة — للاختيار اليدوي حين لا يناسب المُقترح (§7.1)
	const { templates } = useExamTemplates();
	const {
		createNote,
		saveDraft,
		finalizeNote,
		addAddendum,
		isCreating,
		isSaving,
		isFinalizing,
		isAmending,
	} = useClinicalNoteMutations(appointmentId);

	const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
	const [answers, setAnswers] = useState<NoteAnswers>({});
	const [addendumText, setAddendumText] = useState("");
	/** اختيار المدرّب لهذه الزيارة — يتجاوز المُقترح، ولا يُغيّر إعداد الكشف */
	const [pickedTemplateId, setPickedTemplateId] = useState<string | null>(null);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const loadedNoteId = useRef<string | null>(null);

	const note: ClinicalNoteResponse | null =
		notes.find((candidate) => candidate.id === activeNoteId) ?? notes[0] ?? null;

	// تحميل إجابات الملاحظة مرّة واحدة عند فتحها — لا عند كل إعادة جلب، وإلّا
	// داست الاستجابةُ ما يكتبه المدرّب في هذه اللحظة.
	useEffect(() => {
		if (note && loadedNoteId.current !== note.id) {
			loadedNoteId.current = note.id;
			setAnswers((note.answers ?? {}) as unknown as NoteAnswers);
		}
	}, [note]);

	// إلغاء الحفظ المؤجَّل عند إغلاق التبويب — الدالّة تُرجع void لا قيمة
	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
		},
		[],
	);

	if (isLoading || !appointment) return <Spinner />;

	const readOnly = !!note && note.status !== "DRAFT";
	// من القالب المثبَّت على الملاحظة نفسها — لا من قائمة القوالب النشطة الآن
	const blocks = (note?.template?.blocks ?? []) as unknown as ExamBlock[];

	const scheduleSave = (next: NoteAnswers) => {
		if (!note || readOnly) return;
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			void saveDraft({ noteId: note.id, answers: next });
		}, AUTOSAVE_MS);
	};

	const setAnswer = (blockId: string, value: NoteAnswerValue) => {
		const next = { ...answers, [blockId]: value };
		setAnswers(next);
		scheduleSave(next);
	};

	const vitalsSummary = note?.objective?.includes("العلامات الحيوية")
		? note.objective.split("\n").find((line) => line.startsWith("العلامات الحيوية"))
		: null;

	// القالب الذي ستُفتح به الملاحظة: اختيار المدرّب إن اختار، وإلّا المُقترح.
	// الترتيب مقصود — قرار الآن يسبق أي إعداد سابق.
	const templateToUse = pickedTemplateId ?? suggested?.id ?? null;

	// ── لا ملاحظة بعد ────────────────────────────────────────────────────────
	if (!note) {
		return (
			<div className="flex max-w-xl flex-col items-start gap-4 p-6">
				<div>
					<p className="font-semibold text-sm">لا ملاحظة لهذه الزيارة بعد</p>
					<p className="text-muted-foreground text-xs">
						{suggested
							? `القالب المُقترح لهذا الكشف: ${suggested.titleAr}`
							: "لا قالب مُقترح — اختر واحدًا"}
					</p>
				</div>

				{/* الاستبدال الاختياري (§7.1): المُقترح يأتي من إعداد الكشف أو من
				    مطابقة الشكوى، ويبقى للمدرّب أن يستبدله لهذه الزيارة وحدها. */}
				<div className="w-full space-y-1">
					<Label className="text-xs">القالب</Label>
					<Select
						value={templateToUse ?? ""}
						disabled={isCreating}
						onValueChange={setPickedTemplateId}
					>
						<SelectTrigger className="h-8 w-full">
							<SelectValue placeholder="اختر قالبًا..." />
						</SelectTrigger>
						<SelectContent position="popper">
							{templates.map((candidate) => (
								<SelectItem
									key={candidate.id}
									value={candidate.id}
								>
									{candidate.titleAr}
									{candidate.id === suggested?.id ? " · المُقترح" : ""}
									{candidate.clinicId === null ? " · نظام" : ""}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<Button
					size="sm"
					disabled={isCreating || !appointment.patient?.id || !templateToUse}
					onClick={() =>
						void createNote({
							patientId: appointment.patient.id,
							templateId: templateToUse,
						})
					}
				>
					<IconPlus className="size-3.5" />
					ابدأ الملاحظة
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 p-4">
			{/* ── الرأس: الملاحظة النشطة وحالتها ───────────────────────────────── */}
			<div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
				<div className="flex items-center gap-2">
					<span className="font-semibold text-sm">
						{note.templateKey ?? "ملاحظة"}
						{note.templateVersion ? ` · إصدار ${note.templateVersion}` : ""}
					</span>
					<Badge
						variant={note.status === "DRAFT" ? "secondary" : "outline"}
						className="text-xs"
					>
						{note.status === "DRAFT"
							? "مسوّدة"
							: note.status === "FINAL"
								? "موثَّقة"
								: "موثَّقة ومُصحَّحة"}
					</Badge>
					{isSaving && <span className="text-muted-foreground text-xs">جارٍ الحفظ...</span>}
				</div>

				<div className="flex items-center gap-2">
					{notes.length > 1 && (
						<Select
							value={note.id}
							onValueChange={setActiveNoteId}
						>
							<SelectTrigger className="h-8 w-56">
								<SelectValue />
							</SelectTrigger>
							<SelectContent position="popper">
								{notes.map((candidate) => (
									<SelectItem
										key={candidate.id}
										value={candidate.id}
									>
										{candidate.author?.name ?? "ملاحظة"} ·{" "}
										{new Date(candidate.createdAt).toLocaleDateString("ar")}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
					<Button
						size="sm"
						variant="outline"
						disabled={isCreating}
						onClick={() =>
							void createNote({
								patientId: appointment.patient.id,
								templateId: pickedTemplateId ?? suggested?.id ?? null,
							})
						}
					>
						<IconPlus className="size-3.5" />
						ملاحظة أخرى
					</Button>
					{note.status === "DRAFT" && (
						<Button
							size="sm"
							disabled={isFinalizing}
							onClick={() => void finalizeNote(note.id)}
						>
							<IconLock className="size-3.5" />
							إنهاء وتوثيق
						</Button>
					)}
				</div>
			</div>

			{readOnly && (
				<p className="rounded-[4px] border bg-muted/40 p-3 text-xs leading-relaxed">
					هذه الملاحظة موثَّقة، فنصّها مُجمَّد ولا يُعدَّل. التصحيح يُضاف مُلحَقًا أسفل الصفحة ويبقى الأصل
					كما كُتب.
				</p>
			)}

			{/* ── الأقسام الأربعة ───────────────────────────────────────────────── */}
			{SOAP_SECTIONS.map((section) => {
				const sectionBlocks = blocks.filter((block) => block.section === section);
				const isPlan = section === "P";
				if (sectionBlocks.length === 0 && !isPlan) return null;

				return (
					<section
						key={section}
						className="space-y-3"
					>
						<h3 className="font-bold text-sm">{SECTION_TITLES[section]}</h3>

						{sectionBlocks.map((block) => (
							<NoteBlockField
								key={block.id}
								block={block}
								value={answers[block.id]}
								readOnly={readOnly}
								vitalsSummary={vitalsSummary}
								onChange={(value) => setAnswer(block.id, value)}
							/>
						))}

						{/* الطلبات والأدوية تبقى كما هي — نفس المكوّنات ونفس الخطّافات.
						    هي «P» في SOAP، وقد كانت تعمل في خطوة الخطة قبل هذه الشاشة. */}
						{isPlan && (
							<div className="flex flex-col gap-8 pt-2">
								<ProceduresTable
									appointmentId={appointmentId}
									disabled={readOnly}
								/>
								<MedicationsPanel
									appointmentId={appointmentId}
									patientId={appointment.patient?.id ?? null}
									disabled={readOnly}
								/>
							</div>
						)}
					</section>
				);
			})}

			{/* ── الملاحق ───────────────────────────────────────────────────────── */}
			{note.addenda.length > 0 && (
				<section className="space-y-2 border-t pt-4">
					<h3 className="font-bold text-sm">التصحيحات</h3>
					{note.addenda.map((addendum) => (
						<div
							key={addendum.id}
							className="rounded-[4px] border p-3"
						>
							<p className="text-xs leading-relaxed">{addendum.text}</p>
							<p className="mt-1 text-muted-foreground text-xs">
								{addendum.authoredBy?.name ?? "—"} ·{" "}
								{new Date(addendum.createdAt).toLocaleString("ar")}
							</p>
						</div>
					))}
				</section>
			)}

			{readOnly && (
				<section className="space-y-2 border-t pt-4">
					<Label className="text-xs">إضافة تصحيح</Label>
					<Textarea
						rows={2}
						placeholder="ما الذي استجدّ بعد التوثيق؟"
						value={addendumText}
						disabled={isAmending}
						onChange={(event) => setAddendumText(event.target.value)}
					/>
					<Button
						size="sm"
						disabled={isAmending || addendumText.trim().length === 0}
						onClick={async () => {
							await addAddendum(note.id, addendumText.trim());
							setAddendumText("");
						}}
					>
						إضافة مُلحَق
					</Button>
				</section>
			)}
		</div>
	);
};
