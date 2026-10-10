import type {
	CatalogSpecies,
	NutritionActivity,
	NutritionGoal,
	NutritionLifeStage,
	NutritionRecheckOutcome,
} from "@/generated/prisma/enums";

// ── محرّك حساب الطاقة الغذائية ─────────────────────────────────────────────
//
// وحدة نقيّة بلا قاعدة بيانات ولا شبكة: كل ما تحتاجه يأتي في الوسائط، فتُختبر
// بالكامل في المجموعة السريعة. هذا مقصود — الأرقام التي تخرج من هنا تُطبع وتُسلَّم
// للوليّ أمر، فيجب أن تكون قابلة للتثبيت باختبار لا بمراجعة بصريّة.
//
// المراجع: WSAVA Global Nutrition Guidelines (2011) وأدوات Global Nutrition
// Toolkit، وAAHA Nutrition and Weight Management Guidelines (2021)، وجداول
// معاملات الطاقة المنشورة في Small Animal Clinical Nutrition.
//
// حدّ المعرفة المعلن: جداول المعاملات مُصدَّقة للكلاب والقطط فقط. أي نوع آخر
// يعود بـ `requiresManualFactor` ولا يُلفَّق له معامل — المدرّب يُدخله بنفسه.

/** النوع الذي تنطبق عليه الجداول — ما عداه يستلزم معاملًا يدويًا */
export type EnergySpecies = "DOG" | "CAT" | "OTHER";

export const energySpeciesOf = (species: CatalogSpecies | null | undefined): EnergySpecies =>
	species === "DOG" || species === "CAT" ? species : "OTHER";

// ── معادلة الطاقة أثناء الراحة ─────────────────────────────────────────────

/**
 * RER = 70 × (وزن الجسم بالكجم)^0.75 — السعرات اللازمة لطفل ساكن مستريح في
 * محيط حراري محايد. الأساس الأسّي هو المعتمد لكل الأوزان: التقريب الخطّي
 * (30×كجم + 70) يصلح بين ٢ و٤٥ كجم فقط، ويشطّ خارجها، فلا نستعمله.
 */
export const restingEnergyRequirement = (weightKg: number): number => {
	if (!Number.isFinite(weightKg) || weightKg <= 0) return 0;
	return 70 * weightKg ** 0.75;
};

// ── جداول معاملات الطاقة اليومية (DER factors) ─────────────────────────────

export type DerFactorBand = { value: number; min: number; max: number };

const band = (value: number, min: number, max: number): DerFactorBand => ({ value, min, max });

/**
 * معاملات الصيانة للبالغين مرتّبة حسب النشاط، وفي كل صفٍّ قيمتان: سليم وخصيّ.
 * الخصاء يخفض حاجة الطاقة بنحو ٢٠–٣٠٪ — ليس تفصيلًا تجميليًا بل السبب الأول
 * لزيادة الوزن بعد العملية.
 */
const ADULT_MAINTENANCE: Record<
	Exclude<EnergySpecies, "OTHER">,
	Partial<Record<NutritionActivity, { intact: DerFactorBand; neutered: DerFactorBand }>>
> = {
	DOG: {
		INACTIVE: { intact: band(1.4, 1.2, 1.6), neutered: band(1.2, 1.0, 1.4) },
		LOW: { intact: band(1.6, 1.4, 1.8), neutered: band(1.4, 1.2, 1.6) },
		MODERATE: { intact: band(1.8, 1.6, 2.0), neutered: band(1.6, 1.4, 1.8) },
		HIGH: { intact: band(2.0, 1.8, 2.4), neutered: band(1.8, 1.6, 2.2) },
		WORK_LIGHT: { intact: band(2.0, 1.9, 2.2), neutered: band(2.0, 1.9, 2.2) },
		WORK_MODERATE: { intact: band(3.0, 2.5, 3.5), neutered: band(3.0, 2.5, 3.5) },
		// العمل الشاق (كلاب الجرّ والبحث) مدى واسع جدًا — القيمة الافتراضية بداية لا حكم
		WORK_HEAVY: { intact: band(5.0, 4.0, 8.0), neutered: band(5.0, 4.0, 8.0) },
	},
	CAT: {
		INACTIVE: { intact: band(1.2, 1.0, 1.4), neutered: band(1.0, 0.8, 1.2) },
		LOW: { intact: band(1.3, 1.1, 1.5), neutered: band(1.1, 1.0, 1.3) },
		MODERATE: { intact: band(1.4, 1.2, 1.6), neutered: band(1.2, 1.0, 1.4) },
		HIGH: { intact: band(1.6, 1.4, 1.8), neutered: band(1.4, 1.2, 1.6) },
		// القطط لا تُصنَّف عاملة — درجات العمل تُقرأ كنشاط مرتفع
		WORK_LIGHT: { intact: band(1.6, 1.4, 1.8), neutered: band(1.4, 1.2, 1.6) },
		WORK_MODERATE: { intact: band(1.6, 1.4, 1.8), neutered: band(1.4, 1.2, 1.6) },
		WORK_HEAVY: { intact: band(1.6, 1.4, 1.8), neutered: band(1.4, 1.2, 1.6) },
	},
};

