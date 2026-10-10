import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { BudgetAction, BudgetAgainst, DocStatus } from "@/generated/prisma/enums";
export { BudgetAction, BudgetAgainst, DocStatus };
/** [P10.3] Budget types (BRD §13). */
export declare const budgetSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly docstatus: true;
    readonly amendedFromId: true;
    readonly fiscalYear: true;
    readonly budgetAgainst: true;
    readonly costCenterId: true;
    readonly project: true;
    readonly monthlyDistributionId: true;
    readonly applicableOnBookingActualExpenses: true;
    readonly actionIfAnnualExceeded: true;
    readonly actionIfAccumulatedMonthlyExceeded: true;
    readonly applicableOnMaterialRequest: true;
    readonly actionIfAnnualExceededOnMr: true;
    readonly actionIfAccumulatedMonthlyExceededOnMr: true;
    readonly applicableOnPurchaseOrder: true;
    readonly actionIfAnnualExceededOnPo: true;
    readonly actionIfAccumulatedMonthlyExceededOnPo: true;
    readonly createdById: true;
    readonly submittedAt: true;
    readonly submittedById: true;
    readonly cancelledAt: true;
    readonly cancelledById: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly costCenter: {
        readonly select: {
            readonly costCenterName: true;
        };
    };
    readonly monthlyDistribution: {
        readonly select: {
            readonly distributionName: true;
            readonly percentages: {
                readonly orderBy: {
                    readonly month: "asc";
                };
                readonly select: {
                    readonly month: true;
                    readonly percentage: true;
                };
            };
        };
    };
    readonly accounts: {
        readonly orderBy: {
            readonly idx: "asc";
        };
        readonly select: {
            readonly id: true;
            readonly idx: true;
            readonly accountId: true;
            readonly budgetAmount: true;
            readonly account: {
                readonly select: {
                    readonly accountName: true;
                    readonly accountNumber: true;
                    readonly rootType: true;
                };
            };
        };
    };
};
export type BudgetResponse = Prisma.BudgetGetPayload<{
    select: typeof budgetSelect;
}>;
export declare const createBudgetSchema: z.ZodObject<{
    fiscalYear: z.ZodString;
    budgetAgainst: z.ZodDefault<z.ZodEnum<{
        readonly COST_CENTER: "COST_CENTER";
        readonly PROJECT: "PROJECT";
    }>>;
    costCenterId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    project: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    monthlyDistributionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    applicableOnBookingActualExpenses: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    actionIfAnnualExceeded: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        readonly STOP: "STOP";
        readonly WARN: "WARN";
        readonly IGNORE: "IGNORE";
    }>>>;
    actionIfAccumulatedMonthlyExceeded: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        readonly STOP: "STOP";
        readonly WARN: "WARN";
        readonly IGNORE: "IGNORE";
    }>>>;
    accounts: z.ZodArray<z.ZodObject<{
        accountId: z.ZodString;
        budgetAmount: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateBudgetFormInput = z.infer<typeof createBudgetSchema>;
export type CreateBudgetInput = Pick<Prisma.BudgetUncheckedCreateInput, "clinicId" | "fiscalYear" | "budgetAgainst" | "costCenterId" | "project" | "monthlyDistributionId" | "applicableOnBookingActualExpenses" | "actionIfAnnualExceeded" | "actionIfAccumulatedMonthlyExceeded" | "createdById"> & {
    accounts: {
        accountId: string;
        budgetAmount: string;
    }[];
};
