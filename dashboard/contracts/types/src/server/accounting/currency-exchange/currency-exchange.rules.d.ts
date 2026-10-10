/**
 * [P1.8] Pure exchange-rate resolution rules (BRD §4.7) — no DB imports, unit-testable.
 *
 * The document-level resolution order (manual → stored → provider → error) is orchestrated in
 * the service (it needs the DB + per-clinic stale settings); the pure pieces here are the two
 * decisions that carry the business logic: which stored rate applies, and whether it is stale.
 */
/** A stored Currency Exchange row, reduced to what rate selection needs. */
export type StoredRate = {
    date: Date;
    exchangeRate: string;
    forBuying: boolean;
    forSelling: boolean;
};
/** Purchase side reads the buying rate; sales side reads the selling rate (§4.7). */
export type RateSide = "buying" | "selling";
/**
 * The applicable stored rate for a date: the latest entry on/before `onOrBefore`, preferring
 * one whose side flag matches the requested side, falling back to any entry for the pair.
 * Returns null when no entry is on/before the date.
 */
export declare function pickStoredRate(rates: readonly StoredRate[], onOrBefore: Date, side: RateSide): StoredRate | null;
/** Whole-day age of a rate against the as-of date. */
export declare function rateAgeInDays(rateDate: Date, asOf: Date): number;
/** A rate is stale when it is older than `staleDays` full days. */
export declare function isStale(rateDate: Date, asOf: Date, staleDays: number): boolean;
/**
 * BR §4.7 stale guard: when stale rates are not allowed and the resolved rate is older than
 * the configured window, block the transaction (Arabic client-facing error).
 */
export declare function assertNotStale(rateDate: Date, asOf: Date, allowStale: boolean, staleDays: number): void;
