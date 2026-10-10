import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import {
	DietFoodForm,
	DietFoodKind,
	DietMeasureUnit,
	FeedingMethod,
	MuscleConditionScore,
	NutritionActivity,
	NutritionGoal,
	NutritionLifeStage,
	type NutritionPlanStatus,
	type NutritionRecheckOutcome,
} from "@/generated/prisma/enums";

// ── وحدة التغذية — الأنواع المشتركة بين الخادم والواجهة ────────────────────
// محرّك الحساب في `nutrition-energy.ts` (نقيّ ومختبَر). هذا الملف للأشكال فقط.

// ── أشكال الاستعلام ────────────────────────────────────────────────────────

const dietFoodSelect = {
	id: true,
	code: true,
	name: true,
	nameEn: true,
	brand: true,
	form: true,
	kind: true,
	metabolizableEnergyKcalPerKg: true,
	householdUnit: true,
	householdUnitGrams: true,
	proteinPercentDm: true,
	fatPercentDm: true,
	fiberPercentDm: true,
	moisturePercent: true,
	sodiumPercentDm: true,
	phosphorusPercentDm: true,
	species: true,
	indications: true,
	lifeStages: true,
	inventoryItemId: true,
	notes: true,
	active: true,
	editsCount: true,
	createdAt: true,
	updatedAt: true,
	inventoryItem: { select: { id: true, name: true, code: true, stock: true, price: true } },
} as const;

export type DietFoodResponse = Prisma.DietFoodGetPayload<{ select: typeof dietFoodSelect }>;
export const dietFoodSelectShape = dietFoodSelect;

const planItemSelect = {
	id: true,
	order: true,
	dietFoodId: true,
	nameSnapshot: true,
	formSnapshot: true,
	energyDensityKcalPerKgSnapshot: true,
	energySharePercent: true,
	kcalPerDay: true,
	gramsPerDay: true,
	householdUnit: true,
	householdUnitGrams: true,
	householdUnitsPerDay: true,
	isTreat: true,
	notes: true,
	food: { select: { id: true, code: true, name: true, brand: true, active: true } },
} as const;

export type NutritionPlanItemResponse = Prisma.NutritionPlanItemGetPayload<{
	select: typeof planItemSelect;
}>;

const recheckSelect = {
	id: true,
	recheckedAt: true,
	weightKg: true,
	bodyConditionScore: true,
	muscleConditionScore: true,
	weightChangeKg: true,
	weeklyRatePercent: true,
	outcome: true,
	ownerAdherence: true,
	adjustmentPercent: true,
	newDerKcal: true,
	adjustmentReason: true,
	notes: true,
	nextRecheckAt: true,
	createdAt: true,
	performedBy: { select: { id: true, name: true } },
} as const;

export type NutritionRecheckResponse = Prisma.NutritionRecheckGetPayload<{
	select: typeof recheckSelect;
}>;
export const nutritionRecheckSelectShape = recheckSelect;

const planPatientSelect = {
	id: true,
	code: true,
	name: true,
	gender: true,
	birthDate: true,
	weight: true,
	animalType: { select: { id: true, arName: true, enName: true, species: true } },
	animalStrain: { select: { id: true, arName: true } },
	owner: { select: { id: true, name: true, phone: true } },
} as const;

const planListSelect = {
	id: true,
	code: true,
	status: true,
	goal: true,
	assessedAt: true,
	currentWeightKg: true,
	idealWeightKg: true,
	bodyConditionScore: true,
	muscleConditionScore: true,
	lifeStage: true,
	activity: true,
	isNeutered: true,
	derKcal: true,
	rerKcal: true,
	derFactor: true,
	targetWeeklyRatePercent: true,
	estimatedWeeks: true,
	recheckIntervalDays: true,
	nextRecheckAt: true,
	startedAt: true,
	completedAt: true,
	discontinuedAt: true,
	draftedByAi: true,
	createdAt: true,
	updatedAt: true,
	patient: { select: planPatientSelect },
	prescriber: { select: { id: true, name: true } },
	_count: { select: { rechecks: true, items: true } },
} as const;

