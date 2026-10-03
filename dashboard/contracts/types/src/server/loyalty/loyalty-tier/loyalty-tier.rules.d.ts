import { Prisma } from "@/generated/prisma/client";
/** بداية النافذة المتدحرجة: اليوم ناقص `loyaltyTierWindowMonths` (§13). */
export declare function tierWindowStart(now: Date, windowMonths: number): Date;
/** ما يحتاجه حساب الإنفاق من صفّ الدفتر — لا أكثر. */
export type SpendRow = {
    kind: "EARN" | "REDEEM" | "EXPIRY" | "REVERSAL" | "REDEMPTION_RESTORE" | "ADJUSTMENT";
    sourceType: string;
    sourceId: string;
    earnBaseAmount: Prisma.Decimal | null;
    earnedAt: Date;
};
/**
 * **الإنفاق المؤهِّل = مجموع أسس الكسب داخل النافذة، ناقصَ ما رُدَّ.**
 *
 * ولماذا `earnBaseAmount` لا مجاميع الفواتير: هو بالتعريف «صافي وليّ الأمر قبل الضريبة»
 * (BR-L5.2) — محسوبٌ مرّةً واحدة ومحفوظٌ على الصفّ. اشتقاقُ الإنفاق من الفواتير من
 * جديد كان سيُنتج رقمًا ثانيًا يفترق عن الأوّل عند أوّل فاتورة مؤمَّنة، فيرى وليّ الأمر
 * نقاطًا تقول شيئًا ومستوًى يقول غيره.
 *
 * **والمردود لا يُحتسب.** صفّ REVERSAL يحمل نفس (المصدر، المعرّف) الذي حمله الكسب،
 * فيُطرح أصلُه كاملًا: مالٌ رُدّ ليس إنفاقًا، ومستوًى مبنيٌّ عليه مكافأةٌ على مشترياتٍ
 * أُلغيت.
 */
export declare function qualifyingSpend(rows: SpendRow[], windowStart: Date, now?: Date): Prisma.Decimal;
export type TierRow = {
    id: string;
    name: string;
    minSpend: Prisma.Decimal;
    earnMultiplier: Prisma.Decimal;
    order: number;
    colorToken: string;
};
/**
 * BR-L4.1 — أعلى مستوًى بلغ وليّ الأمرُ حدَّه. و`null` مخرجٌ مشروع تمامًا:
 * BR-L4.4 يجعل برنامجًا بلا مستويات صحيحًا، وكذلك وليّ أمرًا لم يبلغ أدناها بعد.
 *
 * الترتيب بـ`minSpend` لا بـ`order`: `order` ترتيبُ عرضٍ يضبطه المستخدم، والتأهيل
 * يحكمه المال. مستويان بنفس الحدّ يحسمهما `order` الأعلى — قرارُ المستخدم عند تعادل
 * القاعدة، لا رميةُ نرد.
 */
export declare function tierFor(spend: Prisma.Decimal | string, tiers: TierRow[]): TierRow | null;
/**
 * BR-L4.2 — سلطة المستوى الوحيدة. غيابُ مستوًى ⇒ ١، لا صفر ولا رمية.
 */
export declare function tierMultiplierOf(tier: TierRow | null): Prisma.Decimal;
