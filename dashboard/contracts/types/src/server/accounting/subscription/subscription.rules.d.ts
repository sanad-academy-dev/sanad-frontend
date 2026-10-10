import type { SubscriptionInterval } from "@/generated/prisma/enums";
/** advance a date by n intervals, clamping the day to the target month's length */
export declare function addInterval(date: Date, interval: SubscriptionInterval, count: number): Date;
export type BillingPeriod = {
    startDate: Date;
    endDate: Date;
};
/**
 * Every period that is DUE for invoicing as of `asOf`, given what has already been invoiced.
 *
 * Prepaid (`generateInvoiceAtPeriodStart`) bills a period once it has STARTED; postpaid bills
 * it once it has ENDED. Both walk forward from the last invoiced period, so a job that has
 * not run for two months returns two periods and a job that runs twice returns none the
 * second time — without needing a lock or a "last run" timestamp that can lie.
 */
export declare function duePeriods(params: {
    startDate: Date;
    endDate?: Date | null;
    interval: SubscriptionInterval;
    intervalCount: number;
    lastInvoicedPeriodEnd?: Date | null;
    generateInvoiceAtPeriodStart: boolean;
    asOf: Date;
    /** safety stop so a misconfigured subscription cannot spin for ever */
    maxPeriods?: number;
}): BillingPeriod[];
