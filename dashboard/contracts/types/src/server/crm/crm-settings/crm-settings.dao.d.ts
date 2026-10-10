import { type CrmSettingsFormInput, type CrmSettingsResponse } from "@/server/crm/crm-settings/crm-settings.type";
export declare const crmSettingsDao: {
    /** القراءة لا تُنشئ صفًّا: أكاديمية بلا سجلّ تقرأ الافتراضيات (§0.3). */
    readonly get: (clinicId: string) => Promise<CrmSettingsResponse>;
    /**
     * الحفظ upsert: أول كتابة تُنشئ الصف. الحقول غير المُرسَلة لا تُلمَس — الحفظ الجزئي
     * هو ما تفعله الشاشة حين يقلب المستخدم مفتاحًا واحدًا.
     */
    readonly update: (clinicId: string, patch: CrmSettingsFormInput) => Promise<CrmSettingsResponse>;
};
