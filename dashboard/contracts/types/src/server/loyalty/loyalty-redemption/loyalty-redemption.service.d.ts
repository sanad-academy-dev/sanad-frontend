import type { Prisma as PrismaNs } from "@/generated/prisma/client";
import { Prisma } from "@/generated/prisma/client";
import { type Allocation } from "@/server/loyalty/loyalty-redemption/loyalty-redemption.rules";
/**
 * [LY-P2] §6 — الاستبدال عند مقعد التسعير، نيّةً ثمّ التزامًا (BR-L6.3).
 *
 * **مُستنسَخ من آليّة استحقاقات العضوية** (`membership-pricing.service.ts`) لأنّها السابقة
 * العاملة الوحيدة في المستودع لنفس المسألة حرفيًا: قيمةٌ محدودة تُحجَز عند التسعير وتُنفَق
 * عند الدفع، مع سباقٍ محتمل بين مستندين على آخر وحدة. الاختلاف الوحيد أنّ المستهلَك هنا
 * موزَّعٌ على صفوفٍ متعدّدة (FIFO)، فالحارس يدور على التخصيصات لا على صفٍّ واحد.
 *
 * ولماذا الحارس شرطٌ في `UPDATE` لا فحصٌ قبله: فحصٌ ثمّ كتابة يترك نافذةً بين اللحظتين
 * يمرّ منها المستند الثاني. الشرط داخل الجملة يجعل الخاسر يرى `0 rows` فيُجهض دفعه.
 */
type Tx = PrismaNs.TransactionClient;
export type LoyaltyRedemptionIntent = {
    programId: string;
    ownerId: string;
    points: number;
    /** الخصم قبل الضريبة — يدخل الخطوة ٤ من BR-M6.4 */
    discount: Prisma.Decimal;
    redemptionRate: Prisma.Decimal;
    allocations: Allocation[];
};
/**
 * المقعد المشترك (BR-L8.2): تستدعيه خدمتا التسعير كلتاهما، ولا ثالثة.
 *
 * **بلا نقاطٍ مطلوبة ⇒ `null` بلا استعلامٍ واحد.** هذا هو ما يجعل العلم المطفأ مطابقًا
 * بتًّا (BR-L8.4): المسار لا يلمس قاعدة البيانات ولا يغيّر قيمةً واحدة.
 *
 * أمّا حين **يُطلب** استبدال ويتعذّر، فالرفض صريحٌ بالعربية لا إسقاطٌ صامت: الكاشير ضغط
 * زرًّا وينتظر أثرًا، وخصمٌ يختفي بلا كلمة أسوأ من رفضٍ يقول السبب (§10.4).
 */
export declare function resolveLoyaltyRedemption(params: {
    clinicId: string;
    ownerId: string | null | undefined;
    redeemPoints?: number | null;
    /** الصافي قبل الضريبة بعد الكوبون — ما تبقّى عند الخطوة ٤ (BR-L8.3) */
    preTaxNet: Prisma.Decimal | string;
    now?: Date;
}): Promise<LoyaltyRedemptionIntent | null>;
/**
 * حفظ النيّة على المستند — **استبدالٌ في المكان** لا إضافة، كما تفعل صفوف الضريبة ومزايا
 * العضوية. إعادة تسعير الفاتورة تعيد كتابة نيّتها؛ والقيد الفريد على (المصدر، المعرّف)
 * يجعل ذلك مسألة صفٍّ واحد، وهو ما يُنفِّذ «النيّات المتقادمة تُطرَح» (BR-L6.3 خطوة ٣)
 * بلا مهمّة تنظيفٍ ولا تاريخ صلاحية.
 *
 * ولا يُلمس صفٌّ **التُزم** فعلًا: فاتورة مدفوعة لا تُعاد تسعيرها، ولو حدث لكان استبدالُ
 * نيّةٍ منفَّذة محوًا لأثرِ استهلاكٍ وقع.
 */
export declare function persistRedemptionIntent(tx: Tx, input: {
    clinicId: string;
    sourceType: "CLINIC_INVOICE" | "POS_SALE";
    sourceId: string;
    intent: LoyaltyRedemptionIntent | null;
    createdByUserId?: string | null;
}): Promise<void>;
/**
 * BR-L6.3 خطوة ٢ — الالتزام داخل معاملة الدفع، بـ`UPDATE` مشروط لكل صفّ مستهلَك منه.
 *
 * الشرط ثلاثيّ: المتبقّي يكفي **و**الصفّ لم ينتهِ بعد. الثاني ليس زينة — بين التسعير
 * والدفع قد يمرّ منتصف ليل، فتُدفَع فاتورةٌ بنقاطٍ انتهت صباحها. صفر صفوف ⇒ رميةٌ عربية
 * تُجهض المعاملة كلّها، فلا يُحصَّل مالٌ مقابل خصمٍ لم يُغطَّ.
 */
export declare function commitLoyaltyRedemption(tx: Tx, input: {
    clinicId: string;
    sourceType: "CLINIC_INVOICE" | "POS_SALE";
    sourceId: string;
}): Promise<{
    points: number;
} | null>;
/**
 * BR-L6.3 خطوة ٤ — الردّ يعيد النقاط **إلى صفوفها**، وللصفوف غير المنتهية وحدها.
 *
 * «إلى صفوفها» لا كمنحةٍ جديدة: نقطةٌ عمرها أحد عشر شهرًا تعود بتاريخ انتهائها الأصلي.
 * منحةٌ جديدة كانت ستمنح وليّ الأمر سنةً كاملة مقابل ردٍّ — فيصير الاسترداد وسيلةً لتجديد
 * نقاطٍ توشك أن تنتهي.
 *
 * و«غير المنتهية وحدها»: ما انتهى بين الاستبدال والردّ لا يُبعَث. لذلك يختلف مبلغ هذا
 * الصفّ عن مبلغ REDEEM، وهو السبب المباشر لوجود نوعٍ مستقلّ له (§17.2).
 */
export declare function restoreLoyaltyRedemption(tx: Tx, input: {
    clinicId: string;
    sourceType: "CLINIC_INVOICE" | "POS_SALE";
    sourceId: string;
    now?: Date;
}): Promise<{
    restored: number;
} | null>;
/** §10.4 — ما يحتاجه المؤلِّف ليرسم الضابط أو يقول لماذا لا يرسمه. */
export declare function redemptionCapability(clinicId: string, ownerId: string | null | undefined): Promise<{
    available: false;
    reason: "module-off";
    balance?: undefined;
    redemptionRate?: undefined;
    minRedemptionPoints?: undefined;
    maxRedemptionPercent?: undefined;
} | {
    available: false;
    reason: "no-owner";
    balance?: undefined;
    redemptionRate?: undefined;
    minRedemptionPoints?: undefined;
    maxRedemptionPercent?: undefined;
} | {
    available: true;
    balance: number;
    redemptionRate: string;
    minRedemptionPoints: number;
    maxRedemptionPercent: string;
    reason?: undefined;
}>;
export {};
