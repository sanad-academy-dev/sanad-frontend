import Elysia from "elysia";
export declare const eosModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "eos.create": import("@sinclair/typebox").TObject<{
            staffId: import("@sinclair/typebox").TString;
            reason: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"END_OF_CONTRACT">, import("@sinclair/typebox").TLiteral<"EMPLOYER_TERMINATION">, import("@sinclair/typebox").TLiteral<"RESIGNATION">, import("@sinclair/typebox").TLiteral<"SPECIAL">]>;
            monthlyWage: import("@sinclair/typebox").TNumber;
            startDate: import("@sinclair/typebox").TString;
            endDate: import("@sinclair/typebox").TString;
            serviceYears: import("@sinclair/typebox").TInteger;
            serviceMonths: import("@sinclair/typebox").TInteger;
            serviceDays: import("@sinclair/typebox").TInteger;
            firstFiveMonths: import("@sinclair/typebox").TNumber;
            beyondFiveMonths: import("@sinclair/typebox").TNumber;
            fullAward: import("@sinclair/typebox").TNumber;
            factor: import("@sinclair/typebox").TNumber;
            finalAmount: import("@sinclair/typebox").TNumber;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
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
