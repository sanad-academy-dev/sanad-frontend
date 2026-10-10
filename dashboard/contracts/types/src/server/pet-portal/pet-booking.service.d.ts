import type { PetOwnerScope } from "@/server/pet-portal/pet-auth.macro";
/** دورات الأكاديمية القابلة للحجز + أطبّاؤها. */
export declare function bookingOptions(scope: PetOwnerScope, clinicId: string): Promise<{
    services: {
        id: string;
        name: string;
        /**
         * الكشف لا يحمل مدّة في مخطّطه — المدّة الافتراضية هي ما يحجزه الطاقم أيضًا
         * (`appointmentsDao.create`). رقمٌ آخر هنا يعني قائمة جلسات تخالف التقويم.
         */
        durationMinutes: number;
        /**
         * السعر **يُعرض هنا**، خلافًا للدورات.
         *
         * `ConsultationTypeConfig.price` هو سعر الأكاديمية المعلن لهذا الكشف، وهو ما
         * يراه الطاقم في النافذة نفسها. إخفاؤه كان يعني أن وليّ الأمر يحجز بلا أن يعرف
         * كم يدفع، بينما الرقم معروف ومحدَّد.
         */
        price: number | null;
        currencyCode: string;
    }[];
    doctors: {
        id: string;
        name: string;
        specialization: string | null;
        avatarUrl: string | null;
    }[];
    /**
     * `true` — لأن هذا هو ما يفعله النظام **فعلًا**.
     *
     * نموذج الحجز العام على الويب يُنشئ موعدًا حقيقيًّا في التقويم منذ زمن. جعلُ
     * التطبيق أضعف منه (طلبٌ ينتظر تأكيدًا) كان سيعني مسارين مختلفين لنفس الفعل،
     * ووليّ الأمر الذي حجز من الموقع يرى موعده بينما الذي حجز من التطبيق ينتظر. حين
     * تطلب أكاديميةٌ وضع التأكيد يصير إعدادًا لها، لا افتراضًا للجميع.
     */
    directBooking: boolean;
    depositAmount: number | null;
    currencyCode: string;
} | null>;
/**
 * الجلسات المتاحة في يوم واحد، عبر كل مدرّب مؤهَّل (أو مدرّبًا بعينه).
 *
 * المحرّك يعمل لكل مدرّب على حدة، فنستدعيه لكلٍّ منهم ثم ندمج. الدمج مرتَّب بالوقت لا
 * بالمدرّب: وليّ الأمر يبحث عن «متى»، والمدرّب تفصيلٌ يقرؤه بعد أن يجد الوقت.
 */
export declare function bookingSlots(scope: PetOwnerScope, args: {
    clinicId: string;
    serviceId: string;
    date: string;
    doctorId?: string;
}): Promise<{
    date: string;
    slots: {
        startsAt: string;
        startMinute: number;
        doctorId: string;
        doctorName: string;
    }[];
} | null>;
export declare class PortalSlotTakenError extends Error {
    constructor();
}
/**
 * ينشئ الموعد.
 *
 * **داخل معاملة واحدة، مع إعادة فحص التعارض في آخر لحظة.** الفحص عند عرض الجلسات
 * لا يكفي: بين رؤية وليّ الأمر للموعد وضغطه عليه ثوانٍ يستطيع فيها الاستقبال حجز الوقت
 * نفسه. الفحص هنا هو ما يمنع موعدين على مدرّب واحد.
 */
export declare function createBooking(scope: PetOwnerScope, input: {
    clinicId: string;
    patientId: string;
    serviceId: string;
    doctorId: string;
    startsAt: string;
    reason?: string;
}): Promise<{
    outcome: "BOOKED";
    appointmentId: string;
    requestId: null;
    startsAt: string;
} | null>;
