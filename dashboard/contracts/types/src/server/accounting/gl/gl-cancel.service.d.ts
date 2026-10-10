import type { GlEntry, Prisma } from "@/generated/prisma/client";
import { type AccountingActor } from "@/server/accounting/permissions/accounting-permissions.guard";
/**
 * [P2.3] `make_reverse_gl_entries` — the §6 cancel path (BRD AR-2, BR-3.1/3.2).
 *
 * Runs inside the voucher's ONE cancel transaction. The original rows are locked with a raw
 * `SELECT … FOR UPDATE` before anything reads their amounts, so two concurrent cancels (or
 * a cancel racing a reconciliation that rewrites against_voucher links in P7) serialize on
 * the rows instead of double-reversing them.
 *
 * Both AR-2 modes, switched by the `enable_immutable_ledger` Accounts Setting at CANCEL
 * time (each cancellation honors the current mode; historical rows are never rewritten):
 *  - **legacy (default):** originals get `isCancelled = true` AND mirrored reversals
 *    (debit↔credit swapped in all three currency pairs) are inserted with
 *    `isCancelled = true`, dated the ORIGINAL posting date. Reports filter
 *    `isCancelled = false`, so the voucher net-disappears with full audit history.
 *  - **immutable:** originals stay live; true reversals are inserted with
 *    `isCancelled = false` at the CANCELLATION date, fiscal year re-resolved for it.
 *
 * BR-3.1: period locks are validated against the REVERSAL posting date — cancel date in
 * immutable mode, original posting date in legacy mode. BR-3.2 (PLE delink/reversal) is
 * wired through `reversePaymentLedgerEntriesHook` when payment_ledger_entry lands (P3.2).
 *
 * `partialCancel` supports P7's advance-unlink flows: only rows matching
 * (account, party, against-voucher, voucher_detail_no) are reversed.
 */
type Tx = Prisma.TransactionClient;
export type PartialCancelFilter = {
    accountId: string;
    partyType?: string | null;
    partyId?: string | null;
    againstVoucherType?: string | null;
    againstVoucherId?: string | null;
    voucherDetailNo?: string | null;
};
export type MakeReverseGlEntriesParams = {
    clinicId: string;
    voucherType: string;
    voucherId: string;
    actor?: AccountingActor;
    createdById?: string | null;
    /** reverse only the matching rows (advance unlink, P7) — omit for a full cancel */
    partialCancel?: PartialCancelFilter;
    /** injectable for tests; defaults to today at UTC midnight */
    cancellationDate?: Date;
};
/**
 * [P3.2] BR-3.2 — the PLE mirror of the AR-2 cancel modes:
 *  - **legacy:** original PLEs get `delinked = 1` AND negated mirror rows are appended
 *    with `delinked = 1` at the ORIGINAL posting date — the live sum drops to zero and
 *    BR-5.2.2 (which reads non-delinked rows only) forgets the voucher instantly.
 *  - **immutable:** originals stay live; negated reversals are appended with
 *    `delinked = 0` at the CANCELLATION date — the sum nets to zero without any update.
 *
 * `partialCancel` reverses only the matching rows (advance unlink, P7) — the same filter
 * semantics as the GL side.
 */
export declare function reversePaymentLedgerEntriesHook(tx: Tx, params: MakeReverseGlEntriesParams, _originals: GlEntry[], mode: "legacy" | "immutable"): Promise<void>;
/**
 * Cancel a voucher's ledger impact. Returns the created reversal rows (empty when the
 * voucher never posted). MUST run inside the voucher's ONE cancel transaction (NFR-1).
 */
export declare function makeReverseGlEntries(tx: Tx, params: MakeReverseGlEntriesParams): Promise<GlEntry[]>;
export {};
