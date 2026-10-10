import { type BankTransactionResponse } from "@/server/accounting/bank/bank-transaction.type";
import type { AccountingActor } from "@/server/accounting/permissions/accounting-permissions.guard";
export type ReconciliationCandidate = {
    paymentDocument: "payment_entry" | "journal_entry";
    paymentEntryId: string;
    paymentRowId: string | null;
    documentNo: string | null;
    postingDate: Date;
    partyType: string | null;
    partyId: string | null;
    partyName: string | null;
    referenceNo: string | null;
    amount: string;
    score: number;
    matchedBy: string[];
};
/** FR-14.2 — rank uncleared book-side vouchers for one bank transaction. */
export declare function getReconciliationCandidates(clinicId: string, bankTransactionId: string): Promise<ReconciliationCandidate[]>;
export type AllocationInput = {
    paymentDocument: "payment_entry" | "journal_entry";
    paymentEntryId: string;
    paymentRowId?: string | null;
    amount: string;
};
/** FR-14.2 — allocate vouchers; clearance date = the TRANSACTION date. */
export declare function allocateToBankTransaction(clinicId: string, bankTransactionId: string, allocations: AllocationInput[]): Promise<BankTransactionResponse>;
/** the inverse of an allocation — clears the voucher stamp when nothing else holds it */
export declare function unallocateBankTransactionPayment(clinicId: string, bankTransactionId: string, paymentId: string): Promise<BankTransactionResponse>;
export declare class DuplicateBookingRiskError extends Error {
    readonly candidate: ReconciliationCandidate;
    constructor(candidate: ReconciliationCandidate);
}
/**
 * "book it now": a party payment matching the transaction's direction, then allocate.
 *
 * [P12A-fix5] Refuses by default when a high-scoring candidate already exists. The owner's
 * UI pass hit exactly this: BTR-2025-00003 had a 90-scored exact match, the workspace
 * offered «سوِّ» and «سند قبض/صرف» side by side with no warning, and taking the PE path
 * booked the same 250 deposit twice — the JV uncleared forever, the PE cleared. The caller
 * must pass `confirmDuplicate` to override, which is what the dialog's explicit
 * acknowledgement sends.
 */
export declare function createPaymentEntryFromTransaction(clinicId: string, params: {
    bankTransactionId: string;
    partyType: string;
    partyId: string;
    confirmDuplicate?: boolean;
}, actor: AccountingActor): Promise<BankTransactionResponse>;
/** "book it now": a charges/income JE against the bank GL, then allocate */
export declare function createJournalEntryFromTransaction(clinicId: string, params: {
    bankTransactionId: string;
    contraAccountId: string;
    remark?: string | null;
}, actor: AccountingActor): Promise<BankTransactionResponse>;
/** FR-14.2 — pair the opposite leg in another company account and book ONE transfer JE */
export declare function markInternalTransfer(clinicId: string, params: {
    bankTransactionId: string;
    counterpartTransactionId?: string;
}, actor: AccountingActor): Promise<{
    transaction: BankTransactionResponse;
    counterpartId: string;
}>;
