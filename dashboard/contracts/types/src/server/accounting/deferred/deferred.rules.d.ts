/**
 * [P12.2] §15 — the recognition arithmetic, pure and therefore testable without a database.
 *
 * WHAT MAKES THIS SUBTLE. A deferred amount is spread over a service period, but the job runs
 * per accounting period, and the two rarely align: a service running 15 Jan → 14 Apr is
 * recognised in three calendar months of unequal length, and the LAST period must absorb the
 * rounding remainder or the deferred account never empties. That trailing fraction is the
 * whole reason this is arithmetic worth isolating and pinning.
 *
 * `book_deferred_entries_based_on` (§19) chooses Days or Months:
 *   · Days   — amount × days-in-period ÷ total-days. Precise, and what an auditor expects.
 *   · Months — amount ÷ number-of-months, evenly. What most operators actually want on a
 *              12-month subscription, because 12 equal lines read as a subscription should.
 *
 * A `serviceStopDate` HALTS future recognition; it never claws back what was already booked
 * (BRD §15). Stopping a service is a forward-looking decision, and reversing recognised
 * revenue would be a credit note, not a schedule change.
 */
export type DeferredBasis = "Days" | "Months";
/** UTC-midnight day count, inclusive of both ends — the way a service period is read. */
export declare const inclusiveDays: (from: Date, to: Date) => number;
/** whole months touched by [from..to], counting a partial month as one (the Months basis) */
export declare const monthsSpanned: (from: Date, to: Date) => number;
export type DeferredLine = {
    /** the full amount sitting in the deferred account */
    amount: number;
    serviceStartDate: Date;
    serviceEndDate: Date;
    /** recognition stops here; null = runs to serviceEndDate */
    serviceStopDate?: Date | null;
};
export type RecognitionInput = {
    line: DeferredLine;
    periodStartDate: Date;
    periodEndDate: Date;
    /** what earlier runs already recognised for this line */
    alreadyBooked: number;
    basis: DeferredBasis;
};
/**
 * Amount to recognise for ONE line in ONE period. Returns 0 when the period does not overlap
 * the (possibly stopped) service window — the caller writes no schedule row for a zero.
 */
export declare function recognizedAmount(input: RecognitionInput): number;
