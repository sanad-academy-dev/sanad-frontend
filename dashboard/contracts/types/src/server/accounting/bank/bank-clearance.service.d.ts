export type ClearanceVoucherRow = {
    paymentDocument: "payment_entry" | "journal_entry";
    voucherId: string;
    /** journal_entry_account id — JE clearance is row-level (P11.1) */
    rowId: string | null;
    documentNo: string | null;
    postingDate: Date;
    clearanceDate: Date | null;
    /** signed against the bank GL: debit positive (money in), credit negative */
    amount: string;
    partyName: string | null;
    referenceNo: string | null;
};
export type BankReconciliationStatementReport = {
    bankAccountName: string;
    asOf: Date;
    /** GL balance at as-of (debit − credit) */
    glBalance: string;
    unclearedVouchers: ClearanceVoucherRow[];
    /** Σ signed uncleared amounts */
    unclearedTotal: string;
    /** GL balance − uncleared total — what the BANK should show */
    calculatedBankBalance: string;
    /** Σ imported feed (deposits − withdrawals) at as-of — what the bank DID show */
    importedFeedBalance: string;
    /** calculated − imported: zero when the feed is complete and reconciled */
    residualDifference: string;
};
export declare function bankReconciliationStatement(params: {
    clinicId: string;
    bankAccountId: string;
    asOf: Date;
}): Promise<BankReconciliationStatementReport>;
export type BankClearanceSummaryReport = {
    bankAccountName: string;
    rows: ClearanceVoucherRow[];
    clearedTotal: string;
    unclearedTotal: string;
};
export declare function bankClearanceSummary(params: {
    clinicId: string;
    bankAccountId: string;
    fromDate: Date;
    toDate: Date;
}): Promise<BankClearanceSummaryReport>;
/** FR-14.4 — the manual tool's list: uncleared vouchers in a range */
export declare function listClearanceVouchers(params: {
    clinicId: string;
    bankAccountId: string;
    fromDate: Date;
    toDate: Date;
}): Promise<ClearanceVoucherRow[]>;
/** FR-14.4 — bulk stamp clearance dates (or clear them with null) */
export declare function setClearanceDates(clinicId: string, updates: {
    paymentDocument: "payment_entry" | "journal_entry";
    voucherId: string;
    rowId?: string | null;
    clearanceDate: Date | null;
}[]): Promise<{
    updated: number;
}>;
