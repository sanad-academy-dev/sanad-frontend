/**
 * [LY-P5] BR-L9.2 — التسوية اليدوية: **ممكنة، ومبوَّبة، ولا تقع صامتة أبدًا**.
 *
 * حاجةٌ حقيقية (منحةُ استرضاء، تصحيح حادثة دعم)، وخطرٌ حقيقيّ: بابٌ يمنح قيمةً بلا
 * مقابلٍ محصَّل. فالثلاثة شروطٌ لا زينة — صلاحية `loyalty_settings.edit`، سببٌ عربيّ
 * إلزاميّ، وظهورٌ في كشف وليّ الأمر كأيّ صفٍّ آخر.
 *
 * **والخصم اليدوي لا يتجاوز الرصيد القابل للاستبدال.** تسويةٌ سالبة أكبر منه كانت
 * ستدفع الرصيد إلى السالب بقرارِ موظّف لا بواقعةِ ردّ — والسالب في هذه الوحدة معناه
 * المحدّد أنّ مالًا رُدّ (BR-L5.6)، فلا يجوز أن يُصنع بزرّ.
 */
export declare function recordLoyaltyAdjustment(input: {
    clinicId: string;
    ownerId: string;
    points: number;
    reason: string;
    userId: string;
}): Promise<{
    id: string;
    points: number;
}>;
/** §10.5 — مُرشِّحات كشف الحركة عبر أولياء الأمور. */
export type StatementFilters = {
    ownerId?: string;
    kind?: "EARN" | "REDEEM" | "EXPIRY" | "REVERSAL" | "REDEMPTION_RESTORE" | "ADJUSTMENT";
    from?: Date;
    to?: Date;
    limit: number;
};
export declare function listClinicStatement(clinicId: string, filters: StatementFilters): Promise<{
    owner: {
        name: string;
        id: string;
        code: string;
    };
    id: string;
    expiresAt: Date | null;
    sourceId: string;
    kind: import("../../../../generated/prisma/enums").LoyaltyLedgerKind;
    note: string | null;
    points: number;
    pointsConsumed: number;
    earnBaseAmount: import("@prisma/client-runtime-utils").Decimal | null;
    sourceType: import("../../../../generated/prisma/enums").LoyaltyLedgerSourceType;
    earnedAt: Date;
}[]>;
