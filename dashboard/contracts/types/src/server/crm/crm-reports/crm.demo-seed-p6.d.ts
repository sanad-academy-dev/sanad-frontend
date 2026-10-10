/**
 * الأرقام المثبَّتة — هذه هي عين ما تؤكّده `crm-p6.walkthrough.test.ts`، وما يجب أن يقرأه
 * وليّ الأمر على الشاشة. أيّ تعديلٍ هنا يكسر الحزمة عمدًا.
 */
export declare const CRM_P6_DEMO: {
    readonly totalLeads: 6;
    readonly convertedLeads: 2;
    /** rate(2, 6) */
    readonly conversionRate: 33.3;
    readonly wonDeals: 1;
    /** rate(1, 6) */
    readonly winRate: 16.7;
    /** (٢ يوم + ٣ أيّام) ÷ ٢ */
    readonly avgDaysToConvert: 2.5;
    /** صفقةٌ مكسوبة واحدة، أُغلقت بعد خمسة أيّام من إنشائها */
    readonly avgDaysToWin: 5;
    /** الصفقة المفتوحة وحدها لها تاريخ إغلاقٍ متوقَّع */
    readonly forecastMonth: "2027-01";
    /** ٣٠٠٠ × ٦٠٪ */
    readonly forecastTotal: 1800;
    readonly wonDealValue: 4500;
    /**
     * سببُ الفقد **مأخوذٌ من بذرة CRM-P0**، لا مصنوعٌ هنا — ولذلك وسمه «(عرض)» لا «(عرض P6)».
     * إنشاء سببٍ ثانٍ باسمٍ مطابق كان سيُضاعف صفًّا مرجعيًّا موجودًا ويجعل تقرير أسباب الفقد
     * يعرض «السعر» مرّتين على شاشة العرض. أمسكت الجولةُ الثابتَ الخطأ في أوّل تشغيل.
     */
    readonly lostReasonName: "السعر (عرض)";
    readonly lostDealCount: 1;
};
type Seeded = {
    created: string[];
    existing: string[];
};
export declare function seedCrmP6Demo(clinicId: string): Promise<Seeded>;
export {};
