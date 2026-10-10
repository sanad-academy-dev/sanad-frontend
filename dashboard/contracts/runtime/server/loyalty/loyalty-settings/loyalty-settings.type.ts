import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";

/**
 * [LY-P0] إعدادات وحدة الولاء (BRD §13).
 *
 * القرار المعماري: جدول **مكتوب الأعمدة** خاص بالوحدة، لا سجلّ `AccountsSetting`
 * المحاسبي — ذلك السجلّ محكومٌ بصلاحية `accounting.accounts_settings.write`، فوضع مفتاح
 * وحدةٍ أماميّة فيه كان سيوجب على مدير الاستقبال صلاحيةً محاسبية ليفعّل وحدةً ليست
 * محاسبية. هذا حسم CRM §17.2 صفّ ٣ نفسه، وهو ما تفعله ثماني وحدات في المستودع.
 */

export const loyaltySettingsSchema = z.object({
	enableLoyaltyModule: z.boolean({ error: "قيمة التفعيل غير صالحة" }).optional(),
	loyaltyTierWindowMonths: z.coerce
		.number({ error: "نافذة المستويات يجب أن تكون رقمًا" })
		.int("نافذة المستويات عدد صحيح")
		.min(1, "نافذة المستويات شهر واحد على الأقلّ")
		.max(120, "نافذة المستويات أطول من المسموح")
		.optional(),
	loyaltyExpiryNoticeDays: z.coerce
		.number({ error: "مهلة التنبيه يجب أن تكون رقمًا" })
		.int("مهلة التنبيه عدد صحيح")
		.min(1, "مهلة التنبيه يوم واحد على الأقلّ")
		.max(365, "مهلة التنبيه أطول من المسموح")
		.optional(),
});
export type LoyaltySettingsFormInput = z.infer<typeof loyaltySettingsSchema>;

export const loyaltySettingsSelect = {
	enableLoyaltyModule: true,
	loyaltyTierWindowMonths: true,
	loyaltyExpiryNoticeDays: true,
} as const;

export type LoyaltySettingsResponse = Prisma.ClinicLoyaltySettingsGetPayload<{
	select: typeof loyaltySettingsSelect;
}>;

/**
 * القيم الافتراضية حين لا يوجد سجلّ بعد. الوحدة **مطفأة** افتراضيًا (§0.3): أكاديمية لم
 * تسمع بالوحدة قطّ يجب أن تقرأ نفس ما تقرؤه أكاديميةٌ عطّلتها صراحةً.
 */
export const LOYALTY_SETTINGS_DEFAULTS: LoyaltySettingsResponse = {
	enableLoyaltyModule: false,
	loyaltyTierWindowMonths: 12,
	loyaltyExpiryNoticeDays: 60,
};
