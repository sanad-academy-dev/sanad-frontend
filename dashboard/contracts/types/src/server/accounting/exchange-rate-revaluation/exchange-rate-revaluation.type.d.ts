import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { DocStatus } from "@/generated/prisma/enums";
export { DocStatus };
/** [P8.4] Exchange Rate Revaluation types (BRD FR-9.3). */
export declare const exchangeRateRevaluationSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly documentNo: true;
    readonly docstatus: true;
    readonly postingDate: true;
    readonly amendedFromId: true;
    readonly roundingLossAllowance: true;
    readonly totalGainLoss: true;
    readonly journalEntryId: true;
    readonly createdById: true;
    readonly submittedAt: true;
    readonly submittedById: true;
    readonly cancelledAt: true;
    readonly cancelledById: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly rows: {
        readonly orderBy: {
            readonly idx: "asc";
        };
        readonly select: {
            readonly id: true;
            readonly idx: true;
            readonly accountId: true;
            readonly accountCurrencyCode: true;
            readonly partyType: true;
            readonly partyId: true;
            readonly balanceInAccountCurrency: true;
            readonly bookedBase: true;
            readonly currentExchangeRate: true;
            readonly newBase: true;
            readonly gainLoss: true;
            readonly isZeroForeignSweep: true;
            readonly account: {
                readonly select: {
                    readonly accountName: true;
                    readonly accountNumber: true;
                };
            };
        };
    };
};
export type ExchangeRateRevaluationResponse = Prisma.ExchangeRateRevaluationGetPayload<{
    select: typeof exchangeRateRevaluationSelect;
}>;
/** a scanned/edited revaluation row — figures come from the scan; the RATE is editable */
export declare const errRowSchema: z.ZodObject<{
    accountId: z.ZodString;
    accountCurrencyCode: z.ZodString;
    partyType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    partyId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    balanceInAccountCurrency: z.ZodString;
    bookedBase: z.ZodString;
    currentExchangeRate: z.ZodString;
}, z.core.$strip>;
export declare const createExchangeRateRevaluationSchema: z.ZodObject<{
    postingDate: z.ZodString;
    roundingLossAllowance: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    rows: z.ZodArray<z.ZodObject<{
        accountId: z.ZodString;
        accountCurrencyCode: z.ZodString;
        partyType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        partyId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        balanceInAccountCurrency: z.ZodString;
        bookedBase: z.ZodString;
        currentExchangeRate: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateExchangeRateRevaluationFormValues = z.output<typeof createExchangeRateRevaluationSchema>;
export type ErrRowInput = z.output<typeof errRowSchema>;
export type CreateExchangeRateRevaluationInput = CreateExchangeRateRevaluationFormValues & {
    clinicId: string;
    createdById?: string | null;
};
