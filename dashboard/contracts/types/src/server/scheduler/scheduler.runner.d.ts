import { ScheduledJobStatus } from "@/generated/prisma/enums";
import { type EnqueueScheduledJobInput, type ScheduledJobResponse } from "@/server/scheduler/scheduler.type";
/**
 * [RC1] مُشغِّل الوظائف — الشيء الذي كان المستودع كلّه يعترف بغيابه.
 *
 * ── ما الذي كان مكسورًا ──────────────────────────────────────────────────────
 *
 * ثمانية مواضع في الكود تقول «لا مجدول في هذا المستودع» صراحةً، وكلٌّ منها بنى
 * حوله حيلةً مختلفة: الجرعة الفائتة في التنويم تُكتشف حين **يفتح أحدٌ اللوحة**
 * (`inpatients.controller.ts`)، وتجاوز هدف الفرز كذلك (`triage-breach.service.ts`)،
 * وإعادة التسجيل في التدريب «كسولة عند تصفّح الوحدة»، وطابور المحاسبة كامل
 * الأركان بلا من يستدعيه. كلّها صحيحة نهارًا وصامتة في الثالثة فجرًا.
 *
 * ── ما هذا الملفّ ────────────────────────────────────────────────────────────
 *
 * مُشغِّل داخل العملية، الصفُّ فيه هو الطابور. نقطتا دخولٍ لا واحدة، والفرق بينهما
 * هو ما يمنع خنق قاعدة البيانات:
 *
 *   - {@link enqueueJob} يُسجّل العمل. آمنٌ داخل معاملة.
 *   - {@link runDueJobs} يُنفّذه. **لا يُستدعى داخل معاملة أبدًا** — وظيفةٌ طويلة
 *     تُبقي معاملةً مفتوحة هي بالضبط ما يوجد AR-7 لمنعه.
 *
 * والمعالِج يُسجَّل بمفتاحٍ نصّي (`registerJobHandler`) فتبقى إضافةُ وظيفةٍ ملفًّا
 * لا ترحيلًا.
 */
export type JobHandler = (job: ScheduledJobResponse) => Promise<unknown>;
export declare function registerJobHandler(jobType: string, handler: JobHandler): void;
export declare function getJobHandler(jobType: string): JobHandler | undefined;
/** أداة اختبار: المعالجات حالةٌ على مستوى الوحدة. */
export declare function clearJobHandlers(): void;
export declare function registeredJobTypes(): string[];
export declare const enqueueJob: (input: EnqueueScheduledJobInput) => Promise<{
    result: import("@prisma/client/runtime/client").JsonValue;
    id: string;
    clinicId: string;
    createdAt: Date;
    updatedAt: Date;
    status: ScheduledJobStatus;
    jobType: string;
    idempotencyKey: string;
    payload: import("@prisma/client/runtime/client").JsonValue;
    attempts: number;
    errorMessage: string | null;
    startedAt: Date | null;
    finishedAt: Date | null;
    maxAttempts: number;
    scheduledFor: Date;
}>;
/**
 * مِفتاحُ عدم التكرار اليوميّ — `{prefix}:{YYYY-MM-DD}`.
 *
 * هذا ما يجعل نبضةً كل خمس دقائق تُنتج وظيفةً واحدة في اليوم: أوّلُ نبضةٍ تُدرج،
 * وكل ما بعدها يصطدم بقيد الفرادة ويحصل على الصفّ نفسه. بلا هذا كان الـcron
 * سيُنشئ ٢٨٨ وظيفة يوميًّا لكل أكاديمية.
 */
export declare const dailyKey: (prefix: string, now: Date) => string;
/**
 * مِفتاحٌ لكل نافذة N دقيقة — للتوزيع، الذي يجب أن يتكرّر خلال اليوم لا مرّة فيه.
 *
 * النافذة تُقصّ إلى مضاعفاتها، فنبضتان داخل النافذة نفسها تتشاركان المفتاح
 * وتُنتجان وظيفةً واحدة.
 */
export declare function windowKey(prefix: string, now: Date, windowMinutes: number): string;
export type RunSummary = {
    claimed: number;
    completed: number;
    failed: number;
    /** وظيفةٌ بنوعٍ لا معالِج له — عيبُ برمجة يُسجَّل ولا يُبتلع */
    unhandled: number;
};
/**
 * ينفّذ ما حان موعده عبر كل الأكاديميات.
 *
 * الحدّ (`limit`) مقصود: نبضةٌ واحدة لا يجب أن تُنفّذ ألف وظيفة وتُبقي الطلب
 * مفتوحًا حتى المهلة. ما تبقّى يلتقطه النبض التالي — وهذا ما يجعل الـcron المتكرّر
 * الرخيص أفضل من نبضةٍ واحدة عملاقة.
 */
export declare function runDueJobs(options?: {
    limit?: number;
    now?: Date;
}): Promise<RunSummary>;
/**
 * نبضة الـcron: تُدرج وظائف اليوم لكل أكاديمية لها قاعدة مُفعَّلة، ثم تُشغّل ما جهُز.
 *
 * الإدراج قبل التشغيل في نفس النبضة مقصود — فأوّلُ نبضةٍ بعد التفعيل تعمل فورًا
 * بدل أن تنتظر النبضة التالية.
 */
export declare function tick(options?: {
    now?: Date;
    limit?: number;
    dispatchWindowMinutes?: number;
    /**
     * يقصر النبضة على أكاديمية واحدة — مدخل زرّ «شغّل الآن» في الشاشة.
     *
     * موجودٌ لأنّ الزرّ بدونه كان **بلا أثر إطلاقًا**: كان يستدعي `runDueJobs`
     * وحدها، وهي تُنفّذ الوظائف المُدرَجة ولا تُدرج شيئًا. فأكاديميةٌ لم تضبط
     * `CRON_SECRET` بعد — وهي بالضبط من وُضع الزرّ لأجلها — كانت تضغطه فلا يحدث
     * شيء إلى الأبد. أمسكت ذلك الجولةُ التنفيذية عند الخطوة الخامسة.
     */
    clinicId?: string;
}): Promise<{
    enqueued: number;
    run: RunSummary;
}>;
