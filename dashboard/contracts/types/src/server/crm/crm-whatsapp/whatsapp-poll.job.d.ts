export declare function enqueueWhatsappPoll(clinicId: string): Promise<{
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
/** يُصدَّر للاختبار: دورة سحبٍ واحدة لأكاديمية. */
export declare function drainWhatsappQueue(clinicId: string): Promise<{
    processed: number;
    inbound: number;
    statusUpdates: number;
}>;
