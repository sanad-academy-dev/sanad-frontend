import Elysia from "elysia";
export declare const voucherDemoModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "accounting-voucher-demo.list": import("@sinclair/typebox").TObject<{
            docstatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"SUBMITTED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "accounting-voucher-demo.create": import("@sinclair/typebox").TObject<{
            title: import("@sinclair/typebox").TString;
            amount: import("@sinclair/typebox").TString;
            postingDate: import("@sinclair/typebox").TString;
        }>;
        readonly "accounting-voucher-demo.update": import("@sinclair/typebox").TObject<{
            title: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            amount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
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
