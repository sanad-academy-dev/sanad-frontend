import type { Prisma } from "@/generated/prisma/client";
/**
 * [P7.9] §18 payment reports — the two the phases file names for P7:
 *
 *  - **Payment Period Based on Invoice Date**: one row per settled reference of a
 *    submitted payment in range — invoice date vs payment date, the collection age in
 *    days. Figures come from the payment's reference rows (the document mirror the
 *    reconcile/unreconcile flows keep in sync); cancelled payments are excluded.
 *
 *  - **Sales Payment Summary**: Receive-side payments grouped by posting date × mode of
 *    payment with totals — the daily cash-desk digest.
 */
type Tx = Prisma.TransactionClient;
export type PaymentPeriodRow = {
    paymentId: string;
    paymentNo: string | null;
    paymentDate: Date;
    paymentType: string;
    partyName: string | null;
    referenceType: string;
    referenceNo: string | null;
    invoiceDate: Date | null;
    dueDate: Date | null;
    allocatedAmount: string;
    /** payment date − invoice date, in days (null when the reference carries no date) */
    ageDays: number | null;
};
export declare function paymentPeriodReport(params: {
    clinicId: string;
    fromDate: Date;
    toDate: Date;
    partyId?: string;
    tx?: Tx;
}): Promise<PaymentPeriodRow[]>;
export type SalesPaymentSummaryRow = {
    postingDate: Date;
    modeOfPayment: string;
    paymentCount: number;
    paidAmount: string;
    allocatedAmount: string;
    unallocatedAmount: string;
};
export declare function salesPaymentSummaryReport(params: {
    clinicId: string;
    fromDate: Date;
    toDate: Date;
    tx?: Tx;
}): Promise<SalesPaymentSummaryRow[]>;
export {};
