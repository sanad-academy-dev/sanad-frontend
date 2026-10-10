import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { CrmWhatsappProvider } from "@/generated/prisma/enums";

/**
 * [CRM-P0] إعدادات وحدة إدارة العملاء (BRD §14).
 *
 * القرار المعماري (Q1): جدول **مكتوب الأعمدة** خاص بالوحدة، لا سجلّ مفاتيح/قيم محاسبي.
 * سجلّ `accounts_settings` محكومٌ بصلاحية `accounting.accounts_settings.write`، فوضع مفتاح
 * الوحدة فيه كان سيوجب على مدير الاستقبال صلاحيةً محاسبية ليفعّل وحدةً ليست محاسبية. وهذا
 * الشكل هو ما تفعله كل وحدة غير محاسبية في المستودع (§17.2 صف ٣).
 */

export const crmSettingsSchema = z.object({
	enableCrmModule: z.boolean({ error: "قيمة التفعيل غير صالحة" }).optional(),
	crmDefaultSlaPolicyId: z.string().trim().min(1).nullable().optional(),
	crmWhatsappProvider: z
		.enum(CrmWhatsappProvider, { error: "مزوّد واتساب غير مدعوم" })
		.optional(),
	crmEmailFromName: z.string().trim().max(120, "الاسم أطول من المسموح").nullable().optional(),
});
export type CrmSettingsFormInput = z.infer<typeof crmSettingsSchema>;

export const crmSettingsSelect = {
	enableCrmModule: true,
	crmDefaultSlaPolicyId: true,
	crmWhatsappProvider: true,
	crmEmailFromName: true,
} as const;

export type CrmSettingsResponse = Prisma.ClinicCrmSettingsGetPayload<{
	select: typeof crmSettingsSelect;
}>;

/**
 * القيم الافتراضية حين لا يوجد سجلّ بعد. الوحدة **مطفأة** افتراضيًا (§0.3): أكاديمية لم تسمع
 * بالوحدة قطّ يجب أن تقرأ نفس ما تقرؤه أكاديميةٌ عطّلتها صراحةً.
 */
export const CRM_SETTINGS_DEFAULTS: CrmSettingsResponse = {
	enableCrmModule: false,
	crmDefaultSlaPolicyId: null,
	crmWhatsappProvider: "MANUAL",
	crmEmailFromName: null,
};
