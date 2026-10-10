import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
/**
 * [CRM-P0] إعدادات وحدة إدارة العملاء (BRD §14).
 *
 * القرار المعماري (Q1): جدول **مكتوب الأعمدة** خاص بالوحدة، لا سجلّ مفاتيح/قيم محاسبي.
 * سجلّ `accounts_settings` محكومٌ بصلاحية `accounting.accounts_settings.write`، فوضع مفتاح
 * الوحدة فيه كان سيوجب على مدير الاستقبال صلاحيةً محاسبية ليفعّل وحدةً ليست محاسبية. وهذا
 * الشكل هو ما تفعله كل وحدة غير محاسبية في المستودع (§17.2 صف ٣).
 */
export declare const crmSettingsSchema: z.ZodObject<{
    enableCrmModule: z.ZodOptional<z.ZodBoolean>;
    crmDefaultSlaPolicyId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    crmWhatsappProvider: z.ZodOptional<z.ZodEnum<{
        readonly MANUAL: "MANUAL";
        readonly GREEN_API: "GREEN_API";
    }>>;
    crmEmailFromName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type CrmSettingsFormInput = z.infer<typeof crmSettingsSchema>;
export declare const crmSettingsSelect: {
    readonly enableCrmModule: true;
    readonly crmDefaultSlaPolicyId: true;
    readonly crmWhatsappProvider: true;
    readonly crmEmailFromName: true;
};
export type CrmSettingsResponse = Prisma.ClinicCrmSettingsGetPayload<{
    select: typeof crmSettingsSelect;
}>;
/**
 * القيم الافتراضية حين لا يوجد سجلّ بعد. الوحدة **مطفأة** افتراضيًا (§0.3): أكاديمية لم تسمع
 * بالوحدة قطّ يجب أن تقرأ نفس ما تقرؤه أكاديميةٌ عطّلتها صراحةً.
 */
export declare const CRM_SETTINGS_DEFAULTS: CrmSettingsResponse;
