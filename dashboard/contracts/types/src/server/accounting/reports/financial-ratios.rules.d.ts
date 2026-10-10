/**
 * [P12.10] FR-18 Financial Ratios — the arithmetic, pure.
 *
 * ONE RULE GOVERNS EVERY RATIO HERE: a zero denominator yields `null`, never Infinity, NaN,
 * or 0. A clinic with no current liabilities has an UNDEFINED current ratio, not an infinite
 * one and certainly not a zero one — and a report that prints «∞» or «0» for it has told the
 * reader something false. `null` renders as «—», which is the truth.
 *
 * Sign convention: every input is a POSITIVE magnitude in base currency. The callers do the
 * §5.1 debit−credit unwinding, because that is where the account's nature is known; this
 * module would have to guess.
 */
export type RatioInputs = {
    currentAssets: number;
    inventory: number;
    currentLiabilities: number;
    totalLiabilities: number;
    totalEquity: number;
    receivables: number;
    payables: number;
    revenue: number;
    costOfGoodsSold: number;
    netProfit: number;
    /** days in the reported period — DSO/DPO are period-scaled, not annual by assumption */
    periodDays: number;
};
export type FinancialRatios = {
    currentRatio: number | null;
    quickRatio: number | null;
    debtToEquity: number | null;
    grossMarginPercent: number | null;
    netMarginPercent: number | null;
    receivableDays: number | null;
    payableDays: number | null;
};
export declare function computeRatios(input: RatioInputs): FinancialRatios;
