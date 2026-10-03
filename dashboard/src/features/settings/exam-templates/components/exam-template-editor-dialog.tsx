import { IconAlertTriangle, IconPlus } from "@tabler/icons-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAnimalTypes } from "@/features/settings/animals/hooks/use-animal-types";
import { ExamBlockEditor } from "@/features/settings/exam-templates/components/exam-block-editor";
import {
	emptyBlock,
	SECTION_HINTS,
	SECTION_LABELS,
	suggestBlockId,
} from "@/features/settings/exam-templates/data/block-kinds";
import { useExamTemplateMutations } from "@/features/settings/exam-templates/hooks/use-exam-template-mutations";
import {
	type ExamBlock,
	type ExamTemplateResponse,
	parseExamBlocks,
	SOAP_SECTIONS,
} from "@sanad/contracts/runtime/server/clinical-notes/clinical-notes.type";

const ANY_SPECIES = "__any__";

export type TemplateDraft = {
	key: string;
	titleAr: string;
	presentingComplaint: string;
	animalTypeId: string | null;
	blocks: ExamBlock[];
	isDefault: boolean;
	active: boolean;
	/** عدد الملاحظات على القالب المصدر — يقرّر إن كان الحفظ سيُصدر نسخة جديدة */
	noteCount: number;
	/** قالب نظام يُنسخ إلى الأكاديمية بدل أن يُعدَّل */
	clonedFromSystem: boolean;
};

export const draftFromTemplate = (template: ExamTemplateResponse): TemplateDraft => ({
	key: template.key,
	titleAr: template.titleAr,
	presentingComplaint: template.presentingComplaint ?? "",
	animalTypeId: template.animalTypeId,
	blocks: (template.blocks ?? []) as unknown as ExamBlock[],
	isDefault: template.isDefault,
	active: template.active,
	noteCount: template._count.notes,
	clonedFromSystem: template.clinicId === null,
});

export const emptyDraft = (): TemplateDraft => ({
	key: "",
	titleAr: "",
	presentingComplaint: "",
	animalTypeId: null,
	blocks: [emptyBlock("prose", "S", "block_1")],
	isDefault: false,
	active: true,
	noteCount: 0,
	clonedFromSystem: false,
});

/**
 * [S3] محرّر القالب.
 *
 * لا يقرّر شيئًا بنفسه: الخادم يفرض أن قالبًا استُعمل يُصدَر من جديد بدل أن يُعدَّل،
 * وهذه الشاشة تجعل ذلك مرئيًّا قبل الضغط على «حفظ» بدل أن يكتشفه المستخدم بعده.
 */
