import Elysia from "elysia";
export declare const compensatoryModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "compensatory.create": import("@sinclair/typebox").TObject<{
            staffId: import("@sinclair/typebox").TString;
            minutes: import("@sinclair/typebox").TInteger;
            source: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"shift_extension">, import("@sinclair/typebox").TLiteral<"leave">, import("@sinclair/typebox").TLiteral<"manual">]>;
            reason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            date: import("@sinclair/typebox").TString;
        }>;
        readonly "compensatory.balanceQuery": import("@sinclair/typebox").TObject<{
            staffId: import("@sinclair/typebox").TString;
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
