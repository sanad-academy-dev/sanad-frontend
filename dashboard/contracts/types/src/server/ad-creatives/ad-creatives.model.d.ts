import Elysia from "elysia";
export declare const adCreativesModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "ad-creatives.generate-copy": import("@sinclair/typebox").TObject<{
            objective: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"BRAND_AWARENESS">, import("@sinclair/typebox").TLiteral<"LEAD_GENERATION">, import("@sinclair/typebox").TLiteral<"STORE_VISITS">, import("@sinclair/typebox").TLiteral<"CUSTOMER_FEEDBACK">, import("@sinclair/typebox").TLiteral<"SALES">, import("@sinclair/typebox").TLiteral<"PRODUCT_AWARENESS">]>;
            platform: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"FACEBOOK">, import("@sinclair/typebox").TLiteral<"INSTAGRAM">]>;
            brief: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            seedText: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            toneFormal: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            toneFriendly: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            toneOptimist: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            count: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>;
        readonly "ad-creatives.generate-image": import("@sinclair/typebox").TObject<{
            prompt: import("@sinclair/typebox").TString;
            style: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "ad-creatives.templates": import("@sinclair/typebox").TObject<{
            category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SEO">, import("@sinclair/typebox").TLiteral<"PAID_ADS">, import("@sinclair/typebox").TLiteral<"SALES">, import("@sinclair/typebox").TLiteral<"SOCIAL">, import("@sinclair/typebox").TLiteral<"EMAIL">]>>;
            search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
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
