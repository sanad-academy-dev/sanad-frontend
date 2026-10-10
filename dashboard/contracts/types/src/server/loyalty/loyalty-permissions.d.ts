/**
 * [LY-P0] فكّ صلاحيات الجلسة وفحصها — نفس نمط الوحدات الأمامية الأخرى، مستخرَجًا هنا
 * لأنّ وحدة الولاء لها متحكّمان يتقاسمانه (البرنامج والإعدادات).
 *
 * لا يوجد ماكرو صلاحيات مشترك في المستودع للوحدات الأمامية؛ كل وحدة تكرّر هذا الفكّ
 * (`crm-permissions.ts` هو النظير الحرفي). توحيدها كلّها إصلاحٌ يتجاوز نطاق هذه المرحلة.
 */
export declare const parsePermissions: (raw: string | null | undefined) => string[];
export declare const allows: (isAdmin: boolean, permissions: string[], permission: string) => boolean;
export declare const LOYALTY_PERMISSIONS: {
    readonly view: "loyalty_settings.view_full";
    readonly create: "loyalty_settings.create";
    readonly edit: "loyalty_settings.edit";
    readonly ledgerView: "loyalty_ledger.view_full";
};
export declare function resolveLoyaltySession(request: Request): Promise<{
    clinicId: string;
    userId: string;
    isAdmin: boolean;
    permissions: string[];
} | null>;
