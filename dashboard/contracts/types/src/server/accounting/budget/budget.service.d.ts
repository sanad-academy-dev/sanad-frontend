import type { Prisma } from "@/generated/prisma/client";
import { Prisma as PrismaNs } from "@/generated/prisma/client";
import { type BudgetResponse, type CreateBudgetInput } from "@/server/accounting/budget/budget.type";
import { type AccountingActor } from "@/server/accounting/permissions/accounting-permissions.guard";
/**
 * [P10.3] Budgets (BRD §13) — a submittable cap per (fiscal year, cost-center|project,
 * account) with Stop / Warn / Ignore actions, enforced at §6 step 1 through
 * {@link enforceBudgetsFor}. A budget against a GROUP cost center covers its whole
 * subtree (nested-set containment, ERPNext parity). "Booked actual" excludes PCV closing
 * rows — closing transfers would otherwise erase the very spending being capped.
 *
 * The accumulated-monthly check compares spend-to-date (period start → end of the
 * posting month) against Σ distribution% × budget through that month (equal twelfths
 * without a distribution). WARN logs a server-side warning and lets the posting through
 * (no messaging bus in this stack — logged decision); STOP throws (Arabic); IGNORE skips.
 *
 * MR/PO applicability (§13 applicability points) is exposed as
 * {@link checkBudgetForCommitment} for the purchasing module to call with its ordered /
 * requested totals — nothing in the GL path invokes it yet.
 *
 * Lifecycle mirrors the Accounting Period: named documents, direct docstatus
 * transitions, no C7 number (logged convention).
 */
type Tx = Prisma.TransactionClient;
export declare function createBudget(input: CreateBudgetInput): Promise<BudgetResponse>;
export declare function deleteBudget(clinicId: string, id: string): Promise<void>;
export declare function listBudgets(clinicId: string): Promise<BudgetResponse[]>;
export declare function getBudget(clinicId: string, id: string): Promise<BudgetResponse>;
export declare function submitBudget(clinicId: string, id: string, actor: AccountingActor): Promise<BudgetResponse>;
export declare function cancelBudget(clinicId: string, id: string, actor: AccountingActor): Promise<BudgetResponse>;
/** budget allowed through `month` (1-12): Σ distribution% × amount, or equal twelfths */
export declare function accumulatedBudgetThrough(budgetAmount: PrismaNs.Decimal, month: number, percentages: {
    month: number;
    percentage: PrismaNs.Decimal | string;
}[] | null): PrismaNs.Decimal;
/**
 * BR-13.1 — evaluate a voucher's expense rows against submitted budgets. Called by the
 * §6 engine (step 1) with the RAW gl_map working rows; PCV batches never reach it (the
 * engine skips the hook for `period_closing_voucher`).
 */
export declare function enforceBudgetsFor(tx: Tx, params: {
    clinicId: string;
    voucherType: string;
    postingDate: Date;
    /** raw gl_map amounts (strings — C2: converted through Decimal here) */
    rows: {
        accountId: string;
        costCenterId?: string | null;
        debit: string;
        credit: string;
    }[];
}): Promise<void>;
/**
 * §13 applicability points for MATERIAL REQUEST / PURCHASE ORDER — a service seam the
 * purchasing module calls with its committed (ordered/requested) amount before saving.
 * Uses the same caps; `kind` selects the action pair.
 */
export declare function checkBudgetForCommitment(params: {
    clinicId: string;
    kind: "MATERIAL_REQUEST" | "PURCHASE_ORDER";
    accountId: string;
    costCenterId: string | null;
    amount: string;
    date: Date;
}): Promise<void>;
export {};
