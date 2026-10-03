import Elysia from "elysia";
export declare const companySettingsController: Elysia<"/accounting/company-settings", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "accounting-company-settings.update": import("@sinclair/typebox").TObject<{
            defaultCurrencyCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            defaultReceivableAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            defaultPayableAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            defaultIncomeAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            defaultExpenseAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            defaultCashAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            defaultBankAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            roundOffAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            roundOffForOpeningAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            writeOffAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            exchangeGainLossAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            unrealizedExchangeGainLossAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            unrealizedProfitLossAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            defaultDiscountAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            defaultDeferredRevenueAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            defaultDeferredExpenseAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            defaultAdvanceReceivedAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            defaultAdvancePaidAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            roundOffCostCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            defaultCostCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            defaultFinanceBookId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            defaultPaymentTermsTemplateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            creditLimit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            bypassCreditLimitCheck: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
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
} & {
    schema: {};
    standaloneSchema: {};
    macro: Partial<{
        readonly requireAccounting: {
            doctype: import("../permissions/accounting-permissions").AccountingDoctypeKey;
            action: import("../permissions/accounting-permissions").AccountingAction;
        };
    }>;
    macroFn: {
        readonly requireAccounting: (options: {
            doctype: import("../permissions/accounting-permissions").AccountingDoctypeKey;
            action: import("../permissions/accounting-permissions").AccountingAction;
        }) => {
            readonly resolve: ({ request }: {
                request: Request;
            }) => Promise<import("elysia").ElysiaCustomStatusResponse<401, {
                readonly message: "غير مصرح";
            }, 401> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
            }, 403> | {
                clinicId: string;
                userId: string;
                actor: import("../permissions/accounting-permissions.guard").AccountingActor;
            }>;
        };
    };
    parser: {};
    response: {};
}, {
    accounting: {
        "company-settings": {};
    };
} & {
    accounting: {
        "company-settings": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        defaultCurrencyCode: string | null;
                        defaultReceivableAccountId: string | null;
                        defaultPayableAccountId: string | null;
                        defaultIncomeAccountId: string | null;
                        defaultExpenseAccountId: string | null;
                        defaultCashAccountId: string | null;
                        defaultBankAccountId: string | null;
                        roundOffAccountId: string | null;
                        roundOffForOpeningAccountId: string | null;
                        writeOffAccountId: string | null;
                        exchangeGainLossAccountId: string | null;
                        unrealizedExchangeGainLossAccountId: string | null;
                        unrealizedProfitLossAccountId: string | null;
                        defaultDiscountAccountId: string | null;
                        defaultDeferredRevenueAccountId: string | null;
                        defaultDeferredExpenseAccountId: string | null;
                        defaultAdvanceReceivedAccountId: string | null;
                        defaultAdvancePaidAccountId: string | null;
                        roundOffCostCenterId: string | null;
                        defaultCostCenterId: string | null;
                        defaultFinanceBookId: string | null;
                        defaultPaymentTermsTemplateId: string | null;
                        creditLimit: import("@prisma/client-runtime-utils").Decimal | null;
                        bypassCreditLimitCheck: boolean;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                    };
                };
            };
        };
    };
} & {
    accounting: {
        "company-settings": {
            patch: {
                body: {
                    defaultCurrencyCode?: string | null | undefined;
                    defaultReceivableAccountId?: string | null | undefined;
                    defaultPayableAccountId?: string | null | undefined;
                    defaultIncomeAccountId?: string | null | undefined;
                    defaultExpenseAccountId?: string | null | undefined;
                    defaultCashAccountId?: string | null | undefined;
                    defaultBankAccountId?: string | null | undefined;
                    roundOffAccountId?: string | null | undefined;
                    roundOffForOpeningAccountId?: string | null | undefined;
                    writeOffAccountId?: string | null | undefined;
                    exchangeGainLossAccountId?: string | null | undefined;
                    unrealizedExchangeGainLossAccountId?: string | null | undefined;
                    unrealizedProfitLossAccountId?: string | null | undefined;
                    defaultDiscountAccountId?: string | null | undefined;
                    defaultDeferredRevenueAccountId?: string | null | undefined;
                    defaultDeferredExpenseAccountId?: string | null | undefined;
                    defaultAdvanceReceivedAccountId?: string | null | undefined;
                    defaultAdvancePaidAccountId?: string | null | undefined;
                    roundOffCostCenterId?: string | null | undefined;
                    defaultCostCenterId?: string | null | undefined;
                    defaultFinanceBookId?: string | null | undefined;
                    defaultPaymentTermsTemplateId?: string | null | undefined;
                    creditLimit?: string | null | undefined;
                    bypassCreditLimitCheck?: boolean | undefined;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        defaultCurrencyCode: string | null;
                        defaultReceivableAccountId: string | null;
                        defaultPayableAccountId: string | null;
                        defaultIncomeAccountId: string | null;
                        defaultExpenseAccountId: string | null;
                        defaultCashAccountId: string | null;
                        defaultBankAccountId: string | null;
                        roundOffAccountId: string | null;
                        roundOffForOpeningAccountId: string | null;
                        writeOffAccountId: string | null;
                        exchangeGainLossAccountId: string | null;
                        unrealizedExchangeGainLossAccountId: string | null;
                        unrealizedProfitLossAccountId: string | null;
                        defaultDiscountAccountId: string | null;
                        defaultDeferredRevenueAccountId: string | null;
                        defaultDeferredExpenseAccountId: string | null;
                        defaultAdvanceReceivedAccountId: string | null;
                        defaultAdvancePaidAccountId: string | null;
                        roundOffCostCenterId: string | null;
                        defaultCostCenterId: string | null;
                        defaultFinanceBookId: string | null;
                        defaultPaymentTermsTemplateId: string | null;
                        creditLimit: import("@prisma/client-runtime-utils").Decimal | null;
                        bypassCreditLimitCheck: boolean;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
}, {
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
} & {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}>;
