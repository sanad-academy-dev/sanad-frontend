/**
 * [CRM-P0] فكّ صلاحيات الجلسة وفحصها — نفس نمط الوحدات الأمامية الأخرى
 * (`mobile-units.controller.ts`), مستخرَجًا هنا لأنّ وحدة الـ CRM لها متحكّمان يتقاسمانه.
 *
 * لا يوجد ماكرو صلاحيات مشترك في المستودع للوحدات الأمامية؛ كل وحدة تكرّر هذا الفكّ.
 * توحيدها كلّها إصلاحٌ يتجاوز نطاق هذه المرحلة، ولذلك تُوسَّع الحدود هنا فقط.
 */
export declare const parsePermissions: (raw: string | null | undefined) => string[];
export declare const allows: (isAdmin: boolean, permissions: string[], permission: string) => boolean;
export declare const CRM_PERMISSIONS: {
    readonly view: "crm_settings.view_full";
    readonly create: "crm_settings.create";
    readonly edit: "crm_settings.edit";
};
export declare function resolveCrmSession(request: Request): Promise<{
    clinicId: string;
    userId: string;
    isAdmin: boolean;
    permissions: string[];
} | null>;
