import type { MobileUnitStatus } from "@/generated/prisma/enums";
import { type AddCrewMemberFormInput, type CreateMobileUnitFormInput, type EligibleStaffResponse, type MobileUnitActivityResponse, type MobileUnitCrewResponse, type MobileUnitDetailResponse, type MobileUnitDeviceResponse, type MobileUnitResponse, type PairDeviceFormInput, type PairedDeviceResponse, type UpdateMobileUnitFormInput } from "@/server/mobile-clinics/mobile-units/mobile-units.type";
type ListFilters = {
    branchId?: string;
    status?: MobileUnitStatus;
    scope?: "active" | "all";
    search?: string;
};
export declare const mobileUnitsDao: {
    list(clinicId: string, filters?: ListFilters): Promise<MobileUnitResponse[]>;
    byId(id: string, clinicId: string): Promise<MobileUnitDetailResponse | null>;
    /**
     * إنشاء مركبة ينشئ مستودعها في **المعاملة نفسها**.
     *
     * الارتباط ١:١ (`warehouseId @unique`) يعني أنّ مركبةً بلا مستودع سجلٌّ مستحيل الإصلاح:
     * لا يمكن صرف دواء منها ولا تحويل مخزون إليها، ولا سبيل لإلحاق مستودع بها لاحقًا دون
     * تعديل يدوي. لذلك إمّا أن ينجح الاثنان أو لا يُنشأ شيء.
     *
     * ومستودع المركبة لا يصير افتراضيًّا أبدًا: الافتراضي يستقبل حركات POS والرصيد الافتتاحي،
     * وهي حركات لا معنى لها في مركبة تتحرّك — ولهذا لا يُستدعى `stockDao.createWarehouse`
     * هنا، فهو يرقّي أوّل مستودع للأكاديمية إلى افتراضي تلقائيًّا.
     */
    create(clinicId: string, userId: string | null, input: CreateMobileUnitFormInput): Promise<MobileUnitResponse>;
    update(id: string, clinicId: string, userId: string | null, data: UpdateMobileUnitFormInput): Promise<MobileUnitResponse>;
    /**
     * مفتاح الإيقاف الإداري (المتطلّب ٤).
     *
     * الإيقاف هنا لا يمسّ المخزون ولا التاريخ — يمنع الاستخدام فقط. أثره الكامل يكتمل في
     * [MC2.2] حيث يردّ حارس `requireVanSession` بـ 423 لأجهزة المركبة الموقوفة، وفي [MC3.2]
     * حيث تُغلَق وردية مفتوحة إن وُجدت. الحالة التشغيلية تُصفَّر إلى OFFLINE لأنّ مركبةً
     * موقوفة لا يصحّ أن تظهر على الخريطة بحالة «متاحة».
     */
    /**
     * تفعيل المركبة أو إيقافها.
     *
     * البثّ **بعد** إتمام المعاملة لا داخلها: حدثٌ يخرج ثم تفشل المعاملة يترك التطبيق
     * مقفلًا ومركبةً مفعّلة في قاعدة البيانات.
     *
     * الإيقاف يبثّ `mobile.unit.disabled` والتفعيل يبثّ `mobile.unit.enabled`. بدون
     * الأوّل ينتظر القفل (423) أوّل طلب يرسله الجهاز — دقيقة أو أكثر تبقى فيها مركبة
     * موقوفة تبثّ موقعها وتعمل محطّاتها. وبدون الثاني يبقى التطبيق مقفلًا بعد رفع
     * الإيقاف حتى يُعاد تشغيله.
     */
    setActive(id: string, clinicId: string, userId: string | null, active: boolean): Promise<MobileUnitResponse>;
    /**
     * تغيير الحالة التشغيلية من اللوحة.
     *
     * كان `mobile.unit.status` يُبثّ من `mobile-app.dao` وحده — أي حين تغيّر المركبة
     * حالتها بنفسها. تغيير المنسّق للحالة من اللوحة لم يكن يصل إلى التطبيق ولا إلى بقيّة
     * اللوحات المفتوحة، فيرى كلٌّ حالةً غير التي في قاعدة البيانات.
     *
     * الحالة غير المتغيّرة لا تُبثّ: حدثٌ بلا تغيير ضجيج يدفع كل عميل إلى إبطال ذاكرته.
     */
    setStatus(id: string, clinicId: string, userId: string | null, status: MobileUnitStatus): Promise<MobileUnitResponse>;
    /**
     * حذف ناعم. مستودع المركبة **لا يُحذف معها**: دفتر المخزون سجلّ دائم، وحذف المستودع
     * يتيم حركاته التاريخية. يُعطَّل فقط، ويُشترط أن يكون فارغًا — مركبة تُحذف وفيها دواء
     * تعني كمّيةً اختفت من النظام دون سند صرف.
     */
    softDelete(id: string, clinicId: string, userId: string | null): Promise<{
        success: true;
    }>;
    activity(id: string, clinicId: string): Promise<MobileUnitActivityResponse[]>;
    devices(id: string, clinicId: string): Promise<MobileUnitDeviceResponse[]>;
    /**
     * اقتران جهاز جديد. الرمز الخام يُولَّد هنا، ويُعاد **مرّة واحدة** في هذه الاستجابة، ولا
     * يُخزَّن إلّا مجزّأً — فلا سبيل لاسترجاعه لاحقًا، لا من الواجهة ولا من قاعدة البيانات.
     */
    pairDevice(id: string, clinicId: string, userId: string, input: PairDeviceFormInput): Promise<PairedDeviceResponse>;
    /**
     * الإبطال ختمُ وقتٍ لا حذف: سجلّ أنّ هذا الجهاز كان مقترنًا في تلك الفترة هو ما يحتاجه
     * التدقيق. الحارس يرفض أي رمز له `revokedAt`، فالأثر الأمني فوري رغم بقاء الصف.
     */
    revokeDevice(id: string, clinicId: string, deviceId: string, userId: string): Promise<{
        success: true;
    }>;
    crew(id: string, clinicId: string): Promise<MobileUnitCrewResponse[]>;
    /**
     * [MC1.4] المرشّحون لطاقم مركبة.
     *
     * الشرط الحاسم هو `schedulingSettings.mobileClinicAppointmentsEnabled` — وهو حقلٌ كان
     * موجودًا في قاعدة البيانات ومعروضًا في شاشة جدولة الموظف («استقبال زيارات في أكاديمية
     * متنقلة») منذ ما قبل هذه الوحدة، بلا أي مستهلك. هذا أوّل مكان يقرأه، فيصير للمفتاح
     * أثرٌ فعلي بدل أن يكون زينة.
     */
    listEligibleStaff(clinicId: string, branchId?: string): Promise<EligibleStaffResponse[]>;
    addCrewMember(id: string, clinicId: string, userId: string | null, input: AddCrewMemberFormInput): Promise<MobileUnitCrewResponse>;
    /**
     * الإزالة تعطيلٌ لا حذف: عضويّة الطاقم دليلٌ على مَن كان يقود المركبة يوم كذا، ويُرجع
     * إليها التدقيق. الحذف الصلب يمحو ذلك بأثر رجعي.
     */
    removeCrewMember(id: string, clinicId: string, crewId: string, userId: string | null): Promise<{
        success: true;
    }>;
};
export {};
