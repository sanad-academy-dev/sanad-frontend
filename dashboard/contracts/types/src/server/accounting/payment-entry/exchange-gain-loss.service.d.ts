import type { Prisma, Prisma as PrismaNs } from "@/generated/prisma/client";
/**
 * [P8.2] BR-7.4.4 — the realized exchange gain/loss lifecycle.
 *
 * Per settled reference: `gainLoss = allocated × (payment rate − invoice rate)` (party-
 * side signs normalized by the caller; here + = LOSS, − = gain). Booked EITHER inside the
 * paying voucher's own GL (a deduction/derived row — `Payment` mode) OR as a separate
 * system "Exchange Gain Or Loss" JE per `exchange_gain_loss_posting_date`:
 *
 *   | setting               | vehicle                     | posting date              |
 *   |-----------------------|-----------------------------|---------------------------|
 *   | Payment               | row inside the PE's GL      | (no JE)                   |
 *   | Invoice               | system JE per reference     | the INVOICE's posting date|
 *   | Reconciliation Date   | system JE per reference     | the settlement act's date |
 *
 * The JE is booked ATOMICALLY inside the settling voucher's transaction
 * (submitJournalEntryInTx — NFR-1), `isSystemGenerated`, `multiCurrency`, and its id is
 * stored on the settlement row (PE reference / invoice advance) so unlink, unreconcile
 * and the BR-10.4 interlock cancel it by LOOKUP, never by search. Cancels are AR-2
 * append-only reversals — we cancel, never delete (logged deviation from ERPNext's
 * delete-when-draftable behavior; consistent with the module's cancel discipline).
 *
 * The party row carries base delta with ZERO account-currency delta — exactly the GLE
 * shape the §6 EGOL exemptions exist for. Booked as SYSTEM_ACTOR: the human action was
 * already permission-gated on the settling voucher.
 */
type Tx = Prisma.TransactionClient;
export type EgolMode = "Payment" | "Invoice" | "Reconciliation Date";
export type EgolConfig = {
    mode: EgolMode;
    /** company realized gain/loss account — required the moment a gain/loss ≠ 0 exists */
    egolAccountId: string | null;
};
export declare function resolveEgolConfig(clinicId: string, tx?: Tx): Promise<EgolConfig>;
export declare function assertEgolAccount(config: EgolConfig): string;
/** the JE-vehicle posting date per mode (`Payment` never reaches here) */
export declare function egolPostingDate(mode: EgolMode, invoicePostingDate: Date, settlementDate: Date): Date;
/**
 * Book one reference's realized gain/loss as a system JE inside the caller's transaction.
 * `gainLoss` is SIGNED (+ = loss → Dr EGOL / Cr party account). Returns the JE id for the
 * linkage column.
 */
export declare function bookEgolJeInTx(tx: Tx, params: {
    clinicId: string;
    egolAccountId: string;
    partyType: string;
    partyId: string;
    partyAccountId: string;
    /** signed, base currency; must be non-zero */
    gainLoss: PrismaNs.Decimal;
    postingDate: Date;
    invoiceType: string;
    invoiceId: string;
    invoiceNo: string | null;
    settledBy: string;
}): Promise<string>;
/**
 * Auto-cancel the EGOL JEs linked to broken settlements (BR-7.4.4's second half —
 * the §7.9 seam). Ids come from the linkage columns; already-cancelled JEs are skipped
 * so the inverse movers stay idempotent.
 */
export declare function cancelEgolJesInTx(tx: Tx, clinicId: string, jeIds: string[]): Promise<void>;
export {};
