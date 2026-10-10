import type { GroomingBehaviorScore, GroomingModifierCalc, GroomingModifierCode, GroomingSizeBand, HairType, MattingGrade, ParasiteFinding } from "@/generated/prisma/enums";
/**
 * رتب المطابقة من الأخصّ إلى الأعمّ. `PROFILE_OVERRIDE` ليست رتبة قاعدة —
 * تُطبَّق فوق نتيجة السلّم (قد تتجاوز السعر وحده أو المدّة وحدها).
 */
export declare const GROOMING_PRICE_LEVELS: readonly ["STRAIN_COAT", "STRAIN", "TYPE_SIZE_COAT", "TYPE_SIZE", "SIZE", "DEFINITION_BASE", "SERVICE_CONFIG"];
export type GroomingPriceLevel = (typeof GROOMING_PRICE_LEVELS)[number];
export declare const GROOMING_PRICE_LEVEL_LABELS: Record<GroomingPriceLevel, string>;
/** صفّ من مصفوفة التسعير — الشكل الذي يقرأه المحرّك، لا صفّ Prisma نفسه */
export type GroomingPriceRuleInput = {
    id: string;
    animalTypeId: string | null;
    animalStrainId: string | null;
    sizeBand: GroomingSizeBand | null;
    coatType: HairType | null;
    price: number;
    durationMin: number;
    dryingMinutes: number | null;
    createdAt: Date;
};
/** أبعاد الطفل التي تُطابَق عليها القواعد */
export type GroomingPetContext = {
    animalTypeId: string | null;
    animalStrainId: string | null;
    /** الشريحة بعد تطبيق تجاوز كرت التجميل، أو المشتقة من الوزن (القرار D4) */
    sizeBand: GroomingSizeBand | null;
    /** نوع الفرو بعد تطبيق تجاوز كرت التجميل، أو الموروث من السلالة */
    coatType: HairType | null;
};
export type GroomingDefinitionInput = {
    id: string;
    serviceId: string;
    nameSnapshot: string;
    basePrice: number;
    baseDurationMin: number;
    dryingMinutes: number;
    /** سعر/مدّة `ClinicServiceConfig` — الملاذ الأخير (الرتبة الثامنة) */
    serviceConfigPrice?: number | null;
    serviceConfigDuration?: number | null;
};
/** تجاوز كرت التجميل — يفوز دائمًا على السلّم، حقلًا حقلًا */
export type GroomingProfileOverride = {
    customPrice?: number | null;
    customDurationMin?: number | null;
};
export type GroomingResolvedPrice = {
    price: number;
    durationMin: number;
    dryingMinutes: number;
    /** الرتبة التي طابقت في السلّم — قبل تجاوز كرت التجميل */
    level: GroomingPriceLevel;
    matchedRuleId: string | null;
    /** أي الحقول جاء من كرت التجميل بدل السلّم */
    overridden: {
        price: boolean;
        duration: boolean;
    };
};
/**
 * الرتبة الأخصّ التي تطابق هذا الطفل، ثم تجاوز كرت التجميل فوقها.
 * لا يُخمَّن بُعد غائب: طفل بلا وزن ولا شريحة يسقط ببساطة إلى رتبة أدنى.
 */
export declare const resolveGroomingPrice: (definition: GroomingDefinitionInput, rules: readonly GroomingPriceRuleInput[], pet: GroomingPetContext, override?: GroomingProfileOverride) => GroomingResolvedPrice;
export type GroomingModifierInput = {
    code: GroomingModifierCode;
    labelAr: string;
    calc: GroomingModifierCalc;
    value: number;
    autoAppliesFrom: number | null;
    requiresOwnerApproval: boolean;
    active: boolean;
};
/** الوقائع التي تُفعّل الرسوم — معظمها يأتي من الفحص القبلي */
export type GroomingModifierTrigger = {
    mattingGrade?: MattingGrade | null;
    /** دقائق فكّ التعقّد المقدَّرة — أساس حساب PER_MINUTE */
    dematMinutes?: number;
    behaviorScore?: GroomingBehaviorScore | null;
    requiresTwoHandlers?: boolean;
    ageYears?: number | null;
    seniorAgeYears?: number;
    parasiteFinding?: ParasiteFinding | null;
    shaveDownRequired?: boolean;
    isSecondPetSameDay?: boolean;
    /** رسوم يطبّقها الطاقم يدويًا (مستعجل/خارج الدوام) */
    manualCodes?: readonly GroomingModifierCode[];
    /** عتبة الحلاقة الاضطرارية من إعداد الفرع */
    shaveDownThreshold?: MattingGrade;
};
/**
 * هل يُطبَّق هذا الرسم آليًا؟ العتبة `autoAppliesFrom` تُقرأ بحسب الرمز: رتبة
 * درجة التعقّد لـ MATTING، وسنوات العمر لـ SENIOR. الرموز اليدوية لا تُطبَّق
 * آليًا أبدًا مهما كانت العتبة.
 */
export declare const isModifierAutoApplied: (modifier: GroomingModifierInput, trigger: GroomingModifierTrigger) => boolean;
export type GroomingAppliedModifier = {
    code: GroomingModifierCode;
    labelAr: string;
    amount: number;
    requiresOwnerApproval: boolean;
    /** آلي من الفحص القبلي أم مطبَّق يدويًا */
    auto: boolean;
};
export type GroomingQuoteItemInput = {
    definition: GroomingDefinitionInput;
    rules: readonly GroomingPriceRuleInput[];
    quantity?: number;
};
export type GroomingQuoteLine = GroomingResolvedPrice & {
    definitionId: string;
    serviceId: string;
    nameSnapshot: string;
    quantity: number;
    lineTotal: number;
};
export type GroomingQuote = {
    lines: readonly GroomingQuoteLine[];
    adjustments: readonly GroomingAppliedModifier[];
    itemsSubtotal: number;
    adjustmentsTotal: number;
    total: number;
    /** مجموع دقائق العمل — مدخل الجدولة لا الفوترة (§7) */
    durationMin: number;
    /** مجموع دقائق التجفيف — يحجز فتحة تجفيف مستقلة عن المُجمِّل */
    dryingMinutes: number;
    /** هل تحتاج التسعيرة إقرار وليّ الأمر قبل بدء العمل */
    requiresOwnerApproval: boolean;
};
export declare const quoteGroomingSession: (input: {
    items: readonly GroomingQuoteItemInput[];
    pet: GroomingPetContext;
    override?: GroomingProfileOverride;
    modifiers?: readonly GroomingModifierInput[];
    trigger?: GroomingModifierTrigger;
    /** رموز يطبّقها الطاقم يدويًا فوق الآلي */
    manualCodes?: readonly GroomingModifierCode[];
}) => GroomingQuote;
/**
 * هل تستوجب التسعيرة الجديدة إقرارًا من وليّ الأمر؟ الزيادة وحدها هي ما يُقرّ —
 * انخفاض السعر لا يحتاج إذنًا. النسبة إعداد فرع (`quoteReapprovalPercent`).
 */
export declare const requiresQuoteReapproval: (bookedTotal: number, newTotal: number, thresholdPercent: number) => boolean;
