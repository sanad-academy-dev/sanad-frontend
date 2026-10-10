/**
 * [P9.1] §18.1 — the period-list builder. PURE module (no DB/env imports): the golden-
 * fixture discipline applies. Periods align to CALENDAR month boundaries starting at the
 * range's first month (financial ranges come from a fiscal year, so FY-aware labeling
 * falls out of the range itself); each period spans 1/3/6/12 months by periodicity and
 * the last period clips at `toDate`. All dates are UTC-midnight `@db.Date` semantics.
 */
export type Periodicity = "Monthly" | "Quarterly" | "Half-Yearly" | "Yearly";
export type StatementPeriod = {
    /** stable key, `YYYY-MM` of the period's LAST month (unique within a range) */
    key: string;
    /** short Arabic label, e.g. «01/2026» · «ر1 2026» · «ن1 2026» · «2026» */
    label: string;
    fromDate: Date;
    toDate: Date;
};
export declare const PERIOD_MONTHS: Record<Periodicity, number>;
export declare function buildPeriodList(params: {
    fromDate: Date;
    toDate: Date;
    periodicity: Periodicity;
}): StatementPeriod[];
/** locate a posting date's period index (dates before the range → −1, after → length) */
export declare function periodIndexOf(periods: StatementPeriod[], date: Date): number;