export type NutritionPlanListResponse = Prisma.NutritionPlanGetPayload<{
	select: typeof planListSelect;
}>;
export const nutritionPlanListSelect = planListSelect;

const planDetailSelect = {
	...planListSelect,
	appointmentId: true,
	prescriberId: true,
	idealWeightSource: true,
	riskFactors: true,
	medicalConditions: true,
	feedingMethod: true,
	mealsPerDay: true,
	currentDietSummary: true,
	treatsSummary: true,
	tableFoodSummary: true,
	supplementsSummary: true,
	medicationFoodSummary: true,
	waterSource: true,
	environmentNotes: true,
	currentTreatCaloriePercent: true,
	calculationWeightKg: true,
	derFactorSource: true,
	treatKcalAllowance: true,
	feedingInstructions: true,
	clinicalNotes: true,
	transitionDays: true,
	discontinueReason: true,
	editsCount: true,
	items: { select: planItemSelect, orderBy: { order: "asc" } },
	rechecks: { select: recheckSelect, orderBy: { recheckedAt: "desc" } },
} as const;

export type NutritionPlanDetailResponse = Prisma.NutritionPlanGetPayload<{
	select: typeof planDetailSelect;
}>;
export const nutritionPlanDetailSelect = planDetailSelect;

/** صفّ «مراجعة مستحقّة» — يُبنى في الـDAO لا في Prisma، فلا payload له */
export type NutritionDueRow = {
	planId: string;
	planCode: string;
	patientId: string;
	patientName: string;
	patientCode: string;
	animalTypeName: string;
	// [RC0] المُعرّف لا الاسم وحده — قائمة الاستدعاء تُجمَّع بوليّ الأمر (انظر GroomingDueRow)
	ownerId: string | null;
	ownerName: string | null;
	ownerPhone: string | null;
	goal: NutritionGoal;
	nextRecheckAt: Date | null;
	/** سالب = متأخّر */
	daysUntil: number | null;
	currentWeightKg: number;
	idealWeightKg: number | null;
	lastWeightKg: number;
	derKcal: number;
};

export type NutritionStats = {
	activePlans: number;
	dueRechecks: number;
	overdueRechecks: number;
	weightManagementPlans: number;
	goalReachedThisMonth: number;
	dietFoods: number;
};

// ── مخطّطات النماذج (Zod) — مصدر الحقيقة لتحقّق الواجهة ────────────────────

const optionalText = z.string().trim().max(2000).optional().nullable();

export const dietFoodSchema = z.object({
	name: z.string({ error: "اسم الغذاء مطلوب" }).trim().min(1, "اسم الغذاء مطلوب"),
	nameEn: z.string().trim().max(160).optional().nullable(),
	brand: z.string().trim().max(160).optional().nullable(),
	form: z.enum(DietFoodForm, { error: "شكل الغذاء مطلوب" }),
	kind: z.enum(DietFoodKind, { error: "تصنيف الغذاء مطلوب" }),
	// عمود الحساب كلّه — لذلك إلزامي وموجب، ولا يُقبل صفرًا
	metabolizableEnergyKcalPerKg: z.coerce
		.number({ error: "كثافة الطاقة مطلوبة" })
		.positive("كثافة الطاقة يجب أن تكون أكبر من صفر")
		.max(9000, "كثافة الطاقة غير معقولة — راجع الوحدة (سعرة/كجم)"),
	householdUnit: z.enum(DietMeasureUnit).default("GRAM"),
	householdUnitGrams: z.coerce.number().positive().max(5000).optional().nullable(),
	proteinPercentDm: z.coerce.number().min(0).max(100).optional().nullable(),
	fatPercentDm: z.coerce.number().min(0).max(100).optional().nullable(),
	fiberPercentDm: z.coerce.number().min(0).max(100).optional().nullable(),
	moisturePercent: z.coerce.number().min(0).max(100).optional().nullable(),
	sodiumPercentDm: z.coerce.number().min(0).max(20).optional().nullable(),
	phosphorusPercentDm: z.coerce.number().min(0).max(20).optional().nullable(),
	species: z.array(z.string()).default([]),
	indications: z.array(z.string().trim().min(1)).default([]),
	lifeStages: z.array(z.enum(NutritionLifeStage)).default([]),
	inventoryItemId: z.string().optional().nullable(),
	notes: optionalText,
	active: z.boolean().default(true),
});

