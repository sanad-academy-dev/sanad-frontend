import { type FinancialRatios } from "@/server/accounting/reports/financial-ratios.rules";
export type FinancialRatiosReport = {
    fromDate: string;
    toDate: string;
    periodDays: number;
    inputs: Record<string, number>;
    ratios: FinancialRatios;
};
export declare function financialRatiosReport(params: {
    clinicId: string;
    fromDate: Date;
    toDate: Date;
}): Promise<FinancialRatiosReport>;
export type ProfitabilityRow = {
    groupId: string | null;
    groupName: string;
    income: string;
    expense: string;
    profit: string;
    marginPercent: number | null;
};
/**
 * P&L grouped by cost center or project — the same GL rows the P&L reads, cut a different
 * way. Rows with NO dimension are reported as «غير موزّع» rather than dropped: an unassigned
 * cost is exactly the thing a profitability report exists to surface.
 */
export declare function profitabilityReport(params: {
    clinicId: string;
    fromDate: Date;
    toDate: Date;
    groupBy: "costCenter" | "project";
}): Promise<ProfitabilityRow[]>;
export type WithholdingSummaryRow = {
    categoryId: string;
    categoryName: string;
    partyType: string;
    partyId: string;
    entries: number;
    taxableAmount: string;
    taxAmount: string;
    /** how many entries still lack a certificate number — the actionable column */
    missingCertificates: number;
};
export declare function withholdingSummaryReport(params: {
    clinicId: string;
    fromDate: Date;
    toDate: Date;
}): Promise<WithholdingSummaryRow[]>;
