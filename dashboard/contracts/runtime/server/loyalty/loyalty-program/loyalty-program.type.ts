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
export const LOYALTY_TIER_COLOR_TOKENS = [
	"chart-1",
	"chart-2",
	"chart-3",
	"chart-4",
	"chart-5",
	"chart-6",
	"chart-7",
	"chart-8",
] as const;
export type LoyaltyTierColorToken = (typeof LOYALTY_TIER_COLOR_TOKENS)[number];

const nameSchema = z
	.string({ error: "الاسم مطلوب" })
	.trim()
	.min(1, "الاسم مطلوب")
	.max(120, "الاسم أطول من المسموح");

/** §3 — البرنامج. المعدّلات بأربع منازل: الكسور طبيعية («نقطة لكل ٣ ريالات» = 0.3333). */
export const loyaltyProgramSchema = z.object({
	name: nameSchema,
	earnRate: z.coerce
		.number({ error: "معدّل الكسب يجب أن يكون رقمًا" })
		.min(0, "معدّل الكسب لا يكون سالبًا"),
	redemptionRate: z.coerce
		.number({ error: "قيمة النقطة يجب أن تكون رقمًا" })
		.min(0, "قيمة النقطة لا تكون سالبة"),
	minRedemptionPoints: z.coerce
		.number({ error: "الحدّ الأدنى يجب أن يكون رقمًا" })
		.int("الحدّ الأدنى عدد صحيح")
		.min(0, "الحدّ الأدنى لا يكون سالبًا"),
	maxRedemptionPercent: z.coerce
		.number({ error: "السقف يجب أن يكون رقمًا" })
		.min(0, "السقف بين ٠ و١٠٠")
		.max(100, "السقف بين ٠ و١٠٠"),
	pointsValidityMonths: z.coerce
		.number({ error: "مدّة الصلاحية يجب أن تكون رقمًا" })
		.int("مدّة الصلاحية عدد صحيح")
		.min(1, "مدّة الصلاحية شهر واحد على الأقلّ"),
	membershipMultiplier: z.coerce
		.number({ error: "مضاعِف العضوية يجب أن يكون رقمًا" })
		.min(0, "مضاعِف العضوية لا يكون سالبًا")
		.default(1),
	active: z.boolean({ error: "الحالة مطلوبة" }).optional().default(true),
});
export type LoyaltyProgramFormInput = z.infer<typeof loyaltyProgramSchema>;

/** §4 — المستوى. `earnMultiplier` سلطته الوحيدة (BR-L4.2). */
export const loyaltyTierSchema = z.object({
	name: nameSchema,
	minSpend: z.coerce
		.number({ error: "الإنفاق المؤهِّل يجب أن يكون رقمًا" })
		.min(0, "الإنفاق المؤهِّل لا يكون سالبًا"),
	earnMultiplier: z.coerce
		.number({ error: "المضاعِف يجب أن يكون رقمًا" })
		.min(0, "المضاعِف لا يكون سالبًا")
		.default(1),
	order: z.coerce.number({ error: "الترتيب يجب أن يكون رقمًا" }).int("الترتيب عدد صحيح").min(0),
	colorToken: z.enum(LOYALTY_TIER_COLOR_TOKENS, { error: "لون المستوى غير مدعوم" }),
	active: z.boolean({ error: "الحالة مطلوبة" }).optional().default(true),
});
export type LoyaltyTierFormInput = z.infer<typeof loyaltyTierSchema>;

const tierSelect = {
	id: true,
	programId: true,
	name: true,
	minSpend: true,
	earnMultiplier: true,
	order: true,
	colorToken: true,
	active: true,
} as const;
export type LoyaltyTierResponse = Prisma.LoyaltyTierGetPayload<{ select: typeof tierSelect }>;

const programSelect = {
	id: true,
	name: true,
	earnRate: true,
	redemptionRate: true,
	minRedemptionPoints: true,
	maxRedemptionPercent: true,
	pointsValidityMonths: true,
	membershipMultiplier: true,
	roundingMode: true,
	active: true,
	createdAt: true,
	tiers: {
		where: { isDeleted: false },
		orderBy: { order: "asc" },
		select: tierSelect,
	},
} as const;
export type LoyaltyProgramResponse = Prisma.LoyaltyProgramGetPayload<{
	select: typeof programSelect;
}>;

export const LOYALTY_SELECTS = { program: programSelect, tier: tierSelect } as const;
