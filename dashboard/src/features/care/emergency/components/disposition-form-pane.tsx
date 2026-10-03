import { IconChevronRight } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useMemo, useState } from "react";

import { FormFooter } from "@/components/common/form-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DispositionConsents } from "@/features/care/emergency/components/disposition-consents";
import { DISPOSITION_FORMS } from "@/features/care/emergency/data/disposition-forms";
import { useDispose } from "@/features/care/emergency/hooks/use-emergency";
import { useOperationProcedureTemplates } from "@/features/services/operations/hooks/use-operation-procedures";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import {
	DispositionKind,
	type InpatientAcuity,
	type InpatientStayKind,
	type TriageCategory,
} from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { triageDefaults } from "@sanad/contracts/runtime/server/emergency/emergency.rules";
import {
	DISPOSITION_KIND_LABELS,
	dispositionAllowedBeforeService,
} from "@sanad/contracts/runtime/server/emergency/emergency.workflow";
import {
	INPATIENT_ACUITY_LABELS,
	INPATIENT_KIND_LABELS,
} from "@sanad/contracts/runtime/server/inpatients/inpatients.workflow";

/**
 * [E5.3] لوح المآل — **لوحٌ داخل ورقة القرار، لا ورقة ثانية فوقها.**
 *
 * ── لماذا لوح لا ورقة ───────────────────────────────────────────────────────
 *
 * الطبقة السابقة فتحت ورقتين متراكبتين، وهو ما لا يُنتج «جنبًا إلى جنب» أبدًا:
 * ورقة Radix الثانية modal، فتفرش طبقة تعتيم فوق الأولى و`pointer-events: none`
 * على كل ما خارجها — أي أن ورقة الاختيار تبقى مرئية خلف التعتيم و**لا تُلمَس**.
 * وإطفاء الـmodal على الاثنتين يُسقط حبس التركيز ومفتاح الهروب معًا.
 *
 * فالحلّ ورقة واحدة تتّسع: لوح الاختيار (يمين في RTL) ولوح المآل (يسار)، بينهما
 * حدّ واحد، وكلاهما حيّ. والاتّجاه يوافق سهم الاختيار: يشير يسارًا، وهناك يُفتح.
 */

export type DispositionFormPaneProps = {
	kind: DispositionKind;
	onBack: () => void;
	onDone: () => void;
	appointmentId: string | null;
	appointmentStatus: string | null;
	category: TriageCategory | null;
	patientId: string | null;
	dir: "rtl" | "ltr";
};

