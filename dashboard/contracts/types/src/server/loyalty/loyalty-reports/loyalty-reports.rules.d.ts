import { Prisma } from "@/generated/prisma/client";
export type LiabilityRow = {
    ownerId: string;
    points: number;
    pointsConsumed: number;
    expiresAt: Date | null;
};
/** دِلاء العمر بحسب قرب الانتهاء — الترتيب هو ترتيب العرض. */
export declare const LIABILITY_BUCKETS: readonly [{
    readonly key: "due30";
    readonly labelAr: "خلال ٣٠ يومًا";
    readonly maxDays: 30;
}, {
    readonly key: "due90";
    readonly labelAr: "خلال ٩٠ يومًا";
    readonly maxDays: 90;
}, {
    readonly key: "due365";
    readonly labelAr: "خلال سنة";
    readonly maxDays: 365;
}, {
    readonly key: "later";
    readonly labelAr: "أبعد من سنة أو بلا انتهاء";
    readonly maxDays: null;
}];
export type LiabilityBucketKey = (typeof LIABILITY_BUCKETS)[number]["key"];
/**
 * §11.1 — **النقاط غير المنتهية × معدّل الاستبدال الحالي.**
 *
 * «غير المنتهية» و«غير المستهلَكة»: ما لا يمكن استبداله غدًا ليس التزامًا اليوم.
 * والمعدّل **الحالي** لا المُلتقَط: هذا تقديرُ تعرّضٍ مستقبليّ، والاستبدال القادم سيقع
 * بمعدّل اليوم لا بمعدّل يوم المنح.
 */
export declare function outstandingLiability(rows: LiabilityRow[], redemptionRate: Prisma.Decimal | string, now?: Date): {
    points: number;
    value: Prisma.Decimal;
    owners: number;
    buckets: {
        key: LiabilityBucketKey;
        labelAr: string;
        points: number;
        value: Prisma.Decimal;
    }[];
};
export type ActivityRow = {
    kind: "EARN" | "REDEEM" | "EXPIRY" | "REVERSAL" | "REDEMPTION_RESTORE" | "ADJUSTMENT";
    points: number;
};
/**
 * §11.2 — الحركة خلال فترة، ومعها **معدّل الاستبدال**: أيّ نسبةٍ من النقاط الممنوحة
 * استُعملت فعلًا. وهو مقياس صحّة البرنامج: منحٌ كثير واستبدالٌ قريب من الصفر يعني
 * برنامجًا لا يراه أحد، لا برنامجًا رابحًا.
 */
export declare function activitySummary(rows: ActivityRow[]): {
    granted: number;
    redeemed: number;
    expired: number;
    reversed: number;
    restored: number;
    adjusted: number;
    /** نسبة مئوية بخانتين، أو `null` حين لا منح — قسمةٌ على صفر ليست صفرًا */
    redemptionRatePercent: string | null;
};
