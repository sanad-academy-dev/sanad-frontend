import type { Prisma } from "@/generated/prisma/client";
/**
 * [LY-P1] أنواع دفتر النقاط — مشتقّة كلّها من Prisma، ولا واجهةَ مكتوبةً بيد (AGENTS.md).
 */
export declare const loyaltyLedgerSelect: {
    readonly id: true;
    readonly kind: true;
    readonly points: true;
    readonly pointsConsumed: true;
    readonly earnBaseAmount: true;
    readonly earnRateSnapshot: true;
    readonly multiplierSnapshot: true;
    readonly sourceType: true;
    readonly sourceId: true;
    readonly earnedAt: true;
    readonly expiresAt: true;
    readonly note: true;
    readonly createdAt: true;
    readonly program: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type LoyaltyLedgerEntryResponse = Prisma.LoyaltyLedgerEntryGetPayload<{
    select: typeof loyaltyLedgerSelect;
}>;
/**
 * §10.3 — ملخّص وليّ الأمر. الرصيد **مشتقّ** (BR-L9.1)، فلا يقابله عمود ولا نوع Prisma —
 * وهذا هو الاستثناء المصرَّح به في AGENTS.md: قيمةٌ محسوبة لا شكلٌ مخزَّن.
 */
export type OwnerLoyaltySummary = {
    enabled: boolean;
    balance: number;
    expiringSoon: number;
    expiryNoticeDays: number;
    /** [LY-P3] §4 — مشتقٌّ من الإنفاق المتدحرج؛ `null` = لم يبلغ أدنى مستوًى (BR-L4.4) */
    tier: {
        name: string;
        colorToken: string;
        earnMultiplier: string;
    } | null;
    /** الإنفاق المؤهِّل داخل النافذة — يُفسّر «لماذا هذا المستوى» على الشاشة */
    qualifyingSpend: string;
    tierWindowMonths: number;
};