/** خصم الشيخوخة على الصيانة — لا يُطبَّق على درجات العمل، فالكلب العامل عامل */
const SENIOR_DISCOUNT: Record<
	Exclude<EnergySpecies, "OTHER">,
	{ delta: number; floor: number }
> = {
	DOG: { delta: 0.2, floor: 1.1 },
	CAT: { delta: 0.1, floor: 1.0 },
};

const IS_WORK: Record<NutritionActivity, boolean> = {
	INACTIVE: false,
	LOW: false,
	MODERATE: false,
	HIGH: false,
	WORK_LIGHT: true,
	WORK_MODERATE: true,
	WORK_HEAVY: true,
};

/** معاملات الأهداف غير الصيانة — لا تتأثّر بالنشاط ولا بالخصاء */
const GOAL_FACTORS: Record<
	Exclude<EnergySpecies, "OTHER">,
	Partial<
		Record<NutritionGoal, DerFactorBand | Partial<Record<NutritionLifeStage, DerFactorBand>>>
	>
> = {
	DOG: {
		// تُحسب على الوزن المثالي لا الحالي — وهذا هو الفرق بين حِمية تعمل وأخرى تُجوِّع
		WEIGHT_LOSS: band(1.0, 0.8, 1.0),
		WEIGHT_GAIN: band(1.4, 1.2, 1.8),
		GROWTH: {
			GROWTH_UNDER_4M: band(3.0, 2.5, 3.0),
			GROWTH_OVER_4M: band(2.0, 1.8, 2.5),
		},
		GESTATION: band(1.8, 1.8, 3.0),
		LACTATION: band(4.0, 2.0, 8.0),
		RECOVERY: band(1.0, 1.0, 1.2),
	},
	CAT: {
		WEIGHT_LOSS: band(0.8, 0.6, 1.0),
		WEIGHT_GAIN: band(1.4, 1.2, 1.8),
		GROWTH: {
			GROWTH_UNDER_4M: band(2.5, 2.5, 3.0),
			GROWTH_OVER_4M: band(2.5, 2.0, 2.5),
		},
		GESTATION: band(2.0, 1.6, 2.0),
		LACTATION: band(3.0, 2.0, 6.0),
		RECOVERY: band(1.0, 1.0, 1.2),
	},
};

export type DerFactorInput = {
	species: EnergySpecies;
	goal: NutritionGoal;
	lifeStage: NutritionLifeStage;
	activity: NutritionActivity;
	isNeutered: boolean;
};

export type DerFactorResult = DerFactorBand & {
	/** النوع خارج الجداول المُصدَّقة — الواجهة تطالب المدرّب بمعامل صريح */
	requiresManualFactor: boolean;
	/** شرح مقروء لسبب هذا الرقم — يظهر بجانب الحقل ويُطبع في الخطة */
	rationale: string;
};

const GOAL_RATIONALE: Record<NutritionGoal, string> = {
	MAINTENANCE: "صيانة الوزن الحالي",
	WEIGHT_LOSS: "إنقاص الوزن — يُحسب على الوزن المثالي",
	WEIGHT_GAIN: "زيادة الوزن — يُحسب على الوزن المثالي",
	GROWTH: "مرحلة النمو",
	GESTATION: "الحمل",
	LACTATION: "الرضاعة — يتباين بعدد المواليد",
	RECOVERY: "نقاهة/حالة حرجة",
};

