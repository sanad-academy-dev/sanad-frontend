import type { Prisma } from "@/generated/prisma/client";
import { AccountingJobStatus } from "@/generated/prisma/enums";
/**
 * [P0.5] Background-job status pattern (BRD AR-7, NFR-8).
 *
 * AR-7 names four heavy operations that must run outside the request that triggers them —
 * Period Closing Voucher, invoice consolidation, auto-reconciliation, deferred accounting —
 * plus reposting (FR-6.9). They all report the same three terminal-ish states and store the
 * failure text, so the pattern is declared once here and each phase registers a handler.
 */
export { AccountingJobStatus };
/**
 * Job types AR-7 calls for. Declared up front (like the P0.3 doctype registry) so a phase
 * adds a handler rather than inventing a key; `accounting_job_demo` is the P0 smoke target.
 */
export declare const ACCOUNTING_JOB_TYPES: {
    /** BRD FR-12.3 — build the closing GLEs + snapshots */
    readonly PERIOD_CLOSING_VOUCHER: "period_closing_voucher";
    /** BRD FR-10.2 — scheduled payment reconciliation */
    readonly AUTO_RECONCILE_PAYMENTS: "auto_reconcile_payments";
    /** BRD §15 — monthly deferred revenue/expense recognition */
    readonly PROCESS_DEFERRED_ACCOUNTING: "process_deferred_accounting";
    /** BRD §16 — POS invoice consolidation */
    readonly CONSOLIDATE_POS_INVOICES: "consolidate_pos_invoices";
    /** BRD FR-12.5 — auto-create the next fiscal year near year end */
    readonly FISCAL_YEAR_ROLLOVER: "fiscal_year_rollover";
    /** BRD FR-6.9 — Repost Accounting Ledger */
    readonly REPOST_ACCOUNTING_LEDGER: "repost_accounting_ledger";
    /** [P8.5] BRD §4.7 — the daily provider fetch writing currency_exchange rows */
    readonly DAILY_RATE_FETCH: "daily_rate_fetch";
    /** BRD FR-17.2 — the nightly subscription billing run */
    readonly SUBSCRIPTION_BILLING: "subscription_billing";
    /** BRD FR-17.4 — the scheduled statement-of-accounts send */
    readonly PROCESS_STATEMENT_OF_ACCOUNTS: "process_statement_of_accounts";
    /** [MI-P1] MI BRD FR-M5.4 — the daily membership billing/status/entitlement run */
    readonly MEMBERSHIP_DAILY: "membership_daily";
    /**
     * [CRM-P4] CRM BRD §9.2 — drain the WhatsApp provider's notification queue.
     *
     * A CRM job in a registry named «accounting» is a misnomer, not a mistake: the runner
     * is already cross-module (MEMBERSHIP_DAILY above is MI's), there is no second runner
     * in this stack, and CRM-P4's owner ruling put the polling step here rather than
     * deferring it again. Renaming the registry is a repo-wide refactor, filed as F15's
     * remaining half rather than smuggled into this phase.
     */
    readonly CRM_WHATSAPP_POLL: "crm_whatsapp_poll";
    /** [CRM-P5] CRM BRD §10.3 — تثبيت حالات الاتفاقية وإشعار المُسنَد إليه عند الخرق */
    readonly CRM_SLA_DAILY: "crm_sla_daily";
    /** [LY-P3] Loyalty BRD §4 — تثبيت لقطات مستويات الولاء للتصفية والتجميع */
    readonly LOYALTY_TIER_DAILY: "loyalty_tier_daily";
    /** [LY-P4] Loyalty BRD §7 — كتابة صفوف انتهاء النقاط للأثر التدقيقي (بلا أثر محاسبي) */
    readonly LOYALTY_EXPIRY_DAILY: "loyalty_expiry_daily";
};
export type AccountingJobType = (typeof ACCOUNTING_JOB_TYPES)[keyof typeof ACCOUNTING_JOB_TYPES];
export declare const accountingJobSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly jobType: true;
    readonly status: true;
    readonly idempotencyKey: true;
    readonly payload: true;
    readonly voucherType: true;
    readonly voucherId: true;
    readonly attempts: true;
    readonly errorMessage: true;
    readonly startedAt: true;
    readonly finishedAt: true;
    readonly createdById: true;
    readonly createdAt: true;
    readonly updatedAt: true;
};
export type AccountingJobResponse = Prisma.AccountingJobGetPayload<{
    select: typeof accountingJobSelect;
}>;
export type EnqueueAccountingJobInput = Pick<Prisma.AccountingJobUncheckedCreateInput, "clinicId" | "jobType" | "idempotencyKey"> & Partial<Pick<Prisma.AccountingJobUncheckedCreateInput, "payload" | "voucherType" | "voucherId" | "createdById">>;
/** A job is still open (not yet finished) while it is queued or running. */
export declare const OPEN_JOB_STATUSES: readonly ["QUEUED", "IN_PROGRESS"];
