/**
 * [P12.5] §17.1 — dunning interest arithmetic, pure.
 *
 * Interest on an overdue invoice is simple, annual, and pro-rated by DAYS overdue:
 *   interest = outstanding × rate% × daysOverdue ÷ 365
 *
 * Two things this gets right that a naive version does not:
 *   · **days are counted from the due date, not the invoice date** — an invoice with 30-day
 *     terms is not overdue on day 1, and charging from issue turns a payment term into a
 *     penalty;
 *   · **a not-yet-due invoice yields zero, never negative**. Without the floor, pulling
 *     "overdue" invoices a day early produces a credit, and a dunning letter that owes the
 *     customer money is worse than no letter.
 */
/** whole days past the due date; 0 while the invoice is still within terms */
export declare const overdueDays: (dueDate: Date, asOf: Date) => number;
export declare const interestFor: (params: {
    outstanding: number;
    annualRatePercent: number;
    days: number;
}) => number;
export type DunningLine = {
    salesInvoiceId: string;
    invoiceNo: string;
    dueDate: Date;
    outstanding: number;
};
export type DunningComputation = {
    lines: (DunningLine & {
        overdueDays: number;
        interest: number;
    })[];
    totalOutstanding: number;
    totalInterest: number;
    /** what the letter asks for ON TOP of the principal */
    dunningAmount: number;
};
export declare function computeDunning(params: {
    lines: DunningLine[];
    annualRatePercent: number;
    fee: number;
    asOf: Date;
}): DunningComputation;
