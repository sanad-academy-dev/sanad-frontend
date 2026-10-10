import type { ReportBuckets, ReportRange } from "@/server/reports/reports.type";
/** `YYYY-MM-DD` → UTC midnight; anything unparseable returns null. */
export declare function parseIsoDay(value: string | undefined): Date | null;
export declare const toIsoDay: (date: Date) => string;
/**
 * Resolves the requested window. `to` is returned **exclusive** (start of the day after the
 * requested one) so `{ gte: from, lt: to }` includes every row stamped on the last day.
 * Defaults to the trailing 12 months, which is what the report screen opens on.
 */
export declare function resolveRange(from: string | undefined, to: string | undefined, tzOffsetMinutes?: number, now?: Date): ReportRange;
/** Hour of day (0–23) as the viewer's clock would read it. */
export declare const localHourOf: (date: Date, tzOffsetMinutes: number) => number;
/** The inclusive last day of a range, for echoing the window back to the client. */
export declare const rangeEndDay: (range: ReportRange) => Date;
export declare const spanInDays: (range: ReportRange) => number;
/**
 * Splits the range into x-axis slots. Granularity adapts to the span so a one-week window
 * plots days and a two-year window plots months without the caller choosing.
 */
export declare function buildBuckets(range: ReportRange): ReportBuckets;
/**
 * Returns a function mapping a timestamp to its bucket index (`-1` when outside the range).
 * Builders use it to fold thousands of rows into buckets in one pass instead of running one
 * query per slot.
 */
export declare function bucketIndexer(range: ReportRange, { granularity, buckets }: ReportBuckets): (date: Date | null | undefined) => number;
/**
 * Allocates a zeroed `points` array shaped for `ReportSeriesWidget`, ready for a builder to
 * accumulate into.
 */
export declare function emptySeriesPoints(buckets: ReportBuckets["buckets"], seriesKeys: string[]): {
    label: string;
    values: Record<string, number>;
}[];