const isBand = (v: unknown): v is DerFactorBand =>
	typeof v === "object" && v !== null && "value" in v;

/**
 * يختار معامل الطاقة من الجداول. النمو والحمل والرضاعة والإنقاص تتقدّم على النشاط
 * والخصاء: قطّة حامل خصيّة خاملة تُغذّى كحامل — الهدف يحكم لا الوصف.
 */
export const resolveDerFactor = (input: DerFactorInput): DerFactorResult => {
	const { species, goal, lifeStage, activity, isNeutered } = input;

	if (species === "OTHER") {
		return {
			...band(1.6, 1.0, 3.0),
			requiresManualFactor: true,
			rationale: "جداول المعاملات مُصدَّقة للكلاب والقطط فقط — أدخل المعامل يدويًا",
		};
	}

	// النمو له صفّه الخاص حتى لو لم يُختر «النمو» هدفًا صراحة
	const growthStage = lifeStage === "GROWTH_UNDER_4M" || lifeStage === "GROWTH_OVER_4M";
	const effectiveGoal: NutritionGoal = goal === "MAINTENANCE" && growthStage ? "GROWTH" : goal;

	if (effectiveGoal !== "MAINTENANCE") {
		const entry = GOAL_FACTORS[species][effectiveGoal];
		const resolved = isBand(entry) ? entry : entry?.[lifeStage];
		if (resolved) {
			return {
				...resolved,
				requiresManualFactor: false,
				rationale: GOAL_RATIONALE[effectiveGoal],
			};
		}
		// نمو بلا مرحلة نمو مُختارة — نطلب قرارًا بدل افتراض مرحلة
		return {
			...band(2.0, 1.8, 3.0),
			requiresManualFactor: true,
			rationale: "حدّد مرحلة النمو (أقل من ٤ أشهر / أكثر) ليُحتسب المعامل",
		};
	}

	const row = ADULT_MAINTENANCE[species][activity];
	if (!row) {
		return {
			...band(1.6, 1.0, 3.0),
			requiresManualFactor: true,
			rationale: "مستوى نشاط غير معروف — أدخل المعامل يدويًا",
		};
	}

	const base = isNeutered ? row.neutered : row.intact;
	const neuterNote = isNeutered ? "خصيّ" : "سليم";

	if (lifeStage === "SENIOR" && !IS_WORK[activity]) {
		const { delta, floor } = SENIOR_DISCOUNT[species];
		const value = Math.max(floor, round2(base.value - delta));
		return {
			value,
			min: Math.max(floor, round2(base.min - delta)),
			max: Math.max(floor, round2(base.max - delta)),
			requiresManualFactor: false,
			rationale: `صيانة — ${neuterNote}، مُسنّ (خصم الشيخوخة ${delta})`,
		};
	}

	return {
		...base,
		requiresManualFactor: false,
		rationale: `صيانة — ${neuterNote}، نشاط ${ACTIVITY_LABEL[activity]}`,
	};
};

const ACTIVITY_LABEL: Record<NutritionActivity, string> = {
	INACTIVE: "خامل",
	LOW: "منخفض",
	MODERATE: "معتدل",
	HIGH: "مرتفع",
	WORK_LIGHT: "عمل خفيف",
	WORK_MODERATE: "عمل متوسط",
	WORK_HEAVY: "عمل شاق",
};

// ── درجة حالة الجسم والوزن المثالي ─────────────────────────────────────────

export const BCS_MIN = 1;
export const BCS_MAX = 9;
export const BCS_IDEAL = 5;

/**
 * كل درجة BCS فوق ٥ تعادل تقريبًا ١٠٪ فوق الوزن المثالي (والعكس تحتها).
 * قاعدة سريرية شائعة لا قياس مباشر — لذلك المخرَج «اقتراح» يعدّله المدرّب،
 * ويُحفظ مصدره في الخطة (`idealWeightSource`).
 */
