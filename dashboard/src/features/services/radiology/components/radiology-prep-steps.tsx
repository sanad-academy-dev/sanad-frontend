import { zodResolver } from "@hookform/resolvers/zod";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { ToggleChip } from "@/components/common/toggle-chip";
import { Field } from "@/components/ui/field";
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
	useSaveRadiologyPrep,
	useSaveRadiologySafety,
} from "@/features/services/radiology/hooks/use-radiology-procedure";
import { VitalsPicker } from "@/features/services/vital-signs/components/vitals-picker";
import { LabFastingStatus, SedationLevel } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import {
	FASTING_LABELS,
	MEDICATION_OPTIONS,
	NO_MEDICATIONS,
} from "@sanad/contracts/runtime/server/lab-tests/lab-sample.type";
import type {
	RadiologyItemResponse,
	RadiologyOrderResponse,
} from "@/server/radiology/radiology.type";
import {
	modalityCapabilities,
	SEDATION_NEED_HINT,
} from "@sanad/contracts/runtime/server/radiology/radiology-modality";
import {
	type RadiologyPrepFormInput,
	type RadiologySafetyFormInput,
	radiologyPrepSchema,
	radiologySafetySchema,
	SEDATION_LABELS,
} from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

// خطوتا التحضير الأوليان: ① فحص السلامة (على مستوى الطلب/الطفل)
// ② تجهيز الطفل (على مستوى الفحص). لا زر حفظ داخلي — «التالي» في لوحة
// الفحص يستدعي الحفظ المسجَّل عبر registerSave ثم يتقدّم بالمرحلة.

type RegisterSave = (save: (() => Promise<unknown>) | null) => void;

/** سؤال نعم/لا ثلاثي الحالات (غير مُجاب/نعم/لا) — حقول السلامة الحرجة */
function YesNoField({
	label,
	value,
	onChange,
	disabled,
	danger,
}: {
	label: string;
	value: boolean | null | undefined;
	onChange: (value: boolean) => void;
	disabled?: boolean;
	danger?: boolean;
}) {
	return (
		<div className="flex items-center justify-between gap-2 rounded-md border p-2.5">
			<span className="flex items-center gap-1.5 text-sm">
				{danger && value === true && (
					<IconAlertTriangleFilled className="size-4 text-red-600" />
				)}
				{label}
			</span>
			<div className="flex gap-1.5">
				<ToggleChip
					active={value === true}
					disabled={disabled}
					className={cn(
						"w-20",
						danger && value === true && "border-red-300 bg-red-50 text-red-700",
					)}
					onClick={() => onChange(true)}
				>
					نعم
				</ToggleChip>
				<ToggleChip
					active={value === false}
					disabled={disabled}
					className="w-20"
					onClick={() => onChange(false)}
				>
					لا
				</ToggleChip>
			</div>
		</div>
	);
}

