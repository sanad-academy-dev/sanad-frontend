import { zodResolver } from "@hookform/resolvers/zod";
import { IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
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
import {
	emptyVitalsForm,
	MUCOUS_MEMBRANE_LABELS,
	PROFILE_HAS_EXTRAS,
	VITALS_FIELD_BY_KEY,
	VITALS_PROFILES,
	type VitalsProfile,
} from "@/features/services/vital-signs/data/vitals-fields";
import {
	useCreateVitalSigns,
	useUpdateVitalSigns,
} from "@/features/services/vital-signs/hooks/use-vital-signs-mutations";
import { MucousMembrane } from "@/generated/prisma/enums";
import {
	type CreateVitalSignsFormValues,
	createVitalSignsSchema,
	EMPTY_RECORD_MESSAGE,
	hasAnyMeasurement,
	type VitalSignsRecordResponse,
	type VitalsAttachTarget,
} from "@sanad/contracts/runtime/server/vital-signs/vital-signs.type";

interface AddVitalsDialogProps {
	patientId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** الحقول المعروضة — الزيارة تلتقط كل شيء، والمختبر/الأشعة الأساسيات */
	profile?: VitalsProfile;
	/** الربط بمستند فور الإنشاء — الإنشاء والربط نداء واحد */
	attachTo?: VitalsAttachTarget;
	/** تمريره يحوّل النافذة إلى تعديل؛ المرتبط منه يُنشئ تصحيحًا لا يكتب فوقه */
	editing?: VitalSignsRecordResponse | null;
	onSaved?: (record: VitalSignsRecordResponse) => void;
}

/** يحوّل السجل القادم من الخادم إلى قيم نموذج — Decimal يصل كسلسلة نصية */
function toFormValues(
	record: VitalSignsRecordResponse,
	patientId: string,
): CreateVitalSignsFormValues {
	const num = (v: string | number | null) => (v == null ? null : Number(v));
	return {
		patientId,
		recordedAt: new Date(record.recordedAt),
		branchId: record.branchId,
		weight: num(record.weight as string | null),
		temperature: num(record.temperature as string | null),
		heartRate: record.heartRate,
		respiratoryRate: record.respiratoryRate,
		oxygenSaturation: record.oxygenSaturation,
		bloodPressure: record.bloodPressure,
		painScore: record.painScore,
		bodyConditionScore: record.bodyConditionScore,
		capillaryRefillSec: num(record.capillaryRefillSec as string | null),
		mucousMembrane: record.mucousMembrane,
		notes: record.notes,
	};
}

export function AddVitalsDialog({
	patientId,
	open,
	onOpenChange,
	profile = "FULL",
	attachTo,
	editing = null,
	onSaved,
}: AddVitalsDialogProps) {
	const { createVitalSigns, isPending: isCreating } = useCreateVitalSigns(patientId);
	const { updateVitalSigns, isPending: isUpdating } = useUpdateVitalSigns(patientId);
	const isPending = isCreating || isUpdating;

	const {
		register,
		handleSubmit,
		control,
		reset,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm<CreateVitalSignsFormValues>({
		resolver: zodResolver(createVitalSignsSchema),
		defaultValues: emptyVitalsForm(patientId),
	});

	// كل فتح يبدأ من صفحة نظيفة — قيم قياس سابق عالقة في النموذج تُسجَّل بالخطأ
	useEffect(() => {
		if (open) reset(editing ? toFormValues(editing, patientId) : emptyVitalsForm(patientId));
	}, [open, editing, patientId, reset]);

	const keys = VITALS_PROFILES[profile];
	const showExtras = PROFILE_HAS_EXTRAS[profile];

	const onSubmit = handleSubmit(async (values) => {
		if (!hasAnyMeasurement(values)) {
			setError("root", { message: EMPTY_RECORD_MESSAGE });
			return;
		}
		clearErrors("root");

		try {
			const record = editing
				? await updateVitalSigns(editing.id, values)
				: await createVitalSigns(values, attachTo);
			if (record) onSaved?.(record as VitalSignsRecordResponse);
		} catch {
			return; // الفشل يُبقي النافذة مفتوحة — التوست يعرض السبب
		}
		onOpenChange(false);
	});

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				showCloseButton={false}
				className="max-h-[85vh] gap-0 overflow-hidden p-0 sm:max-w-2xl"
				dir="rtl"
			>
				<DialogTitle className="sr-only">
					{editing ? "تعديل قياس العلامات الحيوية" : "قياس علامات حيوية جديد"}
				</DialogTitle>

				<form
					className="flex max-h-[85vh] flex-col"
					onSubmit={onSubmit}
				>
					<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
						<span className="text-sm font-semibold">
							{editing ? "تعديل القياس" : "قياس جديد"}
						</span>
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<IconX className="size-4" />
							<span className="sr-only">إغلاق</span>
						</button>
					</div>

					<div className="flex-1 space-y-4 overflow-y-auto p-4">
						{editing && (
							<p className="rounded-[4px] bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
								القياس المرتبط بمستند لا يُعدَّل في مكانه — سيُحفظ التعديل كسجل تصحيح، ويبقى
								المستند على القياس الأصلي.
							</p>
						)}

						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							{keys.map((key) => {
								const spec = VITALS_FIELD_BY_KEY.get(key);
								if (!spec) return null;
								return (
									<Field
										key={key}
										data-invalid={!!errors[key]}
									>
										<Label htmlFor={`vs-${key}`}>
											{spec.label}
											{spec.unit && ` (${spec.unit})`}
										</Label>
										<Input
											id={`vs-${key}`}
											type="number"
											inputMode="decimal"
											step={spec.step}
											min={spec.min}
											max={spec.max}
											placeholder={spec.hint}
											disabled={isPending}
											aria-invalid={!!errors[key]}
											{...register(key, {
												setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
											})}
										/>
										<FieldError errors={[errors[key]]} />
									</Field>
								);
							})}

							{showExtras && (
								<>
									<Field data-invalid={!!errors.bloodPressure}>
										<Label htmlFor="vs-bp">ضغط الدم (mmHg)</Label>
										<Input
											id="vs-bp"
											placeholder="مثال: 120/80"
											dir="ltr"
											disabled={isPending}
											aria-invalid={!!errors.bloodPressure}
											{...register("bloodPressure")}
										/>
										<FieldError errors={[errors.bloodPressure]} />
									</Field>

									<Controller
										name="mucousMembrane"
										control={control}
										render={({ field }) => (
											<Field data-invalid={!!errors.mucousMembrane}>
												<Label>الأغشية المخاطية</Label>
												<Select
													value={field.value ?? undefined}
													onValueChange={field.onChange}
													disabled={isPending}
													dir="rtl"
												>
													<SelectTrigger>
														<SelectValue placeholder="—" />
													</SelectTrigger>
													<SelectContent position="popper">
														{Object.values(MucousMembrane).map((v) => (
															<SelectItem
																key={v}
																value={v}
															>
																{MUCOUS_MEMBRANE_LABELS[v]}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FieldError errors={[errors.mucousMembrane]} />
											</Field>
										)}
									/>
								</>
							)}

							<Controller
								name="recordedAt"
								control={control}
								render={({ field }) => (
									<Field data-invalid={!!errors.recordedAt}>
										<Label htmlFor="vs-recorded-at">وقت القياس</Label>
										<Input
											id="vs-recorded-at"
											type="datetime-local"
											dir="ltr"
											disabled={isPending}
											value={field.value ? toLocalInput(field.value) : ""}
											onChange={(e) =>
												field.onChange(e.target.value ? new Date(e.target.value) : undefined)
											}
										/>
										<FieldError errors={[errors.recordedAt]} />
									</Field>
								)}
							/>
						</div>

						<Field data-invalid={!!errors.notes}>
							<Label htmlFor="vs-notes">ملاحظات</Label>
							<Textarea
								id="vs-notes"
								rows={2}
								disabled={isPending}
								placeholder="ملاحظة على هذا القياس (اختياري)"
								{...register("notes")}
							/>
							<FieldError errors={[errors.notes]} />
						</Field>

						{/* خطأ المستوى الأعلى: سجل بلا أي قياس */}
						{errors.root?.message && (
							<p className="text-sm text-destructive">{errors.root.message}</p>
						)}
					</div>

					<div className="flex items-center gap-2 border-t px-4 py-2">
						<Button
							type="submit"
							size="sm"
							disabled={isPending}
						>
							حفظ
						</Button>
						<Button
							type="button"
							size="sm"
							variant="outline"
							disabled={isPending}
							onClick={() => onOpenChange(false)}
						>
							إلغاء
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

/** input[type=datetime-local] يتوقّع وقتًا محليًا بلا منطقة زمنية */
function toLocalInput(value: Date | string) {
	const d = new Date(value);
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
