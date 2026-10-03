import type { LoyaltyLedgerKind, LoyaltyLedgerSourceType } from "@/generated/prisma/enums";

/**
 * [LY-P1] تسميات صفوف الدفتر بالعربية.
 *
 * `Record` على النوع المولَّد لا كائنًا مفتوحًا: قيمةُ enum تُضاف في المخطط بلا تسمية هنا
 * تكسر البناء بدل أن تُرسَم فارغةً على شاشة وليّ الأمر.
 */
export const LEDGER_KIND_LABEL: Record<LoyaltyLedgerKind, string> = {
	EARN: "كسب",
	REDEEM: "استبدال",
	EXPIRY: "انتهاء",
	REVERSAL: "عكس",
	REDEMPTION_RESTORE: "ردّ نقاط",
	ADJUSTMENT: "تسوية",
};

export const LEDGER_SOURCE_LABEL: Record<LoyaltyLedgerSourceType, string> = {
	CLINIC_INVOICE: "فاتورة أكاديمية",
	POS_SALE: "بيع نقطة بيع",
	MANUAL: "يدويّ",
};
