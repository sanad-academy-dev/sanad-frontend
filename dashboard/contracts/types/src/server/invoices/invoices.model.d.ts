import type { TLiteral } from "@sinclair/typebox";
import Elysia from "elysia";
export declare const invoicesModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "invoices.pay": import("@sinclair/typebox").TObject<{
            paymentMethod: import("@sinclair/typebox").TUnion<[TLiteral<"CASH">, TLiteral<"CARD">, TLiteral<"TRANSFER">]>;
            amountPaid: import("@sinclair/typebox").TNumber;
            scope: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[TLiteral<"CONSULTATION">, TLiteral<"SERVICES">, TLiteral<"PRODUCTS">, TLiteral<"ALL">]>>;
            insurance: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                apply: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                excludedLineRefs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            }>>;
            redeemPoints: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>;
        readonly "invoices.insurancePreview": import("@sinclair/typebox").TObject<{
            excludedLineRefs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>;
        readonly "invoices.refund": import("@sinclair/typebox").TObject<{
            reason: import("@sinclair/typebox").TString;
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