export const idealWeightFromBcs = (currentWeightKg: number, bcs: number): number | null => {
	if (!Number.isFinite(currentWeightKg) || currentWeightKg <= 0) return null;
	if (!Number.isFinite(bcs) || bcs < BCS_MIN || bcs > BCS_MAX) return null;
	const excessRatio = 1 + 0.1 * (bcs - BCS_IDEAL);
	if (excessRatio <= 0) return null;
	return round2(currentWeightKg / excessRatio);
};

/** تقدير نسبة الدهن من BCS — ٢٠٪ عند الدرجة ٥، و٥٪ لكل درجة بعدها */
export const estimatedBodyFatPercent = (bcs: number): number | null => {
	if (!Number.isFinite(bcs) || bcs < BCS_MIN || bcs > BCS_MAX) return null;
	return round1(20 + 5 * (bcs - BCS_IDEAL));
};

/** نسبة الزيادة (أو النقص) عن الوزن المثالي — الرقم الذي يُصارح به وليّ الأمر */
export const percentOverIdeal = (
	currentWeightKg: number,
	idealWeightKg: number,
): number | null => {
	if (!idealWeightKg || idealWeightKg <= 0 || !currentWeightKg) return null;
	return round1(((currentWeightKg - idealWeightKg) / idealWeightKg) * 100);
};

export const BCS_DESCRIPTIONS: Record<number, { label: string; detail: string }> = {
	1: {
		label: "هزال شديد",
		detail: "الأضلاع والفقرات وعظام الحوض بارزة عن بُعد، بلا دهن ملموس",
	},
	2: { label: "هزال", detail: "الأضلاع والفقرات ظاهرة بسهولة، فقد عضلي طفيف" },
	3: { label: "نحيف", detail: "الأضلاع تُلمس بلا دهن يغطّيها، خصر واضح جدًا" },
	4: { label: "أقل من المثالي", detail: "الأضلاع تُلمس بغطاء دهني ضئيل، خصر واضح" },
	5: { label: "مثالي", detail: "الأضلاع تُلمس بغطاء دهني خفيف، خصر ظاهر من الأعلى، بطن مرفوع" },
	6: { label: "أعلى من المثالي", detail: "الأضلاع تُلمس بغطاء دهني زائد، خصر ظاهر بصعوبة" },
	7: { label: "زيادة وزن", detail: "الأضلاع يصعب لمسها، ترسّب دهني على القطن وقاعدة الذيل" },
	8: { label: "سِمنة", detail: "الأضلاع لا تُلمس إلا بضغط قوي، لا خصر، بطن متدلٍّ" },
	9: { label: "سِمنة مفرطة", detail: "ترسّب دهني واسع على الصدر والعمود والقاعدة، تمدّد بطني" },
};

// ── معدّلات تغيّر الوزن المستهدفة ──────────────────────────────────────────

/**
 * المعدّل الأسبوعي الآمن كنسبة من وزن البدء. الكلاب تتحمّل ١–٢٪، والقطط ٠٫٥–١٪
 * لأن الفقد السريع فيها يُنذر بالداء الشحمي الكبدي (hepatic lipidosis). الحدّ
 * الأدنى ليس تحفّظًا زائدًا: تجاوزه خطر لا بطء.
 */
export const WEIGHT_CHANGE_RATE: Record<
	EnergySpecies,
	{ loss: DerFactorBand; gain: DerFactorBand }
> = {
	DOG: { loss: band(1.0, 0.5, 2.0), gain: band(1.0, 0.5, 2.0) },
	CAT: { loss: band(0.5, 0.5, 1.0), gain: band(1.0, 0.5, 1.5) },
	OTHER: { loss: band(0.5, 0.25, 1.0), gain: band(1.0, 0.5, 1.5) },
};

export type WeightProgramInput = {
	species: EnergySpecies;
	goal: NutritionGoal;
	currentWeightKg: number;
	idealWeightKg: number | null;
	/** نسبة أسبوعية يفرضها المدرّب — تتقدّم على الافتراضي */
	targetWeeklyRatePercent?: number | null;
};

export type WeightProgram = {
	/** النسبة الأسبوعية المستهدفة من وزن البدء */
	weeklyRatePercent: number;
	weeklyRateBand: DerFactorBand;
	weeklyChangeKg: number;
	totalChangeKg: number;
	estimatedWeeks: number | null;
	/** تواريخ نسبية: الأسبوع ← الوزن المتوقّع، لرسم المسار وقياس الانحراف عليه */
	milestones: { week: number; weightKg: number }[];
};

