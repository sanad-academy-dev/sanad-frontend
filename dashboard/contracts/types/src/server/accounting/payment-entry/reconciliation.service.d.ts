import { type OutstandingForParty } from "@/server/accounting/payment-entry/get-outstanding.service";
import type { VoucherActor } from "@/server/accounting/voucher/voucher.service";
export type ReconciliationAllocation = {
    paymentType: string;
    paymentId: string;
    invoiceType: string;
    invoiceId: string;
    allocatedAmount: string;
    /** optional write-off of the remaining difference */
    differenceAccountId?: string | null;
    differenceAmount?: string | null;
};
export type ReconciliationResult = {
    allocation: ReconciliationAllocation;
    ok: boolean;
    error?: string;
};
export declare function fetchReconciliationPanes(clinicId: string, partyType: string, partyId: string, filter?: {
    fromDate?: string;
    toDate?: string;
    minAmount?: string;
    maxAmount?: string;
}): Promise<OutstandingForParty>;
/** FR-10.1 — process the allocation rows in per-row transactions (the batch shape). */
export declare function reconcilePayments(clinicId: string, actor: VoucherActor, input: {
    partyType: string;
    partyId: string;
    allocations: ReconciliationAllocation[];
}): Promise<ReconciliationResult[]>;
