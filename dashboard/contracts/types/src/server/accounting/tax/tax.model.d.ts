import Elysia from "elysia";
export declare const taxModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "accounting-tax-template.create": import("@sinclair/typebox").TObject<{
            title: import("@sinclair/typebox").TString;
            isDefault: import("@sinclair/typebox").TBoolean;
            disabled: import("@sinclair/typebox").TBoolean;
            taxCategoryId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            taxes: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                chargeType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ACTUAL">, import("@sinclair/typebox").TLiteral<"ON_NET_TOTAL">, import("@sinclair/typebox").TLiteral<"ON_PREVIOUS_ROW_AMOUNT">, import("@sinclair/typebox").TLiteral<"ON_PREVIOUS_ROW_TOTAL">, import("@sinclair/typebox").TLiteral<"ON_ITEM_QUANTITY">]>;
                accountHeadId: import("@sinclair/typebox").TString;
                rate: import("@sinclair/typebox").TString;
                taxAmount: import("@sinclair/typebox").TString;
                rowId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
                description: import("@sinclair/typebox").TString;
                includedInPrintRate: import("@sinclair/typebox").TBoolean;
                costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"TOTAL">, import("@sinclair/typebox").TLiteral<"VALUATION">, import("@sinclair/typebox").TLiteral<"VALUATION_AND_TOTAL">]>>;
                addDeductTax: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ADD">, import("@sinclair/typebox").TLiteral<"DEDUCT">]>>;
            }>>;
        }>;
        readonly "accounting-item-tax-template.create": import("@sinclair/typebox").TObject<{
            title: import("@sinclair/typebox").TString;
            disabled: import("@sinclair/typebox").TBoolean;
            rows: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                taxTypeAccountId: import("@sinclair/typebox").TString;
                taxRate: import("@sinclair/typebox").TString;
            }>>;
        }>;
        readonly "accounting-tax-category.create": import("@sinclair/typebox").TObject<{
            title: import("@sinclair/typebox").TString;
            disabled: import("@sinclair/typebox").TBoolean;
        }>;
        readonly "accounting-tax-rule.create": import("@sinclair/typebox").TObject<{
            taxType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SALES">, import("@sinclair/typebox").TLiteral<"PURCHASE">]>;
            salesTaxTemplateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            purchaseTaxTemplateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            partyType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            partyId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            itemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            itemCategory: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            taxCategoryId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            fromDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            toDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            priority: import("@sinclair/typebox").TInteger;
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
