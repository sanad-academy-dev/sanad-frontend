import { type PublicAnimalType, type PublicClinicCategory, type PublicClinicResponse, type PublicClinicService, type PublicClinicStaffResponse, type PublicSlotRangeResponse } from "@/server/public/public.type";
export declare const publicDao: {
    getClinicBySlug(slug: string): Promise<PublicClinicResponse | null>;
    listClinicStaffBySlug(slug: string): Promise<PublicClinicStaffResponse[] | null>;
    listClinicAnimalTypesBySlug(slug: string): Promise<PublicAnimalType[] | null>;
    listClinicServicesBySlug(slug: string): Promise<PublicClinicService[] | null>;
    listClinicCategoriesBySlug(slug: string): Promise<PublicClinicCategory[] | null>;
    /**
     * الجلسات المتاحة لمدرّب — **بدورة أو بنوع كشف**.
     *
     * كان المحرّك يعرف الدورات وحدها، وهي ما يحجزه نموذج الويب العام. لكنّ زيارة
     * الأكاديمية الحقيقية تُبنى على **نوع كشف** (`consultationTypeId`) لا على دورة —
     * وهو ما يختاره الطاقم في «سبب الزيارة»، وما صار تطبيق وليّ الأمر يحجزه.
     *
     * والفرق يقع في موضعين اثنين فقط — أهليّة المدرّب ومصدر المدّة — فبقيّة الحساب
     * (ساعات العمل، الجلسات المشغولة، تقطيع اليوم) واحدة. تفريعُ محرّك ثانٍ لها كان
     * سيعني أن التطبيق يعرض جلسات تخالف ما تراه الأكاديمية، وهو أسوأ من ألّا يعرض شيئًا.
     */
    getStaffSlotsRange(args: {
        slug: string;
        staffId: string;
        serviceId?: string;
        consultationTypeId?: string;
        from: Date;
        to: Date;
    }): Promise<PublicSlotRangeResponse | null>;
};
