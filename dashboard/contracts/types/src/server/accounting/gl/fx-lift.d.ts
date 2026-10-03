import type { GlMapRow } from "@/server/accounting/gl/gl-map";
export type FxLiftParams = {
    /** document → base rate (§4.7 resolution already done by the caller) */
    conversionRate: string;
    transactionCurrencyCode: string;
    baseCurrencyCode: string;
    /** resolved `accountCurrencyCode` for every account the map touches */
    accountCurrencyById: Map<string, string>;
};
export declare function liftGlMapToBase(rows: GlMapRow[], params: FxLiftParams): GlMapRow[];
