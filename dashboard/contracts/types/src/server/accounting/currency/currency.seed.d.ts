type CurrencySeed = {
    code: string;
    name: string;
    nameAr: string;
    symbol: string;
    fractionUnits: number;
    smallestUnit: string;
    /** [P0.6] smallest-unit name for in_words (NFR-6) */
    fractionNameEn: string;
    fractionNameAr: string;
};
/**
 * [P0.1] Seed currencies (BRD §4.7). Global reference data; `fractionUnits` drives
 * currency-boundary rounding (note JOD/KWD-style 3-decimal currencies). Idempotent.
 */
export declare const SEED_CURRENCIES: CurrencySeed[];
export declare function seedCurrencies(): Promise<void>;
export {};
