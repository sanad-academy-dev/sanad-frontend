/**
 * [P2.7] Trial Balance — simple variant (BRD §18.2): per LEAF account, opening / period /
 * closing debit-credit pairs over live rows, in Chart-of-Accounts order (lft). Groups are
 * aggregated client-side from the tree when needed; the fiscal-year-aware variant (P&L
 * reset against retained earnings) arrives with period closing (P10). The report FOOTS:
 * Σdebit = Σcredit on the totals row for every column pair.
 */
export type TrialBalanceFilter = {
    clinicId: string;
    fromDate: Date;
    toDate: Date;
};
export type TrialBalanceRow = {
    accountId: string;
    accountName: string;
    accountNumber: string | null;
    openingDebit: string;
    openingCredit: string;
    periodDebit: string;
    periodCredit: string;
    closingDebit: string;
    closingCredit: string;
};
export type TrialBalanceReport = {
    rows: TrialBalanceRow[];
    totals: Omit<TrialBalanceRow, "accountId" | "accountName" | "accountNumber">;
};
export declare function trialBalanceReport(filter: TrialBalanceFilter): Promise<TrialBalanceReport>;
