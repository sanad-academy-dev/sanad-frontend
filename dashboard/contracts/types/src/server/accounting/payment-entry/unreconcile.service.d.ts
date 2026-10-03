import type { VoucherActor } from "@/server/accounting/voucher/voucher.service";
export type UnreconcileSelection = {
    againstVoucherType: string;
    againstVoucherId: string;
};
export type UnreconcileResult = {
    unreconcileId: string;
    entries: {
        againstVoucherType: string;
        againstVoucherId: string;
        unlinkedAmount: string;
    }[];
};
export declare function unreconcilePayment(clinicId: string, actor: VoucherActor, input: {
    paymentType: string;
    paymentId: string;
    partyType: string;
    partyId: string;
    selections: UnreconcileSelection[];
    remarks?: string | null;
}): Promise<UnreconcileResult>;
