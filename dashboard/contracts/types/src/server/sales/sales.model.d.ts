import Elysia from "elysia";
export declare const salesModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "sales.create": import("@sinclair/typebox").TObject<{
            items: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                inventoryItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                name: import("@sinclair/typebox").TString;
                unitPrice: import("@sinclair/typebox").TNumber;
                quantity: import("@sinclair/typebox").TInteger;
            }>>;
            discount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            discountCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            partyId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            paymentMethod: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"CARD">, import("@sinclair/typebox").TLiteral<"TRANSFER">]>>;
            customerName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            customerPhone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            fulfillment: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"AT_PAYMENT">, import("@sinclair/typebox").TLiteral<"ON_DISPENSE">]>>;
            redeemPoints: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>;
        readonly "sales.quote": import("@sinclair/typebox").TObject<{
            items: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                inventoryItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                name: import("@sinclair/typebox").TString;
                unitPrice: import("@sinclair/typebox").TNumber;
                quantity: import("@sinclair/typebox").TInteger;
            }>>;
            discount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            partyId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            redeemPoints: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>;
        readonly "sales.pay": import("@sinclair/typebox").TObject<{
            paymentMethod: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"CARD">, import("@sinclair/typebox").TLiteral<"TRANSFER">]>>;
        }>;
        readonly "sales.refund": import("@sinclair/typebox").TObject<{
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
