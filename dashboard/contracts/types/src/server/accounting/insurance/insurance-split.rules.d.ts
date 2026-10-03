import { type CoverageRowInput } from "@/server/accounting/insurance/patient-coverage.rules";
export type SplitLineInput = {
    lineRef: string;
    label: string;
    serviceId: string | null;
    /** post-membership line amount (pre-tax) — the distribution weight */
    effectiveAmount: string;
};
export type SplitCoverageTerms = {
    coveragePercentDefault: string;
    coverageRows: CoverageRowInput[];
    deductibleFixed: string;
    deductiblePercent: string;
    perClaimCap: string | null;
    annualCap: string | null;
    capConsumed: string;
};
export type SplitLineResult = {
    lineRef: string;
    label: string;
    serviceId: string | null;
    /** the line's slice of the taxed gross, 2dp; slices sum to the invoice total exactly */
    grossShare: string;
    coveragePercent: string;
    /** line gross × % (pre-deductible/caps) — the §9.2 claim-line figure */
    insurerAmount: string;
    /** BR-I9.1.2 — the operator pushed this line to the copay */
    excludedByOperator: boolean;
    /** a 0% coverage row (or 0% default) matched — the policy itself excludes it */
    excludedByPolicy: boolean;
};
export type SplitWorkings = {
    coveredBeforeDeductible: string;
    deductibleFixedApplied: string;
    deductiblePercentApplied: string;
    afterDeductible: string;
    perClaimCapApplied: boolean;
    annualCapApplied: boolean;
    annualCapRemaining: string | null;
};
export type SplitResult = {
    lines: SplitLineResult[];
    workings: SplitWorkings;
    /** 2dp half-up, ≥ 0, ≤ gross */
    insurerShare: string;
    /** gross − insurerShare — what the counter collects */
    copayShare: string;
};
export declare function computeInsuranceSplit(input: {
    lines: SplitLineInput[];
    /** the invoice's final taxed gross (Invoice.total) */
    invoiceTotal: string;
    coverage: SplitCoverageTerms;
    serviceAncestors: Record<string, string[]>;
    excludedLineRefs?: string[];
}): SplitResult;
