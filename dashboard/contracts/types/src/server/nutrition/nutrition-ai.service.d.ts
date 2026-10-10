export type DraftInstructionsResult = {
    ok: true;
    text: string;
} | {
    ok: false;
    reason: "not-found" | "provider";
};
/**
 * مسودّة تعليمات التغذية للوليّ أمر. تُعاد ولا تُحفظ — المدرّب يقرأ ويعدّل ثم يحفظ،
 * فلا تصل ورقة إلى وليّ أمر لم يمرّ عليها إنسان.
 */
export declare const draftFeedingInstructions: (clinicId: string, planId: string, hint?: string | null) => Promise<DraftInstructionsResult>;
export type DraftFromFormInput = {
    kind: "instructions" | "clinicalNotes";
    patientName?: string | null;
    speciesName?: string | null;
    goalLabel: string;
    lifeStageLabel: string;
    isNeutered: boolean;
    currentWeightKg: number;
    idealWeightKg?: number | null;
    bodyConditionScore?: number | null;
    muscleConditionLabel?: string | null;
    derKcal: number;
    treatKcalAllowance: number;
    mealsPerDay: number;
    feedingMethodLabel: string;
    transitionDays?: number | null;
    recheckIntervalDays: number;
    targetWeeklyRatePercent?: number | null;
    estimatedWeeks?: number | null;
    riskFactors: string[];
    medicalConditions: string[];
    currentDietSummary?: string | null;
    treatsSummary?: string | null;
    items: {
        name: string;
        gramsPerDay: number;
        kcalPerDay: number;
        householdUnitsPerDay?: number | null;
        householdUnitLabel?: string | null;
        isTreat: boolean;
    }[];
    hint?: string | null;
};
/**
 * مسودّة من حالة النموذج (لا من خطة محفوظة). تُعاد ولا تُحفظ.
 */
export declare const draftFromForm: (input: DraftFromFormInput) => Promise<DraftInstructionsResult>;
