import { IconX } from "@tabler/icons-react";
import { createPortal } from "react-dom";
import { Controller, type UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { VaccinationChecklistRow } from "@/features/appointments/components/vaccination-checklist-row";
import { cn } from "@/lib/utils";
import type { VitalsFormInput } from "@/server/clinical-exams/clinical-exams.type";

const PROTOCOL_ITEMS: {
	key: keyof VitalsFormInput & `checklist${string}`;
	label: string;
	required: boolean;
}[] = [
	{
		key: "checklistPatientData",
		label: "تسجيل بيانات الطفل (النوع / العمر / الوزن)",
		required: true,
	},
	{ key: "checklistChiefComplaint", label: "تحديد الشكوى الأساسية", required: true },
	{ key: "checklistSymptomDuration", label: "مدة الأعراض وتطورها", required: true },
	{ key: "checklistDiet", label: "النظام الغذائي", required: true },
	{ key: "checklistVaccinations", label: "سجل التطعيمات", required: true },
	{ key: "checklistPreviousTreatments", label: "العلاجات أو الأدوية السابقة", required: true },
	{ key: "checklistTemperature", label: "قياس درجة الحرارة", required: true },
	{ key: "checklistHeartRate", label: "تسجيل نبضات القلب", required: true },
	{ key: "checklistBloodPressure", label: "تقييم ضغط الدم", required: true },
	{ key: "checklistHydration", label: "تقييم مستوى الترطيب", required: true },
	{ key: "checklistBehavior", label: "تقييم النشاط والسلوك", required: false },
	{ key: "checklistAppetite", label: "تقييم الشهية", required: true },
	{ key: "checklistOxygen", label: "مراقبة مستوى الأكسجين", required: true },
	{ key: "checklistSkin", label: "فحص الجلد", required: true },
	{ key: "checklistSeverity", label: "درجة الخطورة", required: true },
	{ key: "checklistAppearance", label: "تقييم المظهر", required: true },
	{ key: "checklistRespiration", label: "فحص التنفس", required: true },
	{ key: "checklistDigestive", label: "فحص الجهاز الهضمي", required: true },
	{ key: "checklistNervous", label: "فحص الجهاز العصبي", required: false },
	{ key: "checklistEar", label: "حالة الأذن", required: false },
	{ key: "checklistVomiting", label: "تقييم القيء أو الإسهال", required: false },
	{
		key: "checklistConsciousness",
		label: "تقييم الوعي والاستجابة أو حالة العيون",
		required: false,
	},
	{ key: "checklistDiagnosis", label: "تحديد التشخيص", required: true },
	{ key: "checklistUltrasound", label: "طلب سونار", required: false },
	{ key: "checklistReferral", label: "إحالة إلى مدرّب مختص", required: false },
	{ key: "checklistXray", label: "طلب أشعة", required: false },
	{ key: "checklistFollowup", label: "تحديد زيارة متابعة", required: false },
];

interface ProtocolPanelProps {
	open: boolean;
	onClose: () => void;
	form: UseFormReturn<VitalsFormInput>;
	disabled?: boolean;
	/** معرّف الطفل — يجعل بند التطعيمات يقرأ السجل الحقيقي بدل أن يكون إقرارًا حرًّا */
	patientId?: string | null;
}

export function ProtocolPanel({
	open,
	onClose,
	form,
	disabled,
	patientId,
}: ProtocolPanelProps) {
	if (typeof document === "undefined") return null;

	const allKeys = PROTOCOL_ITEMS.map((i) => i.key) as (keyof VitalsFormInput)[];
	const values = form.watch(allKeys);
	const checked = (values as boolean[]).filter(Boolean).length;
	const total = PROTOCOL_ITEMS.length;

	return createPortal(
		<div
			className={cn(
				"fixed top-0 bottom-0 my-4 w-96 z-[60] flex flex-col rounded-lg border bg-background shadow-xl",
				open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
			)}
			style={{
				left: open ? "calc(100vw * 2 / 3 + 0.75rem)" : "calc(100vw * 2 / 3 - 1rem)",
				transition: "left 300ms ease-in-out, opacity 300ms ease-in-out",
			}}
			dir="rtl"
		>
			<div className="flex items-center justify-between border-b px-4 py-3 shrink-0">
				<div className="flex items-center gap-2">
					<span className="font-semibold text-sm">البروتوكول الطبي</span>
					<span className="text-muted-foreground text-xs tabular-nums">
						{checked}/{total}
					</span>
				</div>
				<Button
					type="button"
					size="icon"
					variant="ghost"
					className="size-7"
					onClick={onClose}
				>
					<IconX className="size-4" />
				</Button>
			</div>

			<div className="flex-1 overflow-y-auto px-4 py-3">
				<div className="flex flex-col gap-3">
					{PROTOCOL_ITEMS.map((item) => (
						<Controller
							key={item.key}
							control={form.control}
							name={item.key}
							render={({ field }) =>
								// بند التطعيمات وحده يعرض السجل الحقيقي: البند الذي لا يقابله سجل
								// كان إقرارًا لا يُثبت شيئًا. البقية مربّعات كما هي.
								item.key === "checklistVaccinations" ? (
									<VaccinationChecklistRow
										patientId={patientId}
										checked={!!field.value}
										onReviewed={(reviewed) => {
											field.onChange(reviewed);
											form.setValue(
												"vaccinationReviewedAt",
												reviewed ? new Date().toISOString() : null,
												{ shouldDirty: true },
											);
										}}
										disabled={disabled}
									/>
								) : (
									<label
										htmlFor={`protocol-${item.key}`}
										className={cn(
											"flex cursor-pointer items-start justify-between gap-3",
											disabled && "cursor-not-allowed opacity-50",
										)}
									>
										<span
											className={cn(
												"text-sm leading-snug",
												field.value && "text-muted-foreground line-through",
											)}
										>
											{item.label}
										</span>
										<div className="flex items-center gap-2 shrink-0 mt-0.5">
											<span
												className={cn(
													"rounded-sm px-1.5 py-0.5 text-xs font-medium",
													item.required
														? "text-destructive bg-destructive/10"
														: "text-muted-foreground bg-muted",
												)}
											>
												{item.required ? "إلزامي" : "اختياري"}
											</span>
											<Checkbox
												id={`protocol-${item.key}`}
												checked={!!field.value}
												onCheckedChange={field.onChange}
												disabled={disabled}
											/>
										</div>
									</label>
								)
							}
						/>
					))}
				</div>
			</div>
		</div>,
		document.body,
	);
}
