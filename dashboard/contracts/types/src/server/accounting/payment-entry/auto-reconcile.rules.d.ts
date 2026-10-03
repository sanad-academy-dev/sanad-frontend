export type PairableVoucher = {
    voucherType: string;
    voucherId: string;
    /** signed per §5.2: + = outstanding to settle, − = open credit */
    outstanding: string;
    postingDate: Date | null;
};
export type ProposedPair = {
    invoiceType: string;
    invoiceId: string;
    paymentType: string;
    paymentId: string;
    allocatedAmount: string;
};
/** oldest-first pairing — pure, so the policy is testable without a database */
export declare function pairOldestFirst(invoices: {
    voucherType: string;
    voucherId: string;
    outstanding: string;
    postingDate: Date | null;
}[], credits: {
    voucherType: string;
    voucherId: string;
    outstanding: string;
    postingDate: Date | null;
}[]): {
    invoiceType: string;
    invoiceId: string;
    paymentType: string;
    paymentId: string;
    allocatedAmount: string;
}[];
