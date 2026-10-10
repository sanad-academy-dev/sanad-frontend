import Elysia from "elysia";
/** [LY-P4] تحقّق مدخلات تقارير §11. */
export declare const loyaltyReportsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "loyaltyReports.activity.query": import("@sinclair/typebox").TObject<{
            from: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            to: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "loyaltyReports.expiring.query": import("@sinclair/typebox").TObject<{
            days: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
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
