import type { Prisma } from "@/generated/prisma/client";
import type { TaskPriority, TriageCategory } from "@/generated/prisma/enums";
/**
 * [E2] الانتشار — كيف ترث المستندات وسمَ الفرز.
 *
 * الخطة الحاكمة: `docs/emergency-workflow-plan.md` §4.2
 *
 * ── القاعدة الواحدة ─────────────────────────────────────────────────────────
 *
 * **تملأ الفارغ ولا تكتب فوق شيء.** قرار المدرّب الصريح يفوز دائمًا. لو انعكس هذا
 * لصار الطاقم يقاتل النظام على كل طلب — وهو الفرق بين «افتراض» و«فرض».
 *
 * ولهذا لا تحتاج التحاليل ولا الأشعة ولا العمليات ولا التنويم أيّ تغيير مخطّط:
 * كلّها تملك حقول الإلحاح أصلًا، وهذا الملفّ يملؤها حين تُترك صامتة.
 */
type Tx = Prisma.TransactionClient;
/** وسم الفرز على زيارة — قراءة واحدة رخيصة، وnull حين لا فرز */
export declare function triageCategoryOf(appointmentId: string | null | undefined, client?: Tx): Promise<TriageCategory | null>;
/**
 * الأولوية المؤثِّرة لطلب تحليل أو أشعة يُفتح من زيارة.
 *
 * تُستدعى من DAO التحاليل والأشعة عند الإنشاء. حين يمرّر المستخدم أولوية صريحة
 * تُعاد كما هي بلا حتى قراءة الزيارة — فلا استعلام يُدفع ثمنه بلا سبب.
 */
export declare function orderPriorityFor(input: {
    explicit?: TaskPriority | null;
    appointmentId?: string | null;
    kind: "LAB" | "RADIOLOGY";
    client?: Tx;
}): Promise<TaskPriority | null>;
/**
 * الافتراضات التي يرثها إدخال التنويم من زيارة مفروزة.
 *
 * الأحمر يرث العناية المركّزة والحرجية القصوى، ومنها يشتقّ التنويم فترة المراقبة
 * تلقائيًا (`DEFAULT_MONITORING_INTERVAL_BY_ACUITY`) — أي أن حالة إنقاذ حياة تصل
 * العنبر بمراقبة كل ساعة بلا أن يضبطها أحد يدويًا.
 */
export declare function inpatientDefaultsFor(appointmentId: string | null | undefined, client?: Tx): Promise<{
    category: TriageCategory;
    kind: import("@/generated/prisma/enums").InpatientStayKind;
    acuity: import("@/generated/prisma/enums").InpatientAcuity;
} | null>;
/**
 * إلحاح العملية المُشتقّ.
 *
 * الأحمر يرث `IMMEDIATE` — وهي القيمة الوحيدة التي تفتح
 * `canOverrideOperationGates` في وحدة العمليات. أي أن تجاوز بوابات العملية لحالة
 * إنقاذ حياة يعمل **بلا سطر شيفرة جديد هناك**، وكل تجاوز يبقى مسجَّلًا بسببه في
 * `GATE_OVERRIDDEN` كما هو اليوم.
 */
export declare function operationUrgencyFor(appointmentId: string | null | undefined, client?: Tx): Promise<import("@/generated/prisma/enums").OperationUrgency | null>;
export {};
