import Elysia from "elysia";
export declare const accountModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "accounting-account.create": import("@sinclair/typebox").TObject<{
            accountName: import("@sinclair/typebox").TString;
            accountNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            parentAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            isGroup: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            rootType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ASSET">, import("@sinclair/typebox").TLiteral<"LIABILITY">, import("@sinclair/typebox").TLiteral<"INCOME">, import("@sinclair/typebox").TLiteral<"EXPENSE">, import("@sinclair/typebox").TLiteral<"EQUITY">]>;
            accountType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"BANK">, import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"RECEIVABLE">, import("@sinclair/typebox").TLiteral<"PAYABLE">, import("@sinclair/typebox").TLiteral<"TAX">, import("@sinclair/typebox").TLiteral<"STOCK">, import("@sinclair/typebox").TLiteral<"FIXED_ASSET">, import("@sinclair/typebox").TLiteral<"ACCUMULATED_DEPRECIATION">, import("@sinclair/typebox").TLiteral<"DEPRECIATION">, import("@sinclair/typebox").TLiteral<"EXPENSE_ACCOUNT">, import("@sinclair/typebox").TLiteral<"INCOME_ACCOUNT">, import("@sinclair/typebox").TLiteral<"CHARGEABLE">, import("@sinclair/typebox").TLiteral<"ROUND_OFF">, import("@sinclair/typebox").TLiteral<"ROUND_OFF_FOR_OPENING">, import("@sinclair/typebox").TLiteral<"TEMPORARY">, import("@sinclair/typebox").TLiteral<"EQUITY">, import("@sinclair/typebox").TLiteral<"DIRECT_INCOME">, import("@sinclair/typebox").TLiteral<"INDIRECT_INCOME">, import("@sinclair/typebox").TLiteral<"DIRECT_EXPENSE">, import("@sinclair/typebox").TLiteral<"INDIRECT_EXPENSE">, import("@sinclair/typebox").TLiteral<"COST_OF_GOODS_SOLD">, import("@sinclair/typebox").TLiteral<"CURRENT_ASSET">, import("@sinclair/typebox").TLiteral<"CURRENT_LIABILITY">, import("@sinclair/typebox").TLiteral<"CAPITAL_WORK_IN_PROGRESS">, import("@sinclair/typebox").TLiteral<"ASSET_RECEIVED_BUT_NOT_BILLED">, import("@sinclair/typebox").TLiteral<"STOCK_RECEIVED_BUT_NOT_BILLED">, import("@sinclair/typebox").TLiteral<"SERVICE_RECEIVED_BUT_NOT_BILLED">, import("@sinclair/typebox").TLiteral<"STOCK_ADJUSTMENT">]>]>>;
            accountCurrencyCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            taxRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            balanceMustBe: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NONE">, import("@sinclair/typebox").TLiteral<"DEBIT">, import("@sinclair/typebox").TLiteral<"CREDIT">]>>;
            freezeAccount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-account.update": import("@sinclair/typebox").TObject<{
            accountName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            accountNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            accountType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"BANK">, import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"RECEIVABLE">, import("@sinclair/typebox").TLiteral<"PAYABLE">, import("@sinclair/typebox").TLiteral<"TAX">, import("@sinclair/typebox").TLiteral<"STOCK">, import("@sinclair/typebox").TLiteral<"FIXED_ASSET">, import("@sinclair/typebox").TLiteral<"ACCUMULATED_DEPRECIATION">, import("@sinclair/typebox").TLiteral<"DEPRECIATION">, import("@sinclair/typebox").TLiteral<"EXPENSE_ACCOUNT">, import("@sinclair/typebox").TLiteral<"INCOME_ACCOUNT">, import("@sinclair/typebox").TLiteral<"CHARGEABLE">, import("@sinclair/typebox").TLiteral<"ROUND_OFF">, import("@sinclair/typebox").TLiteral<"ROUND_OFF_FOR_OPENING">, import("@sinclair/typebox").TLiteral<"TEMPORARY">, import("@sinclair/typebox").TLiteral<"EQUITY">, import("@sinclair/typebox").TLiteral<"DIRECT_INCOME">, import("@sinclair/typebox").TLiteral<"INDIRECT_INCOME">, import("@sinclair/typebox").TLiteral<"DIRECT_EXPENSE">, import("@sinclair/typebox").TLiteral<"INDIRECT_EXPENSE">, import("@sinclair/typebox").TLiteral<"COST_OF_GOODS_SOLD">, import("@sinclair/typebox").TLiteral<"CURRENT_ASSET">, import("@sinclair/typebox").TLiteral<"CURRENT_LIABILITY">, import("@sinclair/typebox").TLiteral<"CAPITAL_WORK_IN_PROGRESS">, import("@sinclair/typebox").TLiteral<"ASSET_RECEIVED_BUT_NOT_BILLED">, import("@sinclair/typebox").TLiteral<"STOCK_RECEIVED_BUT_NOT_BILLED">, import("@sinclair/typebox").TLiteral<"SERVICE_RECEIVED_BUT_NOT_BILLED">, import("@sinclair/typebox").TLiteral<"STOCK_ADJUSTMENT">]>]>>;
            accountCurrencyCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            taxRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            balanceMustBe: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NONE">, import("@sinclair/typebox").TLiteral<"DEBIT">, import("@sinclair/typebox").TLiteral<"CREDIT">]>>;
            freezeAccount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            isGroup: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-account.move": import("@sinclair/typebox").TObject<{
            parentAccountId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>;
        }>;
        readonly "accounting-account.import": import("@sinclair/typebox").TObject<{
            csv: import("@sinclair/typebox").TString;
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
