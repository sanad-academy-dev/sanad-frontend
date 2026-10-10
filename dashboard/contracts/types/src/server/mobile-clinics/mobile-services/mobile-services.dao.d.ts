import type { Prisma } from "@/generated/prisma/client";
import { type MobileCatalogEntryResponse, MobileServiceConflictError, type MobileVisitServiceResponse, type UpsertCatalogEntryFormInput } from "@/server/mobile-clinics/mobile-services/mobile-services.type";
type Tx = Prisma.TransactionClient;
/** السعر والمدّة الفعليّان لدورة متنقلة. */
export type ResolvedMobilePrice = {
    serviceId: string;
    price: Prisma.Decimal;
    duration: number;
};
/**
 * [MC10.1] يتحقّق أنّ كل دورة مطلوبة مسموح بها للمركبات، ويعيد سعرها ومدّتها الفعليّين.
 *
 * ترتيب الحسم: سعر السجلّ المتنقل ← سعر `ClinicServiceConfig` ← رفض. لا افتراض بصفر:
 * دورةٌ بلا سعر في القناتين خطأُ إعداد يجب أن يظهر عند الجدولة لا أن يصير سطرًا مجّانيًّا
 * في فاتورة وليّ الأمر.
 *
 * رسم التنقّل مستثنًى: ليس دورة سريريّة يؤدّيها الطاقم، بل رسمٌ يضيفه النظام نفسه، وسعره
 * يأتي من النطاق لا من السجلّ (انظر `travel-fee.service`).
 */
export declare function resolveMobileServices(tx: Tx, clinicId: string, serviceIds: string[], 
/**
 * المركبة التي ستنفّذ الدورة — **اختيارية عمدًا**.
 *
 * تُستدعى هذه البوّابة من مواضع لا مركبة فيها بعد: نموذج الحجز العام يعرض الدورات
 * قبل إسناد أي مركبة، وتحويل طلب إلى زيارة قد يجري بلا مركبة (مسار PENDING الذي
 * يقوم عليه عرض الرحلة والتقاطها). فحين تغيب، يُحتكم إلى كتالوج الأكاديمية وحده —
 * وهو الجواب الصحيح: لا يمكن تقييد ما لم تُختر مركبته بعد.
 */
mobileUnitId?: string): Promise<ResolvedMobilePrice[]>;
export declare const mobileServicesDao: {
    list(clinicId: string, includeInactive?: boolean): Promise<MobileCatalogEntryResponse[]>;
    /** دورات المركبة كما ضُبطت — للوحة التحكّم. فارغة ⇒ لم يُقيَّد شيء. */
    unitServices(clinicId: string, mobileUnitId: string): Prisma.PrismaPromise<{
        service: {
            name: string;
            id: string;
        };
        id: string;
        isActive: boolean;
        duration: number | null;
        serviceId: string;
        price: import("@prisma/client-runtime-utils").Decimal | null;
    }[]>;
    /**
     * يضبط قائمة المركبة كاملةً (استبدال لا دمج).
     *
     * الاستبدال أوضح من الدمج هنا: الشاشة تعرض مربّعات اختيار، وما يراه المستخدم بعد
     * الحفظ يجب أن يطابق ما اختاره تمامًا — لا أن يبقى صنفٌ أزاله لأن الدمج لا يحذف.
     *
     * وقائمة فارغة ترفع التقييد ولا تمنع كل شيء: «لم يُضبط» ليست «مُنع».
     */
    setUnitServices(clinicId: string, mobileUnitId: string, serviceIds: string[]): Promise<{
        count: number;
    }>;
    /**
     * ما تقدّمه **هذه المركبة** — ما يعرضه التطبيق للطاقم.
     *
     * مركبة بلا قائمة خاصّة ترى الكتالوج كاملًا؛ ومركبة لها قائمة ترى ما فيها فقط،
     * بسعرها ومدّتها إن جرى تجاوزهما. فلا يعرض التطبيق دورةً سيرفضها الخادم عند
     * التسجيل — وهو أسوأ ما يمكن أن يحدث للطاقم وهو واقف عند الطفل.
     */
    listForUnit(clinicId: string, mobileUnitId: string): Promise<MobileCatalogEntryResponse[]>;
    /**
     * الدورات المرشَّحة للإضافة: أوراق شجرة الدورات المفعّلة في الأكاديمية وغير المُدرجة بعد.
     *
     * `level: "ITEM"` شرطٌ لا تجميل: الفئات والفئات الفرعية عقد تنظيمية لا تُباع، وإدراجها
     * كان سيسمح بجدولة «تحاليل» كدورة بلا تحديد أيّ تحليل.
     */
    candidates(clinicId: string): Promise<{
        id: string;
        name: string;
        categoryName: string | null;
        clinicPrice: import("@prisma/client-runtime-utils").Decimal | null;
        clinicDuration: number | null;
    }[]>;
    upsert(clinicId: string, input: UpsertCatalogEntryFormInput): Promise<MobileCatalogEntryResponse>;
    bulkAdd(clinicId: string, serviceIds: string[]): Promise<{
        added: number;
    }>;
    remove(clinicId: string, id: string): Promise<{
        success: true;
    }>;
    /**
     * [MC10.5] الدورات المعروضة على نموذج الطلب العام.
     *
     * قائمة عرض لا تسعير: تُسقط الدورة التي لا سعر لها في القناتين بدل أن ترمي، لأنّ خطأ
     * إعداد في الأكاديمية يجب ألّا يُسقط صفحة يراها وليّ الأمر. الرفض الحقيقي مكانه التحويل، حيث
     * يقرأه منسّق يستطيع إصلاحه (انظر `resolveMobileServices`).
     */
    publicCatalog(clinicId: string): Promise<({
        id: string;
        name: string;
        categoryName: string | null;
        price: string | null;
        duration: number | null;
    } & {
        price: string;
    })[]>;
    /** المعرّفات المسموح بها فقط — لتصفية ما يرسله نموذج عام لا نثق بمدخلاته. */
    allowedIds(clinicId: string, serviceIds: string[]): Promise<Set<string>>;
    listForVisit(clinicId: string, visitId: string): Promise<MobileVisitServiceResponse[]>;
};
export { MobileServiceConflictError };
