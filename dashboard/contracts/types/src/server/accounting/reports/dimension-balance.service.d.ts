import type { Prisma } from "@/generated/prisma/client";
/**
 * [P10.4] §4.5 — Dimension-wise Accounts Balance: per (dimension value, account) opening
 * / in-period / closing figures over the chosen slot's dim column. With BR-4.5.3
 * offsetting on, every value's rows net to zero — this report is where that shows.
 */
type Tx = Prisma.TransactionClient;
export type DimensionBalanceRow = {
    dimValue: string;
    accountId: string;
    accountName: string;
    accountNumber: string | null;
    openingBalance: string;
    debit: string;
    credit: string;
    closingBalance: string;
};
export type DimensionBalanceReport = {
    slot: number;
    dimensionName: string;
    rows: DimensionBalanceRow[];
    /** per dimValue: Σ closing balances — zero when the dimension is offset-balanced */
    valueTotals: {
        dimValue: string;
        closingBalance: string;
    }[];
};
export declare function dimensionBalanceReport(params: {
    clinicId: string;
    slot: number;
    fromDate: Date;
    toDate: Date;
    tx?: Tx;
}): Promise<DimensionBalanceReport>;
export {};
