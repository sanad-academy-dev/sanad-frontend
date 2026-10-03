import Elysia from "elysia";
export declare const discountsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "discounts.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            couponCode: import("@sinclair/typebox").TString;
            type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PERCENTAGE">, import("@sinclair/typebox").TLiteral<"FIXED">]>;
            value: import("@sinclair/typebox").TNumber;
            validFrom: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            validTo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            usageLimit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            perCustomerLimit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            customerType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ALL">, import("@sinclair/typebox").TLiteral<"VIP">, import("@sinclair/typebox").TLiteral<"LOYALTY">, import("@sinclair/typebox").TLiteral<"NEW">, import("@sinclair/typebox").TLiteral<"CURRENT">]>>;
            serviceIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "discounts.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            couponCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PERCENTAGE">, import("@sinclair/typebox").TLiteral<"FIXED">]>>;
            value: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            validFrom: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            validTo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            usageLimit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            perCustomerLimit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            customerType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ALL">, import("@sinclair/typebox").TLiteral<"VIP">, import("@sinclair/typebox").TLiteral<"LOYALTY">, import("@sinclair/typebox").TLiteral<"NEW">, import("@sinclair/typebox").TLiteral<"CURRENT">]>>;
            serviceIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "discounts.setStatus": import("@sinclair/typebox").TObject<{
            status: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ACTIVE">, import("@sinclair/typebox").TLiteral<"INACTIVE">, import("@sinclair/typebox").TLiteral<"EXPIRED">, import("@sinclair/typebox").TLiteral<"SCHEDULED">]>;
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
