import Elysia from "elysia";
export declare const adAudiencesModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "ad-audiences.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            ageMin: import("@sinclair/typebox").TInteger;
            ageMax: import("@sinclair/typebox").TInteger;
            locations: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            languages: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            interests: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            isAiSuggested: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            aiRationale: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "ad-audiences.suggest": import("@sinclair/typebox").TObject<{
            objective: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"BRAND_AWARENESS">, import("@sinclair/typebox").TLiteral<"LEAD_GENERATION">, import("@sinclair/typebox").TLiteral<"STORE_VISITS">, import("@sinclair/typebox").TLiteral<"CUSTOMER_FEEDBACK">, import("@sinclair/typebox").TLiteral<"SALES">, import("@sinclair/typebox").TLiteral<"PRODUCT_AWARENESS">]>;
            count: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
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
