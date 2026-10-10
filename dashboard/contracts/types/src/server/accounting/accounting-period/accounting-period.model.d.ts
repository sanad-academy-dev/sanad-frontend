import Elysia from "elysia";
/** [P10.1] Accounting Period request validation (FR-12.2). */
export declare const accountingPeriodModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "accounting-period.create": import("@sinclair/typebox").TObject<{
            periodName: import("@sinclair/typebox").TString;
            startDate: import("@sinclair/typebox").TString;
            endDate: import("@sinclair/typebox").TString;
            closedDocumentTypes: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
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
