/** الأرقام المثبَّتة — تقرؤها حزمة CI حرفيًّا، فتغييرها هنا يكسرها هناك عمدًا. */
export declare const CRM_P2_DEMO: {
    readonly leadName: string;
    readonly leadMobile: "+966500000921";
    /**
     * §5 — مصدر العميل المحتمل؛ الجولة تتحقّق أنّه انتقل إلى الصفقة عند التحويل.
     *
     * وسمُه «(عرض)» لا «(عرض P2)»: الصفّ من بذرة CRM-P0 وهذه البذرة تشير إليه ولا
     * تُنشئه، فيحمل وسم وليّ أمره. استعمال `tagged()` هنا كان يبحث عن اسمٍ لا وجود له،
     * فيبقى المصدر فارغًا بلا خطأ — والجولة وحدها تكتشف ذلك، متأخّرًا.
     */
    readonly leadSourceName: "إحالة (عرض)";
    /** صفقةٌ مباشرة (بلا عميل محتمل) بقيمة يدوية، لتُقارَن بالصفقة المشتقّة من البنود. */
    readonly dealName: string;
    readonly dealMobile: "+966500000922";
    readonly dealValue: "4000.00";
    /** مرحلة «عرض مقدَّم» احتمالها ٣٠٪ → المتوقّع = ٤٠٠٠ × ٣٠ ÷ ١٠٠ = ١٢٠٠ */
    readonly expectedValue: "1200.00";
    readonly probability: "30";
    readonly products: readonly [{
        readonly label: string;
        readonly qty: "2";
        readonly unitPrice: "150.50";
        readonly lineTotal: "301.00";
    }, {
        readonly label: string;
        readonly qty: "1";
        readonly unitPrice: "99.00";
        readonly lineTotal: "99.00";
    }];
    /** Σ البنود = ٣٠١٫٠٠ + ٩٩٫٠٠ = ٤٠٠٫٠٠ — وهي ما تصير قيمة الصفقة عند الحفظ (BR-C6.1) */
    readonly productsTotal: "400.00";
};
type Seeded = {
    created: string[];
    existing: string[];
};
export declare function seedCrmP2Demo(clinicId: string): Promise<Seeded>;
export {};