/**
 * مسار الوزن المتوقّع. نموذج خطّي مقصود: النموذج الأسّي أدقّ نظريًا لكن الخطة
 * تُعاد معايرتها كل مراجعة على الوزن المقاس، فالفارق يُصحَّح قبل أن يتراكم —
 * ووضوح «كم كجم في الأسبوع» للوليّ أمر يساوي أكثر من دقّة منحنى لا يراه.
 */
export const buildWeightProgram = (input: WeightProgramInput): WeightProgram | null => {
	const { species, goal, currentWeightKg, idealWeightKg } = input;
	if (goal !== "WEIGHT_LOSS" && goal !== "WEIGHT_GAIN") return null;
	if (!currentWeightKg || !idealWeightKg || idealWeightKg <= 0) return null;

	const direction = goal === "WEIGHT_LOSS" ? -1 : 1;
	const totalChangeKg = round2(idealWeightKg - currentWeightKg);

	// الهدف في الاتجاه المعاكس للنيّة (إنقاص لطفل تحت المثالي) — لا مسار له
	if (totalChangeKg === 0 || Math.sign(totalChangeKg) !== direction) return null;

	const defaults = WEIGHT_CHANGE_RATE[species][goal === "WEIGHT_LOSS" ? "loss" : "gain"];
	const requested = input.targetWeeklyRatePercent;
	const weeklyRatePercent =
		requested != null && Number.isFinite(requested) && requested > 0
			? round2(requested)
			: defaults.value;

	const weeklyChangeKg = round2((currentWeightKg * weeklyRatePercent) / 100);
	if (weeklyChangeKg <= 0) return null;

	const estimatedWeeks = Math.max(1, Math.ceil(Math.abs(totalChangeKg) / weeklyChangeKg));

	const milestones: { week: number; weightKg: number }[] = [];
	// أربع محطّات موزّعة على المدّة، آخرها الهدف نفسه — لا نرسم ٤٠ نقطة لا تُقرأ
	const steps = Math.min(4, estimatedWeeks);
	for (let i = 1; i <= steps; i++) {
		const week = Math.round((estimatedWeeks / steps) * i);
		const projected =
			i === steps
				? idealWeightKg
				: round2(currentWeightKg + direction * weeklyChangeKg * week);
		milestones.push({ week, weightKg: projected });
	}

	return {
		weeklyRatePercent,
		weeklyRateBand: defaults,
		weeklyChangeKg,
		totalChangeKg,
		estimatedWeeks,
		milestones,
	};
};

// ── الحساب الكامل للخطة ────────────────────────────────────────────────────

/** حدّ المكافآت: ١٠٪ من طاقة اليوم. ما زاد يُخِلّ اتزان الحِمية الأساسية */
export const TREAT_ALLOWANCE_RATIO = 0.1;

export type EnergyPlanInput = DerFactorInput & {
	currentWeightKg: number;
	idealWeightKg?: number | null;
	/** معامل يفرضه المدرّب — يتجاوز الجدول ويُسجَّل مصدره "manual" */
	manualDerFactor?: number | null;
	targetWeeklyRatePercent?: number | null;
};

export type EnergyPlan = {
	/** الوزن الذي جرى عليه الحساب: المثالي في الإنقاص/الزيادة، والحالي فيما عداه */
	calculationWeightKg: number;
	calculationWeightBasis: "current" | "ideal";
	rerKcal: number;
	derFactor: number;
	derFactorSource: "auto" | "manual";
	derFactorBand: DerFactorBand;
	derFactorRationale: string;
	requiresManualFactor: boolean;
	derKcal: number;
	treatKcalAllowance: number;
	/** طاقة الغذاء الأساسي بعد حسم المكافآت — الرقم الذي تُقسَّم عليه البنود */
	baseDietKcal: number;
	weightProgram: WeightProgram | null;
	warnings: string[];
};

const USES_IDEAL_WEIGHT: Partial<Record<NutritionGoal, true>> = {
	WEIGHT_LOSS: true,
	WEIGHT_GAIN: true,
};

