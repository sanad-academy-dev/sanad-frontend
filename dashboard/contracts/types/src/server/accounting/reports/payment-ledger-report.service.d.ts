import type { Prisma } from "@/generated/prisma/client";
/**
 * [P3.6] Payment Ledger report (BRD §18.2) — the raw PLE audit view. No aggregation: the
 * point of the report is seeing exactly what BR-5.2.1/BR-3.2 wrote, delinked rows
 * included on demand.
 */
declare const pleReportSelect: {
    readonly id: true;
    readonly postingDate: true;
    readonly dueDate: true;
    readonly accountType: true;
    readonly account: {
        readonly select: {
            readonly accountName: true;
        };
    };
    readonly partyType: true;
    readonly partyId: true;
    readonly voucherType: true;
    readonly voucherId: true;
    readonly voucherNo: true;
    readonly againstVoucherType: true;
    readonly againstVoucherId: true;
    readonly againstVoucherNo: true;
    readonly amount: true;
    readonly amountInAccountCurrency: true;
    readonly accountCurrencyCode: true;
    readonly delinked: true;
    readonly remarks: true;
    readonly createdAt: true;
};
export type PaymentLedgerReportRow = Prisma.PaymentLedgerEntryGetPayload<{
    select: typeof pleReportSelect;
}> & {
    partyName: string;
};
export declare function paymentLedgerReport(params: {
    clinicId: string;
    fromDate: Date;
    toDate: Date;
    partyType?: string;
    partyId?: string;
    accountType?: "RECEIVABLE" | "PAYABLE";
    includeDelinked?: boolean;
}): Promise<PaymentLedgerReportRow[]>;
export {};
