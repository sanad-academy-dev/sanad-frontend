/**
 * [P4.1] Pure §4.11 tax-master rules — no DB imports.
 *
 * 1. Template-row validation (the §8 step-2 shape checks, applied at SAVE time so a bad
 *    template can never reach the calculator): charge type constraints, row_id presence
 *    and back-reference, inclusive-flag restrictions.
 * 2. The Tax Rule best-match resolver: filter rules that match the context (null filter =
 *    wildcard), then pick by MOST SPECIFIC (count of concrete matched filters) and then
 *    HIGHEST priority — verified §4.11 semantics.
 */
export type TaxRuleRowShape = {
    chargeType: string;
    rowId?: number | null;
    includedInPrintRate?: boolean;
    rate: string;
    taxAmount: string;
    description: string;
};
/** §8 step 2 — validate an ordered template row list (idx is 1-based position). */
export declare function assertValidTaxRows(rows: TaxRuleRowShape[]): void;
export type TaxRuleCandidate = {
    id: string;
    partyType?: string | null;
    partyId?: string | null;
    itemId?: string | null;
    itemCategory?: string | null;
    taxCategoryId?: string | null;
    fromDate?: Date | null;
    toDate?: Date | null;
    priority: number;
};
export type TaxRuleContext = {
    partyType?: string | null;
    partyId?: string | null;
    itemId?: string | null;
    itemCategory?: string | null;
    taxCategoryId?: string | null;
    date: Date;
};
/** §4.11 — most-specific-then-highest-priority wins; null when nothing matches. */
export declare function resolveBestTaxRule<T extends TaxRuleCandidate>(rules: T[], ctx: TaxRuleContext): T | null;
