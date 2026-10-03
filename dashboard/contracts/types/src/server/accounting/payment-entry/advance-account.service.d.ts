import type { Prisma } from "@/generated/prisma/client";
import { Prisma as PrismaNs } from "@/generated/prisma/client";
import { PaymentType } from "@/generated/prisma/enums";
import type { AccountingActor } from "@/server/accounting/permissions/accounting-permissions.guard";
/**
 * [P12.6] FR-11.3 — advances booked in a separate party account.
 *
 * THE PROBLEM THIS SOLVES, AND WHY IT NEEDS ITS OWN LEDGER. With the flag on, the
 * unallocated remainder of a payment is not a receivable at all: it is money the clinic owes
 * back until it is earned, so it belongs in a liability («دفعات مقدمة مقبوضة») — or, on the
 * supplier side, in an asset. But BR-4.3.3 FORBIDS a party on any account that is not
 * RECEIVABLE/PAYABLE, and §5.2 derives the payment ledger only for those two types. Post the
 * advance to a plain liability and the party's claim becomes invisible to every advance-aware
 * surface in the module. `advance_payment_ledger_entry` is where that claim lives instead —
 * which is exactly why ERPNext has the same table.
 *
 * THE EXISTING PLE PATH IS NOT TOUCHED. Everything here is a parallel branch chosen by one
 * snapshot flag on the payment; with the flag off (the default) not a single row of the P7
 * allocation core behaves differently. That property is deliberate and load-bearing: the
 * relink in `advances.service.ts` is the most money-critical code in the module, and a
 * feature that a clinic has not switched on must not be able to change its ledger.
 *
 * RELEASE IS A REAL POSTING, NOT A RE-POINTING. A PLE advance is consumed by moving an
 * existing row's against-target (BR-11.2) — legitimate, because the money was already sitting
 * in the receivable. A separate-account advance is sitting somewhere else, so applying it to
 * an invoice must MOVE it: Dr the advance account, Cr the receivable against the invoice. The
 * credit leg carries the party, so §5.2 derives its PLE exactly as any other settlement and
 * the invoice's outstanding drops by precisely the allocation — no second mechanism, no
 * second definition of "settled".
 */
type Tx = Prisma.TransactionClient;
export declare class AdvanceAccountError extends Error {
    constructor(message: string);
}
export type AdvanceAccountConfig = {
    enabled: boolean;
    receivedAccountId: string | null;
    paidAccountId: string | null;
};
/**
 * The FR-11.3 configuration for one clinic. Read at DRAFT CREATION and snapshotted onto the
 * payment — never re-read at submit, because a flag toggled in between would post the money
 * somewhere other than where the operator was told it would go.
 */
export declare function resolveAdvanceAccountConfig(clinicId: string, client?: Tx): Promise<AdvanceAccountConfig>;
/**
 * The advance account for one payment direction, or a NAMED refusal.
 *
 * Refusing loudly matters more here than almost anywhere else in the module: the silent
 * alternative is booking a customer's deposit into debtors, which understates what the clinic
 * owes and overstates what it is owed — a misstatement in both directions at once.
 */
export declare function advanceAccountFor(config: AdvanceAccountConfig, paymentType: PaymentType): string;
/**
 * Record the open advance in the sub-ledger, at payment submit.
 *
 * Sign mirrors §5.2 so the two ledgers read the same way: a customer advance received is
 * NEGATIVE (the party holds a credit against the clinic), a supplier advance paid is
 * POSITIVE. Anyone who has read the payment ledger can read this one without relearning it.
 */
export declare function recordAdvanceLedgerEntry(tx: Tx, params: {
    clinicId: string;
    accountId: string;
    accountCurrencyCode: string;
    partyType: string;
    partyId: string;
    voucherType: string;
    voucherId: string;
    voucherNo: string;
    postingDate: Date;
    paymentType: PaymentType;
    /** positive magnitude in the account currency */
    amountInAccountCurrency: PrismaNs.Decimal;
    /** positive magnitude in the base currency */
    amountInBaseCurrency: PrismaNs.Decimal;
    costCenterId?: string | null;
    createdById?: string | null;
}): Promise<void>;
/** Open (unreleased) advance of one party, as a POSITIVE magnitude per voucher. */
export declare function openAdvancesForParty(clinicId: string, partyType: string, partyId: string, client?: Tx): Promise<{
    voucherType: string;
    voucherId: string;
    voucherNo: string;
    postingDate: Date;
    accountId: string;
    openAmount: string;
}[]>;
/**
 * Apply a separate-account advance to an invoice: post the transfer, then move the
 * sub-ledger slice — the FR-11.3 counterpart of the BR-11.2 relink.
 *
 * ONE TRANSACTION, TWO LEDGERS, AND THE ORDER IS NOT ARBITRARY. The GL posting runs first so
 * that if the advance account is frozen, the period is closed, or the receivable resolution
 * fails, nothing in the sub-ledger has moved yet and the whole submit rolls back with the
 * money still openly owed. The reverse order would leave a released advance with no posting
 * behind it — an advance that had been spent and also still appeared available.
 */
export declare function releaseAdvanceToInvoice(tx: Tx, params: {
    clinicId: string;
    advanceType: string;
    advanceId: string;
    partyType: string;
    partyId: string;
    paymentType: PaymentType;
    /** the AR/AP control account the advance moves INTO */
    partyAccountId: string;
    invoiceType: string;
    invoiceId: string;
    invoiceNo: string | null;
    postingDate: Date;
    /** positive, account currency */
    amount: PrismaNs.Decimal;
    actor: AccountingActor;
}): Promise<void>;
/** Is there a live release of this advance against this invoice? */
export declare function hasReleasedAdvance(tx: Tx, clinicId: string, advanceType: string, advanceId: string, invoiceId: string): Promise<boolean>;
/**
 * [P12.6] Undo a release: put the advance back on its own account and reopen the invoice.
 *
 * THE EXACT INVERSE OF `releaseAdvanceToInvoice`, and it has to be, because FR-10.3 promises
 * that unreconciling restores outstanding EXACTLY. A PLE-backed allocation is undone by moving
 * a row's against-target and the general ledger never changes — but a separate-account release
 * POSTED, so undoing it must post too. Reversing (AR-2 append, never delete) takes the credit
 * off the receivable, which raises the invoice's outstanding by exactly the released amount,
 * and takes the debit off the advance account, which reopens the liability.
 *
 * THE REVERSAL RUNS FIRST, for the same reason the release ran the posting first: if the
 * period is closed or the account is frozen, nothing in the sub-ledger has moved and the whole
 * unreconcile rolls back with the advance still correctly shown as spent. The opposite order
 * would produce an advance that was available again and also still funding an invoice.
 */
export declare function reverseAdvanceRelease(tx: Tx, params: {
    clinicId: string;
    advanceType: string;
    advanceId: string;
    invoiceId: string;
    actor: AccountingActor;
}): Promise<{
    restoredAmount: string;
}>;
/**
 * Neutralize a payment's advance sub-ledger rows when the payment is cancelled.
 *
 * AR-2 says cancels APPEND, and the GL side already obeys that through
 * `makeReverseGlEntries`. The sub-ledger is not the general ledger — it is a working index of
 * who is owed what — so here the discipline is the payment ledger's: mark the rows delinked
 * rather than inventing reversal rows nobody sums. Refuses when any slice has already been
 * released, because cancelling a payment whose advance is sitting inside a submitted invoice
 * would silently unfund that invoice.
 */
export declare function delinkAdvanceLedgerForVoucher(tx: Tx, clinicId: string, voucherType: string, voucherId: string): Promise<void>;
export {};
