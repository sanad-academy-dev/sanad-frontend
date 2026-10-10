/**
 * [LY-P4] §7 — خطوة الانتهاء اليومية على المُشغّل القائم.
 *
 * **نوعٌ مستقلّ عن `LOYALTY_TIER_DAILY` لا مُدمَجٌ فيه**، لأنّ الاسم عقد: معالجٌ اسمه
 * «المستويات» يُصالح الانتهاء أيضًا يجعل سجلّ المهام يكذب على قارئه. خطوتان باسمَيهما
 * أوضح من خطوةٍ تفعل شيئين.
 *
 * ⚠️ خاملة في الإنتاج اليوم كبقيّة مهام هذا المُشغّل ([P13.12]) — ولذلك بالضبط بُني
 * الانتهاء على الاشتقاق: رصيدٌ ينتظر مهمّةً نائمة رصيدٌ كاذب.
 */
export declare function enqueueLoyaltyExpiryDaily(clinicId: string, day: string): Promise<{
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