/** ① فحص السلامة — صيام وأدوية وموانع التصوير والعلامات الحيوية */
function SafetyStep({
	order,
	item,
	registerSave,
}: {
	order: RadiologyOrderResponse;
	item: RadiologyItemResponse;
	registerSave: RegisterSave;
}) {
	const { saveSafety, isPending } = useSaveRadiologySafety();
	const screening = order.safetyScreening;

	const { control, register, getValues, watch, setValue } = useForm<RadiologySafetyFormInput>({
		resolver: zodResolver(radiologySafetySchema),
		defaultValues: {
			fastingStatus: screening?.fastingStatus ?? null,
			fastingHours: screening?.fastingHours ?? null,
			medications: screening?.medications ?? [],
			pregnancyPossible: screening?.pregnancyPossible ?? null,
			metalImplants: screening?.metalImplants ?? null,
			implantNotes: screening?.implantNotes ?? null,
			priorContrastReaction: screening?.priorContrastReaction ?? null,
			allergies: screening?.allergies ?? null,
			asaClass: screening?.asaClass ?? null,
		},
	});

	// «التالي» في اللوحة يستدعي هذا الحفظ — القيم الحالية كما هي، كل الحقول اختيارية.
	// المخطط يقسر مدخلات النصوص الرقمية (coerce) قبل الإرسال.
	useEffect(() => {
		registerSave(() => {
			const values = radiologySafetySchema.parse(getValues());
			return saveSafety({ ...values, orderId: order.id });
		});
		return () => registerSave(null);
	}, [registerSave, getValues, saveSafety, order.id]);

	const fastingStatus = watch("fastingStatus");
	const medications = watch("medications") ?? [];
	const metalImplants = watch("metalImplants");
	// أسئلة السلامة تتبع طريقة التصوير: الحمل يهمّ الإشعاع المؤيّن، والغرسات
	// المعدنية خطر الرنين، والتفاعل مع التباين لا معنى له بلا تباين
	const caps = modalityCapabilities(item.modality);
	const showSafetyBlock = caps.ionizing || caps.metalSafety || caps.contrast;

	const toggleMedication = (option: string, checked: boolean) => {
		// "لا يتناول أدوية" يلغي البقية والعكس صحيح
		if (option === NO_MEDICATIONS) {
			setValue("medications", checked ? [NO_MEDICATIONS] : []);
			return;
		}
		const withoutNone = medications.filter((m) => m !== NO_MEDICATIONS && m !== option);
		setValue("medications", checked ? [...withoutNone, option] : withoutNone);
	};

	return (
		<div className="flex flex-col gap-4">
			{/* الصيام — يهمّ التخدير وفحوصات البطن بالسونار */}
			<Field>
				<Label className="text-sm font-medium">حالة الصيام</Label>
				<Controller
					name="fastingStatus"
					control={control}
					render={({ field }) => (
						<Select
							value={field.value ?? ""}
							onValueChange={(v) => field.onChange((v || null) as LabFastingStatus | null)}
							disabled={isPending}
						>
							<SelectTrigger dir="rtl">
								<SelectValue placeholder="غير محدد" />
							</SelectTrigger>
							<SelectContent
								position="popper"
								dir="rtl"
							>
								{Object.values(LabFastingStatus).map((status) => (
									<SelectItem
										key={status}
										value={status}
									>
										{FASTING_LABELS[status]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>
			</Field>

			{(fastingStatus === LabFastingStatus.FASTED ||
				fastingStatus === LabFastingStatus.PARTIAL) && (
				<Field>
					<Label className="text-sm font-medium">عدد ساعات الصيام</Label>
					<Input
						type="number"
						min={0}
						disabled={isPending}
						{...register("fastingHours")}
					/>
				</Field>
			)}

			<div className="flex flex-col gap-2">
				<Label className="text-sm font-medium">الأدوية الحالية</Label>
				<div className="flex flex-wrap gap-1.5">
					{[...MEDICATION_OPTIONS, NO_MEDICATIONS].map((option) => (
						<ToggleChip
							key={option}
							active={medications.includes(option)}
							disabled={isPending}
							className="w-32"
							onClick={() => toggleMedication(option, !medications.includes(option))}
						>
							{option}
						</ToggleChip>
					))}
				</div>
			</div>

			{/* موانع التصوير — تظهر حسب طريقة التصوير، والإجابات الخطرة بالأحمر */}
			{showSafetyBlock && (
				<div className="flex flex-col gap-2">
					<Label className="text-sm font-medium">سلامة التصوير</Label>
					{/* الحمل: خطر التعريض الإشعاعي وحده */}
					{caps.ionizing && (
						<Controller
							name="pregnancyPossible"
							control={control}
							render={({ field }) => (
								<YesNoField
									label="احتمال حمل؟"
									value={field.value}
									onChange={field.onChange}
									disabled={isPending}
									danger
								/>
							)}
						/>
					)}
					{/* الغرسات المعدنية: خطر سلامة في الرنين المغناطيسي تحديدًا */}
					{caps.metalSafety && (
						<>
							<Controller
								name="metalImplants"
								control={control}
								render={({ field }) => (
									<YesNoField
										label="غرسات أو شرائح معدنية؟ (حرجة للرنين)"
										value={field.value}
										onChange={field.onChange}
										disabled={isPending}
										danger
									/>
								)}
							/>
							{metalImplants === true && (
								<Field>
									<Textarea
										rows={2}
										placeholder="نوع الغرسة وموضعها"
										disabled={isPending}
										{...register("implantNotes")}
									/>
								</Field>
							)}
						</>
					)}
					{/* التفاعل مع التباين: لطرق التصوير التي تستخدمه */}
					{caps.contrast && (
						<Controller
							name="priorContrastReaction"
							control={control}
							render={({ field }) => (
								<YesNoField
									label="تفاعل سابق مع مادة التباين؟"
									value={field.value}
									onChange={field.onChange}
									disabled={isPending}
									danger
								/>
							)}
						/>
					)}
				</div>
			)}

			<Field>
				<Label className="text-sm font-medium">حساسيات معروفة</Label>
				<Input
					placeholder="لا شيء معروف"
					disabled={isPending}
					{...register("allergies")}
				/>
			</Field>

			{/* تصنيف ASA — يُسأل حين يُرجَّح التخدير؛ السونار لا يحتاجه عادةً */}
			{caps.sedation !== "rarely" && (
				<Field>
					<Label className="text-sm font-medium">تصنيف ASA (مخاطر التخدير)</Label>
					<Controller
						name="asaClass"
						control={control}
						render={({ field }) => (
							<Select
								value={field.value != null ? String(field.value) : ""}
								onValueChange={(v) => field.onChange(v ? Number(v) : null)}
								disabled={isPending}
							>
								<SelectTrigger dir="rtl">
									<SelectValue placeholder="غير مقيَّم" />
								</SelectTrigger>
								<SelectContent
									position="popper"
									dir="rtl"
								>
									{[1, 2, 3, 4, 5].map((grade) => (
										<SelectItem
											key={grade}
											value={String(grade)}
										>
											ASA {grade}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
				</Field>
			)}

			{/*
			  آخر قياس يُجلب تلقائيًا مع شارة عمره — يهمّ هنا لأن الوزن أساس حساب
			  جرعة التخدير والتباين. المربوط لقطة ثابتة لهذا الطلب حتى لو سُجّل قياس
			  أحدث لاحقًا (docs/vital-signs-plan.md §4).
			*/}
			<VitalsPicker
				patientId={order.patient.id}
				target={{ type: "RADIOLOGY", id: order.id }}
				attached={screening?.vitalsRecord ?? null}
				profile="BASIC"
			/>
		</div>
	);
}

/** ② تجهيز الطفل — الوضعية والتهدئة لهذا الفحص */
function PrepStep({
	item,
	registerSave,
}: {
	item: RadiologyItemResponse;
	registerSave: RegisterSave;
}) {
	const { savePrep, isPending } = useSaveRadiologyPrep();
	const execution = item.execution;

	const { control, register, getValues, watch } = useForm<RadiologyPrepFormInput>({
		resolver: zodResolver(radiologyPrepSchema),
		defaultValues: {
			positioning: execution?.positioning ?? null,
			sedationUsed: execution?.sedationUsed ?? null,
			sedationAgent: execution?.sedationAgent ?? null,
		},
	});

	useEffect(() => {
		registerSave(() => savePrep({ ...getValues(), itemId: item.id }));
		return () => registerSave(null);
	}, [registerSave, getValues, savePrep, item.id]);

	const sedationUsed = watch("sedationUsed");
	// نصّ التهدئة يتبع الفحص: الرنين يكاد يستحيل بلا تخدير، والسونار عكسه
	const caps = modalityCapabilities(item.modality);

	return (
		<div className="flex flex-col gap-4">
			<Field>
				<Label className="text-sm font-medium">الوضعية والتثبيت</Label>
				<Textarea
					rows={3}
					placeholder="مثال: استلقاء جانبي أيمن مع تثبيت الأطراف، كيس رمل تحت الرقبة"
					disabled={isPending}
					{...register("positioning")}
				/>
			</Field>

			<Field>
				<Label className="text-sm font-medium">التهدئة / التخدير</Label>
				<p
					className={cn(
						"rounded-md border px-2 py-1.5 text-[11px]",
						caps.sedation === "usually"
							? "border-amber-200 bg-amber-50 text-amber-800"
							: "bg-muted/30 text-muted-foreground",
					)}
				>
					{SEDATION_NEED_HINT[caps.sedation]}
				</p>
				<Controller
					name="sedationUsed"
					control={control}
					render={({ field }) => (
						<Select
							value={field.value ?? ""}
							onValueChange={(v) => field.onChange((v || null) as SedationLevel | null)}
							disabled={isPending}
						>
							<SelectTrigger dir="rtl">
								<SelectValue placeholder="غير محدد" />
							</SelectTrigger>
							<SelectContent
								position="popper"
								dir="rtl"
							>
								{Object.values(SedationLevel).map((level) => (
									<SelectItem
										key={level}
										value={level}
									>
										{SEDATION_LABELS[level]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>
			</Field>

			{sedationUsed && sedationUsed !== SedationLevel.NONE && (
				<Field>
					<Label className="text-sm font-medium">العقار والجرعة</Label>
					<Input
						placeholder="مثال: ديكسميديتوميدين 5 مكغ/كغم عضليًا"
						disabled={isPending}
						{...register("sedationAgent")}
					/>
				</Field>
			)}
		</div>
	);
}

export function RadiologyPrepSteps({
	step,
	order,
	item,
	registerSave,
}: {
	step: "safety" | "prep";
	order: RadiologyOrderResponse;
	item: RadiologyItemResponse;
	registerSave: RegisterSave;
}) {
	if (step === "safety") {
		return (
			<SafetyStep
				order={order}
				item={item}
				registerSave={registerSave}
			/>
		);
	}
	return (
		<PrepStep
			item={item}
			registerSave={registerSave}
		/>
	);
}
