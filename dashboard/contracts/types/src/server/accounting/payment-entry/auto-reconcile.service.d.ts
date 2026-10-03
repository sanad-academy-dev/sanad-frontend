import type { VoucherActor } from "@/server/accounting/voucher/voucher.service";
export type AutoReconcileResult = {
    partiesScanned: number;
    allocations: {
        partyType: string;
        partyId: string;
        ok: boolean;
        error?: string;
    }[];
    totalAllocated: string;
};
type PartyRef = {
    partyType: string;
    partyId: string;
};
export declare function runAutoReconciliation(params: {
    clinicId: string;
    actor: VoucherActor;
    /** limit to one party — the "reconcile this party now" button */
    party?: PartyRef;
    /** ignore the settings switch (a manual run is an explicit instruction) */
    force?: boolean;
}): Promise<AutoReconcileResult>;
export {};