export type DietFoodFormInput = z.infer<typeof dietFoodSchema>;

/** بند غذاء داخل الخطة — الكميّات تُحسب في المحرّك، لا يُدخلها المستخدم */
export const nutritionPlanItemSchema = z.object({
	dietFoodId: z.string().optional().nullable(),
	nameSnapshot: z.string().trim().min(1, "اسم الغذاء مطلوب"),
	formSnapshot: z.enum(DietFoodForm).default("DRY"),
	energyDensityKcalPerKgSnapshot: z.coerce
		.number({ error: "كثافة الطاقة مطلوبة" })
		.positive("كثافة الطاقة يجب أن تكون أكبر من صفر"),
	energySharePercent: z.coerce.number().min(0).max(100).default(100),
	householdUnit: z.enum(DietMeasureUnit).default("GRAM"),
	householdUnitGrams: z.coerce.number().positive().optional().nullable(),
	isTreat: z.boolean().default(false),
	notes: optionalText,
});

export type NutritionPlanItemFormInput = z.infer<typeof nutritionPlanItemSchema>;

export const nutritionPlanSchema = z
	.object({
		patientId: z.string({ error: "الطفل مطلوب" }).min(1, "الطفل مطلوب"),
		appointmentId: z.string().optional().nullable(),
		prescriberId: z.string().optional().nullable(),
		goal: z.enum(NutritionGoal, { error: "هدف الخطة مطلوب" }),

		// التقييم
		currentWeightKg: z.coerce
			.number({ error: "الوزن الحالي مطلوب" })
			.positive("الوزن يجب أن يكون أكبر من صفر")
			.max(500, "الوزن غير معقول"),
		bodyConditionScore: z.coerce
			.number()
			.int("درجة حالة الجسم عدد صحيح")
			.min(1, "المقياس من ١ إلى ٩")
			.max(9, "المقياس من ١ إلى ٩")
			.optional()
			.nullable(),
		muscleConditionScore: z.enum(MuscleConditionScore).optional().nullable(),
		idealWeightKg: z.coerce.number().positive().max(500).optional().nullable(),
		idealWeightSource: z.enum(["bcs", "manual", "history"]).optional().nullable(),
		lifeStage: z.enum(NutritionLifeStage, { error: "المرحلة العمرية مطلوبة" }),
		activity: z.enum(NutritionActivity, { error: "مستوى النشاط مطلوب" }),
		isNeutered: z.boolean().default(false),
		riskFactors: z.array(z.string().trim().min(1)).default([]),
		medicalConditions: z.array(z.string().trim().min(1)).default([]),

		// سجلّ التغذية الحالي
		feedingMethod: z.enum(FeedingMethod).default("MEAL_FED"),
		mealsPerDay: z.coerce
			.number({ error: "عدد الوجبات مطلوب" })
			.int("عدد الوجبات عدد صحيح")
			.min(1, "وجبة واحدة على الأقل")
			.max(8, "٨ وجبات كحدّ أقصى")
			.default(2),
		currentDietSummary: optionalText,
		treatsSummary: optionalText,
		tableFoodSummary: optionalText,
		supplementsSummary: optionalText,
		medicationFoodSummary: optionalText,
		waterSource: optionalText,
		environmentNotes: optionalText,
		currentTreatCaloriePercent: z.coerce.number().min(0).max(100).optional().nullable(),

		// الحساب — المعامل اليدوي فقط؛ الباقي يخرج من المحرّك
		manualDerFactor: z.coerce.number().positive().max(10).optional().nullable(),
		targetWeeklyRatePercent: z.coerce.number().positive().max(5).optional().nullable(),
		recheckIntervalDays: z.coerce
			.number()
			.int()
			.min(1, "يوم واحد على الأقل")
			.max(365)
			.default(14),

		// المخرَج
		items: z.array(nutritionPlanItemSchema).default([]),
		feedingInstructions: optionalText,
		clinicalNotes: optionalText,
		transitionDays: z.coerce.number().int().min(0).max(60).optional().nullable(),
	})
	// حِمية الإنقاص/الزيادة بلا وزن مثالي تُحسب على الوزن الخطأ — نمنعها عند الحفظ
	.refine(
		(v) =>
			(v.goal !== "WEIGHT_LOSS" && v.goal !== "WEIGHT_GAIN") ||
			(v.idealWeightKg != null && v.idealWeightKg > 0),
		{ path: ["idealWeightKg"], error: "الوزن المثالي مطلوب لخطط إنقاص أو زيادة الوزن" },
	)
	// مجموع حصص الطاقة يجب أن يبلغ ١٠٠٪ وإلا فالسعرات إمّا ناقصة أو مضاعفة
	.refine(
		(v) => {
			if (v.items.length === 0) return true;
			const total = v.items.reduce((sum, item) => sum + (item.energySharePercent ?? 0), 0);
			return Math.abs(total - 100) < 0.5;
		},
		{ path: ["items"], error: "مجموع حصص الطاقة بين الأغذية يجب أن يساوي ١٠٠٪" },
	);

