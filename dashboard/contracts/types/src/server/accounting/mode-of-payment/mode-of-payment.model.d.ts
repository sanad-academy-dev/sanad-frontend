import Elysia from "elysia";
export declare const modeOfPaymentModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "accounting-mode-of-payment.list": import("@sinclair/typebox").TObject<{
            includeDisabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-mode-of-payment.create": import("@sinclair/typebox").TObject<{
            modeOfPaymentName: import("@sinclair/typebox").TString;
            type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"BANK">, import("@sinclair/typebox").TLiteral<"GENERAL">, import("@sinclair/typebox").TLiteral<"PHONE">]>>;
            enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            defaultAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "accounting-mode-of-payment.update": import("@sinclair/typebox").TObject<{
            modeOfPaymentName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"BANK">, import("@sinclair/typebox").TLiteral<"GENERAL">, import("@sinclair/typebox").TLiteral<"PHONE">]>>;
            enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            defaultAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
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
