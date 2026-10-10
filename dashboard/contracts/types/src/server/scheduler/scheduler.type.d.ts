import type { Prisma } from "@/generated/prisma/client";
/**
 * [RC1] أنواع المُجدوِل. الأشكال مشتقّة من Prisma لا مكتوبة بيد (AGENTS.md).
 */
export declare const scheduledJobSelect: {
    id: true;
    clinicId: true;
    jobType: true;
    status: true;
    payload: true;
    idempotencyKey: true;
    scheduledFor: true;
    attempts: true;
    maxAttempts: true;
    startedAt: true;
    finishedAt: true;
    errorMessage: true;
    result: true;
    createdAt: true;
    updatedAt: true;
};
export type ScheduledJobResponse = Prisma.ScheduledJobGetPayload<{
    select: typeof scheduledJobSelect;
}>;
export type EnqueueScheduledJobInput = Pick<Prisma.ScheduledJobUncheckedCreateInput, "clinicId" | "jobType" | "idempotencyKey"> & Partial<Pick<Prisma.ScheduledJobUncheckedCreateInput, "payload" | "scheduledFor" | "maxAttempts">>;
/**
 * أنواع الوظائف التي تُسجَّل في هذه الحزمة.
 *
 * نصوصٌ لا تعداد قاعدة بيانات: إضافةُ وظيفةٍ يجب ألّا تحتاج ترحيلًا — نفس عُرف
 * `AccountingJob.jobType`. والثوابت هنا تمنع أخطاء الكتابة في مكانٍ واحد.
 */
export declare const JOB_TYPES: {
    /** يجمع مرشَّحي كل قاعدة مُفعَّلة في أكاديمية ويُدرجهم في الصندوق الصادر */
    readonly REMINDERS_SWEEP: "reminders.sweep";
    /** يُسلّم ما حان موعده من الصندوق الصادر */
    readonly REMINDERS_DISPATCH: "reminders.dispatch";
};
export type JobType = (typeof JOB_TYPES)[keyof typeof JOB_TYPES];
