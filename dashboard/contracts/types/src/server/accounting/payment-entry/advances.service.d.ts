import type { Prisma } from "@/generated/prisma/client";
import { Prisma as PrismaNs } from "@/generated/prisma/client";
import { type AccountingActor } from "@/server/accounting/permissions/accounting-permissions.guard";
/**
 * [P7.5] Advances (BRD §11, FR-11.1 + BR-11.2).
 *
 * An "advance" is an open credit the party already paid: the is_advance remainder of a
 * payment ([P7.4]) or an on-account JE credit — i.e. a negative PLE balance against a
 * payment_entry/journal_entry voucher. The fetch reads the SAME pane [P7.2] computes
 * (PLE-only, never a stored column); the FIFO allocator is pure math; the RELINK is the
 * BR-11.2 move — executed inside the invoice's submit transaction:
 *
 *   delink the advance's self-pointing PLE row, re-insert the unconsumed remainder
 *   against self, and insert the consumed slice AGAINST THE INVOICE — the §5.2 sum per
 *   voucher never changes, only the against-target moves, so the invoice's outstanding
 *   drops by exactly the allocation and the advance's open balance shrinks to match.
 *
 * This is the same delink+relink shape the reconciliation tool ([P7.6]) and the
 * unreconcile path ([P7.7]) use — one PLE discipline for every allocation move.
 */
type Tx = Prisma.TransactionClient;
export type AdvanceSource = {
    referenceType: string;
    referenceId: string;
    referenceNo: string | null;
    postingDate: Date | null;
    /** positive figure — the open credit available to allocate */
    advanceAmount: string;
    /** [P8.2] the credit's booked rate (BR-7.4.4 comparison figure at relink) */
    advanceRate: string;
    /** [P12.6] FR-11.3 — this credit lives in a separate advance account, not in AR/AP */
    inSeparateAccount?: boolean;
};
/**
 * FR-11.1 — the Get Advances fetch: open PE/JE credits of the party, oldest first.
 *
 * [P12.6] It covers FR-11.3 advances too, but it does NOT query the sub-ledger itself — the
 * credits pane already unions both ledgers, and reading it here as well would list a
 * separate-account advance twice, which is exactly the double-allocation this whole feature
 * must not permit. One reader, one answer.
 */
export declare function fetchAdvancesForParty(clinicId: string, partyType: string, partyId: string): Promise<AdvanceSource[]>;
export type FifoAllocation = AdvanceSource & {
    allocatedAmount: string;
};
/** FR-11.1 — pure FIFO: walk oldest-first, consume up to the payable. */
export declare function allocateAdvancesFifo(advances: AdvanceSource[], payable: PrismaNs.Decimal): FifoAllocation[];
/**
 * BR-11.2 — re-point one advance slice at the invoice, inside the submit transaction.
 * Locks the advance voucher row first (same discipline as BR-7.4.3) so two invoices
 * consuming the same advance serialize instead of double-spending it.
 */
export declare function relinkAdvanceToInvoice(tx: Tx, params: {
    clinicId: string;
    advanceType: string;
    advanceId: string;
    invoiceType: string;
    invoiceId: string;
    invoiceNo: string | null;
    amount: PrismaNs.Decimal;
    /** [P12.6] only the FR-11.3 release path posts, so this is optional for PLE advances */
    actor?: AccountingActor;
}): Promise<void>;
export type ResolvedAdvanceRow = {
    referenceType: string;
    referenceId: string;
    advanceAmount: string;
    allocatedAmount: string;
    /** [P8.2] snapshot of the credit's booked rate — persisted as refExchangeRate */
    advanceRate: string;
};
/**
 * FR-11.1 — the save-time resolver both invoice services share: FIFO auto-fill when the
 * flag is on, otherwise the manual rows validated against the live fetch. Returns are
 * out (they settle, they don't consume). Σallocations is capped at the payable figure;
 * the hard per-advance balance check re-runs at submit inside the relink (BR-11.2).
 */
export declare function resolveInvoiceAdvanceRows(clinicId: string, input: {
    partyType: string;
    partyId: string;
    isReturn: boolean;
    allocateAdvancesAutomatically: boolean;
    advances: {
        referenceType: string;
        referenceId: string;
        allocatedAmount: string;
    }[];
}, payable: PrismaNs.Decimal): Promise<ResolvedAdvanceRow[]>;
/** convenience for tests/screens: the party's total open advance balance */
export declare function totalOpenAdvances(clinicId: string, partyType: string, partyId: string): Promise<PrismaNs.Decimal>;
export {};