export type NutritionPlanFormInput = z.infer<typeof nutritionPlanSchema>;

export const nutritionRecheckSchema = z.object({
	weightKg: z.coerce
		.number({ error: "الوزن مطلوب" })
		.positive("الوزن يجب أن يكون أكبر من صفر")
		.max(500, "الوزن غير معقول"),
	recheckedAt: z.coerce.date().optional(),
	bodyConditionScore: z.coerce.number().int().min(1).max(9).optional().nullable(),
	muscleConditionScore: z.enum(MuscleConditionScore).optional().nullable(),
	ownerAdherence: z.coerce.number().int().min(0).max(100).optional().nullable(),
	performedById: z.string().optional().nullable(),
	/** تعديل يفرضه المدرّب بدل المقترح — يُسجَّل بسببه */
	adjustmentPercent: z.coerce.number().min(-50).max(50).optional().nullable(),
	applyAdjustment: z.boolean().default(true),
	adjustmentReason: optionalText,
	notes: optionalText,
});

export type NutritionRecheckFormInput = z.infer<typeof nutritionRecheckSchema>;

// ── تسميات عربية موحّدة — مصدر واحد للجداول والنماذج والطباعة ──────────────

export const PLAN_STATUS_LABELS: Record<NutritionPlanStatus, string> = {
	DRAFT: "مسودّة",
	ACTIVE: "سارية",
	COMPLETED: "مكتملة",
	DISCONTINUED: "موقوفة",
};

export const GOAL_LABELS: Record<NutritionGoal, string> = {
	MAINTENANCE: "صيانة الوزن",
	WEIGHT_LOSS: "إنقاص الوزن",
	WEIGHT_GAIN: "زيادة الوزن",
	GROWTH: "النمو",
	GESTATION: "الحمل",
	LACTATION: "الرضاعة",
	RECOVERY: "النقاهة",
};

export const LIFE_STAGE_LABELS: Record<NutritionLifeStage, string> = {
	GROWTH_UNDER_4M: "نمو — أقل من ٤ أشهر",
	GROWTH_OVER_4M: "نمو — ٤ أشهر فأكثر",
	ADULT: "بالغ",
	SENIOR: "مُسنّ",
};

