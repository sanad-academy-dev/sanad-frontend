import { type PharmacySettingsResponse, type UpdatePharmacySettingsInput } from "@/server/pharmacy-settings/pharmacy-settings.type";
export declare const pharmacySettingsDao: {
    /**
     * غياب الصفّ ليس حالة خطأ: كل أكاديمية قائمة بلا صفّ، لأن ترحيل [PH0.2] لا ينشئ
     * صفوفًا. تُعاد القيم الافتراضية كما هي — و`enabled: false` فيها هو ما يجعل
     * الوحدة خاملة لكل أكاديمية لم تفعّلها (BRD §0.3).
     */
    get(clinicId: string): Promise<PharmacySettingsResponse>;
    /**
     * الراية وحدها — يقرأها كل حارس في الوحدة. استعلام عمود واحد بدل جلب الصفّ
     * كاملًا، لأنه المسار الأكثر تنفيذًا في الوحدة كلها.
     */
    isEnabled(clinicId: string): Promise<boolean>;
    upsert(clinicId: string, input: UpdatePharmacySettingsInput): Promise<PharmacySettingsResponse>;
};
