import type { Prisma } from "@/generated/prisma/client";
/**
 * [P5.8] §18.4 — Sales Register + Item-wise Sales Register.
 *
 * Invoice-level: one row per SUBMITTED sales invoice in range, ONE COLUMN PER TAX ACCOUNT
 * (the column set is the union of the range's tax heads), net/tax/grand/rounded/
 * outstanding. Item-wise: one row per invoice ITEM with its per-tax-account amounts from
 * the persisted `item_wise_tax_detail` (written by the P5.3 submit path). Cancelled
 * invoices are excluded; figures come from the stored §8 outputs and the PLE-derived
 * outstanding — the report never recomputes.
 */
type Tx = Prisma.TransactionClient;
export type TaxColumn = {
    accountId: string;
    accountName: string;
};
export type SalesRegisterRow = {
    invoiceId: string;
    documentNo: string | null;
    postingDate: Date;
    dueDate: Date | null;
    partyId: string;
    partyName: string | null;
    debitToAccount: string;
    isReturn: boolean;
    netTotal: string;
    /** accountId → summed tax amount on this invoice */
    taxByAccount: Record<string, string>;
    totalTaxesAndCharges: string;
    grandTotal: string;
    roundedTotal: string;
    outstandingAmount: string;
    status: string;
};
export type SalesRegisterReport = {
    taxColumns: TaxColumn[];
    rows: SalesRegisterRow[];
    totals: {
        netTotal: string;
        taxByAccount: Record<string, string>;
        totalTaxesAndCharges: string;
        grandTotal: string;
        outstandingAmount: string;
    };
};
export declare function salesRegisterReport(params: {
    clinicId: string;
    fromDate: Date;
    toDate: Date;
    partyId?: string;
    tx?: Tx;
}): Promise<SalesRegisterReport>;
export type ItemWiseSalesRegisterRow = {
    invoiceId: string;
    documentNo: string | null;
    postingDate: Date;
    partyName: string | null;
    itemName: string;
    itemCode: string | null;
    incomeAccount: string;
    qty: string;
    rate: string;
    netAmount: string;
    /** taxRow accountId → { rate, amount } from item_wise_tax_detail */
    taxByAccount: Record<string, {
        rate: string;
        amount: string;
    }>;
    totalTax: string;
    total: string;
};
export type ItemWiseSalesRegisterReport = {
    taxColumns: TaxColumn[];
    rows: ItemWiseSalesRegisterRow[];
};
export declare function itemWiseSalesRegisterReport(params: {
    clinicId: string;
    fromDate: Date;
    toDate: Date;
    partyId?: string;
    tx?: Tx;
}): Promise<ItemWiseSalesRegisterReport>;
export {};