export const ExamTemplateEditorDialog = ({
	draft,
	onClose,
}: {
	draft: TemplateDraft | null;
	onClose: () => void;
}) => {
	const { animalTypes } = useAnimalTypes();
	const { saveTemplate, isPending } = useExamTemplateMutations();
	const [form, setForm] = useState<TemplateDraft | null>(draft);
	const [error, setError] = useState<string | null>(null);

	// إعادة التهيئة عند فتح قالب مختلف
	const [seenDraft, setSeenDraft] = useState(draft);
	if (draft !== seenDraft) {
		setSeenDraft(draft);
		setForm(draft);
		setError(null);
	}

	if (!form) return null;

	const patch = (fields: Partial<TemplateDraft>) => setForm({ ...form, ...fields });

	const willVersion = form.noteCount > 0 && !form.clonedFromSystem;

	const submit = async () => {
		// نفس مُتحقِّق الخادم بالضبط، فالرسالة واحدة ولا تفترق النسختان
		const parsed = parseExamBlocks(form.blocks);
		if (!parsed.ok) {
			setError(parsed.error);
			return;
		}
		if (!form.key.trim() || !form.titleAr.trim()) {
			setError("مفتاح القالب وعنوانه مطلوبان");
			return;
		}
		setError(null);

		await saveTemplate({
			key: form.key.trim(),
			titleAr: form.titleAr.trim(),
			presentingComplaint: form.presentingComplaint.trim() || null,
			animalTypeId: form.animalTypeId,
			blocks: parsed.blocks,
			isDefault: form.isDefault,
			active: form.active,
		});
		onClose();
	};

	return (
		<Dialog
			open
			onOpenChange={(open) => !open && onClose()}
		>
			<DialogContent className="max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-4xl">
				<DialogTitle className="sr-only">محرّر قالب الفحص</DialogTitle>

				<div className="flex items-center justify-between border-b px-4 py-2">
					<span className="font-semibold text-sm">
						{form.clonedFromSystem ? "نسخ قالب النظام إلى الأكاديمية" : "قالب فحص"}
					</span>
					{willVersion && (
						<Badge
							variant="outline"
							className="gap-1 text-xs"
						>
							<IconAlertTriangle className="size-3.5" />
							سيُحفظ كإصدار جديد
						</Badge>
					)}
				</div>

				<div className="max-h-[70vh] space-y-4 overflow-y-auto px-4 py-3">
					{willVersion && (
						<p className="rounded-[4px] border bg-muted/40 p-3 text-xs leading-relaxed">
							هذا القالب مستعمَل في <strong>{form.noteCount}</strong> ملاحظة. لن يُعدَّل في مكانه:
							سيُحفظ إصدارًا جديدًا، وتبقى الملاحظات القديمة مثبَّتة على إصدارها. معرّفات الكتل هي
							مفاتيح الإجابات المخزّنة، وتغييرها على قالبٍ استُعمل ييتّمها.
						</p>
					)}
					{form.clonedFromSystem && (
						<p className="rounded-[4px] border bg-muted/40 p-3 text-xs leading-relaxed">
							قوالب النظام لا تُعدَّل. سيُحفظ هذا نسخةً تملكها أكاديميتك، وتهزم نسخةُ الأكاديمية قالبَ
							النظام في الاقتراح التلقائي. غيّر المفتاح إن أردت الاحتفاظ بالاثنين.
						</p>
					)}

					<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
						<div className="space-y-1">
							<Label className="text-xs">العنوان</Label>
							<Input
								className="h-8"
								placeholder="التهاب الجلد"
								value={form.titleAr}
								disabled={isPending}
								onChange={(event) => patch({ titleAr: event.target.value })}
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-xs">المفتاح</Label>
							<Input
								className="h-8 font-mono text-xs"
								dir="ltr"
								placeholder="DERM_V1"
								value={form.key}
								disabled={isPending}
								onChange={(event) => patch({ key: event.target.value.toUpperCase() })}
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-xs">الشكوى</Label>
							<Input
								className="h-8"
								placeholder="حكّة — يبحث بها المدرّب عن القالب"
								value={form.presentingComplaint}
								disabled={isPending}
								onChange={(event) => patch({ presentingComplaint: event.target.value })}
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-xs">النوع</Label>
							<Select
								value={form.animalTypeId ?? ANY_SPECIES}
								disabled={isPending}
								onValueChange={(value) =>
									patch({ animalTypeId: value === ANY_SPECIES ? null : value })
								}
							>
								<SelectTrigger className="h-8 w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent position="popper">
									<SelectItem value={ANY_SPECIES}>كل الأنواع</SelectItem>
									{animalTypes.map((type) => (
										<SelectItem
											key={type.id}
											value={type.id}
										>
											{type.arName}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-4">
						<div className="flex items-center gap-2">
							<Checkbox
								id="template-is-default"
								checked={form.isDefault}
								disabled={isPending}
								onCheckedChange={(checked) => patch({ isDefault: checked === true })}
							/>
							<Label
								htmlFor="template-is-default"
								className="text-xs font-normal"
							>
								يُقترح تلقائيًا لهذه الشكوى
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox
								id="template-active"
								checked={form.active}
								disabled={isPending}
								onCheckedChange={(checked) => patch({ active: checked === true })}
							/>
							<Label
								htmlFor="template-active"
								className="text-xs font-normal"
							>
								مفعّل
							</Label>
						</div>
					</div>

					<div className="space-y-3">
						{SOAP_SECTIONS.map((section) => {
							const sectionBlocks = form.blocks.filter((block) => block.section === section);
							return (
								<div
									key={section}
									className="space-y-2"
								>
									<div className="flex items-center justify-between">
										<div>
											<p className="font-semibold text-xs">{SECTION_LABELS[section]}</p>
											<p className="text-muted-foreground text-xs">{SECTION_HINTS[section]}</p>
										</div>
										<Button
											type="button"
											variant="outline"
											size="sm"
											disabled={isPending}
											onClick={() =>
												patch({
													blocks: [
														...form.blocks,
														emptyBlock(
															"prose",
															section,
															suggestBlockId(form.blocks.map((b) => b.id)),
														),
													],
												})
											}
										>
											<IconPlus className="size-3.5" />
											كتلة
										</Button>
									</div>

									{sectionBlocks.length === 0 ? (
										<p className="rounded-[4px] border border-dashed p-3 text-muted-foreground text-xs">
											لا كتل في هذا القسم بعد.
										</p>
									) : (
										sectionBlocks.map((block) => {
											const absolute = form.blocks.indexOf(block);
											return (
												<ExamBlockEditor
													key={block.id}
													block={block}
													index={absolute}
													total={form.blocks.length}
													disabled={isPending}
													onChange={(next) =>
														patch({
															blocks: form.blocks.map((b, i) => (i === absolute ? next : b)),
														})
													}
													onRemove={() =>
														patch({
															blocks: form.blocks.filter((_, i) => i !== absolute),
														})
													}
													onMove={(direction) => {
														const target = absolute + direction;
														if (target < 0 || target >= form.blocks.length) return;
														const next = [...form.blocks];
														[next[absolute], next[target]] = [next[target], next[absolute]];
														patch({ blocks: next });
													}}
												/>
											);
										})
									)}
								</div>
							);
						})}
					</div>

					{error && <p className="text-destructive text-xs">{error}</p>}
				</div>

				<div className="flex items-center justify-between gap-3 border-t px-4 py-2">
					<span className="text-muted-foreground text-xs">{form.blocks.length} كتلة</span>
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={onClose}
							disabled={isPending}
						>
							إلغاء
						</Button>
						<Button
							type="button"
							size="sm"
							onClick={submit}
							disabled={isPending}
						>
							حفظ
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
