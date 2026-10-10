import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
/**
 * [LY-P0] المصادر المشتركة لبرنامج الولاء ومستوياته (BRD §3، §4).
 *
 * §18.2 يلزم بإعلان أي قائمة تُستهلك في أكثر من موضع مرّةً واحدة مع اختبار تكافؤ — وهذا
 * الملف هو ذلك الموضع الواحد: قائمة رموز الألوان تُشتقّ منها مخططاتُ التحقق والمسارات
 * والواجهة جميعًا.
 */
/**
 * §4 — لون المستوى **مفتاح رمز تصميم** من قائمة مغلقة، لا قيمة hex.
 *
 * سابقة CRM §17.2 صفّ ٢، وهي تنطبق بحرفها: لا يوجد في المستودع كلّه لونُ واجهةٍ مخزَّن
 * في قاعدة البيانات (`mobile_unit.color` لون طلاء مركبة يُعرض نصًّا)، وقاعدة CLAUDE.md
 * الأولى تمنع الألوان الصريحة منعًا باتًّا. الرموز الثمانية معرَّفة في `src/styles.css`.
 *
 * وهي **نفس** قائمة CRM قيمةً لا استيرادًا: استيراد ثابتٍ من وحدةٍ أخرى كان سيربط
 * وحدتين لا علاقة بينهما، فيصير تعديل لوحة الـ CRM تعديلًا في الولاء. اختبار التكافؤ
 * في `loyalty-program.rules.test.ts` يمسك الانحراف بدل الاقتران.
 */
export declare const LOYALTY_TIER_COLOR_TOKENS: readonly ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "chart-6", "chart-7", "chart-8"];
export type LoyaltyTierColorToken = (typeof LOYALTY_TIER_COLOR_TOKENS)[number];
/** §3 — البرنامج. المعدّلات بأربع منازل: الكسور طبيعية («نقطة لكل ٣ ريالات» = 0.3333). */
export declare const loyaltyProgramSchema: z.ZodObject<{
    name: z.ZodString;
    earnRate: z.ZodCoercedNumber<unknown>;
    redemptionRate: z.ZodCoercedNumber<unknown>;
    minRedemptionPoints: z.ZodCoercedNumber<unknown>;
    maxRedemptionPercent: z.ZodCoercedNumber<unknown>;
    pointsValidityMonths: z.ZodCoercedNumber<unknown>;
    membershipMultiplier: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    active: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type LoyaltyProgramFormInput = z.infer<typeof loyaltyProgramSchema>;
/** §4 — المستوى. `earnMultiplier` سلطته الوحيدة (BR-L4.2). */
export declare const loyaltyTierSchema: z.ZodObject<{
    name: z.ZodString;
    minSpend: z.ZodCoercedNumber<unknown>;
    earnMultiplier: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    order: z.ZodCoercedNumber<unknown>;
    colorToken: z.ZodEnum<{
        "chart-1": "chart-1";
        "chart-2": "chart-2";
        "chart-3": "chart-3";
        "chart-4": "chart-4";
        "chart-5": "chart-5";
        "chart-6": "chart-6";
        "chart-7": "chart-7";
        "chart-8": "chart-8";
    }>;
    active: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type LoyaltyTierFormInput = z.infer<typeof loyaltyTierSchema>;
declare const tierSelect: {
    readonly id: true;
    readonly programId: true;
    readonly name: true;
    readonly minSpend: true;
    readonly earnMultiplier: true;
    readonly order: true;
    readonly colorToken: true;
    readonly active: true;
};
export type LoyaltyTierResponse = Prisma.LoyaltyTierGetPayload<{
    select: typeof tierSelect;
}>;
declare const programSelect: {
    readonly id: true;
    readonly name: true;
    readonly earnRate: true;
    readonly redemptionRate: true;
    readonly minRedemptionPoints: true;
    readonly maxRedemptionPercent: true;
    readonly pointsValidityMonths: true;
    readonly membershipMultiplier: true;
    readonly roundingMode: true;
    readonly active: true;
    readonly createdAt: true;
    readonly tiers: {
        readonly where: {
            readonly isDeleted: false;
        };
        readonly orderBy: {
            readonly order: "asc";
        };
        readonly select: {
            readonly id: true;
            readonly programId: true;
            readonly name: true;
            readonly minSpend: true;
            readonly earnMultiplier: true;
            readonly order: true;
            readonly colorToken: true;
            readonly active: true;
        };
    };
};
export type LoyaltyProgramResponse = Prisma.LoyaltyProgramGetPayload<{
    select: typeof programSelect;
}>;
export declare const LOYALTY_SELECTS: {
    readonly program: {
        readonly id: true;
        readonly name: true;
        readonly earnRate: true;
        readonly redemptionRate: true;
        readonly minRedemptionPoints: true;
        readonly maxRedemptionPercent: true;
        readonly pointsValidityMonths: true;
        readonly membershipMultiplier: true;
        readonly roundingMode: true;
        readonly active: true;
        readonly createdAt: true;
        readonly tiers: {
            readonly where: {
                readonly isDeleted: false;
            };
            readonly orderBy: {
                readonly order: "asc";
            };
            readonly select: {
                readonly id: true;
                readonly programId: true;
                readonly name: true;
                readonly minSpend: true;
                readonly earnMultiplier: true;
                readonly order: true;
                readonly colorToken: true;
                readonly active: true;
            };
        };
    };
    readonly tier: {
        readonly id: true;
        readonly programId: true;
        readonly name: true;
        readonly minSpend: true;
        readonly earnMultiplier: true;
        readonly order: true;
        readonly colorToken: true;
        readonly active: true;
    };
};
export {};
