import { type WhatsappCredentials, type WhatsappProvider } from "@/server/crm/crm-whatsapp/whatsapp-provider";
/**
 * [CRM-P4] §9.2 — اختيار المزوّد وفكّ بيانات اعتماده.
 *
 * الفكّ يحدث هنا وحده، وناتجه يُمرَّر إلى المزوّد داخل النداء الواحد ولا يُخزَّن. لا
 * تُعاد هذه القيم إلى العميل أبدًا — ولا مشفَّرة (§17.2 صفّ ١٩).
 */
export type ResolvedProvider = {
    provider: WhatsappProvider;
    credentials: WhatsappCredentials;
    /** سببٌ عربيّ حين تعذّر استعمال المزوّد الحقيقيّ — يُسجَّل مع الرسالة لا يُبتلع. */
    degradedReason: string | null;
};
/**
 * يعيد المزوّد الصالح للاستعمال الآن. **لا يرمي عند غياب التهيئة**: يتراجع إلى MANUAL
 * ويقول لماذا، لأنّ «غير مُهيَّأ» حالةٌ صحيحة في §9.2 لا عطل.
 */
export declare function resolveProvider(clinicId: string): Promise<ResolvedProvider>;
/** حفظ بيانات الاعتماد — تُختم قبل أن تلمس العمود. */
export declare function saveCredentials(clinicId: string, input: {
    instanceId: string;
    apiToken: string;
}): Promise<void>;
/** الحذف يُرجِع الأكاديمية إلى «يدويّ» — لا مزوّدٌ مُعلن بلا مفاتيح. */
export declare function clearCredentials(clinicId: string): Promise<void>;
