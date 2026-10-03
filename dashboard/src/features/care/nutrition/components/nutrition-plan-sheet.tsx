import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconTrash, IconWand } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { AiFieldButton } from "@/components/common/ai-field-button";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { RequiredMark } from "@/components/common/required-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
	ComboboxValue,
} from "@/components/ui/combobox";
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
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BcsScale } from "@/features/care/nutrition/components/bcs-scale";
import { EnergyPanel } from "@/features/care/nutrition/components/energy-panel";
import {
	useDietFoods,
	useNutritionCalculator,
	useNutritionMutations,
} from "@/features/care/nutrition/hooks/use-nutrition";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import {
	ACTIVITY_LABELS,
	FEEDING_METHOD_LABELS,
	FOOD_FORM_LABELS,
	GOAL_LABELS,
	LIFE_STAGE_LABELS,
	MCS_LABELS,
	NUTRITION_RISK_FACTORS,
	type NutritionPlanDetailResponse,
	nutritionPlanSchema,
} from "@sanad/contracts/runtime/server/nutrition/nutrition.type";
import { idealWeightFromBcs } from "@sanad/contracts/runtime/server/nutrition/nutrition-energy";

// مُنشئ خطة التغذية — التقييم ← الحساب ← الوصفة.
//
// تصميم الشاشة يتبع تسلسل القرار السريري لا تسلسل الجدول: يُقيَّم الطفل أولًا،
// فتظهر السعرات، فتُختار الأغذية التي تُقسَّم عليها. الحاسبة تعمل مع كل تغيير،
// فأثر كل خيار مرئي قبل الالتزام به — وهذا ما يفصل «مُنشئ خطة» عن «نموذج إدخال».

const asNumber = (value: unknown): number | null => {
	if (value === "" || value == null) return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
};

type PlanFormValues = {
	patientId: string;
	prescriberId?: string | null;
	goal: NutritionPlanDetailResponse["goal"];
	currentWeightKg: number;
	bodyConditionScore?: number | null;
	muscleConditionScore?: NutritionPlanDetailResponse["muscleConditionScore"];
	idealWeightKg?: number | null;
	idealWeightSource?: "bcs" | "manual" | "history" | null;
	lifeStage: NutritionPlanDetailResponse["lifeStage"];
	activity: NutritionPlanDetailResponse["activity"];
	isNeutered: boolean;
	riskFactors: string[];
	medicalConditions: string[];
	feedingMethod: NutritionPlanDetailResponse["feedingMethod"];
	mealsPerDay: number;
	currentDietSummary?: string | null;
	treatsSummary?: string | null;
	tableFoodSummary?: string | null;
	supplementsSummary?: string | null;
	medicationFoodSummary?: string | null;
	waterSource?: string | null;
	environmentNotes?: string | null;
	currentTreatCaloriePercent?: number | null;
	manualDerFactor?: number | null;
	targetWeeklyRatePercent?: number | null;
	recheckIntervalDays: number;
	items: {
		dietFoodId?: string | null;
		nameSnapshot: string;
		formSnapshot: NutritionPlanDetailResponse["items"][number]["formSnapshot"];
		energyDensityKcalPerKgSnapshot: number;
		energySharePercent: number;
		householdUnit: NutritionPlanDetailResponse["items"][number]["householdUnit"];
		householdUnitGrams?: number | null;
		isTreat: boolean;
		notes?: string | null;
	}[];
	feedingInstructions?: string | null;
	clinicalNotes?: string | null;
	transitionDays?: number | null;
};

/** ما يُرسَل إلى الحاسبة الحيّة — مطابق لما يُسلسَل في `calcKey` */
type CalcPayload = Pick<
	PlanFormValues,
	| "patientId"
	| "goal"
	| "lifeStage"
	| "activity"
	| "isNeutered"
	| "currentWeightKg"
	| "idealWeightKg"
	| "bodyConditionScore"
	| "manualDerFactor"
	| "targetWeeklyRatePercent"
	| "mealsPerDay"
> & { items?: PlanFormValues["items"] };

const DEFAULTS: PlanFormValues = {
	patientId: "",
	goal: "MAINTENANCE",
	currentWeightKg: 0,
	bodyConditionScore: null,
	muscleConditionScore: null,
	idealWeightKg: null,
	idealWeightSource: null,
	lifeStage: "ADULT",
	activity: "MODERATE",
	isNeutered: false,
	riskFactors: [],
	medicalConditions: [],
	feedingMethod: "MEAL_FED",
	mealsPerDay: 2,
	recheckIntervalDays: 14,
	items: [],
};

