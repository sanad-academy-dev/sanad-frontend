import type { Prisma } from "@/generated/prisma/client";
import type { InboxImportance } from "@/generated/prisma/enums";
import { type ApprovalActionInput, type CreateInboxItemInput, type InboxActivityResponse, type InboxDeleteScope, type InboxItemDetailResponse, type InboxItemResponse, type InboxListFilters } from "@/server/inbox/inbox.type";
export declare const inboxDao: {
    list(clinicId: string, userId: string, filters: InboxListFilters): Promise<InboxItemResponse[]>;
    findByIdForDetail(id: string, clinicId: string, userId: string): Promise<InboxItemDetailResponse | null>;
    listActivity(itemId: string, clinicId: string): Promise<InboxActivityResponse[] | null>;
    addComment(itemId: string, clinicId: string, authorUserId: string, body: string): Promise<InboxActivityResponse | null>;
    markRead(id: string, clinicId: string, userId: string): Promise<boolean>;
    markAllRead(clinicId: string, userId: string): Promise<number>;
    unreadCount(clinicId: string, userId: string): Promise<number>;
    deleteScope(clinicId: string, userId: string, scope: InboxDeleteScope): Promise<number>;
    approve(id: string, clinicId: string, userId: string, input: ApprovalActionInput): Promise<InboxItemDetailResponse | null>;
    reject(id: string, clinicId: string, userId: string, input: ApprovalActionInput): Promise<InboxItemDetailResponse | null>;
    create(data: CreateInboxItemInput, activityAuthorUserId?: string): Promise<{
        type: import("@/generated/prisma/enums").InboxItemType;
        id: string;
        clinicId: string;
        createdAt: Date;
        title: string;
        appointmentId: string | null;
        kind: import("@/generated/prisma/enums").InboxItemKind;
        importance: InboxImportance;
        taskId: string | null;
        recipientUserId: string | null;
    }>;
    emitAppointmentEvent(input: EmitAppointmentEventInput): Promise<void>;
    emitLabTestDeclined(input: {
        clinicId: string;
        labTestCode: string;
        serviceName: string;
        patientName: string;
        reason: string;
        patientId?: string | null;
        ownerId?: string | null;
        requestedByUserId?: string | null;
        authorUserId?: string | null;
    }): Promise<void>;
    /**
     * بواعث التحاليل — كلها لا ترمي أبدًا: فشل الإشعار لا يُفشل الإجراء نفسه.
     * `recipientUserId = null` يعني إشعارًا على مستوى الأكاديمية (يراه المختبر).
     */
    emitLabOrderQueued(input: {
        clinicId: string;
        labTestCode: string;
        testNames: string;
        patientName: string;
        isUrgent?: boolean;
        patientId?: string | null;
        ownerId?: string | null;
        appointmentId?: string | null;
        authorUserId?: string | null;
    }): Promise<void>;
    /** تعيين تحليل لفنّي المختبر — يُوجَّه للفنّي نفسه */
    emitLabTestAssigned(input: {
        clinicId: string;
        labTestCode: string;
        serviceName: string;
        patientName: string;
        assigneeUserId: string;
        patientId?: string | null;
        authorUserId?: string | null;
    }): Promise<void>;
    /** رفض العيّنة لسوء جودتها — المدرّب الطالب يحتاج معرفة أن السحب سيُعاد */
    emitLabSampleRejected(input: {
        clinicId: string;
        labTestCode: string;
        serviceName: string;
        patientName: string;
        notes?: string | null;
        requestedByUserId?: string | null;
        patientId?: string | null;
        authorUserId?: string | null;
    }): Promise<void>;
    /** إعادة النتائج من المراجعة — يُوجَّه لفنّي المختبر ليُعيد العمل */
    emitLabResultsReturned(input: {
        clinicId: string;
        labTestCode: string;
        serviceName: string;
        patientName: string;
        reason: string;
        assigneeUserId?: string | null;
        patientId?: string | null;
        authorUserId?: string | null;
    }): Promise<void>;
    /**
     * اعتماد النتائج — يُوجَّه للمدرّب الطالب. وجود قيم حرجة يرفع الأهمية
     * ويُبرزها في العنوان، فهي أهم ما يحتاج المدرّب رؤيته فورًا.
     */
    emitLabResultsReady(input: {
        clinicId: string;
        labTestCode: string;
        serviceName: string;
        patientName: string;
        criticalCount?: number;
        requestedByUserId?: string | null;
        patientId?: string | null;
        ownerId?: string | null;
        appointmentId?: string | null;
        authorUserId?: string | null;
    }): Promise<void>;
    /** إشارة (@) داخل تعليق أو تقرير تحليل — تُوجَّه للمُشار إليهم */
    emitLabMention(input: {
        clinicId: string;
        labTestCode: string;
        mentionedUserIds: string[];
        context: string;
        patientName?: string | null;
        patientId?: string | null;
        authorName?: string | null;
        createdById?: string | null;
    }): Promise<void>;
    /**
     * بواعث الأشعة — كلها لا ترمي أبدًا: فشل الإشعار لا يُفشل الإجراء نفسه.
     * `recipientUserId = null` يعني إشعارًا على مستوى الأكاديمية (يراه قسم الأشعة).
     */
    emitRadiologyOrderQueued(input: {
        clinicId: string;
        radiologyCode: string;
        examNames: string;
        patientName: string;
        isUrgent?: boolean;
        patientId?: string | null;
        ownerId?: string | null;
        appointmentId?: string | null;
        authorUserId?: string | null;
    }): Promise<void>;
    /** تعيين فحص لفنّي الأشعة — يُوجَّه للفنّي نفسه */
    emitRadiologyAssigned(input: {
        clinicId: string;
        radiologyCode: string;
        serviceName: string;
        patientName: string;
        assigneeUserId: string;
        patientId?: string | null;
        authorUserId?: string | null;
    }): Promise<void>;
    /**
     * إشارة داخل تعليق أو ملحق أشعة — إشعار لكل مُشار إليه.
     * يمرّ عبر inboxDao.create فيُبثّ لحظيًا عبر SSE كبقيّة عناصر الوارد.
     */
    emitRadiologyMention(input: {
        clinicId: string;
        radiologyCode: string;
        mentionedUserIds: string[];
        context: string;
        patientName?: string | null;
        patientId?: string | null;
        authorName?: string | null;
        createdById?: string | null;
    }): Promise<void>;
    /** رفض طلب أشعة من الطلبات — يُشعر المدرّب الطالب بالسبب */
    emitRadiologyDeclined(input: {
        clinicId: string;
        radiologyCode: string;
        serviceName: string;
        patientName: string;
        reason: string;
        patientId?: string | null;
        ownerId?: string | null;
        requestedByUserId?: string | null;
        authorUserId?: string | null;
    }): Promise<void>;
    /** إعادة التقرير من المراجعة — يُوجَّه لفنّي الأشعة ليُعيد العمل */
    emitRadiologyReportReturned(input: {
        clinicId: string;
        radiologyCode: string;
        serviceName: string;
        patientName: string;
        reason: string;
        assigneeUserId?: string | null;
        patientId?: string | null;
        authorUserId?: string | null;
    }): Promise<void>;
    /**
     * اعتماد تقرير الأشعة — يُوجَّه للمدرّب الطالب. النتيجة الحرجة ترفع الأهمية
     * وتُبرَز في العنوان، فهي أهم ما يحتاج المدرّب رؤيته فورًا.
     */
    emitRadiologyReportReady(input: {
        clinicId: string;
        radiologyCode: string;
        serviceName: string;
        patientName: string;
        criticalFinding?: boolean;
        requestedByUserId?: string | null;
        patientId?: string | null;
        ownerId?: string | null;
        appointmentId?: string | null;
        authorUserId?: string | null;
    }): Promise<void>;
    emitVaccinationReaction(tx: Prisma.TransactionClient, input: {
        clinicId: string;
        patientId: string;
        patientName: string;
        vaccineName: string;
        batchNo: string | null;
        severityLabel: string;
        severe: boolean;
        createdById?: string | null;
    }): Promise<void>;
    emitLowStock(tx: Prisma.TransactionClient, input: {
        clinicId: string;
        itemName: string;
        stock: number;
        createdById?: string | null;
    }): Promise<void>;
    emitEmergencyCase(input: {
        clinicId: string;
        branchId: string;
        patientName?: string | null;
        patientId?: string | null;
        ownerId?: string | null;
        createdById?: string | null;
    }): Promise<void>;
    emitNoteMention(input: {
        clinicId: string;
        appointmentId: string;
        mentionedUserIds: string[];
        patientName?: string | null;
        patientId?: string | null;
        ownerId?: string | null;
        authorName?: string | null;
        createdById?: string | null;
    }): Promise<void>;
    emitOperationMention(input: {
        clinicId: string;
        operationId: string;
        operationCode: string;
        mentionedUserIds: string[];
        patientName?: string | null;
        patientId?: string | null;
        authorName?: string | null;
        createdById?: string | null;
    }): Promise<void>;
    emitOperationComplication(input: {
        clinicId: string;
        operationId: string;
        operationCode: string;
        patientName?: string | null;
        patientId?: string | null;
        kind: string;
        isSSI: boolean;
        isMortality: boolean;
        createdById?: string | null;
    }): Promise<void>;
    emitTaskMention(input: {
        clinicId: string;
        taskId: string;
        mentionedUserIds: string[];
        taskTitle?: string | null;
        authorName?: string | null;
        createdById?: string | null;
    }): Promise<void>;
    emitTaskCreated(input: {
        clinicId: string;
        taskId: string;
        title: string;
        assigneeUserIds: string[];
        createdById?: string | null;
    }): Promise<void>;
    emitTaskApproval(input: {
        clinicId: string;
        taskId: string;
        title: string;
        recipientUserIds: string[];
        createdById?: string | null;
    }): Promise<void>;
    emitQueuePending(input: {
        clinicId: string;
        patientName?: string | null;
        patientId?: string | null;
        ownerId?: string | null;
        recipientUserIds: string[];
        authorUserId?: string | null;
    }): Promise<void>;
    emitExpenseApproval(input: {
        clinicId: string;
        code: string;
        amount: number | string;
        categoryLabel?: string | null;
        createdById?: string | null;
    }): Promise<void>;
    /** دخول جديد — يصل فريق الفرع ليعرف من دخل العنبر في ورديّته */
    emitInpatientAdmitted(input: {
        clinicId: string;
        branchId: string;
        stayId: string;
        stayCode: string;
        patientId: string;
        patientName: string;
        ownerId?: string | null;
        createdById?: string | null;
    }): Promise<void>;
    /**
     * [IP2] طلب تنويم كتبه مدرّب. يسبق الدخول، فالمخاطَب هو من يُسكن لا من يعالج:
     * طلبٌ يُكتب ولا يراه أحد يعني طفلًا ينتظر قفصًا لا يعلم به أحد.
     */
    emitInpatientRequested(input: {
        clinicId: string;
        branchId: string;
        stayId: string;
        stayCode: string;
        patientId: string;
        patientName: string;
        ownerId?: string | null;
        createdById?: string | null;
    }): Promise<void>;
    /**
     * [IP2] بدأ تجهيز الخروج. المخاطَب هنا **المدرّب المعالج وحده** لا فريق الفرع:
     * تقرير الخروج وتعليماته عملُه هو، وبثّه على الجميع يجعله عمل لا أحد.
     */
    emitInpatientDischargePrep(input: {
        clinicId: string;
        stayId: string;
        stayCode: string;
        patientId: string;
        patientName: string;
        ownerId?: string | null;
        attendingUserId: string | null;
        createdById?: string | null;
    }): Promise<void>;
    /**
     * جرعة فات موعدها. يُستدعى من محرّك الاستحقاق عند قراءة قائمة المستحقّ.
     *
     * الحارس ضدّ التكرار مسؤولية المُستدعي (`inpatientsDao.listDue`): الباعث نفسه
     * لا يعرف إن كان قد أُطلق قبل دقيقة، وإطلاقه في كل قراءة يُغرق الوارد بعشرات
     * النسخ للجرعة الواحدة — وهو أسرع طريق لتدريب الطاقم على تجاهل الوحدة كلّها.
     */
    emitInpatientOverdue(input: {
        clinicId: string;
        stayId: string;
        stayCode: string;
        patientId: string;
        patientName: string;
        itemLabel: string;
        /** وقت الاستحقاق منسَّقًا — يدخل العنوان ليجعله ثابتًا لكل صفّ */
        dueAtLabel: string;
        attendingUserId?: string | null;
        createdById?: string | null;
    }): Promise<void>;
    /** علامة حيوية في المدى الحرج — تُصعَّد للمدرّب المعالج مباشرةً */
    emitInpatientCritical(input: {
        clinicId: string;
        branchId: string;
        stayId: string;
        stayCode: string;
        patientId: string;
        patientName: string;
        messageAr: string;
        attendingUserId?: string | null;
        createdById?: string | null;
    }): Promise<void>;
    /** وصول جديد: أحمر/برتقالي فُرز، أو بلاغ «في الطريق» */
    emitTriageArrival(input: {
        clinicId: string;
        branchId: string;
        appointmentId?: string | null;
        patientId?: string | null;
        ownerId?: string | null;
        patientLabel: string;
        categoryLabel: string;
        importance: InboxImportance;
        enRoute?: boolean;
        attendingUserId?: string | null;
        createdById?: string | null;
    }): Promise<void>;
    /** تجاوز هدف الانتظار */
    emitTriageBreach(input: {
        clinicId: string;
        branchId: string;
        appointmentId: string;
        patientId?: string | null;
        patientLabel: string;
        categoryLabel: string;
        waitedMinutes: number;
        targetMinutes: number;
        importance: InboxImportance;
        attendingUserId?: string | null;
    }): Promise<void>;
    /** إعادة فرز رفعت اللون — التدهور في قاعة الانتظار */
    emitTriageEscalated(input: {
        clinicId: string;
        branchId: string;
        appointmentId: string;
        patientId?: string | null;
        patientLabel: string;
        fromLabel: string;
        toLabel: string;
        importance: InboxImportance;
        createdById?: string | null;
    }): Promise<void>;
    /** علامة حيوية حرجة في قياس الفرز */
    emitTriageCriticalVitals(input: {
        clinicId: string;
        branchId: string;
        appointmentId: string;
        patientId?: string | null;
        patientLabel: string;
        messageAr: string;
        attendingUserId?: string | null;
    }): Promise<void>;
    /** وصول مضى عليه وقت بلا فرز — الصفّ الذي لا أحد نظر إليه */
    emitTriageUntriaged(input: {
        clinicId: string;
        branchId: string;
        patientLabel: string;
        waitedMinutes: number;
    }): Promise<void>;
    /** إشارة في ملاحظة أو تسليم وردية */
    emitInpatientMention(input: {
        clinicId: string;
        stayId: string;
        stayCode: string;
        patientId: string;
        patientName: string;
        mentionedUserIds: readonly string[];
        authorName?: string | null;
        createdById?: string | null;
    }): Promise<void>;
};
/**
 * [IP2] عنوان إشعار الجرعة الفائتة — دالّة مُصدَّرة لا نصّ مكرَّر.
 *
 * الحارس ضدّ التكرار في `inpatientsDao` يبحث بهذا العنوان بعينه، فلو بُني هنا
 * وهناك بنصَّين متقاربَين لَما تطابقا ولَتكرّر الإشعار عند كل قراءة للوحة. وقت
 * الاستحقاق داخل العنوان لا دقائق التأخّر: الأول ثابت لكل صفّ، والثاني يتغيّر
 * كل دقيقة فيُنتج عنوانًا جديدًا في كل مرّة.
 */
