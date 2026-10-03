import type { Prisma } from "@/generated/prisma/client";
import { ScheduledJobStatus } from "@/generated/prisma/enums";
import { type EnqueueScheduledJobInput, type ScheduledJobResponse } from "@/server/scheduler/scheduler.type";
/**
 * [RC1] استعلامات المُجدوِل — Prisma وحدها، بلا منطق أعمال (AGENTS.md).
 */
export declare const schedulerDao: {
    findById(id: string): Promise<ScheduledJobResponse | null>;
    list(clinicId: string, filter?: {
        status?: ScheduledJobStatus;
        jobType?: string;
        limit?: number;
    }): Promise<ScheduledJobResponse[]>;
    /**
     * إدراجٌ عديم الأثر عند التكرار: الاصطدام بقيد الفرادة يعيد الصفّ القائم.
     *
     * لا فحصَ مسبقًا ثم إدراج: بين الفحص والإدراج سباقٌ مفتوح بين نبضتَي cron، والقيد
     * في قاعدة البيانات هو الحكم الوحيد الذي لا يُسبَق.
     */
    enqueue(input: EnqueueScheduledJobInput): Promise<ScheduledJobResponse>;
    /** الوظائف الجاهزة للتنفيذ الآن، عبر كل الأكاديميات — مدخل نبضة الـcron. */
    claimable(now: Date, limit: number): Prisma.PrismaPromise<{
        id: string;
    }[]>;
    /**
     * مطالبة ذرّية. `updateMany` المشروط بـQUEUED هو ما يمنع عاملَين من تنفيذ نفس
     * الوظيفة — نفس نمط `accountingJobsDao.claim`، ولنفس السبب.
     */
    claim(id: string, startedAt: Date): Promise<ScheduledJobResponse | null>;
    finish(id: string, status: ScheduledJobStatus, data: {
        errorMessage?: string | null;
        result?: Prisma.InputJsonValue;
    }): Promise<ScheduledJobResponse>;
    /** يُعيد وظيفةً فاشلة إلى الطابور — فعلٌ بشريّ مقصود، لا إعادة محاولة آلية. */
    requeue(id: string, clinicId: string): Promise<boolean>;
    /** الأكاديميات التي لها قاعدة تذكير مُفعَّلة — لا تُدرَج وظيفةٌ لأكاديمية لا تريدها. */
    clinicsWithActiveRules(): Promise<{
        id: string;
    }[]>;
};
