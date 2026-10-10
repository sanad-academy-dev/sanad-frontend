import Elysia from "elysia";
export declare const currencyExchangeModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "accounting-currency-exchange.list": import("@sinclair/typebox").TObject<{
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "accounting-currency-exchange.create": import("@sinclair/typebox").TObject<{
            date: import("@sinclair/typebox").TString;
            fromCurrencyCode: import("@sinclair/typebox").TString;
            toCurrencyCode: import("@sinclair/typebox").TString;
            exchangeRate: import("@sinclair/typebox").TString;
            forBuying: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            forSelling: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-currency-exchange.resolve": import("@sinclair/typebox").TObject<{
            fromCurrencyCode: import("@sinclair/typebox").TString;
            toCurrencyCode: import("@sinclair/typebox").TString;
            date: import("@sinclair/typebox").TString;
            side: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"buying">, import("@sinclair/typebox").TLiteral<"selling">]>;
        }>;
    };
    error: {};
}, {
    schema: {};
    standaloneSchema: {};
    macro: {};
    macroFn: {};
    parser: {};
    response: {};
}, {}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}>;
