import { DeferredType } from "@/generated/prisma/enums";
/**
 * [P12.2] The Deferred Revenue & Expense report (§15): **posted versus pending**, per line.
 *
 * The number that matters is `pending` — what is still parked in a balance-sheet account and
 * has not reached the P&L. A report that showed only what was recognised would answer the
 * easy question; an accountant closing a year needs to know what is left and until when.
 */
export type DeferredScheduleRow = {
    type: DeferredType;
    itemId: string;
    invoiceNo: string;
    itemName: string;
    deferredAccountName: string;
    totalAmount: string;
    postedAmount: string;
    pendingAmount: string;
    serviceStartDate: Date;
    serviceEndDate: Date;
    serviceStopDate: Date | null;
    lastPeriodEndDate: Date | null;
};
export type DeferredScheduleReport = {
    rows: DeferredScheduleRow[];
    totals: {
        total: string;
        posted: string;
        pending: string;
    };
};
export declare function deferredScheduleReport(params: {
    clinicId: string;
    type?: DeferredType | null;
}): Promise<DeferredScheduleReport>;
