/**
 * [P0.1] Pure naming-series helpers — no DB/env imports so they stay unit-testable in
 * isolation. Format: `{PREFIX}-{YYYY}-{#####}` (contract C7).
 */
/** Pure formatter — `("JV", 2026, 1) → "JV-2026-00001"`. Never truncates > 5 digits. */
export declare function formatDocumentNo(prefix: string, year: number, counter: number): string;
/** Calendar year of a posting date (fiscal-year resolution arrives in P1). */
export declare function seriesYearOf(date: Date): number;
export type NextDocumentNoArgs = {
    clinicId: string;
    doctype: string;
    prefix: string;
    year: number;
};
export type NextDocumentNoResult = {
    documentNo: string;
    counter: number;
};
