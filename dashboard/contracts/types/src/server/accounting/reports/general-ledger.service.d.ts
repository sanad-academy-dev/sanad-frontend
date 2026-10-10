import { Prisma as PrismaNs } from "@/generated/prisma/client";
/**
 * [P2.6] General Ledger report (BRD §18.2). Read-only over `gl_entry`:
 *  - opening row = Σ(debit−credit) strictly BEFORE the period (live rows only — cancelled
 *    rows never contribute to balances in either AR-2 mode),
 *  - per-row running balance from that opening, in posting order,
 *  - closing row = opening + period totals.
 * `showCancelled` adds the flagged rows to the LISTING (audit view) without letting them
 * touch opening/running/closing math. All amounts serialize as strings (contract C2).
 */
export type GeneralLedgerFilter = {
    clinicId: string;
    fromDate: Date;
    toDate: Date;
    accountId?: string;
    costCenterId?: string;
    voucherType?: string;
    showCancelled?: boolean;
};
declare const glRowSelect: {
    readonly id: true;
    readonly postingDate: true;
    readonly fiscalYear: true;
    readonly accountId: true;
    readonly debit: true;
    readonly credit: true;
    readonly against: true;
    readonly voucherType: true;
    readonly voucherSubtype: true;
    readonly voucherId: true;
    readonly voucherNo: true;
    readonly costCenterId: true;
    readonly isOpening: true;
    readonly isCancelled: true;
    readonly remarks: true;
    readonly account: {
        readonly select: {
            readonly accountName: true;
            readonly accountNumber: true;
        };
    };
    readonly costCenter: {
        readonly select: {
            readonly costCenterName: true;
        };
    };
};
export type GeneralLedgerRow = PrismaNs.GlEntryGetPayload<{
    select: typeof glRowSelect;
}> & {
    /** opening + cumulative Σ(debit−credit) up to and including this row, as a string */
    runningBalance: string;
};
export type GeneralLedgerReport = {
    opening: {
        debit: string;
        credit: string;
        balance: string;
    };
    rows: GeneralLedgerRow[];
    closing: {
        debit: string;
        credit: string;
        balance: string;
    };
};
export declare function generalLedgerReport(filter: GeneralLedgerFilter): Promise<GeneralLedgerReport>;
export {};
