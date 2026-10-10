/**
 * [P9.3] §18.3 — the ageing bucket engine. PURE module: configurable range edges
 * (default 30/60/90/120), auto labels (`0-30`, `31-60`, …, `121-Above`), and the
 * based-on selector's age computation. Buckets partition [0, ∞): edges are inclusive
 * upper bounds; negative ages (future-dated documents) land in the first bucket.
 */
export type AgeingBasedOn = "Posting" | "Due" | "Bill";
export declare const DEFAULT_AGEING_RANGES: readonly [30, 60, 90, 120];
export declare function bucketLabels(ranges: readonly number[]): string[];
/** which bucket an age (in days) falls into — index into `bucketLabels(ranges)` */
export declare function bucketIndexOf(ageDays: number, ranges: readonly number[]): number;
/** whole-day age of `baseDate` as of `asOf` (UTC-midnight `@db.Date` semantics) */
export declare function ageInDays(baseDate: Date, asOf: Date): number;
export declare function validateRanges(ranges: readonly number[]): void;
