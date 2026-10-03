import type { Prisma } from "@/generated/prisma/client";
import { AccountingJobStatus } from "@/generated/prisma/enums";
import { type AccountingJobResponse, type EnqueueAccountingJobInput } from "@/server/accounting/jobs/accounting-jobs.type";
export declare const accountingJobsDao: {
    findById(id: string): Promise<AccountingJobResponse | null>;
    findByKey(clinicId: string, jobType: string, idempotencyKey: string): Promise<AccountingJobResponse | null>;
    list(clinicId: string, filter?: {
        status?: AccountingJobStatus;
        jobType?: string;
        limit?: number;
    }): Promise<AccountingJobResponse[]>;
    create(data: EnqueueAccountingJobInput, client?: Prisma.TransactionClient): Promise<AccountingJobResponse>;
    /** Oldest-first so a backlog drains in the order it was queued. */
    listQueued(limit: number): Promise<AccountingJobResponse[]>;
    /**
     * Atomically move QUEUED → IN_PROGRESS. Returns false when another runner got there
     * first — the guard that stops one job from being executed twice.
     */
    claim(id: string): Promise<boolean>;
    finish(id: string, status: AccountingJobStatus, errorMessage: string | null): Promise<AccountingJobResponse>;
    /** Put a failed job back in the queue for another attempt (keeps `attempts`). */
    requeue(id: string): Promise<boolean>;
};
