import type { Prisma } from "@/generated/prisma/client";
import { type GlMapRow, type WorkingRow } from "@/server/accounting/gl/gl-map";
import { type AccountingActor } from "@/server/accounting/permissions/accounting-permissions.guard";
/**
 * [P2.2] `make_gl_entries` — THE posting pipeline (BRD §6, AR-4). Every voucher builds a
 * gl_map and passes it through this ONE function inside its submit transaction; nothing
 * else may write `gl_entry` rows. Runs entirely on the caller's `tx` so the voucher's
 * docstatus flip and its ledger rows commit or roll back together (NFR-1).
 *
 * §6 step map — implemented now vs. stubbed for the phase that owns it:
 *   1 budget validation ............ REAL (P10.3, §13) → `validateBudgetHook`
 *   2 dimension offsetting ......... REAL (P10.4, §4.5) → `dimensionOffsettingHook`
 *   3 accounting period ............ REAL (P10.1, FR-12.2) → `validateAccountingPeriodHook`
 *   4 disabled accounts ............ REAL
 *   5a cost-center allocation split  REAL (BR-4.4.1)
 *   5b merge similar (+_skip_merge)  REAL
 *   5c toggle negatives ............ REAL
 *   6 PLE creation ................. STUB (P3.2)    → `createPaymentLedgerEntriesHook`
 *   7 per-insert validations ....... REAL: postable account (frozen/disabled/group),
 *       fiscal year (BR-4.2.2), frozen-upto + role bypass (FR-12.1), remarks cap;
 *       party rules (BR-4.3.3 + §4.10 guards) REAL since P3.3 (`assertPartyRules`);
 *       PCV check REAL (P10.2, BR-12.4); dimension filters/mandatory REAL (P10.4);
 *       balance_must_be ............ REAL (post-batch, per account)
 *   8 debit=credit + round-off ..... REAL (incl. opening-account branch + absorb-in-place)
 */
export type MakeGlEntriesParams = {
    clinicId: string;
    /** doctype key of the source voucher, e.g. "journal_entry" */
    voucherType: string;
    /** e.g. a JE's voucher_type ("Bank Entry", "Exchange Gain Or Loss", …) */
    voucherSubtype?: string | null;
    voucherId: string;
    voucherNo: string;
    postingDate: Date;
    rows: GlMapRow[];
    mergeEntries?: boolean;
    actor?: AccountingActor;
    createdById?: string | null;
};
type Tx = Prisma.TransactionClient;
/**
 * [P3.2] BR-5.2.1 — every persisted GLE hitting a Receivable/Payable account derives a
 * payment_ledger_entry. The hook receives the FINAL processed rows (post-merge/toggle/
 * round-off) so derivation and persistence can never disagree. Skipped entirely for the
 * Period Closing Voucher. A row's allocation target is its `againstVoucher*`; when empty,
 * against = the row's own voucher (an invoice's own row points at itself).
 *
 * Party-less AR/AP rows derive nothing here: BR-4.3.3 (party mandatory on AR/AP) is
 * P3.3's engine validation — once it lands, such rows can no longer reach this hook.
 */
export declare function createPaymentLedgerEntriesHook(tx: Tx, params: MakeGlEntriesParams, rows: WorkingRow[]): Promise<void>;
/**
 * Submit path of the §6 pipeline. Persists the processed rows on `tx` and returns them.
 * MUST be called inside the voucher's ONE submit transaction (NFR-1).
 */
export declare function makeGlEntries(tx: Tx, params: MakeGlEntriesParams): Promise<{
    fiscalYear: string;
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    accountCurrencyCode: string;
    costCenterId: string | null;
    accountId: string;
    debit: import("@prisma/client-runtime-utils").Decimal;
    credit: import("@prisma/client-runtime-utils").Decimal;
    debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
    creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
    debitInTransactionCurrency: import("@prisma/client-runtime-utils").Decimal;
    creditInTransactionCurrency: import("@prisma/client-runtime-utils").Decimal;
    transactionCurrencyCode: string | null;
    transactionExchangeRate: import("@prisma/client-runtime-utils").Decimal | null;
    partyType: string | null;
    partyId: string | null;
    against: string | null;
    voucherDetailNo: string | null;
    againstVoucherType: string | null;
    againstVoucherId: string | null;
    projectId: string | null;
    financeBookId: string | null;
    dim1: string | null;
    dim2: string | null;
    dim3: string | null;
    dim4: string | null;
    isOpening: boolean;
    isAdvance: boolean;
    dueDate: Date | null;
    remarks: string | null;
    transactionDate: Date | null;
    postingDate: Date;
    voucherType: string;
    voucherId: string;
    voucherNo: string;
    voucherSubtype: string | null;
    isCancelled: boolean;
}[]>;
export {};
