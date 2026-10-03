import Elysia from "elysia";
export declare const fiscalYearModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "accounting-fiscal-year.create": import("@sinclair/typebox").TObject<{
            year: import("@sinclair/typebox").TString;
            yearStartDate: import("@sinclair/typebox").TString;
            yearEndDate: import("@sinclair/typebox").TString;
            isShortYear: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-fiscal-year.update": import("@sinclair/typebox").TObject<{
            year: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            yearStartDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            yearEndDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            isShortYear: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-fiscal-year.resolve": import("@sinclair/typebox").TObject<{
            date: import("@sinclair/typebox").TString;
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