export declare const inpatientOverdueTitle: (input: {
    itemLabel: string;
    patientName: string;
    dueAtLabel: string;
    stayCode: string;
}) => string;
declare const APPOINTMENT_EVENT_META: {
    readonly booked: {
        readonly type: "APPOINTMENT_NEW";
        readonly importance: "NORMAL";
        readonly label: "تم حجز زيارة جديدة";
    };
    readonly confirmed: {
        readonly type: "APPOINTMENT_CONFIRMED";
        readonly importance: "NORMAL";
        readonly label: "تم تأكيد حجز زيارة";
    };
    readonly pending: {
        readonly type: "APPOINTMENT_PENDING";
        readonly importance: "NORMAL";
        readonly label: "في انتظار تأكيد حجز زيارة";
    };
    readonly cancelled: {
        readonly type: "APPOINTMENT_CANCELLED";
        readonly importance: "HIGH";
        readonly label: "تم إلغاء حجز زيارة";
    };
};
export type AppointmentEvent = keyof typeof APPOINTMENT_EVENT_META;
export type EmitAppointmentEventInput = {
    event: AppointmentEvent;
    clinicId: string;
    patientName?: string | null;
    patientId?: string | null;
    ownerId?: string | null;
    staffUserId?: string | null;
    authorUserId?: string | null;
};
export {};
