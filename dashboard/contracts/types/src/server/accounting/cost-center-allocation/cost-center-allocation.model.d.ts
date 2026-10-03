import Elysia from "elysia";
export declare const costCenterAllocationModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "accounting-cost-center-allocation.list": import("@sinclair/typebox").TObject<{
            docstatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"SUBMITTED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "accounting-cost-center-allocation.create": import("@sinclair/typebox").TObject<{
            mainCostCenterId: import("@sinclair/typebox").TString;
            validFrom: import("@sinclair/typebox").TString;
            rows: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                costCenterId: import("@sinclair/typebox").TString;
                percentage: import("@sinclair/typebox").TString;
            }>>;
        }>;
        readonly "accounting-cost-center-allocation.update": import("@sinclair/typebox").TObject<{
            mainCostCenterId: import("@sinclair/typebox").TString;
            validFrom: import("@sinclair/typebox").TString;
            rows: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                costCenterId: import("@sinclair/typebox").TString;
                percentage: import("@sinclair/typebox").TString;
            }>>;
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
