import { type CreateCurrencyExchangeInput, type ResolvedRate, type ResolveRateParams } from "@/server/accounting/currency-exchange/currency-exchange.type";
export declare function createCurrencyExchange(input: CreateCurrencyExchangeInput): Promise<{
    date: Date;
    id: string;
    clinicId: string;
    createdAt: Date;
    updatedAt: Date;
    exchangeRate: import("@prisma/client-runtime-utils").Decimal;
    fromCurrencyCode: string;
    toCurrencyCode: string;
    forBuying: boolean;
    forSelling: boolean;
}>;
export declare function deleteCurrencyExchange(clinicId: string, id: string): Promise<void>;
/**
 * [P8.5] §4.7 third step — the pluggable provider, gated by the `rate_provider` setting
 * ("None" keeps the pre-P8 behavior: the provider never answers). frankfurter.dev is the
 * dossier's reference provider: GET /v1/{date}?base={from}&symbols={to} → {rates:{TO:n}}.
 * Failures return null — §4.7 then errors loudly rather than inventing a number.
 */
export declare function fetchProviderRate(params: {
    clinicId: string;
    fromCurrencyCode: string;
    toCurrencyCode: string;
    date: Date;
}): Promise<string | null>;
/** §4.7 resolution order: manual → stored (side-aware, stale-guarded) → provider → error. */
export declare function resolveExchangeRate(params: ResolveRateParams): Promise<ResolvedRate>;
/**
 * [P8.5] §4.7 submit-time freshness re-check: a document saved days ago may reach submit
 * after its pair's stored rates fell outside the stale window. Manual doc rates are never
 * blocked (§4.7 "manual wins") — this guards only the STORED-table freshness, and only
 * when the pair has stored rates at all.
 */
export declare function assertPairRateFresh(clinicId: string, fromCurrencyCode: string, toCurrencyCode: string, date: Date): Promise<void>;
