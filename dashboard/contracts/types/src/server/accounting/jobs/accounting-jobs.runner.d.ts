import { accountingJobsDao } from "@/server/accounting/jobs/accounting-jobs.dao";
import type { AccountingJobResponse, EnqueueAccountingJobInput } from "@/server/accounting/jobs/accounting-jobs.type";
/**
 * [P0.5] Background-job runner (BRD AR-7, NFR-8).
 *
 * There is no queue service in this stack (no Redis, no worker process), so the runner is
 * in-process and the DB row *is* the queue: it holds the state AR-7 requires (In Progress /
 * Completed / Failed + `error_message`) and survives a restart, which an in-memory queue
 * would not. Two entry points, and the difference matters:
 *
 *   - {@link enqueueAccountingJob} records the work. Safe to call inside a submit
 *     transaction — pass the transaction client — so the job exists if and only if the
 *     voucher was committed.
 *   - {@link runAccountingJob} / {@link runQueuedAccountingJobs} execute it. Never call
 *     these inside a transaction: a long job holding a submit transaction open is exactly
 *     what AR-7 exists to prevent.
 *
 * Restart safety: a job interrupted mid-flight stays IN_PROGRESS and is not auto-retried,
 * because a half-applied posting job must be inspected before it runs again. Recovery is
 * deliberate — {@link requeueAccountingJob}.
 *
 * When a real worker/cron lands, it calls `runQueuedAccountingJobs` on a schedule; nothing
 * else changes.
 */
export type AccountingJobHandler = (job: AccountingJobResponse) => Promise<void>;
export declare function registerAccountingJobHandler(jobType: string, handler: AccountingJobHandler): void;
export declare function getAccountingJobHandler(jobType: string): AccountingJobHandler | undefined;
/** Test/bootstrap helper — handlers are module-level state. */
export declare function clearAccountingJobHandlers(): void;
/**
 * Record a unit of work. Idempotent per (clinic, jobType, idempotencyKey): enqueueing the
 * same key twice returns the existing row instead of creating a second job (NFR-8) — the
 * reason a retried request cannot double-post a period closing.
 */
export declare function enqueueAccountingJob(input: EnqueueAccountingJobInput, tx?: Parameters<typeof accountingJobsDao.create>[1]): Promise<AccountingJobResponse>;
/**
 * Execute one job. Claims it first (QUEUED → IN_PROGRESS via a conditional update), so a
 * job already claimed by another runner is skipped rather than run twice. Never throws for
 * a handler failure: the failure is the job's recorded outcome, not the caller's problem.
 */
export declare function runAccountingJob(jobId: string): Promise<AccountingJobResponse | null>;
/** Drain the queue oldest-first. The entry point a scheduler or admin action calls. */
export declare function runQueuedAccountingJobs(limit?: number): Promise<AccountingJobResponse[]>;
/**
 * Enqueue and start it without blocking the caller. Use AFTER the triggering transaction
 * has committed — the job must not observe a voucher that could still roll back.
 */
export declare function dispatchAccountingJob(input: EnqueueAccountingJobInput): Promise<AccountingJobResponse>;
/** Deliberate retry of a FAILED job (AR-7 gives no automatic retry). */
export declare function requeueAccountingJob(jobId: string): Promise<AccountingJobResponse | null>;