/**
 * الحساب الكامل: من الوزن والهدف إلى سعرات اليوم ومسار الوزن.
 * لا يرمي أبدًا — يعيد `warnings` بدل ذلك، لأن الشاشة تحسب مع كل ضغطة مفتاح
 * وحقل نصف مكتوب ليس خطأً بل حالة وسيطة.
 */
export const computeEnergyPlan = (input: EnergyPlanInput): EnergyPlan => {
	const warnings: string[] = [];

	const usesIdeal = !!USES_IDEAL_WEIGHT[input.goal];
	const hasIdeal = !!input.idealWeightKg && input.idealWeightKg > 0;

	if (usesIdeal && !hasIdeal) {
		warnings.push("الوزن المثالي مطلوب لحساب حِمية الإنقاص/الزيادة — احسبه من BCS أو أدخله");
	}

	const calculationWeightBasis: "current" | "ideal" =
		usesIdeal && hasIdeal ? "ideal" : "current";
	const calculationWeightKg =
		calculationWeightBasis === "ideal"
			? (input.idealWeightKg as number)
			: input.currentWeightKg;

	const rerKcal = round1(restingEnergyRequirement(calculationWeightKg));
	const auto = resolveDerFactor(input);

	const manual = input.manualDerFactor;
	const useManual = manual != null && Number.isFinite(manual) && manual > 0;
	const derFactor = useManual ? round3(manual) : auto.value;
	const derFactorSource: "auto" | "manual" = useManual ? "manual" : "auto";

	if (
		useManual &&
		(derFactor < auto.min || derFactor > auto.max) &&
		!auto.requiresManualFactor
	) {
		warnings.push(
			`المعامل ${derFactor} خارج المدى المرجعي لهذه الحالة (${auto.min}–${auto.max})`,
		);
	}
	if (!useManual && auto.requiresManualFactor) {
		warnings.push(auto.rationale);
	}

	const derKcal = round1(rerKcal * derFactor);
	const treatKcalAllowance = round1(derKcal * TREAT_ALLOWANCE_RATIO);

	const weightProgram = buildWeightProgram({
		species: input.species,
		goal: input.goal,
		currentWeightKg: input.currentWeightKg,
		idealWeightKg: input.idealWeightKg ?? null,
		targetWeeklyRatePercent: input.targetWeeklyRatePercent,
	});

	if (weightProgram) {
		const { weeklyRatePercent, weeklyRateBand } = weightProgram;
		if (weeklyRatePercent > weeklyRateBand.max) {
			warnings.push(
				`المعدّل ${weeklyRatePercent}٪ أسبوعيًا يتجاوز الحدّ الآمن (${weeklyRateBand.max}٪) لهذا النوع`,
			);
		} else if (weeklyRatePercent < weeklyRateBand.min) {
			warnings.push(
				`المعدّل ${weeklyRatePercent}٪ أسبوعيًا دون المدى الفعّال (${weeklyRateBand.min}٪)`,
			);
		}
	}

	if (input.goal === "WEIGHT_LOSS" && input.species === "CAT") {
		warnings.push(
			"القطط: الفقد السريع أو الامتناع عن الأكل ينذر بالداء الشحمي الكبدي — راقب الأكل يوميًا",
		);
	}

	return {
		calculationWeightKg: round2(calculationWeightKg),
		calculationWeightBasis,
		rerKcal,
		derFactor,
		derFactorSource,
		derFactorBand: { value: auto.value, min: auto.min, max: auto.max },
		derFactorRationale: useManual ? "معامل مُدخَل يدويًا" : auto.rationale,
		requiresManualFactor: auto.requiresManualFactor,
		derKcal,
		treatKcalAllowance,
		baseDietKcal: round1(derKcal - treatKcalAllowance),
		weightProgram,
		warnings,
	};
};

// ── تحويل السعرات إلى كميّات ───────────────────────────────────────────────

export type FoodAmountInput = {
	kcalPerDay: number;
	/** كثافة الطاقة الأيضية كما هو (as fed) */
	energyDensityKcalPerKg: number;
	mealsPerDay?: number;
	/** وزن وحدة المنزل بالجرام (كوب، علبة، مقاعة) */
	householdUnitGrams?: number | null;
};

