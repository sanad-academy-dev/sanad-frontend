import type { Prisma } from "@/generated/prisma/client";
import type { TaxColumn } from "@/server/accounting/reports/sales-register.service";
/**
 * [P6.5] §18.4 — Purchase Register + Item-wise Purchase Register, the AP mirror of
 * sales-register.service.ts.
 *
 * Invoice-level: one row per SUBMITTED purchase invoice in range, ONE COLUMN PER TAX
 * ACCOUNT (the union of the range's tax heads), with the supplier's bill reference
 * (BR-7.3.1) and the hold flag (BR-7.3.2) carried through. Item-wise: one row per
 * invoice ITEM with its per-tax-account amounts from the persisted `item_wise_tax_detail`
 * (written by the P6.2 submit path). Cancelled invoices are excluded; figures come from
 * the stored §8 outputs and the PLE-derived outstanding — the report never recomputes.
 */
type Tx = Prisma.TransactionClient;
export type PurchaseRegisterRow = {
    invoiceId: string;
    documentNo: string | null;
    postingDate: Date;
    dueDate: Date | null;
    partyId: string;
    partyName: string | null;
    creditToAccount: string;
    billNo: string | null;
    billDate: Date | null;
    isReturn: boolean;
    onHold: boolean;
    netTotal: string;
    /** accountId → summed tax amount on this invoice */
    taxByAccount: Record<string, string>;
    totalTaxesAndCharges: string;
    grandTotal: string;
    roundedTotal: string;
    outstandingAmount: string;
    status: string;
};
export type PurchaseRegisterReport = {
    taxColumns: TaxColumn[];
    rows: PurchaseRegisterRow[];
    totals: {
        netTotal: string;
        taxByAccount: Record<string, string>;
        totalTaxesAndCharges: string;
        grandTotal: string;
        outstandingAmount: string;
    };
};
export declare function purchaseRegisterReport(params: {
    clinicId: string;
    fromDate: Date;
    toDate: Date;
    partyId?: string;
    tx?: Tx;
}): Promise<PurchaseRegisterReport>;
export type ItemWisePurchaseRegisterRow = {
    invoiceId: string;
    documentNo: string | null;
    postingDate: Date;
    partyName: string | null;
    itemName: string;
    itemCode: string | null;
    expenseAccount: string;
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
export type ItemWisePurchaseRegisterReport = {
    taxColumns: TaxColumn[];
    rows: ItemWisePurchaseRegisterRow[];
};
export declare function itemWisePurchaseRegisterReport(params: {
    clinicId: string;
    fromDate: Date;
    toDate: Date;
    partyId?: string;
    tx?: Tx;
}): Promise<ItemWisePurchaseRegisterReport>;
export {};