export const ACTIVITY_LABELS: Record<NutritionActivity, string> = {
	INACTIVE: "خامل / معرّض للسِّمنة",
	LOW: "منخفض",
	MODERATE: "معتدل",
	HIGH: "مرتفع",
	WORK_LIGHT: "عمل خفيف",
	WORK_MODERATE: "عمل متوسط",
	WORK_HEAVY: "عمل شاق",
};

export const MCS_LABELS: Record<MuscleConditionScore, string> = {
	NORMAL: "كتلة عضلية طبيعية",
	MILD_LOSS: "فقد عضلي خفيف",
	MODERATE_LOSS: "فقد عضلي متوسط",
	SEVERE_LOSS: "فقد عضلي شديد",
};

export const FEEDING_METHOD_LABELS: Record<FeedingMethod, string> = {
	MEAL_FED: "وجبات محدّدة",
	FREE_CHOICE: "طعام متاح دائمًا",
	COMBINATION: "مزيج",
};

export const FOOD_FORM_LABELS: Record<DietFoodForm, string> = {
	DRY: "جاف",
	WET: "معلّب / رطب",
	RAW: "نيء",
	HOME_COOKED: "منزلي مطبوخ",
	TREAT: "مكافآت",
	SUPPLEMENT: "مكمّل",
};

export const FOOD_KIND_LABELS: Record<DietFoodKind, string> = {
	MAINTENANCE: "غذاء صيانة",
	THERAPEUTIC: "غذاء علاجي",
	TREAT: "مكافآت",
	SUPPLEMENT: "مكمّل غذائي",
};

export const MEASURE_UNIT_LABELS: Record<DietMeasureUnit, string> = {
	GRAM: "جرام",
	CUP: "كوب",
	CAN: "علبة",
	SCOOP: "مقاعة",
	PIECE: "قطعة",
};

export const RECHECK_OUTCOME_LABELS: Record<NutritionRecheckOutcome, string> = {
	ON_TRACK: "ضمن المستهدف",
	TOO_FAST: "أسرع من المستهدف",
	TOO_SLOW: "أبطأ من المستهدف",
	STALLED: "متوقّف",
	REVERSED: "عكس الهدف",
	GOAL_REACHED: "بلغ الهدف",
};

/**
 * عوامل الخطر التي تستدعي تقييمًا غذائيًا موسّعًا (AAHA 2021). تُعرض كقائمة
 * اختيار لأن كتابتها حرّة تجعلها غير قابلة للبحث ولا للإحصاء.
 */
export const NUTRITION_RISK_FACTORS = [
	"تغيّر وزن غير مُفسَّر",
	"درجة حالة جسم خارج ٤–٥",
	"فقد في الكتلة العضلية",
	"غذاء منزلي أو نيء غير متوازن",
	"أكثر من ١٠٪ من السعرات من المكافآت",
	"مرض مزمن (كلوي، كبدي، قلبي)",
	"داء سكري أو اضطراب غدد صمّاء",
	"حساسية أو عدم تحمّل غذائي",
	"أمراض الأسنان تعيق المضغ",
	"قيء أو إسهال متكرّر",
	"جراحة أو رضّ حديث",
	"حمل أو رضاعة",
	"عمر أقل من سنة أو أكبر من سبع سنوات",
	"يعيش مع أطفال أخرى تتشارك الطعام",
] as const;

// ── مساعدات الحالة ─────────────────────────────────────────────────────────

/** المسودّة وحدها قابلة للتحرير الكامل — السارية تُعدَّل بمراجعة لا بكتابة فوقها */
export const isPlanEditable = (status: NutritionPlanStatus): boolean => status === "DRAFT";

/** المراجعات تُسجَّل على الخطط السارية فقط */
export const acceptsRechecks = (status: NutritionPlanStatus): boolean => status === "ACTIVE";
