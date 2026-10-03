import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { NotificationChannel, RecallOutcome, ReminderTrigger } from "@/generated/prisma/enums";
export type { NotificationChannel, OutboxStatus, RecallContactChannel, RecallOutcome, ReminderTrigger, } from "@/generated/prisma/enums";
declare const ruleSelect: {
    id: true;
    clinicId: true;
    trigger: true;
    name: true;
    active: true;
    offsetHours: true;
    repeatAfterDays: true;
    maxSends: true;
    channels: true;
    subjectTemplate: true;
    bodyTemplate: true;
    quietHoursStart: true;
    quietHoursEnd: true;
    horizonDays: true;
    createdAt: true;
    updatedAt: true;
};
export declare const ruleSelectShape: {
    id: true;
    clinicId: true;
    trigger: true;
    name: true;
    active: true;
    offsetHours: true;
    repeatAfterDays: true;
    maxSends: true;
    channels: true;
    subjectTemplate: true;
    bodyTemplate: true;
    quietHoursStart: true;
    quietHoursEnd: true;
    horizonDays: true;
    createdAt: true;
    updatedAt: true;
};
export type ReminderRuleResponse = Prisma.ReminderRuleGetPayload<{
    select: typeof ruleSelect;
}>;
declare const outboxSelect: {
    id: true;
    clinicId: true;
    channel: true;
    status: true;
    recipientKind: true;
    ownerId: true;
    toAddress: true;
    subject: true;
    body: true;
    trigger: true;
    ruleId: true;
    patientId: true;
    appointmentId: true;
    dedupeKey: true;
    scheduledFor: true;
    attempts: true;
    maxAttempts: true;
    sentAt: true;
    failedAt: true;
    lastError: true;
    manualLink: true;
    createdAt: true;
    owner: {
        select: {
            id: true;
            name: true;
            phone: true;
        };
    };
    patient: {
        select: {
            id: true;
            name: true;
            code: true;
        };
    };
};
export declare const outboxSelectShape: {
    id: true;
    clinicId: true;
    channel: true;
    status: true;
    recipientKind: true;
    ownerId: true;
    toAddress: true;
    subject: true;
    body: true;
    trigger: true;
    ruleId: true;
    patientId: true;
    appointmentId: true;
    dedupeKey: true;
    scheduledFor: true;
    attempts: true;
    maxAttempts: true;
    sentAt: true;
    failedAt: true;
    lastError: true;
    manualLink: true;
    createdAt: true;
    owner: {
        select: {
            id: true;
            name: true;
            phone: true;
        };
    };
    patient: {
        select: {
            id: true;
            name: true;
            code: true;
        };
    };
};
export type OutboxMessageResponse = Prisma.NotificationOutboxGetPayload<{
    select: typeof outboxSelect;
}>;
declare const contactSelect: {
    id: true;
    clinicId: true;
    ownerId: true;
    patientId: true;
    trigger: true;
    dedupeKey: true;
    channel: true;
    outcome: true;
    notes: true;
    snoozedUntil: true;
    bookedAppointmentId: true;
    contactedById: true;
    contactedAt: true;
    contactedBy: {
        select: {
            id: true;
            name: true;
        };
    };
    patient: {
        select: {
            id: true;
            name: true;
        };
    };
};
export declare const contactSelectShape: {
    id: true;
    clinicId: true;
    ownerId: true;
    patientId: true;
    trigger: true;
    dedupeKey: true;
    channel: true;
    outcome: true;
    notes: true;
    snoozedUntil: true;
    bookedAppointmentId: true;
    contactedById: true;
    contactedAt: true;
    contactedBy: {
        select: {
            id: true;
            name: true;
        };
    };
    patient: {
        select: {
            id: true;
            name: true;
        };
    };
};
export type RecallContactResponse = Prisma.RecallContactGetPayload<{
    select: typeof contactSelect;
}>;
/**
 * ملخّص تشغيل قاعدة واحدة.
 *
 * يعيش هنا لا في `outbox.service.ts` لأن الشاشة تقرؤه: استيراد نوعٍ من وحدة دورة
 * يجرّ إلى مشروع **العميل** كل ما تستورده تلك الوحدة — الجوامع، ومنها الـDAOs،
 * ومنها كل أشكال Prisma. وهذا ليس تنظيمًا نظريًّا: أوّل نسخة من هذه الوحدة
 * استوردت `PreviewRow` من `outbox.service` فانفجر `tsc -p tsconfig.client.json`
 * بنفاد الذاكرة. الاصطلاح في AGENTS.md — «الأنواع المشتركة في `[resource].type.ts`»
 * — هو ما يمنع ذلك.
 */
