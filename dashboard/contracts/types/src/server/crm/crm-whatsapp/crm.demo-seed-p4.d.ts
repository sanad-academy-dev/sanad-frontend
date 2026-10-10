/** الأرقام والنصوص المثبَّتة — تقرؤها حزمة CI حرفيًّا. */
export declare const CRM_P4_DEMO: {
    readonly leadName: "سالم القحطاني (عرض P4)";
    /** رقمٌ خاصّ بهذه البذرة، لا يشترك فيه أحد: المطابقة تختار أحدث صفٍّ بنفس الرقم. */
    readonly leadMobile: "+966500000941";
    /** الصيغة التي يطلبها المزوّد الكلاسيكيّ: الأرقام وحدها + اللاحقة. */
    readonly leadChatId: "966500000941@c.us";
    /** نصّ الرسالة الصادرة التي ترسلها الجولة. */
    readonly outboundBody: "تذكير بموعد (عرض P4)";
    /** نصّ الرسالة الواردة التي تحقنها الجولة عبر طابور المزوّد. */
    readonly inboundBody: "تمام، سأحضر (عرض P4)";
    /** السبب العربيّ المتوقَّع حين تكون القناة غير مضبوطة. */
    readonly manualReason: "المزوّد مضبوط على «يدويّ»";
};
type Seeded = {
    created: string[];
    existing: string[];
};
export declare function seedCrmP4Demo(clinicId: string): Promise<Seeded>;
export {};
