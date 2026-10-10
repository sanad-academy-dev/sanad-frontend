import Elysia from "elysia";
export declare const crmMastersModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "crmMasters.flat.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "crmMasters.flat.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "crmMasters.leadStatus.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            color: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"chart-1">, import("@sinclair/typebox").TLiteral<"chart-2">, import("@sinclair/typebox").TLiteral<"chart-3">, import("@sinclair/typebox").TLiteral<"chart-4">, import("@sinclair/typebox").TLiteral<"chart-5">, import("@sinclair/typebox").TLiteral<"chart-6">, import("@sinclair/typebox").TLiteral<"chart-7">, import("@sinclair/typebox").TLiteral<"chart-8">]>;
            order: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"OPEN">, import("@sinclair/typebox").TLiteral<"CONVERTED">, import("@sinclair/typebox").TLiteral<"LOST">]>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "crmMasters.leadStatus.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            color: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"chart-1">, import("@sinclair/typebox").TLiteral<"chart-2">, import("@sinclair/typebox").TLiteral<"chart-3">, import("@sinclair/typebox").TLiteral<"chart-4">, import("@sinclair/typebox").TLiteral<"chart-5">, import("@sinclair/typebox").TLiteral<"chart-6">, import("@sinclair/typebox").TLiteral<"chart-7">, import("@sinclair/typebox").TLiteral<"chart-8">]>>;
            order: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            kind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"OPEN">, import("@sinclair/typebox").TLiteral<"CONVERTED">, import("@sinclair/typebox").TLiteral<"LOST">]>>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "crmMasters.dealStatus.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            color: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"chart-1">, import("@sinclair/typebox").TLiteral<"chart-2">, import("@sinclair/typebox").TLiteral<"chart-3">, import("@sinclair/typebox").TLiteral<"chart-4">, import("@sinclair/typebox").TLiteral<"chart-5">, import("@sinclair/typebox").TLiteral<"chart-6">, import("@sinclair/typebox").TLiteral<"chart-7">, import("@sinclair/typebox").TLiteral<"chart-8">]>;
            order: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"OPEN">, import("@sinclair/typebox").TLiteral<"WON">, import("@sinclair/typebox").TLiteral<"LOST">]>;
            defaultProbability: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "crmMasters.dealStatus.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            color: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"chart-1">, import("@sinclair/typebox").TLiteral<"chart-2">, import("@sinclair/typebox").TLiteral<"chart-3">, import("@sinclair/typebox").TLiteral<"chart-4">, import("@sinclair/typebox").TLiteral<"chart-5">, import("@sinclair/typebox").TLiteral<"chart-6">, import("@sinclair/typebox").TLiteral<"chart-7">, import("@sinclair/typebox").TLiteral<"chart-8">]>>;
            order: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            kind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"OPEN">, import("@sinclair/typebox").TLiteral<"WON">, import("@sinclair/typebox").TLiteral<"LOST">]>>;
            defaultProbability: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "crmMasters.list.query": import("@sinclair/typebox").TObject<{
            includeInactive: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
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