export const DispositionFormPane = ({
	kind,
	onBack,
	onDone,
	appointmentId,
	appointmentStatus,
	category,
	patientId,
	dir,
}: DispositionFormPaneProps) => {
	const { dispose, isPending } = useDispose();
	const { templates } = useOperationProcedureTemplates();
	const { staff } = useStaff();

	const [notes, setNotes] = useState("");
	const [destination, setDestination] = useState("");
	const [admitKind, setAdmitKind] = useState<InpatientStayKind | null>(null);
	const [admitAcuity, setAdmitAcuity] = useState<InpatientAcuity | null>(null);
	const [procedureServiceId, setProcedureServiceId] = useState("");
	const [surgeonStaffId, setSurgeonStaffId] = useState("");
	const [durationMin, setDurationMin] = useState("60");

	const defaults = useMemo(() => (category ? triageDefaults(category) : null), [category]);
	const inService = appointmentStatus === "IN_SERVICE";
	const spec = DISPOSITION_FORMS[kind];

	const missing = (() => {
		if (!inService && !dispositionAllowedBeforeService(kind)) {
			return "ابدأ الدورة قبل هذا القرار";
		}
		if (kind === DispositionKind.TRANSFERRED && !destination.trim()) return "اذكر الوجهة";
		if (kind === DispositionKind.TO_SURGERY && (!procedureServiceId || !surgeonStaffId)) {
			return "اختر الإجراء والجرّاح";
		}
		return null;
	})();
	const canSubmit = !isPending && missing === null && appointmentId != null;

	const submit = async () => {
		if (!appointmentId) return;
		await dispose({
			appointmentId,
			kind,
			notes: notes.trim() || null,
			transferDestination: kind === DispositionKind.TRANSFERRED ? destination.trim() : null,
			admit:
				kind === DispositionKind.ADMITTED
					? {
							kind: admitKind ?? defaults?.inpatientKind,
							acuity: admitAcuity ?? defaults?.inpatientAcuity,
						}
					: null,
			surgery:
				kind === DispositionKind.TO_SURGERY
					? {
							procedureServiceId,
							surgeonStaffId,
							estimatedDurationMin: Number(durationMin) || 60,
						}
					: null,
		});
		onDone();
	};

	useHotkey("Mod+Enter", () => void (canSubmit && submit()));

	return (
		<section className="flex min-h-0 min-w-0 flex-1 flex-col">
			<div className="flex items-center gap-2 border-b px-4 py-2">
				<Button
					size="sm"
					variant="ghost"
					className="-ms-2 h-7 gap-1 px-2"
					disabled={isPending}
					onClick={onBack}
				>
					{/* الرجوع إلى لوح الاختيار — وهو يمين هذا اللوح في RTL */}
					<IconChevronRight className="size-4 rtl:rotate-0" />
					رجوع
				</Button>
				<h2 className="font-medium text-sm">{DISPOSITION_KIND_LABELS[kind]}</h2>
			</div>

			<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
				{/* ما سيحدث — يُقرأ قبل الضغط لا بعده */}
				<p
					className={cn(
						"rounded-md border px-3 py-2 text-xs",
						spec.grave
							? "border-destructive/30 bg-destructive/5 text-destructive"
							: "text-muted-foreground",
					)}
				>
					{spec.effect}
				</p>

				{/* الإقرارات أوّلًا — من وحدة الإقرارات نفسها */}
				<DispositionConsents
					patientId={patientId}
					appointmentId={appointmentId}
					templateKeys={spec.consentTemplateKeys}
					gapNote={spec.consentGapNote}
				/>

				{kind === DispositionKind.TRANSFERRED ? (
					<div className="flex flex-col gap-2">
						<Label>المنشأة المُحوَّل إليها</Label>
						<Input
							value={destination}
							onChange={(e) => setDestination(e.target.value)}
							placeholder="اسم المستشفى أو الأكاديمية"
							disabled={isPending}
						/>
					</div>
				) : null}

				{kind === DispositionKind.ADMITTED ? (
					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-2">
							<Label>نوع الإقامة</Label>
							<Select
								value={admitKind ?? defaults?.inpatientKind ?? "MEDICAL"}
								onValueChange={(v) => setAdmitKind(v as InpatientStayKind)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								{/* popper إلزامي: الافتراضي يُعرض خارج الشاشة في RTL */}
								<SelectContent
									position="popper"
									dir={dir}
								>
									{(Object.keys(INPATIENT_KIND_LABELS) as InpatientStayKind[])
										.filter((v) => v !== "BOARDING")
										.map((v) => (
											<SelectItem
												key={v}
												value={v}
											>
												{INPATIENT_KIND_LABELS[v]}
											</SelectItem>
										))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex flex-col gap-2">
							<Label>الحرجية</Label>
							<Select
								value={admitAcuity ?? defaults?.inpatientAcuity ?? "MEDIUM"}
								onValueChange={(v) => setAdmitAcuity(v as InpatientAcuity)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent
									position="popper"
									dir={dir}
								>
									{(Object.keys(INPATIENT_ACUITY_LABELS) as InpatientAcuity[]).map((v) => (
										<SelectItem
											key={v}
											value={v}
										>
											{INPATIENT_ACUITY_LABELS[v]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<p className="col-span-2 text-muted-foreground text-xs">
							مُعبَّأة من اللون ويمكن تغييرها. الإسكان في قفص يقرّره العنبر لا هذا اللوح.
						</p>
					</div>
				) : null}

				{kind === DispositionKind.TO_SURGERY ? (
					<div className="flex flex-col gap-3">
						<div className="flex flex-col gap-2">
							<Label>الإجراء الجراحي</Label>
							<Select
								value={procedureServiceId}
								onValueChange={setProcedureServiceId}
							>
								<SelectTrigger>
									<SelectValue placeholder="اختر الإجراء" />
								</SelectTrigger>
								<SelectContent
									position="popper"
									dir={dir}
								>
									{templates.map((t) => (
										<SelectItem
											key={t.serviceId}
											value={t.serviceId}
										>
											{t.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-[1fr_auto] gap-3">
							<div className="flex flex-col gap-2">
								<Label>الجرّاح</Label>
								<Select
									value={surgeonStaffId}
									onValueChange={setSurgeonStaffId}
								>
									<SelectTrigger>
										<SelectValue placeholder="اختر الجرّاح" />
									</SelectTrigger>
									<SelectContent
										position="popper"
										dir={dir}
									>
										{staff.map((s) => (
											<SelectItem
												key={s.id}
												value={s.id}
											>
												{s.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col gap-2">
								<Label>المدّة (د)</Label>
								<Input
									type="number"
									min={5}
									max={720}
									value={durationMin}
									onChange={(e) => setDurationMin(e.target.value)}
									className="w-24"
									disabled={isPending}
								/>
							</div>
						</div>
					</div>
				) : null}

				<div className="flex flex-col gap-2">
					<Label>ملاحظات</Label>
					<Textarea
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						rows={3}
						placeholder={
							kind === DispositionKind.DISCHARGED
								? "تعليمات المنزل، موعد المتابعة…"
								: undefined
						}
						disabled={isPending}
					/>
				</div>
			</div>

			<FormFooter
				disabled={isPending}
				extra={
					missing ? <span className="text-muted-foreground text-xs">{missing}</span> : null
				}
			>
				<Button
					size="sm"
					variant="ghost"
					disabled={isPending}
					onClick={onBack}
				>
					إلغاء
				</Button>
				<Button
					size="sm"
					variant={spec.grave ? "destructive" : "default"}
					disabled={!canSubmit}
					onClick={submit}
				>
					{DISPOSITION_KIND_LABELS[kind]}
				</Button>
			</FormFooter>
		</section>
	);
};
