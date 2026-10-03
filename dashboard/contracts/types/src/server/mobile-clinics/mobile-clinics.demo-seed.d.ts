/**
 * [MC9.2] سيناريو تجريبي مثبَّت للأكاديميات المتنقلة.
 *
 * القاعدة رقم ١٠ في CLAUDE.md: مخرج المرحلة يحتاج بذرةً **مُعادة التشغيل بلا أثر**، على
 * سجلّات مخصَّصة للعرض حتى لا تتحرّك أرقامٌ سبق للوليّ أمر أن تحقّق منها. لذلك:
 *   • كل كائن يُطابق بالاسم أو الرمز الثابت أدناه، فإعادة التشغيل لا تُنشئ شيئًا جديدًا.
 *   • التواريخ **مطلقة** لا نسبية: بذرةٌ تعتمد على «اليوم» تُنتج أرقامًا مختلفة كل يوم،
 *     فلا يمكن تثبيتها في اختبار.
 *   • الأرقام مختارة لتُنتج مؤشّرات لا لبس فيها (انظر EXPECTED أدناه).
 */
/** بادئة ثابتة تميّز بيانات العرض عن بيانات الأكاديمية الحقيقية. */
export declare const DEMO_PREFIX = "MC-DEMO";
/** يوم مرجعي ثابت — لا `new Date()` في أي مكان يؤثّر على رقم. */
export declare const DEMO_DAY: Date;
/**
 * الأرقام التي يجب أن يعرضها تقرير الأسطول بعد هذه البذرة تمامًا.
 * اختبار CI يقارن بها؛ أي تغيير هنا يجب أن يصحبه تغيير الاختبار عمدًا لا مصادفةً.
 */
export declare const EXPECTED: {
    readonly activeUnits: 2;
    readonly shifts: 2;
    readonly visits: 5;
    readonly completed: 3;
    readonly failed: 1;
    readonly totalDistanceKm: 75;
    /** ٣ زيارات لها نافذة ووصول: اثنتان ضمنها وواحدة متأخّرة ⇒ 66.7٪ */
    readonly onTimeRate: 66.7;
    readonly onTimeSampleSize: 3;
    readonly kmPerVisit: 15;
};
type SeedResult = {
    unitIds: string[];
    visitIds: string[];
    created: boolean;
};
/**
 * يبذر السيناريو لأكاديمية واحدة. يُعيد `created: false` إن كان موجودًا مسبقًا — تشغيلٌ ثانٍ
 * لا يضاعف الأرقام، وهو شرط تثبيتها في اختبار.
 */
export declare function seedMobileClinicsDemo(clinicId: string): Promise<SeedResult>;
export {};
