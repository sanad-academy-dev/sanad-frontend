import type { Prisma } from "@/generated/prisma/client";
import type { MobileBookingRequestStatus } from "@/generated/prisma/enums";
export declare const mobileRequestSelect: {
    readonly id: true;
    readonly code: true;
    readonly ownerName: true;
    readonly phone: true;
    readonly email: true;
    readonly ownerId: true;
    readonly addressLine: true;
    readonly district: true;
    readonly city: true;
    readonly landmark: true;
    readonly lat: true;
    readonly lng: true;
    readonly petName: true;
    readonly petNotes: true;
    readonly serviceIds: true;
    readonly preferredDate: true;
    readonly preferredWindow: true;
    readonly notes: true;
    readonly attachments: true;
    readonly status: true;
    readonly rejectionReason: true;
    readonly appointmentId: true;
    readonly createdAt: true;
    readonly handledAt: true;
    readonly animalType: {
        readonly select: {
            readonly id: true;
            readonly arName: true;
        };
    };
    readonly zone: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly travelFee: true;
        };
    };
    readonly handledBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type MobileRequestResponse = Prisma.MobileBookingRequestGetPayload<{
    select: typeof mobileRequestSelect;
}>;
/** بصمة مجزّأة للـ IP — تكفي لتحديد المعدّل بلا تخزين معرّف شخصي. */
export declare const hashIp: (ip: string) => string;
export type PublicRequestInput = {
    ownerName: string;
    phone: string;
    email?: string;
    addressLine: string;
    district?: string;
    city?: string;
    landmark?: string;
    lat?: number;
    lng?: number;
    animalTypeId?: string;
    petName?: string;
    petNotes?: string;
    serviceIds?: string[];
    preferredDate?: string;
    preferredWindow?: "MORNING" | "AFTERNOON" | "EVENING" | "ANY";
    notes?: string;
};
export declare const mobileRequestsDao: {
    /** [MC7.2] إنشاء طلب من النموذج العام. لا وليّ أمر ولا طفل هنا — التحويل وحده يُنشئهما. */
    createPublic(clinicId: string, input: PublicRequestInput, ipHash: string | null): Promise<{
        code: string;
    }>;
    /**
     * [PP1] طلب وارد من **تطبيق وليّ الأمر** — هويّته معروفة.
     *
     * يختلف عن `createPublic` في نقطة واحدة جوهرية: `ownerId` يُكتب الآن لا عند الفرز.
     * الطلب العام يصل باسم ورقم حرَّين ويُنسب إلى وليّ أمر بمطابقة الهاتف لاحقًا؛ هذا يصل
     * منسوبًا سلفًا، فيرى المنسّق سجلّ وليّ الأمر وأطفاله بدل أن يبحث عنه.
     *
     * ويشترك معه في كل ما عداه — بما فيه البثّ اللحظي، فالطلب يظهر في اللوحة وعلى
     * المركبات بالسرعة نفسها أيًّا كان مصدره.
     */
    createFromPortal(clinicId: string, input: {
        ownerId: string;
        ownerName: string;
        phone: string;
        email: string | null;
        addressLine: string;
        district?: string;
        landmark?: string;
        petId?: string;
        serviceIds?: string[];
        preferredWindow?: "MORNING" | "AFTERNOON" | "EVENING" | "ANY";
        notes?: string;
    }): Promise<{
        code: string;
        requestId: string;
    }>;
    list(clinicId: string, status?: MobileBookingRequestStatus): Promise<MobileRequestResponse[]>;
    byId(id: string, clinicId: string): Promise<MobileRequestResponse | null>;
    setStatus(id: string, clinicId: string, userId: string, status: MobileBookingRequestStatus, rejectionReason?: string): Promise<MobileRequestResponse>;
    /**
     * [MC7.4] تحويل طلب إلى زيارة متنقلة.
     *
     * كل شيء في معاملة واحدة: وليّ الأمر (مطابقةً بالهاتف أو إنشاءً)، والطفل، وعنوان الدورة،
     * والزيارة، وامتدادها المتنقّل، ثم ختم الطلب. فشلٌ في المنتصف كان سيترك وليّ أمرًا بلا
     * طفل أو زيارةً بلا عنوان — سجلّات يتيمة يصنعها الفرز لا المستخدم.
     *
     * المطابقة بالهاتف تتبع نفس قاعدة `public-bookings.dao`: `Owner` فريد بـ
     * (clinicId, phone)، فوليّ الأمر العائد لا يتكرّر.
     */
    convert(id: string, clinicId: string, userId: string, input: {
        branchId: string;
        staffId: string;
        startsAt: string;
        durationMinutes: number;
        mobileUnitId?: string;
        windowStart?: string;
        windowEnd?: string;
        /**
         * نوع الطفل حين لا يذكره الطلب.
         *
         * نموذج الطلب العام لا يفرضه — والعميل غالبًا لا يعرف تصنيفنا أصلًا. وبدون
         * هذا الباب كان الطاقم يرى الطلب في التطبيق ولا يستطيع قبوله إطلاقًا: رفضٌ
         * لا مخرج منه إلا بفتح لوحة التحكّم، وهو ما لا يملكه سائق في مركبة.
         */
        animalTypeId?: string;
    }): Promise<{
        appointmentId: string;
        visitId: string;
        trackingToken: string;
        requestCode: string;
    }>;
};
