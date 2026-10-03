/**
 * [P7.2] "Get Outstanding" (FR-7.5.1) — the Payment Entry dialog's data source.
 *
 * PLE FIRST, plus the [P12.6] advance sub-ledger: the open-voucher set comes from
 * `listPartyOpenVouchers` — the same seam the
 * P6.3 hold filter lives in, so held purchase invoices never surface here (BR-7.3.2)
 * and there is no second filter to forget. Each open voucher is then enriched through
 * the [P7.1] reference loaders (document no, dates, bill no, total) — the outstanding
 * itself is the PLE sum the seam returned, never the document's stored column.
 *
 * Split by sign (§5.2 matrix): positive rows are debts to settle (invoices),
 * negative rows are unallocated credits (credit/debit notes with their own balance,
 * on-account JE rows, and — after [P7.3] — payment advances). Date/amount filters
 * apply to the invoice pane; credits return wholesale, as the dialog offers them for
 * netting regardless of when they arose (FR-7.5.1).
 *
 * Currency: P7 is single-currency — every figure is in the company currency; the
 * per-account currency dimension activates at P8 through the same loaders.
 */
export type OutstandingVoucherRow = {
    voucherType: string;
    voucherId: string;
    voucherNo: string | null;
    postingDate: Date | null;
    dueDate: Date | null;
    billNo: string | null;
    totalAmount: string;
    /** signed per §5.2: + = outstanding to settle, − = open credit */
    outstanding: string;
    /** [P8.2] the rate the voucher was booked at (BR-7.4.4 comparison figure) */
    conversionRate: string;
    /**
     * [P12.6] FR-11.3 — this credit lives in a separate advance account, not in AR/AP.
     *
     * Carried on the row rather than re-derived by each consumer: the allocation path has to
     * know which ledger the credit came from, and two places asking the sub-ledger the same
     * question is two places that can start disagreeing.
     */
    inSeparateAccount?: boolean;
};
export type OutstandingForParty = {
    invoices: OutstandingVoucherRow[];
    credits: OutstandingVoucherRow[];
};
export type GetOutstandingFilter = {
    fromDate?: string;
    toDate?: string;
    minAmount?: string;
    maxAmount?: string;
};
export declare function getOutstandingForParty(clinicId: string, partyType: string, partyId: string, filter?: GetOutstandingFilter): Promise<OutstandingForParty>;
