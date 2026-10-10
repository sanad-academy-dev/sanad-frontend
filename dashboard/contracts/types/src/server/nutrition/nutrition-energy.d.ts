import type { CatalogSpecies, NutritionActivity, NutritionGoal, NutritionLifeStage, NutritionRecheckOutcome } from "@/generated/prisma/enums";
/** النوع الذي تنطبق عليه الجداول — ما عداه يستلزم معاملًا يدويًا */
export type EnergySpecies = "DOG" | "CAT" | "OTHER";
export declare const energySpeciesOf: (species: CatalogSpecies | null | undefined) => EnergySpecies;
/**
 * RER = 70 × (وزن الجسم بالكجم)^0.75 — السعرات اللازمة لطفل ساكن مستريح في
 * محيط حراري محايد. الأساس الأسّي هو المعتمد لكل الأوزان: التقريب الخطّي
 * (30×كجم + 70) يصلح بين ٢ و٤٥ كجم فقط، ويشطّ خارجها، فلا نستعمله.
 */
export declare const restingEnergyRequirement: (weightKg: number) => number;
export type DerFactorBand = {
    value: number;
    min: number;
    max: number;
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
/**
 * يختار معامل الطاقة من الجداول. النمو والحمل والرضاعة والإنقاص تتقدّم على النشاط
 * والخصاء: قطّة حامل خصيّة خاملة تُغذّى كحامل — الهدف يحكم لا الوصف.
 */
export declare const resolveDerFactor: (input: DerFactorInput) => DerFactorResult;
export declare const BCS_MIN = 1;
export declare const BCS_MAX = 9;
export declare const BCS_IDEAL = 5;
/**
 * كل درجة BCS فوق ٥ تعادل تقريبًا ١٠٪ فوق الوزن المثالي (والعكس تحتها).
 * قاعدة سريرية شائعة لا قياس مباشر — لذلك المخرَج «اقتراح» يعدّله المدرّب،
 * ويُحفظ مصدره في الخطة (`idealWeightSource`).
 */
export declare const idealWeightFromBcs: (currentWeightKg: number, bcs: number) => number | null;
/** تقدير نسبة الدهن من BCS — ٢٠٪ عند الدرجة ٥، و٥٪ لكل درجة بعدها */
export declare const estimatedBodyFatPercent: (bcs: number) => number | null;
/** نسبة الزيادة (أو النقص) عن الوزن المثالي — الرقم الذي يُصارح به وليّ الأمر */
export declare const percentOverIdeal: (currentWeightKg: number, idealWeightKg: number) => number | null;
export declare const BCS_DESCRIPTIONS: Record<number, {
    label: string;
    detail: string;
}>;
/**
 * المعدّل الأسبوعي الآمن كنسبة من وزن البدء. الكلاب تتحمّل ١–٢٪، والقطط ٠٫٥–١٪
 * لأن الفقد السريع فيها يُنذر بالداء الشحمي الكبدي (hepatic lipidosis). الحدّ
 * الأدنى ليس تحفّظًا زائدًا: تجاوزه خطر لا بطء.
 */
export declare const WEIGHT_CHANGE_RATE: Record<EnergySpecies, {
    loss: DerFactorBand;
    gain: DerFactorBand;
}>;
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
    milestones: {
        week: number;
        weightKg: number;
    }[];
};
/**
 * مسار الوزن المتوقّع. نموذج خطّي مقصود: النموذج الأسّي أدقّ نظريًا لكن الخطة
 * تُعاد معايرتها كل مراجعة على الوزن المقاس، فالفارق يُصحَّح قبل أن يتراكم —
 * ووضوح «كم كجم في الأسبوع» للوليّ أمر يساوي أكثر من دقّة منحنى لا يراه.
 */
export declare const buildWeightProgram: (input: WeightProgramInput) => WeightProgram | null;
/** حدّ المكافآت: ١٠٪ من طاقة اليوم. ما زاد يُخِلّ اتزان الحِمية الأساسية */
export declare const TREAT_ALLOWANCE_RATIO = 0.1;
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
/**
 * الحساب الكامل: من الوزن والهدف إلى سعرات اليوم ومسار الوزن.
 * لا يرمي أبدًا — يعيد `warnings` بدل ذلك، لأن الشاشة تحسب مع كل ضغطة مفتاح
 * وحقل نصف مكتوب ليس خطأً بل حالة وسيطة.
 */
export declare const computeEnergyPlan: (input: EnergyPlanInput) => EnergyPlan;
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
export declare const foodAmountFor: (input: FoodAmountInput) => FoodAmount | null;
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
/**
 * يقيس المراجعة ويقترح التعديل. القرار من الوزن المقاس لا من التزام وليّ الأمر
 * المُبلَّغ عنه: البلاغ ذاتي، والميزان ليس كذلك. الالتزام يُسجَّل ليفسّر النتيجة
 * لا ليُبنى عليه الرقم.
 */
export declare const assessRecheck: (input: RecheckInput) => RecheckAssessment;
