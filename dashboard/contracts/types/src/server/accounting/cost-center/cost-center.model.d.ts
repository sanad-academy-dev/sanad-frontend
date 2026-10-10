import Elysia from "elysia";
export declare const costCenterModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "accounting-cost-center.create": import("@sinclair/typebox").TObject<{
            costCenterName: import("@sinclair/typebox").TString;
            costCenterNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            parentCostCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            isGroup: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-cost-center.update": import("@sinclair/typebox").TObject<{
            costCenterName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            costCenterNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            isGroup: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-cost-center.move": import("@sinclair/typebox").TObject<{
            parentCostCenterId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>;
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
