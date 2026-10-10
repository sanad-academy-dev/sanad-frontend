/**
 * [P10.5] FR-12.5 — fiscal-year auto-rollover. Within {@link ROLLOVER_WINDOW_DAYS} of the
 * latest fiscal year's end (or after it), create the NEXT year — same span length,
 * `autoCreated`, nothing carried physically: opening balances derive from the ledger
 * (BS accounts cumulative) because the PCV zeroed P&L (§12.5). Gated by the
 * `auto_create_fiscal_year` setting (default ON — ERPNext parity). Idempotent per
 * (clinic, target year); a cron/worker calls the enqueue helper daily when one lands —
 * the same story as the P8.5 rate fetch.
 */
export declare const ROLLOVER_WINDOW_DAYS = 3;
/** Create the next FY when the current one is ending — the job body, test-callable. */
export declare function runFiscalYearRolloverForClinic(clinicId: string, referenceDate: Date): Promise<{
    created: boolean;
    year?: string;
}>;
export declare function enqueueFiscalYearRollover(clinicId: string, day: string): Promise<{
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
