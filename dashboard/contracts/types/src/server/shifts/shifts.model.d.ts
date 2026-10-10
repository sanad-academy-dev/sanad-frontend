import Elysia from "elysia";
export declare const shiftsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "shifts.list": import("@sinclair/typebox").TObject<{
            start: import("@sinclair/typebox").TString;
            end: import("@sinclair/typebox").TString;
        }>;
        readonly "shifts.aiSuggest": import("@sinclair/typebox").TObject<{
            days: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            options: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                workdays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TInteger>>;
                perShift: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                    MORNING: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
                    EVENING: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
                    NIGHT: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
                }>>;
                maxDaysPerStaff: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
                notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                replaceExisting: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            }>>;
        }>;
        readonly "shifts.upsert": import("@sinclair/typebox").TObject<{
            staffId: import("@sinclair/typebox").TString;
            date: import("@sinclair/typebox").TString;
            type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MORNING">, import("@sinclair/typebox").TLiteral<"EVENING">, import("@sinclair/typebox").TLiteral<"NIGHT">]>;
            startMinute: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            endMinute: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            hours: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
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
