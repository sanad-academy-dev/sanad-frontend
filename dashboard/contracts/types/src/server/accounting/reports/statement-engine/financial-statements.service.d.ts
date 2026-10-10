import type { Prisma } from "@/generated/prisma/client";
import { type Periodicity } from "@/server/accounting/reports/statement-engine/period-list";
import { type StatementRow } from "@/server/accounting/reports/statement-engine/tree-aggregate";
/**
 * [P9.2] §18.1 statements — thin composers over the [P9.1] engine.
 *
 * Balance Sheet: cumulative closing per period (opening folded, then accumulated) with
 * the **provisional-profit line** — cumulative (income − expense) injected beside equity
 * so the sheet balances PRE-PCV (P10.2's closing empties the line; the invariant test
 * pins that the line equals exactly what closing would move). P&L: in-range only,
 * `isOpening` rows excluded, `accumulated_values` optional. Cash Flow: indirect from net
 * profit + BS deltas with the DEFAULT bucket mapping — investing stays an explicit zero
 * line until asset classification exists (logged assumption); the net change ties to the
 * cash/bank delta by double-entry construction. Trial Balance stays on its own tested
 * scan — absorbed by verification, not rewritten (dossier risk 3).
 */
type Tx = Prisma.TransactionClient;
export type StatementRangeInput = {
    clinicId: string;
    fromDate: Date;
    toDate: Date;
    periodicity: Periodicity;
    tx?: Tx;
};
export type StatementSection = {
    rows: StatementRow[];
    /** leaf totals per period, presentation signs */
    totals: string[];
};
export type BalanceSheetReport = {
    periods: {
        key: string;
        label: string;
    }[];
    assets: StatementSection;
    liabilities: StatementSection;
    equity: StatementSection;
    /** cumulative pre-PCV profit per period — the equity-side balancing line */
    provisionalProfit: string[];
    totalLiabilitiesAndEquity: string[];
    /** per period: assets − (liabilities + equity + provisional profit) — MUST be 0 */
    differences: string[];
};
export declare function balanceSheetReport(input: StatementRangeInput): Promise<BalanceSheetReport>;
export type ProfitAndLossReport = {
    periods: {
        key: string;
        label: string;
    }[];
    income: StatementSection;
    expense: StatementSection;
    /** income − expense per period (presentation signs) */
    netProfit: string[];
};
export declare function profitAndLossReport(input: StatementRangeInput & {
    accumulatedValues?: boolean;
}): Promise<ProfitAndLossReport>;
export type CashFlowReport = {
    periods: {
        key: string;
        label: string;
    }[];
    rows: {
        label: string;
        values: string[];
    }[];
    /** per period — MUST equal the cash/bank delta (double-entry identity) */
    netChange: string[];
    openingCash: string[];
    closingCash: string[];
};
export declare function cashFlowReport(input: StatementRangeInput): Promise<CashFlowReport>;
export {};
