/**
 * [P1.4] Pure Fiscal Year rules (BRD §4.2) — no DB imports, unit-testable.
 */
export type DateRange = {
    start: Date;
    end: Date;
};
/** Two closed date ranges overlap iff each starts on or before the other ends. */
export declare function rangesOverlap(a: DateRange, b: DateRange): boolean;
/** BR-4.2: end ≥ start, and span ≤ 12 months unless it's an explicit short year. */
export declare function assertValidSpan(start: Date, end: Date, isShortYear: boolean): void;
/** Compute the fiscal year that follows `latest` (dates shifted +1 year). */
export declare function nextFiscalYear(latest: {
    yearStartDate: Date;
    yearEndDate: Date;
}): {
    year: string;
    yearStartDate: Date;
    yearEndDate: Date;
};
