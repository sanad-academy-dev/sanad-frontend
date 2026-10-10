import type { OperationTier, SedationLevel } from "@/generated/prisma/enums";
/** درجة ASA التي تُعدّ عندها الحالة بالغة الخطورة (ASA IV = مرض جهازي مُهدِّد للحياة) */
export declare const HIGH_RISK_ASA_CLASS = 4;
export type OperationConsentContext = {
    tier: OperationTier;
    plannedAnesthesia: SedationLevel;
    /** ASA I–V من تقييم ما قبل التخدير، إن وُجد */
    asaClass?: number | null;
};
/**
 * الحالة بالغة الخطورة إمّا بجسامة الإجراء (كبرى) أو بحالة الطفل نفسه
 * (ASA ≥ IV). المعياران مستقلّان: عملية صغرى على طفل منهك تظلّ بالغة الخطورة،
 * وهذا بالضبط ما يوجب نموذج الموافقة المشدَّد بنسبة الوفاة المصرَّح بها.
 */
export declare const isHighRiskOperation: (ctx: OperationConsentContext) => boolean;
/**
 * مفاتيح القوالب المقترحة لحالة عملية، بالترتيب. الجراحية بديلها المشدَّد عند
 * الخطورة — لا يُعرضان معًا كي لا يُوقَّع نموذجان متعارضان على إجراء واحد.
 */
export declare const consentTemplatesForOperation: (ctx: OperationConsentContext) => string[];