export type EnqueueSummary = {
    trigger: ReminderTrigger;
    candidates: number;
    /** أُدرجت الآن */
    queued: number;
    /** مرشَّح لم يحن وقته بعد، أو مضى وقتُه بأكثر من المهلة */
    notDue: number;
    /** بصمتُه موجودة أصلًا — وهذا هو النجاح لا الفشل */
    duplicates: number;
    /** لا قناة صالحة، أو لا وليّ أمر */
    skipped: number;
};
/** صفّ معاينة — الرسالة كما ستُدرَج بالضبط، أو سببُ تعذّرها. */
export type PreviewRow = {
    dedupeKey: string;
    ownerName: string | null;
    patientName: string | null;
    channel: NotificationChannel | null;
    scheduledFor: Date | null;
    body: string;
    skippedReason: string | null;
};
/** استحقاقٌ واحد كما يظهر في قائمة العمل، بعد طيّه مع سجلّ التواصل. */
export type RecallItem = {
    dedupeKey: string;
    trigger: ReminderTrigger;
    triggerLabel: string;
    patientId: string | null;
    patientName: string | null;
    dueAt: string | null;
    daysUntilDue: number | null;
    details: string | null;
    /** آخر تواصل بشأن هذا الاستحقاق تحديدًا — `null` يعني «لم يُكلَّم بعد» */
    lastContactAt: string | null;
    lastOutcome: RecallOutcome | null;
    contactCount: number;
    snoozedUntil: string | null;
    /** حالة آخر رسالة آلية عن هذا الاستحقاق */
    outboxStatus: string | null;
    /** رابط واتساب جاهز حين تكون الرسالة بانتظار ضغطة موظّف */
    manualLink: string | null;
    outboxId: string | null;
};
/**
 * صفٌّ في قائمة العمل — **وليّ أمرٌ واحد** بكل ما يستحقّه أطفالُه.
 *
 * التجميع بوليّ الأمر لا بالطفل هو الفارق العملي كلّه: قبل هذه الوحدة كانت
 * الاستحقاقات موزّعة على أربع شاشاتٍ مفاتيحُها الطفل، فوليّ أمرٌ له ثلاثة كلاب
 * مستحقّة يظهر في ثلاثة صفوف على ثلاث شاشات — ويُكلَّم ثلاث مرّات.
 */
