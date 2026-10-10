/**
 * [P12.3] BR-8.2 — the tax-withholding (TDS/TCS) computation, pure.
 *
 * WHY THIS IS HARDER THAN "MULTIPLY BY A RATE". Withholding is threshold arithmetic, and every
 * one of the four knobs changes the answer for the same invoice:
 *
 *   · **single threshold** — this transaction alone must exceed it, or nothing is withheld;
 *   · **cumulative threshold** — the fiscal year's qualifying transactions TOGETHER must
 *     exceed it, which means an invoice can trigger withholding on the strength of invoices
 *     that came before it and were themselves untaxed;
 *   · **`taxOnExcessAmount`** — when set, only the amount ABOVE the threshold is taxed, not
 *     the whole invoice. Getting this backwards over-withholds by the threshold × rate on
 *     every first qualifying invoice, and suppliers notice;
 *   · **basis Gross vs Net** — Gross includes taxes already on the document, Net does not.
 *
 * The cumulative case has a consequence worth stating: the invoice that CROSSES the threshold
 * is charged on the whole accumulated base, not just its own share, because the earlier
 * invoices were under-withheld. That is the rule, it surprises people, and it is why the
 * previous total is an input here rather than something inferred at the call site.
 */
export type WithholdingBasis = "GROSS" | "NET";
export type WithholdingRate = {
    fromDate: Date;
    toDate: Date;
    rate: number;
    singleThreshold: number;
    cumulativeThreshold: number;
};
export type WithholdingCategoryConfig = {
    basis: WithholdingBasis;
    /** tax only the amount above the threshold rather than the full base */
    taxOnExcessAmount: boolean;
    roundOffTaxAmount: boolean;
    disableSingleThreshold: boolean;
    disableCumulativeThreshold: boolean;
    rates: WithholdingRate[];
};
export type WithholdingInput = {
    config: WithholdingCategoryConfig;
    postingDate: Date;
    /** this document's base before withholding — net or gross per the category's basis */
    netTotal: number;
    grossTotal: number;
    /** qualifying base already booked against this party this fiscal year, excluding this doc */
    previousTotal: number;
};
export type WithholdingResult = {
    applies: boolean;
    rate: number;
    /** the amount the rate was applied to — useful in the certificate and the report */
    taxableAmount: number;
    taxAmount: number;
    reason: "no-rate" | "below-single" | "below-cumulative" | "applied";
};
/** the rate row whose window contains the posting date; windows are not allowed to overlap */
export declare function rateFor(rates: WithholdingRate[], postingDate: Date): WithholdingRate | null;
export declare function computeWithholding(input: WithholdingInput): WithholdingResult;