export type FoodAmount = {
	gramsPerDay: number;
	gramsPerMeal: number | null;
	householdUnitsPerDay: number | null;
	householdUnitsPerMeal: number | null;
};

/** الكميّة من السعرات: جرام/يوم = سعرات × ١٠٠٠ ÷ (سعرة/كجم) */
export const foodAmountFor = (input: FoodAmountInput): FoodAmount | null => {
	const { kcalPerDay, energyDensityKcalPerKg } = input;
	if (!Number.isFinite(kcalPerDay) || kcalPerDay <= 0) return null;
	if (!Number.isFinite(energyDensityKcalPerKg) || energyDensityKcalPerKg <= 0) return null;

	const gramsPerDay = round1((kcalPerDay * 1000) / energyDensityKcalPerKg);
	const meals = input.mealsPerDay && input.mealsPerDay > 0 ? input.mealsPerDay : null;
	const unitGrams =
		input.householdUnitGrams && input.householdUnitGrams > 0 ? input.householdUnitGrams : null;

	return {
		gramsPerDay,
		gramsPerMeal: meals ? round1(gramsPerDay / meals) : null,
		householdUnitsPerDay: unitGrams ? round2(gramsPerDay / unitGrams) : null,
		householdUnitsPerMeal: unitGrams && meals ? round2(gramsPerDay / unitGrams / meals) : null,
	};
};

// ── تقييم المراجعة وتعديل السعرات ──────────────────────────────────────────

export type RecheckInput = {
	species: EnergySpecies;
	goal: NutritionGoal;
	/** وزن آخر قياس قبل هذه المراجعة (بدء الخطة أو المراجعة السابقة) */
	previousWeightKg: number;
	currentWeightKg: number;
	idealWeightKg: number | null;
	daysElapsed: number;
	currentDerKcal: number;
	targetWeeklyRatePercent?: number | null;
};

export type RecheckAssessment = {
	weightChangeKg: number;
	/** موجب = زيادة، سالب = نقص. نسبة من وزن القياس السابق لكل أسبوع */
	weeklyRatePercent: number | null;
	outcome: NutritionRecheckOutcome;
	/** نسبة تعديل السعرات المقترحة (موجب = زيادة) — مدى AAHA ‏٥–٢٠٪ */
	adjustmentPercent: number;
	newDerKcal: number;
	reason: string;
};

/** حدّ بلوغ الهدف: ضمن ٢٪ من الوزن المثالي يُعدّ بلوغًا لا نقصًا */
const GOAL_TOLERANCE = 0.02;
/** تحت هذا المعدّل يُعدّ الوزن ثابتًا لا متحرّكًا — ضجيج الميزان لا تقدّم */
const STALL_THRESHOLD = 0.1;

/**
 * يقيس المراجعة ويقترح التعديل. القرار من الوزن المقاس لا من التزام وليّ الأمر
 * المُبلَّغ عنه: البلاغ ذاتي، والميزان ليس كذلك. الالتزام يُسجَّل ليفسّر النتيجة
 * لا ليُبنى عليه الرقم.
 */
