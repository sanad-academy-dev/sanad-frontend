import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
/** [P10.4] Accounting Dimension types (BRD §4.5). */
export declare const accountingDimensionSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly slot: true;
    readonly dimensionName: true;
    readonly referenceDoctype: true;
    readonly disabled: true;
    readonly mandatoryForBalanceSheet: true;
    readonly mandatoryForProfitAndLoss: true;
    readonly defaultDimensionValue: true;
    readonly autoPostBalancingEntry: true;
    readonly offsettingAccountId: true;
    readonly createdById: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly offsettingAccount: {
        readonly select: {
            readonly accountName: true;
        };
    };
    readonly filters: {
        readonly where: {
            readonly disabled: false;
        };
        readonly select: {
            readonly id: true;
            readonly allowOnly: true;
            readonly disabled: true;
            readonly accounts: {
                readonly select: {
                    readonly accountId: true;
                };
            };
            readonly values: {
                readonly select: {
                    readonly dimValue: true;
                };
            };
        };
    };
};
export type AccountingDimensionResponse = Prisma.AccountingDimensionGetPayload<{
    select: typeof accountingDimensionSelect;
}>;
export declare const upsertAccountingDimensionSchema: z.ZodObject<{
    slot: z.ZodCoercedNumber<unknown>;
    dimensionName: z.ZodString;
    referenceDoctype: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    disabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    mandatoryForBalanceSheet: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    mandatoryForProfitAndLoss: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    defaultDimensionValue: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    autoPostBalancingEntry: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    offsettingAccountId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type UpsertAccountingDimensionFormInput = z.infer<typeof upsertAccountingDimensionSchema>;
export declare const upsertDimensionFilterSchema: z.ZodObject<{
    allowOnly: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    disabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    accountIds: z.ZodArray<z.ZodString>;
    dimValues: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type UpsertDimensionFilterFormInput = z.infer<typeof upsertDimensionFilterSchema>;
