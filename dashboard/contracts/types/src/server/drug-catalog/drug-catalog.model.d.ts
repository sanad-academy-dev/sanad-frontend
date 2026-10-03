import Elysia from "elysia";
export declare const drugCatalogModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "drug-catalog.search": import("@sinclair/typebox").TObject<{
            q: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            standardId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            species: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DOG">, import("@sinclair/typebox").TLiteral<"CAT">, import("@sinclair/typebox").TLiteral<"HORSE">, import("@sinclair/typebox").TLiteral<"CATTLE">, import("@sinclair/typebox").TLiteral<"SHEEP">, import("@sinclair/typebox").TLiteral<"GOAT">, import("@sinclair/typebox").TLiteral<"CAMEL">, import("@sinclair/typebox").TLiteral<"POULTRY">, import("@sinclair/typebox").TLiteral<"RABBIT">, import("@sinclair/typebox").TLiteral<"SWINE">, import("@sinclair/typebox").TLiteral<"FISH">, import("@sinclair/typebox").TLiteral<"BEE">]>>;
            dosageForm: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            therapeuticClass: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            includeSuspended: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            page: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            pageSize: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "drug-catalog.toggleStandard": import("@sinclair/typebox").TObject<{
            enabled: import("@sinclair/typebox").TBoolean;
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
