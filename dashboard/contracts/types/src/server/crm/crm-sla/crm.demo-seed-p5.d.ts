/** الأرقام المثبَّتة — تقرؤها حزمة CI حرفيًّا. */
export declare const CRM_P5_DEMO: {
    readonly policyName: "استجابة فورية (عرض P5)";
    /** دقيقة واحدة: الخرق يقع أثناء الجولة لا بعدها بساعتين. */
    readonly firstResponseMinutes: 1;
    readonly leadName: "منى الحربي (عرض P5)";
    readonly leadMobile: "+966500000951";
    readonly viewName: "عملائي المستعجلون (عرض P5)";
};
type Seeded = {
    created: string[];
    existing: string[];
};
export declare function seedCrmP5Demo(clinicId: string): Promise<Seeded>;
export {};
