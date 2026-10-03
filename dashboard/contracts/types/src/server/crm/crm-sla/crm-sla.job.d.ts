export declare function enqueueCrmSlaDaily(clinicId: string, day: string): Promise<{
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    status: import("@/server/accounting/jobs/accounting-jobs.type").AccountingJobStatus;
    voucherType: string | null;
    voucherId: string | null;
    jobType: string;
    idempotencyKey: string;
    payload: import("@prisma/client/runtime/client").JsonValue;
    attempts: number;
    errorMessage: string | null;
    startedAt: Date | null;
    finishedAt: Date | null;
}>;
/** يُصدَّر للاختبار: دورةٌ واحدة لأكاديمية. */
export declare function runCrmSlaDaily(clinicId: string, now?: Date): Promise<{
    breached: number;
    notified: number;
}>;
/**
 * §8.2 — إشعار المهمّة المتأخّرة، على نفس الدورة.
 *
 * كان مؤجَّلًا إلى CRM-P5 مع خطوة الاتفاقية (§17)، وفات المرحلة: بُنيت خطوة الاتفاقية
 * وحدها. يُغلق هنا في CRM-P6 بدل أن يُنسى — والاعتراف بذلك في تقرير خروج P5 أصدق من
 * إغلاقٍ صامت.
 *
 * «مرّة واحدة» يحرسها عمود `overdueNotifiedAt`، لا فحصُ صندوق الوارد: المهمة المتأخّرة
 * تبقى متأخّرة كل ليلة، وتذكيرٌ يوميّ يصير ضجيجًا يُتجاهَل — وأوّل ما يُتجاهَل هو ما
 * كان يجب أن يُقرأ.
 */
export declare function runCrmTaskOverdueDaily(clinicId: string, now?: Date): Promise<{
    notified: number;
}>;
