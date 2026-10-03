/**
 * [LY-P3] §4 — خطوة المستويات اليومية على مُشغّل المهام القائم.
 *
 * **المهمّة تُثبّت ما تراه القراءة، ولا تكون مصدره.** `resolveOwnerTier` تشتقّ المستوى
 * عند كل قراءة، فشريحةُ وليّ الأمر ومضاعِفُ كسبه صادقان حتى لو لم تُشغَّل هذه المهمّة قطّ.
 * ما تضيفه شيءٌ واحد لا تقدّمه القراءة: مستوًى **قابل للتصفية والتجميع** عبر آلاف
 * أولياء الأمور في تقارير §11، بلا استعلامٍ لكلّ وليّ أمر.
 *
 * ⚠️ **وهي خاملة في الإنتاج اليوم** — لا لعطلٍ فيها، بل لأنّ لا شيء في هذا المستودع
 * يستدعي `runQueuedAccountingJobs`: لا مُجدوِل ولا عامل ولا مسار مجدول. ذلك حال كلّ
 * مهام المحاسبة منذ [P0.5] ومهمّة العضويات وواردِ واتساب ومهمّة الاتفاقيات، ومُلفَّف في
 * **[P13.12]**. حزمةٌ خضراء هنا تعني «المنطق صحيح»، لا «الساعة تعمل» — وهو بالضبط سبب
 * بناء المستوى على الاشتقاق لا على عمودٍ تكتبه هذه المهمّة.
 */
export declare function enqueueLoyaltyTierDaily(clinicId: string, day: string): Promise<{
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