export type RecallOwnerRow = {
    ownerId: string;
    ownerName: string;
    ownerPhone: string | null;
    ownerEmail: string | null;
    /** رقم E.164 المُطبَّع — `null` إذا تعذّر فهم الرقم المخزَّن */
    ownerPhoneE164: string | null;
    items: RecallItem[];
    /** أشدّ تأخّرٍ بين بنوده — مفتاح الترتيب الافتراضي */
    worstDaysUntilDue: number | null;
    /** كُلِّم بشأن كل بنوده */
    fullyHandled: boolean;
    /** كل بنوده مؤجَّلة إلى المستقبل */
    snoozed: boolean;
};
export type RecallBoard = {
    rows: RecallOwnerRow[];
    stats: {
        owners: number;
        items: number;
        overdue: number;
        contactedToday: number;
        awaitingManual: number;
    };
};
export declare const reminderRuleSchema: z.ZodObject<{
    trigger: z.ZodEnum<{
        readonly VACCINATION_DUE: "VACCINATION_DUE";
        readonly GROOMING_DUE: "GROOMING_DUE";
        readonly NUTRITION_RECHECK_DUE: "NUTRITION_RECHECK_DUE";
        readonly APPOINTMENT_UPCOMING: "APPOINTMENT_UPCOMING";
        readonly APPOINTMENT_NO_SHOW: "APPOINTMENT_NO_SHOW";
        readonly CARE_PLAN_VISIT_DUE: "CARE_PLAN_VISIT_DUE";
        readonly INVOICE_OVERDUE: "INVOICE_OVERDUE";
        readonly MEMBERSHIP_RENEWAL: "MEMBERSHIP_RENEWAL";
        readonly POST_OP_FOLLOW_UP: "POST_OP_FOLLOW_UP";
    }>;
    name: z.ZodString;
    active: z.ZodDefault<z.ZodBoolean>;
    offsetHours: z.ZodDefault<z.ZodNumber>;
    repeatAfterDays: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    maxSends: z.ZodDefault<z.ZodNumber>;
    channels: z.ZodArray<z.ZodEnum<{
        readonly INBOX: "INBOX";
        readonly EMAIL: "EMAIL";
        readonly WHATSAPP: "WHATSAPP";
        readonly SMS: "SMS";
        readonly PUSH: "PUSH";
    }>>;
    subjectTemplate: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    bodyTemplate: z.ZodString;
    quietHoursStart: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    quietHoursEnd: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    horizonDays: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type ReminderRuleFormInput = z.infer<typeof reminderRuleSchema>;
export declare const recallContactSchema: z.ZodObject<{
    ownerId: z.ZodString;
    patientId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    trigger: z.ZodEnum<{
        readonly VACCINATION_DUE: "VACCINATION_DUE";
        readonly GROOMING_DUE: "GROOMING_DUE";
        readonly NUTRITION_RECHECK_DUE: "NUTRITION_RECHECK_DUE";
        readonly APPOINTMENT_UPCOMING: "APPOINTMENT_UPCOMING";
        readonly APPOINTMENT_NO_SHOW: "APPOINTMENT_NO_SHOW";
        readonly CARE_PLAN_VISIT_DUE: "CARE_PLAN_VISIT_DUE";
        readonly INVOICE_OVERDUE: "INVOICE_OVERDUE";
        readonly MEMBERSHIP_RENEWAL: "MEMBERSHIP_RENEWAL";
        readonly POST_OP_FOLLOW_UP: "POST_OP_FOLLOW_UP";
    }>;
    dedupeKey: z.ZodString;
    channel: z.ZodEnum<{
        readonly PHONE: "PHONE";
        readonly WHATSAPP: "WHATSAPP";
        readonly EMAIL: "EMAIL";
        readonly SMS: "SMS";
        readonly IN_PERSON: "IN_PERSON";
        readonly INBOX: "INBOX";
    }>;
    outcome: z.ZodEnum<{
        readonly BOOKED: "BOOKED";
        readonly NO_ANSWER: "NO_ANSWER";
        readonly CALLBACK_REQUESTED: "CALLBACK_REQUESTED";
        readonly DECLINED: "DECLINED";
        readonly WRONG_NUMBER: "WRONG_NUMBER";
        readonly SNOOZED: "SNOOZED";
        readonly INFORMED: "INFORMED";
    }>;
    notes: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    snoozedUntil: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    bookedAppointmentId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type RecallContactFormInput = z.infer<typeof recallContactSchema>;
/**
 * ما يحرّره الموظّف فعلًا في نافذة «تسجيل تواصل» — مشتقّ بـ`pick` من المخطّط الكامل
 * لا مكتوب بيد (AGENTS.md). وليّ الأمر والسبب والبصمة تأتي من البند المختار لا من النموذج.
 *
 * والتأجيل بلا تاريخ ليس تأجيلًا: `SNOOZED` يشترط `snoozedUntil`، ويُرفض عند الحفظ
 * برسالةٍ على الحقل نفسه لا بصفٍّ صامتٍ يعود إلى القائمة غدًا.
 */
export declare const recallContactFormSchema: z.ZodObject<{
    notes: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    channel: z.ZodEnum<{
        readonly PHONE: "PHONE";
        readonly WHATSAPP: "WHATSAPP";
        readonly EMAIL: "EMAIL";
        readonly SMS: "SMS";
        readonly IN_PERSON: "IN_PERSON";
        readonly INBOX: "INBOX";
    }>;
    outcome: z.ZodEnum<{
        readonly BOOKED: "BOOKED";
        readonly NO_ANSWER: "NO_ANSWER";
        readonly CALLBACK_REQUESTED: "CALLBACK_REQUESTED";
        readonly DECLINED: "DECLINED";
        readonly WRONG_NUMBER: "WRONG_NUMBER";
        readonly SNOOZED: "SNOOZED";
        readonly INFORMED: "INFORMED";
    }>;
    snoozedUntil: z.ZodDefault<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type RecallContactDialogInput = z.infer<typeof recallContactFormSchema>;
export type CreateReminderRuleInput = Pick<Prisma.ReminderRuleUncheckedCreateInput, "clinicId" | "trigger" | "name" | "active" | "offsetHours" | "maxSends" | "bodyTemplate" | "horizonDays"> & Partial<Pick<Prisma.ReminderRuleUncheckedCreateInput, "repeatAfterDays" | "channels" | "subjectTemplate" | "quietHoursStart" | "quietHoursEnd">>;
export type UpdateReminderRuleInput = Partial<Omit<CreateReminderRuleInput, "clinicId">>;
export type CreateRecallContactInput = Pick<Prisma.RecallContactUncheckedCreateInput, "clinicId" | "ownerId" | "trigger" | "dedupeKey" | "channel" | "outcome"> & Partial<Pick<Prisma.RecallContactUncheckedCreateInput, "patientId" | "notes" | "snoozedUntil" | "bookedAppointmentId" | "contactedById">>;
