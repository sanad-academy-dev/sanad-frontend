import type { Prisma } from "@/generated/prisma/client";
/** ما يلزم من النطاق بعد المطابقة: هويّته ورسم تنقّله. */
export type MatchedZone = {
    id: string;
    travelFee: Prisma.Decimal | null;
};
/**
 * [MC8.2] مطابقة النطاق.
 *
 * تُجرى بعد الحفظ لا قبله، والخروج عن النطاق **لا يرفض الطلب**: قد يكون الدبّوس خاطئًا،
 * وقد تقرّر الأكاديمية دورة عميل بعيد. النطاق معلومة للمنسّق لا بوّابة تُغلق أمام الزبون.
 *
 * أُخرجت من `mobile-requests.dao` إلى وحدة محايدة حين احتاجتها الزيارات أيضًا ([O3]):
 * استيراد كلٍّ من الـ DAOين للآخر يصنع دورة استيراد، والمنطق واحد لا نسختان.
 *
 * أوّل نطاق مطابق يفوز. النطاقات المتداخلة ممكنة، ولا ترتيب أولويّة في النموذج — فإن
 * احتاجت الأكاديمية أولويّة صريحة فتلك خانة على `ServiceZone` لا افتراض مخبّأ هنا.
 */
export declare function matchZoneRow(clinicId: string, point: {
    lat: number;
    lng: number;
}): Promise<MatchedZone | null>;
/** المطابقة حين لا يلزم إلا المعرّف (تصنيف الطلب الوارد). */
export declare function matchZone(clinicId: string, point: {
    lat: number;
    lng: number;
}): Promise<string | null>;
