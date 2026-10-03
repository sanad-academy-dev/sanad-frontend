import type { Prisma } from "@/generated/prisma/client";
/**
 * [P10.3] FR-13.2 — Budget Variance: per submitted budget row, 12 monthly columns of
 * budget vs actual vs variance. Monthly budget = distribution% (equal twelfths without a
 * distribution); actual = GL net debit on the account within the budget's target subtree
 * for that month (PCV closing rows excluded — same rule as enforcement).
 */
type Tx = Prisma.TransactionClient;
export type BudgetVarianceRow = {
    budgetId: string;
    costCenterId: string | null;
    costCenterName: string | null;
    project: string | null;
    accountId: string;
    accountName: string;
    budgetAmount: string;
    /** index 0..11 = months 1..12 */
    monthlyBudget: string[];
    monthlyActual: string[];
    monthlyVariance: string[];
    totalActual: string;
    totalVariance: string;
};
export type BudgetVarianceReport = {
    fiscalYear: string;
    rows: BudgetVarianceRow[];
};
export declare function budgetVarianceReport(params: {
    clinicId: string;
    fiscalYear: string;
    tx?: Tx;
}): Promise<BudgetVarianceReport>;
export {};
