/**
 * [P12.7] FR-10.2 — the scheduled Process Payment Reconciliation, on the P0.5 job runner.
 *
 * The idempotency key is (clinic, slot) where the slot is the caller's own window label, so
 * a scheduler that fires twice inside one interval enqueues one job. Even without that, the
 * run itself reads the LIVE outstanding and would find nothing to pair the second time —
 * the queue key saves the work, not the correctness.
 */
export declare function enqueueAutoReconciliation(clinicId: string, slot: string): Promise<{
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
