/** الأرقام والنصوص المثبَّتة — تقرؤها حزمة CI حرفيًّا. */
export declare const CRM_P3_DEMO: {
    readonly templateName: "ترحيب بالعميل (عرض P3)";
    readonly templateSubject: "عرضنا لك يا {{الاسم}}";
    readonly templateBody: "مرحبًا {{الاسم}}،\nنتواصل معك من {{الأكاديمية}} بخصوص اهتمامك.\nجوالك لدينا: {{الجوال}}";
    /** بريد الأكاديمية الذي يصير عنوان الردّ حين تكون الإعدادات فارغة. */
    readonly fallbackClinicEmail: "reception@demo-clinic.test";
};
type Seeded = {
    created: string[];
    existing: string[];
};
export declare function seedCrmP3Demo(clinicId: string): Promise<Seeded>;
export {};
