/**
 * [P8.5] §4.7 — the daily provider fetch. One job per (clinic, day): for every FOREIGN
 * currency any ledger account of the clinic uses, pull provider rates into
 * `currency_exchange` (idempotent per pair+date — an existing manual row for the day
 * wins and is never overwritten). Skipped entirely while `rate_provider` = "None".
 *
 * The runner infrastructure is P0.5's; a cron/worker calls `runQueuedAccountingJobs` on
 * a schedule — this module only registers the handler and offers the enqueue helper.
 */
export declare function enqueueDailyRateFetch(clinicId: string, day: string): Promise<{
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
