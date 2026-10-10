import Elysia from "elysia";
/** [P10.2] Period Closing Voucher request validation (FR-12.3). */
export declare const periodClosingModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "period-closing.create": import("@sinclair/typebox").TObject<{
            periodStartDate: import("@sinclair/typebox").TString;
            periodEndDate: import("@sinclair/typebox").TString;
            closingAccountHeadId: import("@sinclair/typebox").TString;
            remarks: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            granularByDimensions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
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
