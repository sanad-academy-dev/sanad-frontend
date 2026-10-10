import type { OperationTier, SedationLevel } from "@/generated/prisma/enums";

// أي نماذج موافقة تخصّ سياقًا بعينه. دالة خالصة: القرار قاعدة مكتوبة تُختبر،
// لا شرط مبعثر داخل مكوّن واجهة.

/** درجة ASA التي تُعدّ عندها الحالة بالغة الخطورة (ASA IV = مرض جهازي مُهدِّد للحياة) */
export const HIGH_RISK_ASA_CLASS = 4;

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
export const isHighRiskOperation = (ctx: OperationConsentContext): boolean =>
	ctx.tier === "MAJOR" || (ctx.asaClass ?? 0) >= HIGH_RISK_ASA_CLASS;

/**
 * مفاتيح القوالب المقترحة لحالة عملية، بالترتيب. الجراحية بديلها المشدَّد عند
 * الخطورة — لا يُعرضان معًا كي لا يُوقَّع نموذجان متعارضان على إجراء واحد.
 */
export const consentTemplatesForOperation = (ctx: OperationConsentContext): string[] => {
	const keys = [isHighRiskOperation(ctx) ? "HIGH_RISK_SURGICAL_V1" : "SURGICAL_V1"];
	if (ctx.plannedAnesthesia !== "NONE") keys.push("ANESTHESIA_V1");
	return keys;
};
