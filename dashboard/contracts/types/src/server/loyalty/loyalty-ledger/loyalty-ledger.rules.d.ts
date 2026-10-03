import { Prisma } from "@/generated/prisma/client";
/**
 * BR-L5.2 — **أساس الكسب: صافي وليّ الأمر قبل الضريبة**.
 *
 * ولا يوجد عمودٌ يحمله. ما هو محفوظ على فاتورة الأكاديمية: `total` (الإجمالي بالضريبة)،
 * `vatAmount`، و`copayShare`/`insurerShare` — وكلاهما **بعد الضريبة**، لأنّ قسمة §9.1
 * تجري على الإجمالي المُضرَّب (BR-I9.1.1). فالصافي قبل الضريبة يُشتقّ:
 *
 *     preTaxNet   = total − vatAmount            (دقيق: الضريبة محفوظة كمبلغ)
 *     ownerShare  = preTaxNet × copay ÷ total    (حين توجد مطالبة)
 *
 * **والافتراض الوحيد في القسمة النسبية ليس جديدًا**: قسمة §9.1 نفسها توزّع الإجمالي
 * المُضرَّب على الأسطر **بأوزان ما قبل الضريبة** (خطوتها الأولى)، أي أنّها تفترض أصلًا
 * تناسبَ الضريبة مع الأسطر. فالعودة بالنسبة نفسها لا تضيف تقريبًا فوق ما افترضته
 * القسمة — ولو أضفنا حسابًا «أدقّ» هنا لخالفنا الرقم الذي قُسِمت به الفاتورة فعلًا.
 * مسجَّل في §17.2 صفّ ٨.
 *
 * وحين لا مطالبة: `copayShare` فارغ ⇒ الأساس هو الصافي كاملًا.
 */
export declare function ownerPreTaxNet(input: {
    total: Prisma.Decimal | string;
    vatAmount: Prisma.Decimal | string;
    copayShare?: Prisma.Decimal | string | null;
}): Prisma.Decimal;
/**
 * BR-L5.4 — المعدّل الفعليّ = المعدّل الأساسي × مضاعِف المستوى × مضاعِف العضوية.
 *
 * مضاعِف العضوية **قراءةٌ لا اقتران**: الوحدة تقرأ حالة العضوية ولا تكتب في جداولها،
 * ولا تُضيف نوع ميزة، ولا تظهر في `applyMembershipBenefits`. مضاعِف المستوى يصل في
 * LY-P3؛ حتى ذلك الحين يمرّ ١ فتبقى المعادلة هي هي.
 */
export declare function effectiveEarnRate(input: {
    earnRate: Prisma.Decimal | string;
    tierMultiplier?: Prisma.Decimal | string | null;
    membershipMultiplier?: Prisma.Decimal | string | null;
}): Prisma.Decimal;
/**
 * BR-L5.5 — **تقريب النقاط إلى الأسفل**، ثابتًا لا قابلًا للضبط.
 *
 * فالأكاديمية لا تمنح أكثر ممّا حسبت أبدًا. وأساسٌ سالب أو صفر يعطي صفرًا لا رقمًا سالبًا:
 * الكسب لا يخصم، والخصم فعلُ العكس وحده (BR-L5.6).
 */
export declare function pointsEarned(base: Prisma.Decimal | string, effectiveRate: Prisma.Decimal | string): number;
/** §7 — `expiresAt = earnedAt + pointsValidityMonths` (BR-L7.1). */
export declare function expiryFor(earnedAt: Date, validityMonths: number): Date;
export type LedgerRow = {
    kind: "EARN" | "REDEEM" | "EXPIRY" | "REVERSAL" | "REDEMPTION_RESTORE" | "ADJUSTMENT";
    points: number;
    pointsConsumed?: number;
    expiresAt: Date | null;
};
/**
 * BR-L9.1 — **الرصيد مجموع الصفوف، ولا عمود رصيد في أيّ مكان.**
 *
 * والانتهاء **يُشتقّ عند القراءة** (BR-L7.1): مهمّة الليل لا تدور في الإنتاج ([P13.12])،
 * والاعتماد على صفوف EXPIRY وحدها كان سيعرض رصيدًا انتهى نصفه منذ أسبوع.
 *
 * **[LY-P2] وصفُّ كسبٍ انتهى يُسقِط ما لم يُنفَق منه فقط، لا كلَّه.** هذا تدقيقٌ لصيغة
 * LY-P1، لا تغييرٌ لسلوكها: يومها لم يكن ثمّة استبدال، فـ`pointsConsumed` صفرٌ دائمًا
 * والصيغتان متطابقتان حرفيًا. مع الاستبدال يفترقان، والفرق حقيقيّ — نقطةٌ أُنفقت قبل
 * انتهائها **استُعملت**، والانتهاء لا يستردّ ما صُرف. الإسقاط الكامل كان سيخصم النقطة
 * مرّتين: مرّةً بصفّ REDEEM السالب، ومرّةً بإسقاط صفّ كسبها. (§17.2)
 *
 * وصفوف EXPIRY تُستثنى: هي أثرٌ تدقيقيّ لما أسقطه الاشتقاق أصلًا، فجمعُها طرحٌ ثانٍ.
 */
export declare function deriveBalance(rows: LedgerRow[], now?: Date): number;
/**
 * §10.3 — قيمة ما يوشك أن ينتهي خلال نافذة التنبيه.
 *
 * تُحتسب صفوف الكسب غير المنتهية وحدها، وبما تبقّى منها بعد الاستهلاك — نقطةٌ استُبدلت
 * لا تنتهي مرّتين.
 */
export declare function expiringWithin(rows: (LedgerRow & {
    pointsConsumed?: number;
})[], days: number, now?: Date): number;
