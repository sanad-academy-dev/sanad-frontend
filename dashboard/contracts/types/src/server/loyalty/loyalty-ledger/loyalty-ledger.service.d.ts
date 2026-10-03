import type { Prisma as PrismaNs } from "@/generated/prisma/client";
import { Prisma } from "@/generated/prisma/client";
import { ownerPreTaxNet } from "@/server/loyalty/loyalty-ledger/loyalty-ledger.rules";
/**
 * [LY-P1] §5 و§9 — منح النقاط وعكسها، وقراءة الرصيد.
 *
 * **يُستدعى المنح داخل معاملة الدفع نفسها** (BR-L5.1، NFR-1): يمرّ `tx` ولا يُفتح اتصال
 * ثانٍ. دفعةٌ تفشل بعد المنح كانت ستترك نقاطًا مقابل مالٍ لم يُحصَّل — وهو عين ما يمنعه
 * التزام استحقاقات العضوية في نفس الموضع من نفس المعاملة.
 *
 * **وكل هذه الدوالّ صامتةٌ عند الإطفاء**: وحدةٌ مطفأة، أو أكاديميةٌ بلا برنامج فعّال، أو
 * فاتورةٌ بلا وليّ أمر ⇒ لا صفّ ولا خطأ. مسار الدفع لا يجوز أن يفشل لأنّ وحدةً اختيارية
 * غير مهيّأة (§0.3) — وهذا هو الفرق بين «خامل» و«معطوب».
 */
type Tx = PrismaNs.TransactionClient;
export type EarnSource = {
    sourceType: "CLINIC_INVOICE" | "POS_SALE";
    sourceId: string;
};
/**
 * BR-L5.1/5.2 — منح النقاط عند اكتمال الدفع.
 *
 * متعادلٌ بقيدٍ فريد على (المصدر، النوع): إعادة معالجة الدفعة لا تمنح مرّتين. التقاط
 * P2002 أرخص من فحصٍ مسبق ولا يترك سباقًا بين معاملتين متزامنتين.
 */
export declare function commitLoyaltyEarn(tx: Tx, input: EarnSource & {
    clinicId: string;
    ownerId: string | null | undefined;
    /** صافي وليّ الأمر قبل الضريبة (BR-L5.2) — يحسبه المستدعي من أعمدة مستنده */
    preTaxNet: Prisma.Decimal | string;
    earnedAt?: Date;
}): Promise<{
    points: number;
} | null>;
/**
 * BR-L5.6 — الاسترداد يعكس المنحة، **وقد يدفع الرصيد إلى السالب**.
 *
 * ولا يُلطَّف ذلك عمدًا. البديلان أسوأ: رفضُ الاسترداد يعطّل عمليةً مشروعة، والتسامحُ
 * الصامت يجعل النقاط طريقًا لاستخراج قيمة من المرتجعات. الرصيد السالب يمنع الاستبدال
 * (LY-P2) حتى يُغطّى بكسبٍ لاحق، وهو ظاهرٌ على سطح وليّ الأمر لا مخبوء.
 *
 * ويعكس ما مُنح فعلًا لا ما كان سيُمنح اليوم: يقرأ صفّ الكسب ويُنشئ نظيره سالبًا.
 */
export declare function reverseLoyaltyEarn(tx: Tx, input: EarnSource & {
    clinicId: string;
}): Promise<{
    points: number;
} | null>;
/** §10.3 — رصيد وليّ الأمر ومقدار ما يوشك أن ينتهي. مشتقّ، لا مقروء من عمود. */
export declare function getOwnerLoyaltySummary(clinicId: string, ownerId: string): Promise<{
    enabled: boolean;
    balance: number;
    expiringSoon: number;
    expiryNoticeDays: number;
    tier: {
        name: string;
        colorToken: string;
        earnMultiplier: string;
    } | null;
    qualifyingSpend: string;
    tierWindowMonths: number;
}>;
export { ownerPreTaxNet };
