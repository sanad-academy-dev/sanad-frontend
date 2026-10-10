import Elysia from "elysia";
/** [P10.3] Budget request validation (§13). */
export declare const budgetModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "budget.create": import("@sinclair/typebox").TObject<{
            fiscalYear: import("@sinclair/typebox").TString;
            budgetAgainst: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"COST_CENTER">, import("@sinclair/typebox").TLiteral<"PROJECT">]>>;
            costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            project: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            monthlyDistributionId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            applicableOnBookingActualExpenses: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            actionIfAnnualExceeded: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"STOP">, import("@sinclair/typebox").TLiteral<"WARN">, import("@sinclair/typebox").TLiteral<"IGNORE">]>>;
            actionIfAccumulatedMonthlyExceeded: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"STOP">, import("@sinclair/typebox").TLiteral<"WARN">, import("@sinclair/typebox").TLiteral<"IGNORE">]>>;
            accounts: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                accountId: import("@sinclair/typebox").TString;
                budgetAmount: import("@sinclair/typebox").TString;
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
