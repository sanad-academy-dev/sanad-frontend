import type { Prisma } from "@/generated/prisma/client";
import { Prisma as PrismaNs } from "@/generated/prisma/client";
/**
 * [P9.4] §18 remaining reports — four read-only services over the P2/P3 ledgers:
 *
 * 1. Party Ledger Summary — per-party opening/invoiced/paid/returns/closing over a range,
 *    built on the PLE ONLY (non-delinked rows, §5.2 signs).
 * 2. Gross Profit — per submitted sales-invoice item; valuation via a PLUGGABLE seam
 *    (`resolveValuationRate`, latest submitted purchase rate for the item name).
 * 3. Invoice Trends — 12 monthly buckets of submitted invoices (sales or purchase side);
 *    returns subtract naturally because their totals are negative.
 * 4. Ledger Debug — voucherwise GL imbalance + PLE↔GL drift on the AR/AP control accounts
 *    (§5.2 sign matrix: RECEIVABLE glNet = pleSum; PAYABLE glNet = −pleSum).
 */
type Tx = Prisma.TransactionClient;
export type PartyLedgerSummaryRow = {
    partyType: string;
    partyId: string;
    partyName: string | null;
    openingBalance: string;
    invoiced: string;
    paid: string;
    returns: string;
    closingBalance: string;
};
export type PartyLedgerSummaryReport = {
    side: "RECEIVABLE" | "PAYABLE";
    fromDate: Date;
    toDate: Date;
    rows: PartyLedgerSummaryRow[];
    totals: {
        openingBalance: string;
        invoiced: string;
        paid: string;
        returns: string;
        closingBalance: string;
    };
};
export declare function partyLedgerSummaryReport(params: {
    clinicId: string;
    side: "RECEIVABLE" | "PAYABLE";
    fromDate: Date;
    toDate: Date;
    tx?: Tx;
}): Promise<PartyLedgerSummaryReport>;
/**
 * PLUGGABLE valuation seam: today valuation = the LATEST submitted purchase-invoice item
 * with the same itemName (by the parent invoice's postingDate, newest first), else 0.
 * The stock module (out of v1 scope) swaps this seam for real FIFO/moving-average
 * valuation later — callers only ever see "a rate per item name".
 */
export declare function resolveValuationRate(tx: Tx, clinicId: string, itemName: string): Promise<PrismaNs.Decimal>;
export type GrossProfitRow = {
    invoiceId: string;
    documentNo: string | null;
    postingDate: Date;
    itemName: string;
    itemCode: string | null;
    qty: string;
    rate: string;
    amount: string;
    valuationRate: string;
    buyingAmount: string;
    grossProfit: string;
};
export type GrossProfitReport = {
    rows: GrossProfitRow[];
    totals: {
        selling: string;
        buying: string;
        grossProfit: string;
    };
};
export declare function grossProfitReport(params: {
    clinicId: string;
    fromDate: Date;
    toDate: Date;
    tx?: Tx;
}): Promise<GrossProfitReport>;
export type InvoiceTrendsBucket = {
    /** 1-12 */
    month: number;
    count: number;
    netTotal: string;
    grandTotal: string;
};
export type InvoiceTrendsReport = {
    side: "sales" | "purchase";
    year: number;
    months: InvoiceTrendsBucket[];
    totals: {
        count: number;
        netTotal: string;
        grandTotal: string;
    };
};
export declare function invoiceTrendsReport(params: {
    clinicId: string;
    side: "sales" | "purchase";
    year: number;
    tx?: Tx;
}): Promise<InvoiceTrendsReport>;
export type VoucherwiseImbalanceRow = {
    voucherType: string;
    voucherId: string;
    difference: string;
};
export type PleGlDriftRow = {
    accountId: string;
    accountName: string;
    glBalance: string;
    pleBalance: string;
    drift: string;
};
export type LedgerDebugReport = {
    voucherwiseImbalance: VoucherwiseImbalanceRow[];
    pleGlDrift: PleGlDriftRow[];
};
export declare function ledgerDebugReport(params: {
    clinicId: string;
    tx?: Tx;
}): Promise<LedgerDebugReport>;
export {};