export const assessRecheck = (input: RecheckInput): RecheckAssessment => {
	const { goal, previousWeightKg, currentWeightKg, idealWeightKg, daysElapsed } = input;

	const weightChangeKg = round2(currentWeightKg - previousWeightKg);
	const weeks = daysElapsed > 0 ? daysElapsed / 7 : 0;
	const weeklyRatePercent =
		weeks > 0 && previousWeightKg > 0
			? round2((weightChangeKg / previousWeightKg / weeks) * 100)
			: null;

	const keep = (outcome: NutritionRecheckOutcome, reason: string): RecheckAssessment => ({
		weightChangeKg,
		weeklyRatePercent,
		outcome,
		adjustmentPercent: 0,
		newDerKcal: round1(input.currentDerKcal),
		reason,
	});

	const adjust = (
		outcome: NutritionRecheckOutcome,
		percent: number,
		reason: string,
	): RecheckAssessment => ({
		weightChangeKg,
		weeklyRatePercent,
		outcome,
		adjustmentPercent: percent,
		newDerKcal: round1(input.currentDerKcal * (1 + percent / 100)),
		reason,
	});

	if (weeklyRatePercent === null) {
		return keep("ON_TRACK", "لا مدّة كافية بين القياسين لاحتساب معدّل");
	}

	// بلوغ الهدف يتقدّم على كل تقييم آخر — لا معنى لـ«بطيء» وقد وصل
	if (
		(goal === "WEIGHT_LOSS" || goal === "WEIGHT_GAIN") &&
		idealWeightKg &&
		idealWeightKg > 0 &&
		Math.abs(currentWeightKg - idealWeightKg) / idealWeightKg <= GOAL_TOLERANCE
	) {
		return keep("GOAL_REACHED", "بلغ الوزن المثالي — انتقل إلى خطة صيانة");
	}

	if (
		goal === "MAINTENANCE" ||
		goal === "GROWTH" ||
		goal === "GESTATION" ||
		goal === "LACTATION"
	) {
		if (Math.abs(weeklyRatePercent) <= 0.5) return keep("ON_TRACK", "الوزن ثابت ضمن المتوقّع");
		if (weeklyRatePercent > 0.5)
			return adjust("REVERSED", -10, "زيادة غير مقصودة في وزن خطة صيانة — خفض ١٠٪");
		return adjust("REVERSED", 10, "نقص غير مقصود في وزن خطة صيانة — رفع ١٠٪");
	}

	const band = WEIGHT_CHANGE_RATE[input.species][goal === "WEIGHT_LOSS" ? "loss" : "gain"];
	const targetMin = band.min;
	const targetMax = band.max;
	// اتجاه التقدّم: سالب في الإنقاص، موجب في الزيادة
	const direction = goal === "WEIGHT_LOSS" ? -1 : 1;
	const progressRate = weeklyRatePercent * direction; // موجب = يتقدّم نحو الهدف

	if (Math.abs(weeklyRatePercent) < STALL_THRESHOLD) {
		return goal === "WEIGHT_LOSS"
			? adjust("STALLED", -15, "الوزن متوقّف — خفض السعرات ١٥٪ ومراجعة المكافآت والالتزام")
			: adjust("STALLED", 15, "الوزن متوقّف — رفع السعرات ١٥٪");
	}

	if (progressRate < 0) {
		return goal === "WEIGHT_LOSS"
			? adjust("REVERSED", -20, "الوزن يزيد بدل أن ينقص — خفض ٢٠٪ ومراجعة كل مصادر السعرات")
			: adjust("REVERSED", 20, "الوزن ينقص بدل أن يزيد — رفع ٢٠٪ وتقييم سبب مرضي");
	}

	if (progressRate > targetMax) {
		return goal === "WEIGHT_LOSS"
			? adjust(
					"TOO_FAST",
					10,
					`الفقد ${Math.abs(weeklyRatePercent)}٪ أسبوعيًا يتجاوز ${targetMax}٪ — رفع ١٠٪`,
				)
			: adjust(
					"TOO_FAST",
					-10,
					`الزيادة ${weeklyRatePercent}٪ أسبوعيًا تتجاوز ${targetMax}٪ — خفض ١٠٪`,
				);
	}

	if (progressRate < targetMin) {
		return goal === "WEIGHT_LOSS"
			? adjust(
					"TOO_SLOW",
					-10,
					`الفقد ${Math.abs(weeklyRatePercent)}٪ أسبوعيًا دون ${targetMin}٪ — خفض ١٠٪`,
				)
			: adjust(
					"TOO_SLOW",
					10,
					`الزيادة ${weeklyRatePercent}٪ أسبوعيًا دون ${targetMin}٪ — رفع ١٠٪`,
				);
	}

	return keep(
		"ON_TRACK",
		`المعدّل ${Math.abs(weeklyRatePercent)}٪ أسبوعيًا ضمن المستهدف — أبقِ السعرات`,
	);
};

// ── تقريب ──────────────────────────────────────────────────────────────────
// الحساب يمرّ بأسّ كسري، فالتقريب عند حدود العرض لا داخل السلسلة.

const round1 = (n: number) => Math.round(n * 10) / 10;
const round2 = (n: number) => Math.round(n * 100) / 100;
const round3 = (n: number) => Math.round(n * 1000) / 1000;
