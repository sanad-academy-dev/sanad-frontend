import type { Prisma } from "@/generated/prisma/client";
import { type MobileVisitServiceResponse, type RecordVisitServiceFormInput } from "@/server/mobile-clinics/mobile-services/mobile-services.type";
type Tx = Prisma.TransactionClient;
export declare const visitServicesService: {
    /**
     * [MC10.2] تسجيل دورة نُفِّذت في الموقع.
     *
     * السعر يُشتقّ في الخادم من سجلّ المسموح — لا يُقبل من الجهاز. والسطر يُرفض إن لم تكن
     * الدورة مُدرجة للمركبات، فنفس الحارس يعمل عند الجدولة وفي الميدان.
     */
    record(clinicId: string, visitId: string, input: RecordVisitServiceFormInput, performedByStaffId: string | null): Promise<MobileVisitServiceResponse>;
    updateQuantity(clinicId: string, visitId: string, lineId: string, quantity: number): Promise<MobileVisitServiceResponse>;
    remove(clinicId: string, visitId: string, lineId: string): Promise<{
        success: true;
    }>;
    /**
     * يبذر سجلّ المنفَّذ من دورات الموعد المجدولة، عند أوّل وصول للمركبة.
     *
     * بلا هذا يبدأ الطاقم من قائمة فارغة ويعيد إدخال ما هو مجدول أصلًا — أسرع طريق إلى
     * فاتورة ناقصة. و`source: SCHEDULED` يُبقي الفارق بين ما حُجز وما أُضيف ميدانيًّا ظاهرًا.
     */
    seedFromAppointment(tx: Tx, clinicId: string, visitId: string, appointmentId: string): Promise<{
        seeded: number;
    }>;
    /**
     * يزامن ما نُفِّذ إلى `AppointmentService` عند إنهاء الزيارة.
     *
     * السجلّ الميداني هو الحقيقة، والموعد هو مستند الفوترة — فالمزامنة تجعل الفاتورة تعكس
     * ما جرى فعلًا بدل ما حُجز، بلا مسار فوترة ثانٍ.
     *
     * ثلاثة أشياء لا تُمسّ:
     *  - **رسم التنقّل**: يضيفه النظام من النطاق، وليس من عمل الطاقم.
     *  - **السطور المدفوعة** (`paidAt`): حذفها يُفسد فاتورةً حُصّلت بالفعل.
     *  - **الكميات**: تُنقل كما سجّلها الطاقم لا كما حُجزت.
     */
    syncToAppointment(tx: Tx, clinicId: string, visitId: string, appointmentId: string): Promise<{
        written: number;
        removed: number;
    }>;
};
export {};
