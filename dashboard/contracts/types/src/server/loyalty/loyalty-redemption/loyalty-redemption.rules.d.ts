import { Prisma } from "@/generated/prisma/client";
/** صفّ كسبٍ قابلٌ للاستهلاك، بالشكل الذي يقرؤه الترتيب FIFO. */
export type EarnRow = {
    id: string;
    points: number;
    pointsConsumed: number;
    expiresAt: Date | null;
    earnedAt: Date;
};
export type Allocation = {
    ledgerEntryId: string;
    points: number;
    expiresAt: Date | null;
};
/**
 * BR-L6.4 — **الأقدم انتهاءً أولًا**، لا الأقدم كسبًا.
 *
 * والفرق ليس تجميليًا: صفّان أحدهما أقدمُ كسبًا وأبعدُ انتهاءً (برنامجٌ مُدِّدت صلاحيته،
 * أو تسويةٌ يدوية) — الترتيب بالكسب كان سيُنفق البعيد أولًا ويترك القريب يضيع. الترتيب
 * بالانتهاء هو الوحيد الذي يجعل «نقاطك تنتهي قريبًا» تنبيهًا صادقًا.
 *
 * وصفٌّ بلا انتهاء يأتي **أخيرًا**: ما لا ينتهي لا يضيع بالانتظار.
 */
export declare function redeemableRows(rows: EarnRow[], now?: Date): EarnRow[];
/** مجموع ما يمكن إنفاقه فعلًا اليوم — غير المنتهي وغير المستهلَك. */
export declare function redeemableBalance(rows: EarnRow[], now?: Date): number;
/**
 * توزيع النقاط على الصفوف بالترتيب. يُعيد `null` إن لم يكفِ الرصيد — لا يوزّع جزئيًا:
 * استبدالٌ نصفه واقعٌ ونصفه لا هو أسوأ من رفضٍ صريح.
 */
export declare function allocateFifo(rows: EarnRow[], points: number, now?: Date): Allocation[] | null;
/** قيمة النقاط بالريال قبل الضريبة. */
export declare function discountFor(points: number, redemptionRate: Prisma.Decimal | string): Prisma.Decimal;
/**
 * سقف §6.2: أكبر عددِ نقاطٍ لا يتجاوز خصمُه `maxRedemptionPercent` من الصافي قبل الضريبة.
 *
 * يُحسب بالنقاط لا بالريال ليكون الرفض قابلًا للتنفيذ: «الحدّ الأقصى ١٢٠ نقطة» تعليماتٌ،
 * و«الحدّ الأقصى ٢٤ ريالًا» لغزٌ يحلّه المستخدم بالقسمة.
 */
export declare function maxRedeemablePoints(preTaxNet: Prisma.Decimal | string, maxRedemptionPercent: Prisma.Decimal | string, redemptionRate: Prisma.Decimal | string): number;
export type RedemptionPlan = {
    points: number;
    discount: Prisma.Decimal;
    allocations: Allocation[];
};
/**
 * BR-L6.2 — كل الشروط، ورفضُها بالعربية **مع الرقم الذي يُصلحه**.
 *
 * رسالةٌ تقول «النقاط غير كافية» بلا رصيد ولا مطلوب تجعل الكاشير يخمّن؛ ولذلك كل رفضٍ
 * هنا يحمل الحدّ الذي كُسِر. نفس مبدأ رفوض BR-L3.1 في LY-P0.
 */
export declare function planRedemption(input: {
    requestedPoints: number;
    rows: EarnRow[];
    /** الصافي قبل الضريبة **بعد** الكوبون — ما تبقّى عند الخطوة ٤ (BR-L8.3) */
    preTaxNet: Prisma.Decimal | string;
    redemptionRate: Prisma.Decimal | string;
    minRedemptionPoints: number;
    maxRedemptionPercent: Prisma.Decimal | string;
    now?: Date;
}): RedemptionPlan;