function SectionTitle({ children, hint }: { children: string; hint?: string }) {
	return (
		<div className="flex flex-col gap-0.5">
			<h3 className="text-sm font-semibold">{children}</h3>
			{hint && <p className="text-xs text-muted-foreground">{hint}</p>}
		</div>
	);
}

export function NutritionPlanSheet({
	open,
	onOpenChange,
	patientId,
	plan,
	onSaved,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** يُمرَّر من ملف الطفل — يثبّت الطفل ويخفي مُنتقيه */
	patientId?: string;
	/** خطة قائمة للتحرير — المسودّات فقط تصل إلى هنا */
	plan?: NutritionPlanDetailResponse | null;
	onSaved?: (planId: string) => void;
}) {
	const { patients } = usePatients();
	const { staff } = useStaff();
	const { calculate, calculation, isCalculating } = useNutritionCalculator();
	const { createPlan, updatePlan, activatePlan, draftField, isDrafting, isPending } =
		useNutritionMutations();

	const [activateAfterSave, setActivateAfterSave] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		reset,
		formState: { errors },
	} = useForm<PlanFormValues>({
		resolver: zodResolver(nutritionPlanSchema) as never,
		defaultValues: { ...DEFAULTS, patientId: patientId ?? "" },
	});

	const { fields, append, remove } = useFieldArray({ control, name: "items" });

	const values = watch();

	// الكتالوج مرشَّح بالطفل المختار: الخادم يشتقّ نوعه ويعيد ما يصلح له وحده
	// (مع الأصناف العامّة). قبل اختيار طفل تبقى القائمة كاملة.
	const { foods } = useDietFoods({
		activeOnly: true,
		patientId: values.patientId || undefined,
	});

	const selectedPatient = patients.find((p) => p.id === values.patientId);
	const isWeightProgram = values.goal === "WEIGHT_LOSS" || values.goal === "WEIGHT_GAIN";

	// إعادة التعبئة عند الفتح — التحرير يحمّل القائم، والإنشاء يبدأ نظيفًا
	useEffect(() => {
		if (!open) return;
		if (plan) {
			reset({
				patientId: plan.patient.id,
				prescriberId: plan.prescriberId,
				goal: plan.goal,
				currentWeightKg: Number(plan.currentWeightKg),
				bodyConditionScore: plan.bodyConditionScore,
				muscleConditionScore: plan.muscleConditionScore,
				idealWeightKg: plan.idealWeightKg ? Number(plan.idealWeightKg) : null,
				idealWeightSource:
					(plan.idealWeightSource as PlanFormValues["idealWeightSource"]) ?? null,
				lifeStage: plan.lifeStage,
				activity: plan.activity,
				isNeutered: plan.isNeutered,
				riskFactors: plan.riskFactors,
				medicalConditions: plan.medicalConditions,
				feedingMethod: plan.feedingMethod,
				mealsPerDay: plan.mealsPerDay,
				currentDietSummary: plan.currentDietSummary,
				treatsSummary: plan.treatsSummary,
				tableFoodSummary: plan.tableFoodSummary,
				supplementsSummary: plan.supplementsSummary,
				medicationFoodSummary: plan.medicationFoodSummary,
				waterSource: plan.waterSource,
				environmentNotes: plan.environmentNotes,
				currentTreatCaloriePercent: plan.currentTreatCaloriePercent
					? Number(plan.currentTreatCaloriePercent)
					: null,
				manualDerFactor: plan.derFactorSource === "manual" ? Number(plan.derFactor) : null,
				targetWeeklyRatePercent: plan.targetWeeklyRatePercent
					? Number(plan.targetWeeklyRatePercent)
					: null,
				recheckIntervalDays: plan.recheckIntervalDays,
				items: plan.items.map((item) => ({
					dietFoodId: item.dietFoodId,
					nameSnapshot: item.nameSnapshot,
					formSnapshot: item.formSnapshot,
					energyDensityKcalPerKgSnapshot: Number(item.energyDensityKcalPerKgSnapshot),
					energySharePercent: Number(item.energySharePercent),
					householdUnit: item.householdUnit,
					householdUnitGrams: null,
					isTreat: item.isTreat,
					notes: item.notes,
				})),
				feedingInstructions: plan.feedingInstructions,
				clinicalNotes: plan.clinicalNotes,
				transitionDays: plan.transitionDays,
			});
			return;
		}
		reset({ ...DEFAULTS, patientId: patientId ?? "" });
		setActivateAfterSave(false);
	}, [open, plan, patientId, reset]);

	// وزن الطفل المسجّل يملأ الحقل عند اختياره — نقطة بداية لا قيمة نهائية
	useEffect(() => {
		if (plan || !selectedPatient?.weight) return;
		if (values.currentWeightKg) return;
		setValue("currentWeightKg", Number(selectedPatient.weight));
	}, [plan, selectedPatient, values.currentWeightKg, setValue]);

	/**
	 * الحساب الحيّ. يُعاد مع كل تغيير في مُدخل حسابي — والاعتماد على قيَم مُسلسَلة
	 * لا على الكائن يمنع دورة لا نهائية: `watch()` يعيد كائنًا جديدًا كل رسم.
	 */
	const calcKey = JSON.stringify({
		// النوع لا يُرسَل: الخادم يشتقّه من الطفل — فلا يمكن حساب قطّة بجدول كلب
		patientId: values.patientId || null,
		goal: values.goal,
		lifeStage: values.lifeStage,
		activity: values.activity,
		isNeutered: values.isNeutered,
		currentWeightKg: values.currentWeightKg,
		idealWeightKg: values.idealWeightKg,
		bodyConditionScore: values.bodyConditionScore,
		manualDerFactor: values.manualDerFactor,
		targetWeeklyRatePercent: values.targetWeeklyRatePercent,
		mealsPerDay: values.mealsPerDay,
		items: values.items?.map((i) => ({
			nameSnapshot: i.nameSnapshot,
			energyDensityKcalPerKgSnapshot: i.energyDensityKcalPerKgSnapshot,
			energySharePercent: i.energySharePercent,
			householdUnitGrams: i.householdUnitGrams,
			householdUnit: i.householdUnit,
			isTreat: i.isTreat,
		})),
	});

	useEffect(() => {
		const { items, ...rest } = JSON.parse(calcKey) as CalcPayload;
		if (!rest.currentWeightKg || rest.currentWeightKg <= 0) return;
		void calculate({ ...rest, foods: items ?? [] } as never).catch(() => {
			// فشل الحساب لا يُعطّل النموذج — اللوحة تبقى على آخر نتيجة صالحة
		});
	}, [calcKey, calculate]);

	const suggestedIdeal = useMemo(
		() =>
			values.bodyConditionScore && values.currentWeightKg
				? idealWeightFromBcs(values.currentWeightKg, values.bodyConditionScore)
				: null,
		[values.bodyConditionScore, values.currentWeightKg],
	);

	const totalShare = (values.items ?? []).reduce(
		(sum, item) => sum + (Number(item.energySharePercent) || 0),
		0,
	);

	const addFood = (foodId: string) => {
		const food = foods.find((f) => f.id === foodId);
		if (!food) return;
		// أول غذاء يأخذ ١٠٠٪، وما بعده يُضاف بصفر ليوزّع المدرّب الحصص بنفسه
		append({
			dietFoodId: food.id,
			nameSnapshot: `${food.brand ? `${food.brand} — ` : ""}${food.name}`,
			formSnapshot: food.form,
			energyDensityKcalPerKgSnapshot: Number(food.metabolizableEnergyKcalPerKg),
			energySharePercent: fields.length === 0 ? 100 : 0,
			householdUnit: food.householdUnit,
			householdUnitGrams: food.householdUnitGrams ? Number(food.householdUnitGrams) : null,
			isTreat: food.kind === "TREAT",
			notes: null,
		});
	};

	/**
	 * ما ينقص لصياغة نصّ ذي قيمة. القائمة تُعرض في تلميح الزرّ المعطَّل، فالمستخدم
	 * يعرف ماذا يفعل بدل أن يظنّ الزرّ معطّلًا. الشروط ليست شكلية: بلا وزن لا سعرات،
	 * وبلا غذاء لا كميّات — والنصّ الناتج حينها إنشاء لا تعليمات.
	 */
	const missingForDraft = useMemo(() => {
		const missing: string[] = [];
		if (!values.patientId) missing.push("اختيار الطفل");
		if (!values.currentWeightKg || Number(values.currentWeightKg) <= 0)
			missing.push("الوزن الحالي");
		if (isWeightProgram && !values.idealWeightKg) missing.push("الوزن المثالي");
		if (!values.items?.length) missing.push("غذاءً واحدًا على الأقل");
		else if (Math.abs(totalShare - 100) >= 0.5) missing.push("ضبط حصص الطاقة على ١٠٠٪");
		return missing;
	}, [
		values.patientId,
		values.currentWeightKg,
		values.idealWeightKg,
		values.items,
		isWeightProgram,
		totalShare,
	]);

	const onDraft = async (kind: "instructions" | "clinicalNotes") => {
		const result = await draftField({
			kind,
			patientId: values.patientId || null,
			goal: values.goal,
			lifeStage: values.lifeStage,
			activity: values.activity,
			isNeutered: values.isNeutered,
			currentWeightKg: Number(values.currentWeightKg),
			idealWeightKg: asNumber(values.idealWeightKg),
			bodyConditionScore: asNumber(values.bodyConditionScore),
			muscleConditionScore: values.muscleConditionScore ?? null,
			manualDerFactor: asNumber(values.manualDerFactor),
			targetWeeklyRatePercent: asNumber(values.targetWeeklyRatePercent),
			mealsPerDay: Number(values.mealsPerDay),
			feedingMethod: values.feedingMethod,
			recheckIntervalDays: Number(values.recheckIntervalDays),
			transitionDays: asNumber(values.transitionDays),
			riskFactors: values.riskFactors ?? [],
			medicalConditions: values.medicalConditions ?? [],
			currentDietSummary: values.currentDietSummary ?? null,
			treatsSummary: values.treatsSummary ?? null,
			items: (values.items ?? []).map((item) => ({
				...item,
				energyDensityKcalPerKgSnapshot: Number(item.energyDensityKcalPerKgSnapshot),
				energySharePercent: Number(item.energySharePercent),
				householdUnitGrams: asNumber(item.householdUnitGrams),
			})),
		} as never);
		if (result?.text)
			setValue(kind === "instructions" ? "feedingInstructions" : "clinicalNotes", result.text);
	};

	const onSubmit = handleSubmit(async (formValues) => {
		const body = {
			...formValues,
			currentWeightKg: Number(formValues.currentWeightKg),
			idealWeightKg: asNumber(formValues.idealWeightKg),
			bodyConditionScore: asNumber(formValues.bodyConditionScore),
			currentTreatCaloriePercent: asNumber(formValues.currentTreatCaloriePercent),
			manualDerFactor: asNumber(formValues.manualDerFactor),
			targetWeeklyRatePercent: asNumber(formValues.targetWeeklyRatePercent),
			transitionDays: asNumber(formValues.transitionDays),
			mealsPerDay: Number(formValues.mealsPerDay),
			recheckIntervalDays: Number(formValues.recheckIntervalDays),
			items: (formValues.items ?? []).map((item) => ({
				...item,
				energyDensityKcalPerKgSnapshot: Number(item.energyDensityKcalPerKgSnapshot),
				energySharePercent: Number(item.energySharePercent),
				householdUnitGrams: asNumber(item.householdUnitGrams),
			})),
		};

		const saved = plan
			? await updatePlan({ id: plan.id, body: body as never })
			: await createPlan(body as never);

		const savedId = (saved as { id?: string } | undefined)?.id ?? plan?.id;
		// التفعيل خطوة منفصلة عن الحفظ عمدًا: الحفظ يُنشئ مسودّة تُراجَع، والتفعيل
		// يجعلها سجلًا سريريًا يُطعَم عليه طفل. دمجهما يجعل الالتزام بلا لحظة قرار.
		if (savedId && activateAfterSave && !plan) await activatePlan(savedId);
		if (savedId) onSaved?.(savedId);
		onOpenChange(false);
	});

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="w-full gap-0 p-0 sm:max-w-3xl!"
			>
				<FormHeader
					title={plan ? "تعديل خطة التغذية" : "خطة تغذية جديدة"}
					identity={
						selectedPatient ? { name: selectedPatient.name, code: selectedPatient.code } : null
					}
					changesCount={plan?.editsCount ?? 0}
					onClose={() => onOpenChange(false)}
				/>

				<form
					onSubmit={onSubmit}
					className="flex min-h-0 flex-1 flex-col"
				>
					<div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
						{/* ── ١. الطفل والهدف ─────────────────────────────────────── */}
						<SectionTitle hint="الهدف يختار معامل الطاقة — فليس وسمًا وصفيًا">
							الطفل والهدف
						</SectionTitle>

						<div className="grid gap-3 sm:grid-cols-2">
							{!patientId && (
								<Controller
									name="patientId"
									control={control}
									render={({ field }) => (
										<Field data-invalid={!!errors.patientId}>
											<Label className="justify-start gap-1.5">
												الطفل
												<RequiredMark />
											</Label>
											<Combobox
												value={field.value}
												onValueChange={(v) => field.onChange(typeof v === "string" ? v : "")}
											>
												<ComboboxTrigger className="flex h-9 w-full items-center justify-between rounded-[4px] border border-input px-3 text-sm">
													<ComboboxValue
														placeholder="اختر الطفل"
														className="truncate"
													>
														{patients.find((p) => p.id === field.value)?.name}
													</ComboboxValue>
												</ComboboxTrigger>
												<ComboboxContent dir="rtl">
													<ComboboxList>
														{patients.length === 0 ? (
															<ComboboxEmpty>لا أطفال مسجّلة</ComboboxEmpty>
														) : (
															patients.map((p) => (
																<ComboboxItem
																	key={p.id}
																	value={p.id}
																>
																	{p.name} — {p.code}
																</ComboboxItem>
															))
														)}
													</ComboboxList>
												</ComboboxContent>
											</Combobox>
											<FieldError errors={[errors.patientId]} />
										</Field>
									)}
								/>
							)}

							<Controller
								name="goal"
								control={control}
								render={({ field }) => (
									<Field data-invalid={!!errors.goal}>
										<Label className="justify-start gap-1.5">
											الهدف
											<RequiredMark />
										</Label>
										<Select
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent
												position="popper"
												dir="rtl"
											>
												{Object.entries(GOAL_LABELS).map(([value, label]) => (
													<SelectItem
														key={value}
														value={value}
													>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={[errors.goal]} />
									</Field>
								)}
							/>

							<Controller
								name="prescriberId"
								control={control}
								render={({ field }) => (
									<Field>
										<Label>المدرّب الواصف</Label>
										<Select
											value={field.value ?? ""}
											onValueChange={field.onChange}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="اختر المدرّب" />
											</SelectTrigger>
											<SelectContent
												position="popper"
												dir="rtl"
											>
												{staff.map((member) => (
													<SelectItem
														key={member.id}
														value={member.id}
													>
														{member.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>
								)}
							/>
						</div>

						<Separator />

						{/* ── ٢. التقييم الغذائي ────────────────────────────────────── */}
						<SectionTitle hint="التقييم الحيوي الخامس — بعد الحرارة والنبض والتنفّس والألم (WSAVA)">
							التقييم الغذائي
						</SectionTitle>

						<div className="grid gap-3 sm:grid-cols-3">
							<Field data-invalid={!!errors.currentWeightKg}>
								<Label className="justify-start gap-1.5">
									الوزن الحالي (كجم)
									<RequiredMark />
								</Label>
								<Input
									type="number"
									step="0.01"
									aria-invalid={!!errors.currentWeightKg}
									{...register("currentWeightKg")}
								/>
								<FieldError errors={[errors.currentWeightKg]} />
							</Field>

							<Field data-invalid={!!errors.idealWeightKg}>
								<Label className="justify-start gap-1.5">
									الوزن المثالي (كجم)
									{/* مطلوب في حِميات الوزن فقط — الوسم يظهر مع الشرط لا دائمًا */}
									{isWeightProgram && <RequiredMark />}
								</Label>
								<div className="flex items-center gap-1.5">
									<Input
										type="number"
										step="0.01"
										className="flex-1"
										aria-invalid={!!errors.idealWeightKg}
										{...register("idealWeightKg")}
										onChange={(e) => {
											setValue("idealWeightKg", asNumber(e.target.value));
											setValue("idealWeightSource", "manual");
										}}
									/>
									{/* الاشتقاق من BCS اقتراح صريح لا تعبئة صامتة — المصدر يُحفظ */}
									<Button
										type="button"
										variant="outline"
										size="sm"
										disabled={!suggestedIdeal}
										title={
											suggestedIdeal
												? `اشتقاق من BCS: ${suggestedIdeal} كجم`
												: "أدخل الوزن ودرجة حالة الجسم أولًا"
										}
										onClick={() => {
											setValue("idealWeightKg", suggestedIdeal);
											setValue("idealWeightSource", "bcs");
										}}
									>
										<IconWand className="size-4" />
									</Button>
								</div>
								<FieldError errors={[errors.idealWeightKg]} />
							</Field>

							<Controller
								name="muscleConditionScore"
								control={control}
								render={({ field }) => (
									<Field>
										<Label>الكتلة العضلية (MCS)</Label>
										<Select
											value={field.value ?? ""}
											onValueChange={field.onChange}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="غير مُقيَّمة" />
											</SelectTrigger>
											<SelectContent
												position="popper"
												dir="rtl"
											>
												{Object.entries(MCS_LABELS).map(([value, label]) => (
													<SelectItem
														key={value}
														value={value}
													>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>
								)}
							/>
						</div>

						<Controller
							name="bodyConditionScore"
							control={control}
							render={({ field }) => (
								<Field data-invalid={!!errors.bodyConditionScore}>
									<Label>درجة حالة الجسم (BCS)</Label>
									<BcsScale
										value={field.value}
										onChange={field.onChange}
									/>
									<FieldError errors={[errors.bodyConditionScore]} />
								</Field>
							)}
						/>

						<div className="grid gap-3 sm:grid-cols-3">
							<Controller
								name="lifeStage"
								control={control}
								render={({ field }) => (
									<Field data-invalid={!!errors.lifeStage}>
										<Label className="justify-start gap-1.5">
											المرحلة العمرية
											<RequiredMark />
										</Label>
										<Select
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent
												position="popper"
												dir="rtl"
											>
												{Object.entries(LIFE_STAGE_LABELS).map(([value, label]) => (
													<SelectItem
														key={value}
														value={value}
													>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={[errors.lifeStage]} />
									</Field>
								)}
							/>

							<Controller
								name="activity"
								control={control}
								render={({ field }) => (
									<Field data-invalid={!!errors.activity}>
										<Label className="justify-start gap-1.5">
											مستوى النشاط
											<RequiredMark />
										</Label>
										<Select
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent
												position="popper"
												dir="rtl"
											>
												{Object.entries(ACTIVITY_LABELS).map(([value, label]) => (
													<SelectItem
														key={value}
														value={value}
													>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={[errors.activity]} />
									</Field>
								)}
							/>

							<Controller
								name="isNeutered"
								control={control}
								render={({ field }) => (
									<Field>
										<Label>الخصاء</Label>
										{/* الخصاء يخفض الحاجة ٢٠–٣٠٪ — أهمّ مفتاح واحد في الشاشة */}
										<div className="flex h-9 items-center gap-2">
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
											<span className="text-sm text-muted-foreground">
												{field.value ? "خصيّ" : "سليم"}
											</span>
										</div>
									</Field>
								)}
							/>
						</div>

						{/* ── ٣. الحساب ─────────────────────────────────────────────── */}
						<SectionTitle hint="يُعاد مع كل تغيير — أثر كل خيار مرئي قبل الحفظ">
							الحساب
						</SectionTitle>

						<EnergyPanel
							calculation={calculation}
							isCalculating={isCalculating}
						/>

						<div className="grid gap-3 sm:grid-cols-3">
							<Field>
								<Label>معامل يدوي (تجاوز الجدول)</Label>
								<Input
									type="number"
									step="0.01"
									placeholder="اتركه فارغًا للحساب الآلي"
									{...register("manualDerFactor")}
								/>
							</Field>

							{isWeightProgram && (
								<Field>
									<Label>المعدّل الأسبوعي المستهدف (٪)</Label>
									<Input
										type="number"
										step="0.1"
										placeholder="افتراضي حسب النوع"
										{...register("targetWeeklyRatePercent")}
									/>
								</Field>
							)}

							<Field data-invalid={!!errors.recheckIntervalDays}>
								<Label className="justify-start gap-1.5">
									المراجعة كل (يوم)
									<RequiredMark />
								</Label>
								<Input
									type="number"
									{...register("recheckIntervalDays")}
								/>
								<FieldError errors={[errors.recheckIntervalDays]} />
							</Field>
						</div>

						<Separator />

						{/* ── ٤. الأغذية الموصوفة ───────────────────────────────────── */}
						<div className="flex items-start justify-between gap-3">
							<SectionTitle hint="مجموع الحصص يجب أن يساوي ١٠٠٪ — الكميّات يحسبها النظام">
								الأغذية الموصوفة
							</SectionTitle>
							<Badge
								variant={Math.abs(totalShare - 100) < 0.5 ? "secondary" : "destructive"}
								className="tabular-nums"
							>
								{totalShare}٪
							</Badge>
						</div>

						<Combobox
							value=""
							onValueChange={(v) => typeof v === "string" && v && addFood(v)}
						>
							<ComboboxTrigger className="flex h-9 w-full items-center gap-2 rounded-[4px] border border-dashed border-input px-3 text-sm text-muted-foreground">
								<IconPlus className="size-4" />
								<span>أضف غذاءً من الكتالوج</span>
							</ComboboxTrigger>
							<ComboboxContent dir="rtl">
								<ComboboxList>
									{foods.length === 0 ? (
										<ComboboxEmpty>
											لا أغذية في الكتالوج — أضِفها من تبويب «كتالوج الأغذية»
										</ComboboxEmpty>
									) : (
										foods.map((food) => (
											<ComboboxItem
												key={food.id}
												value={food.id}
											>
												{food.brand ? `${food.brand} — ` : ""}
												{food.name} · {Number(food.metabolizableEnergyKcalPerKg)} سعرة/كجم
											</ComboboxItem>
										))
									)}
								</ComboboxList>
							</ComboboxContent>
						</Combobox>

						{fields.length === 0 ? (
							<p className="rounded-[4px] border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
								لا أغذية بعد — الخطة لا تُفعَّل بلا غذاء موصوف
							</p>
						) : (
							<div className="flex flex-col gap-2">
								{fields.map((field, index) => {
									const computed = calculation?.items?.[index];
									return (
										<div
											key={field.id}
											className="flex flex-col gap-2 rounded-[4px] border p-3"
										>
											<div className="flex items-center gap-2">
												<span className="min-w-0 flex-1 truncate text-sm font-medium">
													{values.items?.[index]?.nameSnapshot}
												</span>
												<Badge variant="outline">
													{FOOD_FORM_LABELS[values.items?.[index]?.formSnapshot ?? "DRY"]}
												</Badge>
												<Button
													type="button"
													variant="ghost"
													size="icon-sm"
													onClick={() => remove(index)}
												>
													<IconTrash className="size-4" />
												</Button>
											</div>

											<div className="grid gap-2 sm:grid-cols-4">
												<Field>
													<Label className="text-xs">حصّة الطاقة (٪)</Label>
													<Input
														type="number"
														step="1"
														{...register(`items.${index}.energySharePercent`)}
													/>
												</Field>
												<Field>
													<Label className="text-xs">سعرة/كجم</Label>
													<Input
														type="number"
														step="1"
														{...register(`items.${index}.energyDensityKcalPerKgSnapshot`)}
													/>
												</Field>
												<Field>
													<Label className="text-xs">وزن وحدة المنزل (جم)</Label>
													<Input
														type="number"
														step="1"
														placeholder="كوب/علبة"
														{...register(`items.${index}.householdUnitGrams`)}
													/>
												</Field>
												<Controller
													name={`items.${index}.isTreat`}
													control={control}
													render={({ field: treatField }) => (
														<Field>
															<Label className="text-xs">مكافآت</Label>
															<div className="flex h-9 items-center">
																<Checkbox
																	checked={treatField.value}
																	onCheckedChange={(v) => treatField.onChange(v === true)}
																/>
															</div>
														</Field>
													)}
												/>
											</div>

											{/* الكميّة المحسوبة تظهر تحت البند مباشرة — لا في لوحة بعيدة */}
											{computed?.amount && (
												<p className="text-xs tabular-nums text-muted-foreground">
													{computed.amount.gramsPerDay} جم/يوم ({computed.kcalPerDay} سعرة)
													{computed.amount.gramsPerMeal != null &&
														` · ${computed.amount.gramsPerMeal} جم لكل وجبة`}
													{computed.amount.householdUnitsPerDay != null &&
														` · ${computed.amount.householdUnitsPerDay} وحدة/يوم`}
												</p>
											)}
										</div>
									);
								})}
							</div>
						)}

						<Separator />

						{/* ── ٥. سجلّ التغذية الحالي ────────────────────────────────── */}
						<SectionTitle hint="نموذج تاريخ الحِمية (WSAVA) — المكافآت وطعام المائدة وطعام الدواء تُنسى دائمًا وهي أشيع أسباب فشل الحِمية">
							سجلّ التغذية الحالي
						</SectionTitle>

						<div className="grid gap-3 sm:grid-cols-3">
							<Controller
								name="feedingMethod"
								control={control}
								render={({ field }) => (
									<Field>
										<Label>أسلوب التغذية</Label>
										<Select
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent
												position="popper"
												dir="rtl"
											>
												{Object.entries(FEEDING_METHOD_LABELS).map(([value, label]) => (
													<SelectItem
														key={value}
														value={value}
													>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>
								)}
							/>

							<Field data-invalid={!!errors.mealsPerDay}>
								<Label className="justify-start gap-1.5">
									عدد الوجبات
									<RequiredMark />
								</Label>
								<Input
									type="number"
									{...register("mealsPerDay")}
								/>
								<FieldError errors={[errors.mealsPerDay]} />
							</Field>

							<Field>
								<Label>٪ السعرات من المكافآت حاليًا</Label>
								<Input
									type="number"
									step="1"
									placeholder="تقديري"
									{...register("currentTreatCaloriePercent")}
								/>
							</Field>
						</div>

						<div className="grid gap-3 sm:grid-cols-2">
							<Field>
								<Label>الغذاء الحالي</Label>
								<Textarea
									rows={2}
									placeholder="العلامة التجارية والكمّية"
									{...register("currentDietSummary")}
								/>
							</Field>
							<Field>
								<Label>المكافآت</Label>
								<Textarea
									rows={2}
									placeholder="النوع والعدد اليومي"
									{...register("treatsSummary")}
								/>
							</Field>
							<Field>
								<Label>طعام المائدة</Label>
								<Textarea
									rows={2}
									{...register("tableFoodSummary")}
								/>
							</Field>
							<Field>
								<Label>المكمّلات</Label>
								<Textarea
									rows={2}
									{...register("supplementsSummary")}
								/>
							</Field>
							<Field>
								<Label>الطعام المستعمل لإعطاء الدواء</Label>
								<Textarea
									rows={2}
									placeholder="جبن، زبدة فول سوداني، كبسولة..."
									{...register("medicationFoodSummary")}
								/>
							</Field>
							<Field>
								<Label>الماء والبيئة</Label>
								<Textarea
									rows={2}
									placeholder="مصدر الماء، مشاركة الطعام مع أطفال أخرى"
									{...register("environmentNotes")}
								/>
							</Field>
						</div>

						<Controller
							name="riskFactors"
							control={control}
							render={({ field }) => (
								<Field>
									<Label>عوامل الخطر (تستدعي تقييمًا موسّعًا)</Label>
									<div className="flex flex-wrap gap-1.5">
										{NUTRITION_RISK_FACTORS.map((factor) => {
											const active = field.value?.includes(factor);
											return (
												<button
													key={factor}
													type="button"
													onClick={() =>
														field.onChange(
															active
																? field.value.filter((f: string) => f !== factor)
																: [...(field.value ?? []), factor],
														)
													}
												>
													<Badge variant={active ? "default" : "outline"}>{factor}</Badge>
												</button>
											);
										})}
									</div>
								</Field>
							)}
						/>

						<Separator />

						{/* ── ٦. التعليمات ──────────────────────────────────────────── */}
						<SectionTitle hint="تُطبع في نشرة التسليم للوليّ أمر">تعليمات وليّ الأمر</SectionTitle>

						<div className="grid gap-3 sm:grid-cols-2">
							{/* الحقل `relative` والنصّ بحشوة علوية — الزرّ يجلس داخل الحقل
							    لا فوق العنوان، فيبقى مقترنًا بالنصّ الذي يكتبه */}
							<Field className="relative sm:col-span-2">
								<AiFieldButton
									missing={missingForDraft}
									isPending={isDrafting}
									onClick={() => void onDraft("instructions")}
								/>
								<Textarea
									rows={6}
									className="pt-9"
									placeholder="الكميّات، حدّ المكافآت، التحويل التدريجي، متى يتّصل بالأكاديمية"
									{...register("feedingInstructions")}
								/>
							</Field>
							<Field>
								<Label>أيام التحويل التدريجي</Label>
								<Input
									type="number"
									placeholder="٧ أيام عادةً"
									{...register("transitionDays")}
								/>
							</Field>
							<Field className="relative">
								<Label>ملاحظات داخلية (لا تُطبع)</Label>
								<AiFieldButton
									missing={missingForDraft}
									isPending={isDrafting}
									label="لخّص"
									className="top-7"
									onClick={() => void onDraft("clinicalNotes")}
								/>
								<Textarea
									rows={4}
									className="pt-9"
									{...register("clinicalNotes")}
								/>
							</Field>
						</div>
					</div>

					<FormFooter
						showShortcut
						extra={
							!plan && (
								<Label className="flex cursor-pointer items-center gap-2 font-normal text-muted-foreground">
									<Checkbox
										checked={activateAfterSave}
										onCheckedChange={(v) => setActivateAfterSave(v === true)}
									/>
									تفعيل بعد الحفظ
								</Label>
							)
						}
					>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onOpenChange(false)}
							disabled={isPending}
						>
							إلغاء
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={isPending}
						>
							{plan ? "حفظ التعديلات" : "حفظ المسودّة"}
						</Button>
					</FormFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
