/**
 * [D6] نشر نتيجة لوليّ أمر الطفل — الفعل السريري الذي يفتح بوّابة التطبيق.
 *
 * ── لماذا فعلٌ صريح لا اشتقاق من «اكتملت» ───────────────────────────────
 *
 * اكتمال التحليل حدثٌ مخبري؛ صلاحيّته للعرض على غير المدرّب حكمٌ سريري. قيمةٌ خارج
 * المدى المرجعي تُقرأ كارثةً وهي طبيعية لنوع الطفل، وأخرى تبدو سليمة يعرف المدرّب
 * وحده أنها تستدعي إعادة. ربطُ النشر بالاكتمال كان سيعني أن أي نتيجة تصل وليّ الأمر قبل
 * أن يقرأها أحد — وهو ما رفضته [D6] منذ البداية، ولذلك بقيت `/results` فارغة.
 *
 * فالنشر هنا: مدرّبٌ يقرّر، فيُسجَّل اسمه ووقته وملخّصه بلغة وليّ الأمر.
 *
 * ── ما يُعرض ليس التقرير الخام ──────────────────────────────────────────
 *
 * `releaseSummary` هو ما يقرؤه وليّ الأمر. الموجودات التفصيلية والانطباع التشخيصي تبقى
 * للطاقم: نشرُ نصٍّ كُتب لمدرّبٍ آخر ليس شفافية بل نقلُ عبء التفسير إلى من لا يملكه.
 */
export declare class ResultsReleaseError extends Error {
    constructor(message: string);
}
/** لا يُنشر إلا المكتمل: نتيجةٌ قيد التنفيذ لا تُنشر ولو أراد المدرّب. */
export declare function releaseLabOrder(clinicId: string, orderId: string, staffId: string, summary: string): Promise<{
    id: string;
    releasedToOwnerAt: Date | null;
}>;
export declare function releaseRadiologyOrder(clinicId: string, orderId: string, staffId: string, summary: string): Promise<{
    id: string;
    releasedToOwnerAt: Date | null;
}>;
/**
 * التراجع عن النشر.
 *
 * لا يُمحى الملخّص: سحبُ نتيجةٍ رآها وليّ الأمر فعلًا لا يُنسيه إيّاها، والأثر يبقى لبيان
 * أنها كانت منشورة. المسح هنا يخصّ العرض في التطبيق لا التاريخ.
 */
export declare function unreleaseLabOrder(clinicId: string, orderId: string): Promise<{
    id: string;
}>;
export declare function unreleaseRadiologyOrder(clinicId: string, orderId: string): Promise<{
    id: string;
}>;
