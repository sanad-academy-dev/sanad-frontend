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
export declare const loyaltySettingsSchema: z.ZodObject<{
    enableLoyaltyModule: z.ZodOptional<z.ZodBoolean>;
    loyaltyTierWindowMonths: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    loyaltyExpiryNoticeDays: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type LoyaltySettingsFormInput = z.infer<typeof loyaltySettingsSchema>;
export declare const loyaltySettingsSelect: {
    readonly enableLoyaltyModule: true;
    readonly loyaltyTierWindowMonths: true;
    readonly loyaltyExpiryNoticeDays: true;
};
export type LoyaltySettingsResponse = Prisma.ClinicLoyaltySettingsGetPayload<{
    select: typeof loyaltySettingsSelect;
}>;
/**
 * القيم الافتراضية حين لا يوجد سجلّ بعد. الوحدة **مطفأة** افتراضيًا (§0.3): أكاديمية لم
 * تسمع بالوحدة قطّ يجب أن تقرأ نفس ما تقرؤه أكاديميةٌ عطّلتها صراحةً.
 */
export declare const LOYALTY_SETTINGS_DEFAULTS: LoyaltySettingsResponse;
