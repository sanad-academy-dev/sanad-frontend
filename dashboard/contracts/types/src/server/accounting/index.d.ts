import Elysia from "elysia";
import "@/server/accounting/currency-exchange/daily-rate-fetch.job";
import "@/server/accounting/period-closing/period-closing.job";
import "@/server/accounting/fiscal-year/fiscal-year-rollover.job";
import "@/server/accounting/subscription/subscription-billing.job";
import "@/server/accounting/membership/membership.job";
import "@/server/accounting/payment-entry/auto-reconcile.job";
import "@/server/accounting/psoa/psoa.job";
/**
 * The accounting module's composition root. Composed as ONE sub-app (and used as one
 * `.use()` in `src/server/index.ts`) for two reasons: it keeps the module's registration in
 * the module's own folder, and it keeps the main server chain short — a single flat chain of
 * 70+ `.use()` calls pushes Elysia's composed type past TypeScript's instantiation-depth
 * limit (TS2589). New accounting controllers register HERE, not in the main index.
 */
export declare const accountingServer: Elysia<"", {
    decorator: {};
    store: any;
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "accounting-currency.list": import("@sinclair/typebox").TObject<{
            includeDisabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
    };
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
} & {
    typebox: {
        readonly "accounting-accounts-settings.update": import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>]>>;
    };
    error: {};
} & {
    typebox: {
        readonly "accounting-jobs.list": import("@sinclair/typebox").TObject<{
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"QUEUED">, import("@sinclair/typebox").TLiteral<"IN_PROGRESS">, import("@sinclair/typebox").TLiteral<"COMPLETED">, import("@sinclair/typebox").TLiteral<"FAILED">]>>;
            jobType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
    };
    error: {};
} & {
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
} & {
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
} & {
    typebox: {
        readonly "accounting-fiscal-year.create": import("@sinclair/typebox").TObject<{
            year: import("@sinclair/typebox").TString;
            yearStartDate: import("@sinclair/typebox").TString;
            yearEndDate: import("@sinclair/typebox").TString;
            isShortYear: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-fiscal-year.update": import("@sinclair/typebox").TObject<{
            year: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            yearStartDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            yearEndDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            isShortYear: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-fiscal-year.resolve": import("@sinclair/typebox").TObject<{
            date: import("@sinclair/typebox").TString;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "accounting-period.create": import("@sinclair/typebox").TObject<{
            periodName: import("@sinclair/typebox").TString;
            startDate: import("@sinclair/typebox").TString;
            endDate: import("@sinclair/typebox").TString;
            closedDocumentTypes: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "period-closing.create": import("@sinclair/typebox").TObject<{
            periodStartDate: import("@sinclair/typebox").TString;
            periodEndDate: import("@sinclair/typebox").TString;
            closingAccountHeadId: import("@sinclair/typebox").TString;
            remarks: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            granularByDimensions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "budget.create": import("@sinclair/typebox").TObject<{
            fiscalYear: import("@sinclair/typebox").TString;
            budgetAgainst: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"COST_CENTER">, import("@sinclair/typebox").TLiteral<"PROJECT">]>>;
            costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            project: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            monthlyDistributionId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            applicableOnBookingActualExpenses: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            actionIfAnnualExceeded: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"STOP">, import("@sinclair/typebox").TLiteral<"WARN">, import("@sinclair/typebox").TLiteral<"IGNORE">]>>;
            actionIfAccumulatedMonthlyExceeded: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"STOP">, import("@sinclair/typebox").TLiteral<"WARN">, import("@sinclair/typebox").TLiteral<"IGNORE">]>>;
            accounts: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                accountId: import("@sinclair/typebox").TString;
                budgetAmount: import("@sinclair/typebox").TString;
            }>>;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "bank.upsert": import("@sinclair/typebox").TObject<{
            bankName: import("@sinclair/typebox").TString;
            swiftNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            website: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "bank.account.upsert": import("@sinclair/typebox").TObject<{
            bankId: import("@sinclair/typebox").TString;
            accountName: import("@sinclair/typebox").TString;
            isCompanyAccount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            glAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            accountType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            accountSubtype: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            iban: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            branchCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            bankAccountNo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            partyType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            partyId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "accounting-cost-center.create": import("@sinclair/typebox").TObject<{
            costCenterName: import("@sinclair/typebox").TString;
            costCenterNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            parentCostCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            isGroup: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-cost-center.update": import("@sinclair/typebox").TObject<{
            costCenterName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            costCenterNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            isGroup: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-cost-center.move": import("@sinclair/typebox").TObject<{
            parentCostCenterId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "accounting-cost-center-allocation.list": import("@sinclair/typebox").TObject<{
            docstatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"SUBMITTED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "accounting-cost-center-allocation.create": import("@sinclair/typebox").TObject<{
            mainCostCenterId: import("@sinclair/typebox").TString;
            validFrom: import("@sinclair/typebox").TString;
            rows: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                costCenterId: import("@sinclair/typebox").TString;
                percentage: import("@sinclair/typebox").TString;
            }>>;
        }>;
        readonly "accounting-cost-center-allocation.update": import("@sinclair/typebox").TObject<{
            mainCostCenterId: import("@sinclair/typebox").TString;
            validFrom: import("@sinclair/typebox").TString;
            rows: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                costCenterId: import("@sinclair/typebox").TString;
                percentage: import("@sinclair/typebox").TString;
            }>>;
        }>;
    };
    error: {};
} & {
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
} & {
    typebox: {
        readonly "accounting-currency-exchange.list": import("@sinclair/typebox").TObject<{
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "accounting-currency-exchange.create": import("@sinclair/typebox").TObject<{
            date: import("@sinclair/typebox").TString;
            fromCurrencyCode: import("@sinclair/typebox").TString;
            toCurrencyCode: import("@sinclair/typebox").TString;
            exchangeRate: import("@sinclair/typebox").TString;
            forBuying: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            forSelling: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-currency-exchange.resolve": import("@sinclair/typebox").TObject<{
            fromCurrencyCode: import("@sinclair/typebox").TString;
            toCurrencyCode: import("@sinclair/typebox").TString;
            date: import("@sinclair/typebox").TString;
            side: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"buying">, import("@sinclair/typebox").TLiteral<"selling">]>;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "accounting-finance-book.create": import("@sinclair/typebox").TObject<{
            financeBookName: import("@sinclair/typebox").TString;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-finance-book.update": import("@sinclair/typebox").TObject<{
            financeBookName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "accounting-journal-entry.list": import("@sinclair/typebox").TObject<{
            docstatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"SUBMITTED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            voucherType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "accounting-journal-entry.create": import("@sinclair/typebox").TObject<{
            voucherType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            postingDate: import("@sinclair/typebox").TString;
            chequeNo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            chequeDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            remark: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            rows: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                accountId: import("@sinclair/typebox").TString;
                debit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                credit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                dim1: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                dim2: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                dim3: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                dim4: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                userRemark: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            }>>;
        }>;
        readonly "accounting-journal-entry.update": import("@sinclair/typebox").TObject<{
            voucherType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            postingDate: import("@sinclair/typebox").TString;
            chequeNo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            chequeDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            remark: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            rows: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                accountId: import("@sinclair/typebox").TString;
                debit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                credit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                dim1: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                dim2: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                dim3: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                dim4: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                userRemark: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            }>>;
        }>;
        readonly "accounting-journal-entry.template-create": import("@sinclair/typebox").TObject<{
            templateTitle: import("@sinclair/typebox").TString;
            voucherType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            accountIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "accounting-party.update": import("@sinclair/typebox").TObject<{
            accountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            defaultCurrencyCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            creditLimit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            bypassCreditLimitCheck: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            isFrozen: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "accounting-payment-entry.create": import("@sinclair/typebox").TObject<{
            paymentType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"RECEIVE">, import("@sinclair/typebox").TLiteral<"PAY">, import("@sinclair/typebox").TLiteral<"INTERNAL_TRANSFER">]>;
            postingDate: import("@sinclair/typebox").TString;
            partyType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            partyId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            modeOfPaymentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            paidFromId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            paidToId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            paidAmount: import("@sinclair/typebox").TString;
            receivedAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            referenceNo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            referenceDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            isOpening: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            projectId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            remarks: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            references: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                referenceDoctype: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"sales_invoice">, import("@sinclair/typebox").TLiteral<"purchase_invoice">, import("@sinclair/typebox").TLiteral<"journal_entry">, import("@sinclair/typebox").TLiteral<"insurance_claim">]>;
                referenceId: import("@sinclair/typebox").TString;
                allocatedAmount: import("@sinclair/typebox").TString;
            }>>>;
            deductions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                accountId: import("@sinclair/typebox").TString;
                costCenterId: import("@sinclair/typebox").TString;
                amount: import("@sinclair/typebox").TString;
            }>>>;
        }>;
        readonly "accounting-payment-entry.outstanding": import("@sinclair/typebox").TObject<{
            partyType: import("@sinclair/typebox").TString;
            partyId: import("@sinclair/typebox").TString;
            fromDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            toDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            minAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            maxAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "accounting-payment-entry.list": import("@sinclair/typebox").TObject<{
            docstatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"SUBMITTED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            paymentType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"RECEIVE">, import("@sinclair/typebox").TLiteral<"PAY">, import("@sinclair/typebox").TLiteral<"INTERNAL_TRANSFER">]>>;
            partyId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            fromDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            toDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "accounting-payment-term.create": import("@sinclair/typebox").TObject<{
            paymentTermName: import("@sinclair/typebox").TString;
            invoicePortion: import("@sinclair/typebox").TString;
            dueDateBasedOn: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DAYS_AFTER_INVOICE_DATE">, import("@sinclair/typebox").TLiteral<"DAYS_AFTER_INVOICE_MONTH_END">, import("@sinclair/typebox").TLiteral<"MONTHS_AFTER_INVOICE_MONTH_END">]>;
            creditDays: import("@sinclair/typebox").TInteger;
            creditMonths: import("@sinclair/typebox").TInteger;
            modeOfPaymentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            discountType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PERCENTAGE">, import("@sinclair/typebox").TLiteral<"AMOUNT">]>;
            discount: import("@sinclair/typebox").TString;
            discountValidityBasedOn: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DAYS_AFTER_INVOICE_DATE">, import("@sinclair/typebox").TLiteral<"DAYS_AFTER_INVOICE_MONTH_END">, import("@sinclair/typebox").TLiteral<"MONTHS_AFTER_INVOICE_MONTH_END">]>;
            discountValidity: import("@sinclair/typebox").TInteger;
        }>;
        readonly "accounting-payment-terms-template.create": import("@sinclair/typebox").TObject<{
            templateName: import("@sinclair/typebox").TString;
            allocatePaymentBasedOnPaymentTerms: import("@sinclair/typebox").TBoolean;
            termIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
        }>;
    };
    error: {};
} & {
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
} & {
    typebox: {
        readonly "accounting-sales-invoice.create": import("@sinclair/typebox").TObject<{
            postingDate: import("@sinclair/typebox").TString;
            dueDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            partyType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            partyId: import("@sinclair/typebox").TString;
            debitToId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            isReturn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            returnAgainstId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            updateOutstandingForSelf: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            isOpening: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            poNo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            poDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            taxesAndChargesTemplateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            taxCategoryId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            applyDiscountOn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"GRAND_TOTAL">, import("@sinclair/typebox").TLiteral<"NET_TOTAL">]>>;
            additionalDiscountPercentage: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            discountAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            isCashOrNonTradeDiscount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            additionalDiscountAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            disableRoundedTotal: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            writeOffAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            writeOffAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            writeOffCostCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            paymentTermsTemplateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            ignoreDefaultPaymentTermsTemplate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            projectId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            remarks: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            items: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                itemCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                itemName: import("@sinclair/typebox").TString;
                description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                qty: import("@sinclair/typebox").TString;
                uom: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                priceListRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                marginType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PERCENTAGE">, import("@sinclair/typebox").TLiteral<"AMOUNT">]>, import("@sinclair/typebox").TNull]>>;
                marginRateOrAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                discountPercentage: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                discountAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                rate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                isFreeItem: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                incomeAccountId: import("@sinclair/typebox").TString;
                costCenterId: import("@sinclair/typebox").TString;
                discountAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                itemTaxTemplateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                projectId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            }>>;
            taxes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                chargeType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ACTUAL">, import("@sinclair/typebox").TLiteral<"ON_NET_TOTAL">, import("@sinclair/typebox").TLiteral<"ON_PREVIOUS_ROW_AMOUNT">, import("@sinclair/typebox").TLiteral<"ON_PREVIOUS_ROW_TOTAL">, import("@sinclair/typebox").TLiteral<"ON_ITEM_QUANTITY">]>;
                accountHeadId: import("@sinclair/typebox").TString;
                rate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                taxAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                rowId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
                description: import("@sinclair/typebox").TString;
                includedInPrintRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            }>>>;
            schedule: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                dueDate: import("@sinclair/typebox").TString;
                invoicePortion: import("@sinclair/typebox").TString;
                paymentAmount: import("@sinclair/typebox").TString;
                modeOfPaymentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            }>>>;
            allocateAdvancesAutomatically: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            advances: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                referenceType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"payment_entry">, import("@sinclair/typebox").TLiteral<"journal_entry">]>;
                referenceId: import("@sinclair/typebox").TString;
                allocatedAmount: import("@sinclair/typebox").TString;
            }>>>;
        }>;
        readonly "accounting-sales-invoice.list": import("@sinclair/typebox").TObject<{
            docstatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"SUBMITTED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"SUBMITTED">, import("@sinclair/typebox").TLiteral<"UNPAID">, import("@sinclair/typebox").TLiteral<"PAID">, import("@sinclair/typebox").TLiteral<"PARTLY_PAID">, import("@sinclair/typebox").TLiteral<"OVERDUE">, import("@sinclair/typebox").TLiteral<"RETURN">, import("@sinclair/typebox").TLiteral<"CREDIT_NOTE_ISSUED">, import("@sinclair/typebox").TLiteral<"INTERNAL_TRANSFER">, import("@sinclair/typebox").TLiteral<"CONSOLIDATED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            partyId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            fromDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            toDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            isReturn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "accounting-purchase-invoice.create": import("@sinclair/typebox").TObject<{
            postingDate: import("@sinclair/typebox").TString;
            dueDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            partyType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            partyId: import("@sinclair/typebox").TString;
            creditToId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            billNo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            billDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            isPaid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            modeOfPaymentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            cashBankAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            paidAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            isReturn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            returnAgainstId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            updateOutstandingForSelf: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            isOpening: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            taxesAndChargesTemplateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            taxCategoryId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            applyDiscountOn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"GRAND_TOTAL">, import("@sinclair/typebox").TLiteral<"NET_TOTAL">]>>;
            additionalDiscountPercentage: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            discountAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            isCashOrNonTradeDiscount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            additionalDiscountAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            disableRoundedTotal: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            writeOffAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            writeOffAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            writeOffCostCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            paymentTermsTemplateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            ignoreDefaultPaymentTermsTemplate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            projectId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            remarks: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            items: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                itemCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                itemName: import("@sinclair/typebox").TString;
                description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                qty: import("@sinclair/typebox").TString;
                uom: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                priceListRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                marginType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PERCENTAGE">, import("@sinclair/typebox").TLiteral<"AMOUNT">]>, import("@sinclair/typebox").TNull]>>;
                marginRateOrAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                discountPercentage: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                discountAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                rate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                isFreeItem: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                expenseAccountId: import("@sinclair/typebox").TString;
                costCenterId: import("@sinclair/typebox").TString;
                itemTaxTemplateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                projectId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            }>>;
            taxes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                chargeType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ACTUAL">, import("@sinclair/typebox").TLiteral<"ON_NET_TOTAL">, import("@sinclair/typebox").TLiteral<"ON_PREVIOUS_ROW_AMOUNT">, import("@sinclair/typebox").TLiteral<"ON_PREVIOUS_ROW_TOTAL">, import("@sinclair/typebox").TLiteral<"ON_ITEM_QUANTITY">]>;
                accountHeadId: import("@sinclair/typebox").TString;
                rate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                taxAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                rowId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
                description: import("@sinclair/typebox").TString;
                includedInPrintRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"TOTAL">, import("@sinclair/typebox").TLiteral<"VALUATION">, import("@sinclair/typebox").TLiteral<"VALUATION_AND_TOTAL">]>>;
                addDeductTax: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ADD">, import("@sinclair/typebox").TLiteral<"DEDUCT">]>>;
            }>>>;
            schedule: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                dueDate: import("@sinclair/typebox").TString;
                invoicePortion: import("@sinclair/typebox").TString;
                paymentAmount: import("@sinclair/typebox").TString;
                modeOfPaymentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            }>>>;
            allocateAdvancesAutomatically: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            advances: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                referenceType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"payment_entry">, import("@sinclair/typebox").TLiteral<"journal_entry">]>;
                referenceId: import("@sinclair/typebox").TString;
                allocatedAmount: import("@sinclair/typebox").TString;
            }>>>;
        }>;
        readonly "accounting-purchase-invoice.hold": import("@sinclair/typebox").TObject<{
            holdComment: import("@sinclair/typebox").TString;
            releaseDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        }>;
        readonly "accounting-purchase-invoice.list": import("@sinclair/typebox").TObject<{
            docstatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"SUBMITTED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"SUBMITTED">, import("@sinclair/typebox").TLiteral<"UNPAID">, import("@sinclair/typebox").TLiteral<"PAID">, import("@sinclair/typebox").TLiteral<"PARTLY_PAID">, import("@sinclair/typebox").TLiteral<"OVERDUE">, import("@sinclair/typebox").TLiteral<"RETURN">, import("@sinclair/typebox").TLiteral<"DEBIT_NOTE_ISSUED">, import("@sinclair/typebox").TLiteral<"INTERNAL_TRANSFER">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            partyId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            fromDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            toDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            isReturn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            onHold: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
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
            doctype: import("./permissions/accounting-permissions").AccountingDoctypeKey;
            action: import("./permissions/accounting-permissions").AccountingAction;
        };
    }>;
    macroFn: {
        readonly requireAccounting: (options: {
            doctype: import("./permissions/accounting-permissions").AccountingDoctypeKey;
            action: import("./permissions/accounting-permissions").AccountingAction;
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
                actor: import("./permissions/accounting-permissions.guard").AccountingActor;
            }>;
        };
    };
    parser: {};
    response: {};
}, {
    accounting: {
        currencies: {};
    };
} & {
    accounting: {
        currencies: {
            get: {
                body: {};
                params: {};
                query: {
                    includeDisabled?: boolean | undefined;
                };
                headers: {};
                response: {
                    200: {
                        symbol: string | null;
                        name: string;
                        code: string;
                        nameAr: string;
                        fractionUnits: number;
                        fractionNameEn: string | null;
                        fractionNameAr: string | null;
                        smallestUnit: import("@prisma/client-runtime-utils").Decimal;
                        enabled: boolean;
                    }[];
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
} & {
    accounting: {
        currencies: {
            ":code": {
                get: {
                    body: {};
                    params: {
                        code: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            symbol: string | null;
                            name: string;
                            code: string;
                            nameAr: string;
                            fractionUnits: number;
                            fractionNameEn: string | null;
                            fractionNameAr: string | null;
                            smallestUnit: import("@prisma/client-runtime-utils").Decimal;
                            enabled: boolean;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "العملة غير موجودة";
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
    };
} & {
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
} & {
    accounting: {
        "accounts-settings": {};
    };
} & {
    accounting: {
        "accounts-settings": {
            definitions: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            groups: readonly [{
                                readonly id: "ledger";
                                readonly labelAr: "الدفتر والترحيل";
                                readonly labelEn: "Ledger & Posting";
                            }, {
                                readonly id: "period";
                                readonly labelAr: "التجميد وإقفال الفترات";
                                readonly labelEn: "Period Control";
                            }, {
                                readonly id: "receivables";
                                readonly labelAr: "الذمم والمدفوعات";
                                readonly labelEn: "Receivables & Payments";
                            }, {
                                readonly id: "invoicing";
                                readonly labelAr: "الفوترة والضرائب";
                                readonly labelEn: "Invoicing & Tax";
                            }, {
                                readonly id: "printing";
                                readonly labelAr: "الطباعة";
                                readonly labelEn: "Printing";
                            }, {
                                readonly id: "currency";
                                readonly labelAr: "العملات وأسعار الصرف";
                                readonly labelEn: "Currency & Exchange";
                            }, {
                                readonly id: "reconciliation";
                                readonly labelAr: "التسوية";
                                readonly labelEn: "Reconciliation";
                            }, {
                                readonly id: "deferred";
                                readonly labelAr: "الاستحقاق المؤجل";
                                readonly labelEn: "Deferred Accounting";
                            }, {
                                readonly id: "features";
                                readonly labelAr: "تفعيل الخصائص";
                                readonly labelEn: "Feature Toggles";
                            }];
                            definitions: {
                                readonly enable_immutable_ledger: {
                                    readonly group: "ledger";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "الدفتر غير القابل للتعديل";
                                    readonly labelEn: "Enable immutable ledger";
                                    readonly descriptionAr: "عند التفعيل تبقى القيود الأصلية سارية ويُضاف عكسها بتاريخ الإلغاء؛ وعند الإيقاف (الوضع الافتراضي) تُعلَّم القيود الأصلية وعكسها كملغاة.";
                                    readonly descriptionEn: "When on, original entries stay live and a reversal is posted at the cancellation date; when off (default) the original and its mirror are both flagged cancelled.";
                                    readonly brd: "AR-2";
                                    readonly phase: "P2.3";
                                };
                                readonly merge_similar_account_heads: {
                                    readonly group: "ledger";
                                    readonly type: "boolean";
                                    readonly default: true;
                                    readonly labelAr: "دمج القيود المتشابهة";
                                    readonly labelEn: "Merge similar account heads";
                                    readonly descriptionAr: "دمج أسطر القيد المتطابقة في المفتاح قبل الحفظ لتقليل عدد الأسطر.";
                                    readonly descriptionEn: "Merge ledger rows that share the same merge key before persisting, to keep entry counts down.";
                                    readonly brd: "§6 step 5b";
                                    readonly phase: "P2.2";
                                };
                                readonly delete_linked_ledger_entries: {
                                    readonly group: "ledger";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "حذف القيود المرتبطة عند حذف المستند";
                                    readonly labelEn: "Delete linked ledger entries";
                                    readonly descriptionAr: "خطير — يحذف قيود الأستاذ نهائيًا بدل الإبقاء على أثر التدقيق. يُترك مغلقًا.";
                                    readonly descriptionEn: "Dangerous — hard-deletes ledger entries instead of preserving the audit trail. Leave off.";
                                    readonly brd: "§19";
                                };
                                readonly ignore_account_closing_balance: {
                                    readonly group: "ledger";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "تجاهل أرصدة الإقفال المخزّنة";
                                    readonly labelEn: "Ignore account closing balance";
                                    readonly descriptionAr: "تجاوز مسار الأرصدة المخزّنة في تقارير الميزانية والاعتماد على القيود مباشرة.";
                                    readonly descriptionEn: "Bypass the stored closing-balance fast path and read balance-sheet figures straight from the ledger.";
                                    readonly brd: "§5.3";
                                    readonly phase: "P10.2";
                                };
                                readonly auto_create_fiscal_year: {
                                    readonly group: "ledger";
                                    readonly type: "boolean";
                                    readonly default: true;
                                    readonly labelAr: "إنشاء السنة المالية التالية تلقائيًا";
                                    readonly labelEn: "Auto-create next fiscal year";
                                    readonly descriptionAr: "قرب نهاية السنة المالية يُنشئ النظام السنة التالية تلقائيًا — لا يُرحَّل شيء فعليًا؛ الأرصدة الافتتاحية تُشتق من الدفاتر (FR-12.5).";
                                    readonly descriptionEn: "Near fiscal-year end the system creates the next year automatically — nothing is carried physically; opening balances derive from the ledger (FR-12.5).";
                                    readonly brd: "FR-12.5";
                                    readonly phase: "P10.5";
                                };
                                readonly ignore_is_opening_check_for_reporting: {
                                    readonly group: "ledger";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "السماح بالقيود الافتتاحية بعد الإقفال (لأغراض التقارير)";
                                    readonly labelEn: "Ignore is-opening check for reporting";
                                    readonly descriptionAr: "يسمح بترحيل قيود افتتاحية بتاريخ يسبق آخر سند إقفال — لتصحيحات الأرصدة الافتتاحية فقط (BR-12.4).";
                                    readonly descriptionEn: "Allow all-opening batches to post on/before the last Period Closing Voucher — opening-balance corrections only (BR-12.4).";
                                    readonly brd: "BR-12.4";
                                    readonly phase: "P10.2";
                                };
                                readonly general_ledger_remarks_length: {
                                    readonly group: "ledger";
                                    readonly type: "int";
                                    readonly default: 0;
                                    readonly min: 0;
                                    readonly max: 1000;
                                    readonly labelAr: "حد طول الملاحظات في الأستاذ العام";
                                    readonly labelEn: "GL remarks length limit";
                                    readonly descriptionAr: "صفر يعني بلا حد.";
                                    readonly descriptionEn: "Zero means no limit.";
                                    readonly brd: "§5.1";
                                    readonly phase: "P2.1";
                                };
                                readonly receivable_payable_remarks_length: {
                                    readonly group: "ledger";
                                    readonly type: "int";
                                    readonly default: 0;
                                    readonly min: 0;
                                    readonly max: 1000;
                                    readonly labelAr: "حد طول الملاحظات في الذمم";
                                    readonly labelEn: "AR/AP remarks length limit";
                                    readonly descriptionAr: "صفر يعني بلا حد.";
                                    readonly descriptionEn: "Zero means no limit.";
                                    readonly brd: "§5.2";
                                    readonly phase: "P3.2";
                                };
                                readonly accounts_frozen_upto: {
                                    readonly group: "period";
                                    readonly type: "date";
                                    readonly default: null;
                                    readonly labelAr: "تجميد القيود حتى تاريخ";
                                    readonly labelEn: "Accounts frozen upto";
                                    readonly descriptionAr: "يمنع أي ترحيل أو إلغاء بتاريخ ترحيل ≤ هذا التاريخ، إلا لمن يملك صلاحية «تعديل الفترات المجمّدة».";
                                    readonly descriptionEn: "Blocks any posting or cancellation dated on or before this date, except for holders of the frozen-accounts modifier permission.";
                                    readonly brd: "FR-12.1";
                                    readonly phase: "P2.8";
                                };
                                readonly period_closing_voucher_job_timeout: {
                                    readonly group: "period";
                                    readonly type: "int";
                                    readonly default: 3600;
                                    readonly min: 60;
                                    readonly max: 86400;
                                    readonly labelAr: "مهلة مهمة سند الإقفال (ثانية)";
                                    readonly labelEn: "Period Closing Voucher job timeout (s)";
                                    readonly descriptionAr: "الحد الأقصى لزمن تنفيذ مهمة الإقفال في الخلفية قبل اعتبارها فاشلة.";
                                    readonly descriptionEn: "Maximum runtime for the background closing job before it is marked failed.";
                                    readonly brd: "FR-12.3";
                                    readonly phase: "P10.2";
                                };
                                readonly confirm_before_resetting_posting_date: {
                                    readonly group: "period";
                                    readonly type: "boolean";
                                    readonly default: true;
                                    readonly labelAr: "تأكيد قبل تغيير تاريخ الترحيل";
                                    readonly labelEn: "Confirm before resetting posting date";
                                    readonly descriptionAr: "طلب تأكيد صريح عند تعديل تاريخ ترحيل مستند.";
                                    readonly descriptionEn: "Ask for explicit confirmation when a document's posting date is changed.";
                                    readonly brd: "§19";
                                };
                                readonly unlink_payment_on_cancellation_of_invoice: {
                                    readonly group: "receivables";
                                    readonly type: "boolean";
                                    readonly default: true;
                                    readonly labelAr: "فك ارتباط الدفعات عند إلغاء الفاتورة";
                                    readonly labelEn: "Unlink payment on cancellation of invoice";
                                    readonly descriptionAr: "عند الإيقاف يُمنع إلغاء فاتورة مرتبطة بدفعة بدل فك الارتباط تلقائيًا.";
                                    readonly descriptionEn: "When off, cancelling an invoice that has linked payments is blocked instead of auto-unlinking them.";
                                    readonly brd: "BR-10.4";
                                    readonly phase: "P7.8";
                                };
                                readonly unlink_advance_payment_on_cancelation_of_order: {
                                    readonly group: "receivables";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "فك ارتباط الدفعة المقدمة عند إلغاء الطلب";
                                    readonly labelEn: "Unlink advance payment on cancellation of order";
                                    readonly descriptionAr: "يحكم إلغاء الطلبات المرتبطة بدفعات مقدمة.";
                                    readonly descriptionEn: "Governs cancellation of orders that carry advance payments.";
                                    readonly brd: "BR-10.4";
                                    readonly phase: "P7.8";
                                };
                                readonly make_payment_via_journal_entry: {
                                    readonly group: "receivables";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "إنشاء المدفوعات كقيد يومية";
                                    readonly labelEn: "Make payment via Journal Entry";
                                    readonly descriptionAr: "استخدام قيد يومية بدل سند القبض/الصرف عند تسجيل الدفع.";
                                    readonly descriptionEn: "Record payments as journal entries instead of payment entries.";
                                    readonly brd: "§19";
                                    readonly phase: "P7.1";
                                };
                                readonly automatically_fetch_payment_terms: {
                                    readonly group: "receivables";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "جلب شروط الدفع تلقائيًا";
                                    readonly labelEn: "Automatically fetch payment terms";
                                    readonly descriptionAr: "تعبئة جدول الاستحقاق من قالب شروط الدفع عند حفظ الفاتورة.";
                                    readonly descriptionEn: "Fill the payment schedule from the payment-terms template when an invoice is saved.";
                                    readonly brd: "BR-4.9.1";
                                    readonly phase: "P5.4";
                                };
                                readonly default_ageing_range: {
                                    readonly group: "receivables";
                                    readonly type: "string";
                                    readonly default: "30, 60, 90, 120";
                                    readonly labelAr: "فترات أعمار الديون الافتراضية";
                                    readonly labelEn: "Default ageing range";
                                    readonly descriptionAr: "حدود شرائح أعمار الديون بالأيام، مفصولة بفواصل.";
                                    readonly descriptionEn: "Ageing bucket boundaries in days, comma separated.";
                                    readonly brd: "§18.3";
                                    readonly phase: "P9.3";
                                };
                                readonly check_supplier_invoice_uniqueness: {
                                    readonly group: "invoicing";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "التحقق من عدم تكرار فاتورة المورّد";
                                    readonly labelEn: "Check supplier invoice uniqueness";
                                    readonly descriptionAr: "منع تكرار رقم فاتورة المورّد لنفس المورّد داخل المنشأة.";
                                    readonly descriptionEn: "Reject a duplicate supplier bill number for the same supplier within the company.";
                                    readonly brd: "BR-7.3.1";
                                    readonly phase: "P6.1";
                                };
                                readonly over_billing_allowance: {
                                    readonly group: "invoicing";
                                    readonly type: "decimal";
                                    readonly default: "0";
                                    readonly labelAr: "نسبة السماح بتجاوز الفوترة (%)";
                                    readonly labelEn: "Over billing allowance (%)";
                                    readonly descriptionAr: "النسبة المسموح بتجاوزها فوق قيمة الطلب/الاستلام؛ التجاوز الأكبر يحتاج صلاحية «تجاوز حد الفوترة».";
                                    readonly descriptionEn: "Percentage a document may exceed its order/receipt by; anything beyond needs the over-billing permission.";
                                    readonly brd: "§19";
                                    readonly phase: "P5.2";
                                };
                                readonly add_taxes_from_item_tax_template: {
                                    readonly group: "invoicing";
                                    readonly type: "boolean";
                                    readonly default: true;
                                    readonly labelAr: "إضافة الضرائب من قالب ضريبة الصنف";
                                    readonly labelEn: "Add taxes from Item Tax Template";
                                    readonly descriptionAr: "إدراج صفوف الضريبة الناقصة من قالب ضريبة الصنف.";
                                    readonly descriptionEn: "Insert missing tax rows from the item's tax template.";
                                    readonly brd: "§8 step 5";
                                    readonly phase: "P4.2";
                                };
                                readonly add_taxes_from_taxes_and_charges_template: {
                                    readonly group: "invoicing";
                                    readonly type: "boolean";
                                    readonly default: true;
                                    readonly labelAr: "إضافة الضرائب من قالب الضرائب والرسوم";
                                    readonly labelEn: "Add taxes from Taxes and Charges Template";
                                    readonly descriptionAr: "تعبئة صفوف الضريبة من القالب الافتراضي عند إنشاء المستند.";
                                    readonly descriptionEn: "Populate tax rows from the default template when a document is created.";
                                    readonly brd: "§4.11";
                                    readonly phase: "P4.2";
                                };
                                readonly determine_address_tax_category_from: {
                                    readonly group: "invoicing";
                                    readonly type: "enum";
                                    readonly options: readonly ["Billing Address", "Shipping Address"];
                                    readonly default: "Billing Address";
                                    readonly labelAr: "مصدر فئة الضريبة من العنوان";
                                    readonly labelEn: "Determine address tax category from";
                                    readonly descriptionAr: "أي عنوان يُستخدم لاختيار فئة الضريبة عند مطابقة قواعد الضريبة.";
                                    readonly descriptionEn: "Which address decides the tax category when matching tax rules.";
                                    readonly brd: "§4.11";
                                    readonly phase: "P4.1";
                                };
                                readonly round_row_wise_tax: {
                                    readonly group: "invoicing";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "تقريب الضريبة لكل صف";
                                    readonly labelEn: "Round row-wise tax";
                                    readonly descriptionAr: "تقريب مبلغ الضريبة على مستوى الصف بدل المجموع فقط.";
                                    readonly descriptionEn: "Round the tax amount per row rather than only on the total.";
                                    readonly brd: "§8 step 6";
                                    readonly phase: "P4.2";
                                };
                                readonly book_tax_discount_loss: {
                                    readonly group: "invoicing";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "ترحيل فرق ضريبة الخصم";
                                    readonly labelEn: "Book tax discount loss";
                                    readonly descriptionAr: "ترحيل الجزء الضريبي من الخصم إلى حساب مستقل.";
                                    readonly descriptionEn: "Post the tax portion of a discount to a separate account.";
                                    readonly brd: "§8 step 8";
                                    readonly phase: "P5.3";
                                };
                                readonly enable_discount_accounting: {
                                    readonly group: "invoicing";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "محاسبة الخصومات";
                                    readonly labelEn: "Enable discount accounting";
                                    readonly descriptionAr: "ترحيل الخصم إلى حساب خصم مستقل بدل تخفيض الإيراد مباشرة.";
                                    readonly descriptionEn: "Post discounts to a dedicated discount account instead of netting them off income.";
                                    readonly brd: "§7.2 posting map row 7";
                                    readonly phase: "P5.3";
                                };
                                readonly show_inclusive_tax_in_print: {
                                    readonly group: "printing";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "إظهار الضريبة المتضمَّنة في الطباعة";
                                    readonly labelEn: "Show inclusive tax in print";
                                    readonly descriptionAr: "إظهار مبلغ الضريبة المتضمَّنة في السعر ضمن نسخة الطباعة.";
                                    readonly descriptionEn: "Show the tax included in the rate on the printed document.";
                                    readonly brd: "§19";
                                    readonly phase: "P5.9";
                                };
                                readonly show_payment_schedule_in_print: {
                                    readonly group: "printing";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "إظهار جدول الاستحقاق في الطباعة";
                                    readonly labelEn: "Show payment schedule in print";
                                    readonly descriptionAr: "طباعة أقساط الاستحقاق ضمن الفاتورة.";
                                    readonly descriptionEn: "Print the instalment schedule on the invoice.";
                                    readonly brd: "§19";
                                    readonly phase: "P5.9";
                                };
                                readonly show_taxes_as_table_in_print: {
                                    readonly group: "printing";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "إظهار الضرائب كجدول في الطباعة";
                                    readonly labelEn: "Show taxes as table in print";
                                    readonly descriptionAr: "عرض تفصيل الضرائب في جدول مستقل عند الطباعة.";
                                    readonly descriptionEn: "Render the tax breakdown as its own table when printing.";
                                    readonly brd: "§19";
                                    readonly phase: "P5.9";
                                };
                                readonly allow_stale: {
                                    readonly group: "currency";
                                    readonly type: "boolean";
                                    readonly default: true;
                                    readonly labelAr: "السماح بسعر صرف قديم";
                                    readonly labelEn: "Allow stale exchange rates";
                                    readonly descriptionAr: "عند الإيقاف تُمنع الحركة إذا كان أحدث سعر صرف أقدم من المدة المحددة.";
                                    readonly descriptionEn: "When off, transactions are blocked if the latest exchange rate is older than the configured window.";
                                    readonly brd: "§4.7";
                                    readonly phase: "P1.8";
                                };
                                readonly stale_days: {
                                    readonly group: "currency";
                                    readonly type: "int";
                                    readonly default: 1;
                                    readonly min: 0;
                                    readonly max: 365;
                                    readonly labelAr: "مدة صلاحية سعر الصرف (يوم)";
                                    readonly labelEn: "Stale days";
                                    readonly descriptionAr: "عدد الأيام التي يُعتبر بعدها سعر الصرف قديمًا.";
                                    readonly descriptionEn: "Number of days after which an exchange rate counts as stale.";
                                    readonly brd: "§4.7";
                                    readonly phase: "P1.8";
                                };
                                readonly allow_multi_currency_invoices_against_single_party_account: {
                                    readonly group: "currency";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "السماح بعملات متعددة على حساب طرف واحد";
                                    readonly labelEn: "Allow multi-currency invoices against single party account";
                                    readonly descriptionAr: "تجاوز قاعدة توحيد عملة حساب الطرف بعد أول حركة.";
                                    readonly descriptionEn: "Override the rule that fixes a party account's currency after its first entry.";
                                    readonly brd: "BR-4.10.2";
                                    readonly phase: "P8.3";
                                };
                                readonly rate_provider: {
                                    readonly group: "currency";
                                    readonly type: "enum";
                                    readonly options: readonly ["None", "frankfurter.dev"];
                                    readonly default: "None";
                                    readonly labelAr: "مزوّد أسعار الصرف";
                                    readonly labelEn: "Exchange rate provider";
                                    readonly descriptionAr: "المصدر الآلي لأسعار الصرف (§4.7) — «None» يعتمد الأسعار اليدوية فقط.";
                                    readonly descriptionEn: "Automatic rate source (§4.7); None keeps manual rates only.";
                                    readonly brd: "§4.7";
                                    readonly phase: "P8.5";
                                };
                                readonly exchange_gain_loss_posting_date: {
                                    readonly group: "currency";
                                    readonly type: "enum";
                                    readonly options: readonly ["Invoice", "Payment", "Reconciliation Date"];
                                    readonly default: "Reconciliation Date";
                                    readonly labelAr: "تاريخ ترحيل فروق الصرف";
                                    readonly labelEn: "Exchange gain/loss posting date";
                                    readonly descriptionAr: "التاريخ المستخدم لقيد فرق سعر الصرف المحقق.";
                                    readonly descriptionEn: "Date used for the realised exchange gain/loss entry.";
                                    readonly brd: "BR-7.4.4";
                                    readonly phase: "P8.2";
                                };
                                readonly maintain_same_internal_transaction_rate: {
                                    readonly group: "currency";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "توحيد سعر الصرف في الحركات الداخلية";
                                    readonly labelEn: "Maintain same internal transaction rate";
                                    readonly descriptionAr: "إلزام الطرفين في الحركات بين الشركات بنفس سعر الصرف.";
                                    readonly descriptionEn: "Force both sides of an inter-company transaction to use the same exchange rate.";
                                    readonly brd: "FR-9.1";
                                    readonly phase: "P12.8";
                                };
                                readonly maintain_same_rate_action: {
                                    readonly group: "currency";
                                    readonly type: "enum";
                                    readonly options: readonly ["Stop", "Warn"];
                                    readonly default: "Stop";
                                    readonly labelAr: "إجراء اختلاف السعر الداخلي";
                                    readonly labelEn: "Maintain same rate action";
                                    readonly descriptionAr: "منع الحفظ أو الاكتفاء بتنبيه عند اختلاف السعر.";
                                    readonly descriptionEn: "Block the save or only warn when the rates differ.";
                                    readonly brd: "FR-9.1";
                                    readonly phase: "P12.8";
                                };
                                readonly auto_reconcile_payments: {
                                    readonly group: "reconciliation";
                                    readonly type: "boolean";
                                    readonly default: true;
                                    readonly labelAr: "التسوية التلقائية للمدفوعات";
                                    readonly labelEn: "Auto reconcile payments";
                                    readonly descriptionAr: "تشغيل مهمة مطابقة الدفعات بالفواتير دوريًا.";
                                    readonly descriptionEn: "Run the payment-to-invoice matching job on a schedule.";
                                    readonly brd: "FR-10.2";
                                    readonly phase: "P12.7";
                                };
                                readonly reconciliation_queue_size: {
                                    readonly group: "reconciliation";
                                    readonly type: "int";
                                    readonly default: 5;
                                    readonly min: 1;
                                    readonly max: 100;
                                    readonly labelAr: "حجم دفعة التسوية";
                                    readonly labelEn: "Reconciliation queue size";
                                    readonly descriptionAr: "عدد السجلات التي تعالجها المهمة في الدفعة الواحدة.";
                                    readonly descriptionEn: "How many records the job processes per batch.";
                                    readonly brd: "FR-10.1";
                                    readonly phase: "P7.6";
                                };
                                readonly auto_reconciliation_job_trigger: {
                                    readonly group: "reconciliation";
                                    readonly type: "int";
                                    readonly default: 15;
                                    readonly min: 1;
                                    readonly max: 1440;
                                    readonly labelAr: "تكرار مهمة التسوية (دقيقة)";
                                    readonly labelEn: "Auto reconciliation job trigger (min)";
                                    readonly descriptionAr: "الفاصل الزمني بين تشغيلات مهمة التسوية التلقائية.";
                                    readonly descriptionEn: "Interval between runs of the auto-reconciliation job.";
                                    readonly brd: "FR-10.2";
                                    readonly phase: "P12.7";
                                };
                                readonly enable_party_matching: {
                                    readonly group: "reconciliation";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "مطابقة الأطراف في التسوية البنكية";
                                    readonly labelEn: "Enable party matching";
                                    readonly descriptionAr: "ترشيح المستندات المرشّحة اعتمادًا على اسم الطرف في الحركة البنكية.";
                                    readonly descriptionEn: "Use the party name on a bank transaction to narrow candidate vouchers.";
                                    readonly brd: "FR-14.2";
                                    readonly phase: "P11.3";
                                };
                                readonly enable_fuzzy_matching: {
                                    readonly group: "reconciliation";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "المطابقة التقريبية";
                                    readonly labelEn: "Enable fuzzy matching";
                                    readonly descriptionAr: "السماح بمطابقة الأوصاف المتقاربة لا المطابقة الحرفية فقط.";
                                    readonly descriptionEn: "Allow near-matching descriptions rather than exact matches only.";
                                    readonly brd: "FR-14.2";
                                    readonly phase: "P11.3";
                                };
                                readonly enable_bank_transaction_rules: {
                                    readonly group: "reconciliation";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "قواعد الحركات البنكية";
                                    readonly labelEn: "Enable bank transaction rules";
                                    readonly descriptionAr: "تفعيل محرك القواعد المرتّبة لتصنيف حركات الكشف وإنشاء قيودها تلقائيًا (FR-14.3).";
                                    readonly descriptionEn: "Enable the ordered rules engine that auto-classifies statement rows and books their entries.";
                                    readonly brd: "FR-14.3";
                                    readonly phase: "P11.5";
                                };
                                readonly automatically_run_rules_on_unreconciled_transactions: {
                                    readonly group: "reconciliation";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "تشغيل القواعد تلقائيًا بعد الاستيراد";
                                    readonly labelEn: "Automatically run rules on unreconciled transactions";
                                    readonly descriptionAr: "تشغيل جولة القواعد على الحركات غير المسوّاة مباشرة بعد كل استيراد كشف.";
                                    readonly descriptionEn: "Run the rules sweep on unreconciled transactions right after every import.";
                                    readonly brd: "FR-14.3";
                                    readonly phase: "P11.5";
                                };
                                readonly transfer_match_days: {
                                    readonly group: "reconciliation";
                                    readonly type: "int";
                                    readonly default: 2;
                                    readonly labelAr: "نافذة مطابقة التحويلات الداخلية (أيام)";
                                    readonly labelEn: "Transfer match days";
                                    readonly descriptionAr: "أقصى فارق أيام بين ساقي تحويل داخلي بين حسابين بنكيين حتى يُقترَح الإقران.";
                                    readonly descriptionEn: "Maximum day gap between the two legs of an internal bank transfer for pairing.";
                                    readonly brd: "FR-14.2";
                                    readonly phase: "P11.3";
                                };
                                readonly enable_clinic_invoice_adapter: {
                                    readonly group: "features";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "تفعيل محول فواتير الأكاديمية";
                                    readonly labelEn: "Enable clinic invoice adapter";
                                    readonly descriptionAr: "ترحيل فواتير الأكاديمية التشغيلية المدفوعة إلى دفتر الأستاذ عبر جولات المحول — إيقافه يجمّد الترحيل دون المساس بالتشغيل.";
                                    readonly descriptionEn: "Post paid operational clinic invoices into the ledger via adapter runs — OFF freezes posting without touching operations.";
                                    readonly brd: "§C3";
                                    readonly phase: "P12A.2";
                                };
                                readonly enable_expense_adapter: {
                                    readonly group: "features";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "تفعيل محول المصروفات";
                                    readonly labelEn: "Enable expense adapter";
                                    readonly descriptionAr: "ترحيل المصروفات التشغيلية المدفوعة إلى دفتر الأستاذ عبر جولات المحول — إيقافه يجمّد الترحيل دون المساس بالتشغيل.";
                                    readonly descriptionEn: "Post paid operational expenses into the ledger via adapter runs — OFF freezes posting without touching operations.";
                                    readonly brd: "§C3";
                                    readonly phase: "P12A.2";
                                };
                                readonly adapter_vat_account_id: {
                                    readonly group: "features";
                                    readonly type: "string";
                                    readonly default: "";
                                    readonly labelAr: "حساب ضريبة المحول";
                                    readonly labelEn: "Adapter VAT account";
                                    readonly descriptionAr: "معرّف حساب الضريبة الذي يستقبل ضريبة فواتير الأكاديمية المرحّلة — مطلوب متى حملت فاتورة ضريبة.";
                                    readonly descriptionEn: "Ledger account id credited with VAT from adapted clinic invoices — required whenever an invoice carries VAT.";
                                    readonly brd: "§C3";
                                    readonly phase: "P12A.2";
                                };
                                readonly enable_pos_sale_adapter: {
                                    readonly group: "features";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "تفعيل محول نقطة البيع";
                                    readonly labelEn: "Enable POS sale adapter";
                                    readonly descriptionAr: "ترحيل مبيعات نقطة البيع المدفوعة إلى دفتر الأستاذ عبر جولات المحول — إيقافه يجمّد الترحيل دون المساس بالبيع.";
                                    readonly descriptionEn: "Post paid point-of-sale sales into the ledger via adapter runs — OFF freezes posting without touching selling.";
                                    readonly brd: "§C3";
                                    readonly phase: "P12B.4";
                                };
                                readonly book_advance_payments_in_separate_party_account: {
                                    readonly group: "features";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "ترحيل الدفعات المقدمة إلى حساب منفصل";
                                    readonly labelEn: "Book advance payments in a separate party account";
                                    readonly descriptionAr: "باقي الدفعة غير المخصَّص يُقيَّد على «دفعات مقدمة مقبوضة/مدفوعة» بدل حساب الذمم، ولا ينتقل إلى الذمم إلا عند تخصيصه على فاتورة. إيقافه يُبقي السلوك الحالي كما هو تمامًا.";
                                    readonly descriptionEn: "The unallocated remainder of a payment books to Advance Received/Paid instead of the AR/AP account, and moves to receivables only when applied to an invoice. OFF keeps today's behaviour bit-identical.";
                                    readonly brd: "FR-11.3";
                                    readonly phase: "P12.6";
                                };
                                readonly default_advance_received_account_id: {
                                    readonly group: "features";
                                    readonly type: "string";
                                    readonly default: "";
                                    readonly labelAr: "حساب الدفعات المقدمة المقبوضة";
                                    readonly labelEn: "Advance received account";
                                    readonly descriptionAr: "حساب التزام يستقبل مقدَّمات العملاء — مطلوب لتفعيل الترحيل المنفصل على سندات القبض.";
                                    readonly descriptionEn: "Liability account holding customer advances — required by separate booking on receive payments.";
                                    readonly brd: "FR-11.3";
                                    readonly phase: "P12.6";
                                };
                                readonly default_advance_paid_account_id: {
                                    readonly group: "features";
                                    readonly type: "string";
                                    readonly default: "";
                                    readonly labelAr: "حساب الدفعات المقدمة المدفوعة";
                                    readonly labelEn: "Advance paid account";
                                    readonly descriptionAr: "حساب أصل يستقبل مقدَّمات الموردين — مطلوب لتفعيل الترحيل المنفصل على سندات الدفع.";
                                    readonly descriptionEn: "Asset account holding supplier advances — required by separate booking on pay payments.";
                                    readonly brd: "FR-11.3";
                                    readonly phase: "P12.6";
                                };
                                readonly adapter_cogs_account_id: {
                                    readonly group: "features";
                                    readonly type: "string";
                                    readonly default: "";
                                    readonly labelAr: "حساب تكلفة البضاعة المباعة";
                                    readonly labelEn: "Cost of goods sold account";
                                    readonly descriptionAr: "حساب المصروف الذي يُقيَّد عليه مدينًا بتكلفة أصناف نقطة البيع وقت صرفها (BRD §7.2 سطر 5) — مطلوب لتفعيل محول نقطة البيع.";
                                    readonly descriptionEn: "Expense account debited with the valuation cost of POS items at issue (BRD §7.2 row 5) — required by the POS adapter.";
                                    readonly brd: "§7.2";
                                    readonly phase: "P12B.5";
                                };
                                readonly adapter_stock_account_id: {
                                    readonly group: "features";
                                    readonly type: "string";
                                    readonly default: "";
                                    readonly labelAr: "حساب المخزون";
                                    readonly labelEn: "Stock account";
                                    readonly descriptionAr: "حساب الأصل الذي يُقيَّد عليه دائنًا بنفس التكلفة عند صرف أصناف نقطة البيع — الطرف المقابل لتكلفة البضاعة المباعة.";
                                    readonly descriptionEn: "Asset account credited with the same cost when POS items are issued — the counter-leg of COGS.";
                                    readonly brd: "§7.2";
                                    readonly phase: "P12B.5";
                                };
                                readonly automatically_process_deferred_accounting_entry: {
                                    readonly group: "deferred";
                                    readonly type: "boolean";
                                    readonly default: true;
                                    readonly labelAr: "معالجة الاستحقاق المؤجل تلقائيًا";
                                    readonly labelEn: "Automatically process deferred accounting entry";
                                    readonly descriptionAr: "تشغيل مهمة الاعتراف الشهري بالإيراد/المصروف المؤجل.";
                                    readonly descriptionEn: "Run the monthly deferred revenue/expense recognition job.";
                                    readonly brd: "§15";
                                    readonly phase: "P12.2";
                                };
                                readonly book_deferred_entries_via_journal_entry: {
                                    readonly group: "deferred";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "ترحيل الاستحقاق المؤجل عبر قيد يومية";
                                    readonly labelEn: "Book deferred entries via Journal Entry";
                                    readonly descriptionAr: "إنشاء قيود يومية بدل الترحيل المباشر إلى الأستاذ.";
                                    readonly descriptionEn: "Create journal entries instead of posting straight to the ledger.";
                                    readonly brd: "§15";
                                    readonly phase: "P12.2";
                                };
                                readonly submit_journal_entries: {
                                    readonly group: "deferred";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "ترحيل قيود الاستحقاق تلقائيًا";
                                    readonly labelEn: "Submit journal entries";
                                    readonly descriptionAr: "ترحيل القيود المُنشأة تلقائيًا بدل تركها مسودات.";
                                    readonly descriptionEn: "Submit the generated entries automatically instead of leaving them as drafts.";
                                    readonly brd: "§15";
                                    readonly phase: "P12.2";
                                };
                                readonly book_deferred_entries_based_on: {
                                    readonly group: "deferred";
                                    readonly type: "enum";
                                    readonly options: readonly ["Days", "Months"];
                                    readonly default: "Days";
                                    readonly labelAr: "أساس توزيع الاستحقاق المؤجل";
                                    readonly labelEn: "Book deferred entries based on";
                                    readonly descriptionAr: "توزيع المبلغ على الأيام أو على الأشهر.";
                                    readonly descriptionEn: "Spread the amount over days or over months.";
                                    readonly brd: "§15";
                                    readonly phase: "P12.2";
                                };
                                readonly book_asset_depreciation_entry_automatically: {
                                    readonly group: "deferred";
                                    readonly type: "boolean";
                                    readonly default: true;
                                    readonly labelAr: "ترحيل الإهلاك تلقائيًا";
                                    readonly labelEn: "Book asset depreciation entry automatically";
                                    readonly descriptionAr: "خاص بوحدة الأصول الثابتة عند إضافتها.";
                                    readonly descriptionEn: "Applies to the fixed-assets module once it is added.";
                                    readonly brd: "§19";
                                };
                                readonly enable_common_party_accounting: {
                                    readonly group: "features";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "محاسبة الطرف المشترك";
                                    readonly labelEn: "Enable common party accounting";
                                    readonly descriptionAr: "معاملة العميل والمورّد المرتبطين كطرف واحد وترحيل قيد المقاصة.";
                                    readonly descriptionEn: "Treat a linked customer and supplier as one party and post the offsetting entry.";
                                    readonly brd: "§4.10";
                                    readonly phase: "P12.8";
                                };
                                readonly enable_accounting_dimensions: {
                                    readonly group: "features";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "الأبعاد المحاسبية";
                                    readonly labelEn: "Enable accounting dimensions";
                                    readonly descriptionAr: "تفعيل الأبعاد التحليلية على المستندات والقيود.";
                                    readonly descriptionEn: "Enable analytical dimensions on documents and ledger entries.";
                                    readonly brd: "§4.5";
                                    readonly phase: "P10.4";
                                };
                                readonly enable_subscriptions: {
                                    readonly group: "features";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "الاشتراكات والفوترة الدورية";
                                    readonly labelEn: "Enable subscriptions";
                                    readonly descriptionAr: "توليد فواتير دورية من خطط الاشتراك.";
                                    readonly descriptionEn: "Generate recurring invoices from subscription plans.";
                                    readonly brd: "FR-17.2";
                                    readonly phase: "P12.5";
                                };
                                readonly enable_loyalty_programs: {
                                    readonly group: "features";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "برامج الولاء (متجاوَز)";
                                    readonly labelEn: "Enable loyalty programs (superseded)";
                                    readonly descriptionAr: "لم يعد هذا المفتاح يفعل شيئًا. تُفعَّل وحدة الولاء من «المالية ← الولاء ← برنامج الولاء».";
                                    readonly descriptionEn: "This flag no longer does anything. Enable the loyalty module from Finance → Loyalty → Loyalty Program.";
                                    readonly brd: "§1.3";
                                    readonly supersededBy: "clinic_loyalty_settings.enableLoyaltyModule";
                                };
                                readonly show_balance_in_coa: {
                                    readonly group: "features";
                                    readonly type: "boolean";
                                    readonly default: true;
                                    readonly labelAr: "إظهار الأرصدة في دليل الحسابات";
                                    readonly labelEn: "Show balance in Chart of Accounts";
                                    readonly descriptionAr: "عرض عمود الرصيد ضمن شجرة الحسابات.";
                                    readonly descriptionEn: "Show the balance column in the chart-of-accounts tree.";
                                    readonly brd: "§19";
                                    readonly phase: "P1.2";
                                };
                                readonly repost_allowed_types: {
                                    readonly group: "features";
                                    readonly type: "string_list";
                                    readonly default: readonly [];
                                    readonly labelAr: "أنواع المستندات المسموح بإعادة ترحيلها";
                                    readonly labelEn: "Repost allowed doctypes";
                                    readonly descriptionAr: "المستندات التي تقبل إعادة بناء قيودها بعد الترحيل.";
                                    readonly descriptionEn: "Documents whose ledger entries may be rebuilt after submission.";
                                    readonly brd: "FR-6.9";
                                    readonly phase: "P12.9";
                                };
                                readonly enable_membership_module: {
                                    readonly group: "features";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "تفعيل وحدة العضويات";
                                    readonly labelEn: "Enable membership module";
                                    readonly descriptionAr: "العلم الرئيسي لوحدة العضويات — إيقافه يُبقي مسار تسعير الفواتير كما هو اليوم تمامًا (تمرير محايد، انضباط FR-11.3).";
                                    readonly descriptionEn: "Master flag for the membership module — OFF keeps the invoice pricing path byte-identical to today (FR-11.3 flag discipline).";
                                    readonly brd: "MI §7.3";
                                    readonly phase: "MI-P0";
                                };
                                readonly enable_insurance_module: {
                                    readonly group: "features";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "تفعيل وحدة التأمين";
                                    readonly labelEn: "Enable insurance module";
                                    readonly descriptionAr: "العلم الرئيسي لوحدة التأمين — إيقافه يُبقي شاشة الدفع وتقسيم الفواتير كما هما اليوم تمامًا (تمرير محايد).";
                                    readonly descriptionEn: "Master flag for the insurance module — OFF keeps the pay screen and invoice splitting exactly as they are today (neutral pass-through).";
                                    readonly brd: "MI §7.3";
                                    readonly phase: "MI-P0";
                                };
                                readonly membership_income_account_id: {
                                    readonly group: "features";
                                    readonly type: "string";
                                    readonly default: "";
                                    readonly labelAr: "حساب إيراد العضويات";
                                    readonly labelEn: "Membership income account";
                                    readonly descriptionAr: "حساب الإيراد الذي تُقيَّد عليه رسوم اشتراكات العضوية — يُفحص عند أول استخدام بعد تفعيل الوحدة، لا عند الحفظ (قرار MI-P0).";
                                    readonly descriptionEn: "Income account credited with membership subscription fees — checked at first use after enabling the module, not at save (MI-P0 decision).";
                                    readonly brd: "MI §7.3";
                                    readonly phase: "MI-P0";
                                };
                                readonly membership_deferred_account_id: {
                                    readonly group: "features";
                                    readonly type: "string";
                                    readonly default: "";
                                    readonly labelAr: "حساب الإيراد المؤجل للعضويات";
                                    readonly labelEn: "Membership deferred revenue account";
                                    readonly descriptionAr: "حساب التزام يستقبل رسوم العضوية عند التأجيل — مطلوب فقط متى وُجدت خطة تؤجل الإيراد، ويُفحص عند الاستخدام (MI-P1).";
                                    readonly descriptionEn: "Liability account holding deferred membership fees — required only when some plan defers revenue, checked at use (MI-P1).";
                                    readonly brd: "MI §7.3";
                                    readonly phase: "MI-P0";
                                };
                                readonly membership_active_on_enroll: {
                                    readonly group: "features";
                                    readonly type: "boolean";
                                    readonly default: false;
                                    readonly labelAr: "تفعيل العضوية فور التسجيل";
                                    readonly labelEn: "Membership active on enroll";
                                    readonly descriptionAr: "تصبح العضوية فعّالة عند التسجيل دون انتظار سداد أول فاتورة (بيع كاونتر والنقد في اليد) — الافتراضي انتظار السداد.";
                                    readonly descriptionEn: "Membership turns ACTIVE at enrollment without waiting for the first invoice to be paid (counter sale, cash in hand) — default waits for payment.";
                                    readonly brd: "MI FR-M5.1";
                                    readonly phase: "MI-P0";
                                };
                                readonly membership_stacks_with_coupons: {
                                    readonly group: "features";
                                    readonly type: "boolean";
                                    readonly default: true;
                                    readonly labelAr: "جمع خصم العضوية مع الكوبونات";
                                    readonly labelEn: "Membership stacks with coupons";
                                    readonly descriptionAr: "خصم العضوية أولًا ثم الكوبون على المتبقي (ترتيب §6.4) — إيقافه يُطبّق التخفيض الأكبر وحده.";
                                    readonly descriptionEn: "Membership discount first, then the coupon on the remainder (§6.4 order) — OFF applies only the larger single reduction.";
                                    readonly brd: "MI BR-M6.6";
                                    readonly phase: "MI-P0";
                                };
                            };
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
    };
} & {
    accounting: {
        "accounts-settings": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("./accounts-settings/accounts-settings.type").AccountsSettingsValues;
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
        "accounts-settings": {
            patch: {
                body: {
                    [x: string]: string | number | boolean | string[] | null;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("./accounts-settings/accounts-settings.type").AccountsSettingsValues;
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
} & {
    accounting: {
        jobs: {};
    };
} & {
    accounting: {
        jobs: {
            get: {
                body: {};
                params: {};
                query: {
                    status?: "QUEUED" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | undefined;
                    limit?: number | undefined;
                    jobType?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        status: import("./jobs/accounting-jobs.type").AccountingJobStatus;
                        voucherType: string | null;
                        voucherId: string | null;
                        jobType: string;
                        idempotencyKey: string;
                        payload: import("@prisma/client/runtime/client").JsonValue;
                        attempts: number;
                        errorMessage: string | null;
                        startedAt: Date | null;
                        finishedAt: Date | null;
                    }[];
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
} & {
    accounting: {
        jobs: {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            status: import("./jobs/accounting-jobs.type").AccountingJobStatus;
                            voucherType: string | null;
                            voucherId: string | null;
                            jobType: string;
                            idempotencyKey: string;
                            payload: import("@prisma/client/runtime/client").JsonValue;
                            attempts: number;
                            errorMessage: string | null;
                            startedAt: Date | null;
                            finishedAt: Date | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "المهمة غير موجودة";
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
    };
} & {
    accounting: {
        "voucher-demo": {};
    };
} & {
    accounting: {
        "voucher-demo": {
            get: {
                body: {};
                params: {};
                query: {
                    limit?: number | undefined;
                    docstatus?: "DRAFT" | "SUBMITTED" | "CANCELLED" | undefined;
                };
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        title: string;
                        docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        postingDate: Date;
                        amount: import("@prisma/client-runtime-utils").Decimal;
                        documentNo: string | null;
                    }[];
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
} & {
    accounting: {
        "voucher-demo": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
                            docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                            amendedFromId: string | null;
                            submittedAt: Date | null;
                            submittedById: string | null;
                            cancelledAt: Date | null;
                            cancelledById: string | null;
                            postingDate: Date;
                            amount: import("@prisma/client-runtime-utils").Decimal;
                            documentNo: string | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "المستند غير موجود";
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
    };
} & {
    accounting: {
        "voucher-demo": {
            post: {
                body: {
                    title: string;
                    postingDate: string;
                    amount: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        title: string;
                        docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        postingDate: Date;
                        amount: import("@prisma/client-runtime-utils").Decimal;
                        documentNo: string | null;
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
} & {
    accounting: {
        "voucher-demo": {
            ":id": {
                patch: {
                    body: {
                        title?: string | undefined;
                        amount?: string | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
                            docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                            amendedFromId: string | null;
                            submittedAt: Date | null;
                            submittedById: string | null;
                            cancelledAt: Date | null;
                            cancelledById: string | null;
                            postingDate: Date;
                            amount: import("@prisma/client-runtime-utils").Decimal;
                            documentNo: string | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "المستند غير موجود";
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
    };
} & {
    accounting: {
        "voucher-demo": {
            ":id": {
                submit: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                title: string;
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                postingDate: Date;
                                amount: import("@prisma/client-runtime-utils").Decimal;
                                documentNo: string | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "المستند غير موجود";
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
        };
    };
} & {
    accounting: {
        "voucher-demo": {
            ":id": {
                cancel: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                title: string;
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                postingDate: Date;
                                amount: import("@prisma/client-runtime-utils").Decimal;
                                documentNo: string | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "المستند غير موجود";
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
        };
    };
} & {
    accounting: {
        "voucher-demo": {
            ":id": {
                amend: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                title: string;
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                postingDate: Date;
                                amount: import("@prisma/client-runtime-utils").Decimal;
                                documentNo: string | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "المستند غير موجود";
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
        };
    };
} & {
    accounting: {
        accounts: {};
    };
} & {
    accounting: {
        accounts: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        disabled: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                        accountName: string;
                        accountNumber: string | null;
                        parentAccountId: string | null;
                        isGroup: boolean;
                        rootType: import("../../../generated/prisma/enums").AccountRootType;
                        reportType: import("../../../generated/prisma/enums").AccountReportType;
                        accountType: import("../../../generated/prisma/enums").AccountType | null;
                        accountCurrencyCode: string;
                        taxRate: import("@prisma/client-runtime-utils").Decimal | null;
                        balanceMustBe: import("../../../generated/prisma/enums").BalanceMustBe;
                        freezeAccount: boolean;
                        lft: number;
                        rgt: number;
                    }[];
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
        accounts: {
            import: {
                template: {
                    get: {
                        body: {};
                        params: {};
                        query: {};
                        headers: {};
                        response: {
                            200: string;
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
        };
    };
} & {
    accounting: {
        accounts: {
            import: {
                preview: {
                    post: {
                        body: {
                            csv: string;
                        };
                        params: {};
                        query: {};
                        headers: {};
                        response: {
                            200: import("./account/coa-import").ImportPlan;
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
        };
    };
} & {
    accounting: {
        accounts: {
            import: {
                commit: {
                    post: {
                        body: {
                            csv: string;
                        };
                        params: {};
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                created: number;
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
        };
    };
} & {
    accounting: {
        accounts: {
            import: {
                "seed-standard": {
                    post: {
                        body: {};
                        params: {};
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                created: number;
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
        };
    };
} & {
    accounting: {
        accounts: {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            accountName: string;
                            accountNumber: string | null;
                            parentAccountId: string | null;
                            isGroup: boolean;
                            rootType: import("../../../generated/prisma/enums").AccountRootType;
                            reportType: import("../../../generated/prisma/enums").AccountReportType;
                            accountType: import("../../../generated/prisma/enums").AccountType | null;
                            accountCurrencyCode: string;
                            taxRate: import("@prisma/client-runtime-utils").Decimal | null;
                            balanceMustBe: import("../../../generated/prisma/enums").BalanceMustBe;
                            freezeAccount: boolean;
                            lft: number;
                            rgt: number;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "الحساب غير موجود";
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
    };
} & {
    accounting: {
        accounts: {
            post: {
                body: {
                    disabled?: boolean | undefined;
                    accountNumber?: string | null | undefined;
                    parentAccountId?: string | null | undefined;
                    isGroup?: boolean | undefined;
                    accountType?: "EQUITY" | "BANK" | "CASH" | "RECEIVABLE" | "PAYABLE" | "TAX" | "STOCK" | "FIXED_ASSET" | "ACCUMULATED_DEPRECIATION" | "DEPRECIATION" | "EXPENSE_ACCOUNT" | "INCOME_ACCOUNT" | "CHARGEABLE" | "ROUND_OFF" | "ROUND_OFF_FOR_OPENING" | "TEMPORARY" | "DIRECT_INCOME" | "INDIRECT_INCOME" | "DIRECT_EXPENSE" | "INDIRECT_EXPENSE" | "COST_OF_GOODS_SOLD" | "CURRENT_ASSET" | "CURRENT_LIABILITY" | "CAPITAL_WORK_IN_PROGRESS" | "ASSET_RECEIVED_BUT_NOT_BILLED" | "STOCK_RECEIVED_BUT_NOT_BILLED" | "SERVICE_RECEIVED_BUT_NOT_BILLED" | "STOCK_ADJUSTMENT" | null | undefined;
                    accountCurrencyCode?: string | undefined;
                    taxRate?: string | null | undefined;
                    balanceMustBe?: "NONE" | "DEBIT" | "CREDIT" | undefined;
                    freezeAccount?: boolean | undefined;
                    accountName: string;
                    rootType: "ASSET" | "LIABILITY" | "INCOME" | "EXPENSE" | "EQUITY";
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        id: string;
                        clinicId: string;
                        disabled: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                        accountName: string;
                        accountNumber: string | null;
                        parentAccountId: string | null;
                        isGroup: boolean;
                        rootType: import("../../../generated/prisma/enums").AccountRootType;
                        reportType: import("../../../generated/prisma/enums").AccountReportType;
                        accountType: import("../../../generated/prisma/enums").AccountType | null;
                        accountCurrencyCode: string;
                        taxRate: import("@prisma/client-runtime-utils").Decimal | null;
                        balanceMustBe: import("../../../generated/prisma/enums").BalanceMustBe;
                        freezeAccount: boolean;
                        lft: number;
                        rgt: number;
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
} & {
    accounting: {
        accounts: {
            ":id": {
                patch: {
                    body: {
                        disabled?: boolean | undefined;
                        accountName?: string | undefined;
                        accountNumber?: string | null | undefined;
                        isGroup?: boolean | undefined;
                        accountType?: "EQUITY" | "BANK" | "CASH" | "RECEIVABLE" | "PAYABLE" | "TAX" | "STOCK" | "FIXED_ASSET" | "ACCUMULATED_DEPRECIATION" | "DEPRECIATION" | "EXPENSE_ACCOUNT" | "INCOME_ACCOUNT" | "CHARGEABLE" | "ROUND_OFF" | "ROUND_OFF_FOR_OPENING" | "TEMPORARY" | "DIRECT_INCOME" | "INDIRECT_INCOME" | "DIRECT_EXPENSE" | "INDIRECT_EXPENSE" | "COST_OF_GOODS_SOLD" | "CURRENT_ASSET" | "CURRENT_LIABILITY" | "CAPITAL_WORK_IN_PROGRESS" | "ASSET_RECEIVED_BUT_NOT_BILLED" | "STOCK_RECEIVED_BUT_NOT_BILLED" | "SERVICE_RECEIVED_BUT_NOT_BILLED" | "STOCK_ADJUSTMENT" | null | undefined;
                        accountCurrencyCode?: string | undefined;
                        taxRate?: string | null | undefined;
                        balanceMustBe?: "NONE" | "DEBIT" | "CREDIT" | undefined;
                        freezeAccount?: boolean | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            accountName: string;
                            accountNumber: string | null;
                            parentAccountId: string | null;
                            isGroup: boolean;
                            rootType: import("../../../generated/prisma/enums").AccountRootType;
                            reportType: import("../../../generated/prisma/enums").AccountReportType;
                            accountType: import("../../../generated/prisma/enums").AccountType | null;
                            accountCurrencyCode: string;
                            taxRate: import("@prisma/client-runtime-utils").Decimal | null;
                            balanceMustBe: import("../../../generated/prisma/enums").BalanceMustBe;
                            freezeAccount: boolean;
                            lft: number;
                            rgt: number;
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
    };
} & {
    accounting: {
        accounts: {
            ":id": {
                move: {
                    post: {
                        body: {
                            parentAccountId: string | null;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                disabled: boolean;
                                createdAt: Date;
                                updatedAt: Date;
                                accountName: string;
                                accountNumber: string | null;
                                parentAccountId: string | null;
                                isGroup: boolean;
                                rootType: import("../../../generated/prisma/enums").AccountRootType;
                                reportType: import("../../../generated/prisma/enums").AccountReportType;
                                accountType: import("../../../generated/prisma/enums").AccountType | null;
                                accountCurrencyCode: string;
                                taxRate: import("@prisma/client-runtime-utils").Decimal | null;
                                balanceMustBe: import("../../../generated/prisma/enums").BalanceMustBe;
                                freezeAccount: boolean;
                                lft: number;
                                rgt: number;
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
        };
    };
} & {
    accounting: {
        accounts: {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
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
    };
} & {
    accounting: {
        "fiscal-years": {};
    };
} & {
    accounting: {
        "fiscal-years": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        year: string;
                        yearStartDate: Date;
                        yearEndDate: Date;
                        isShortYear: boolean;
                        disabled: boolean;
                        autoCreated: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                    }[];
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
        "fiscal-years": {
            resolve: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        date: string;
                    };
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            year: string;
                            yearStartDate: Date;
                            yearEndDate: Date;
                            isShortYear: boolean;
                            disabled: boolean;
                            autoCreated: boolean;
                            createdAt: Date;
                            updatedAt: Date;
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
    };
} & {
    accounting: {
        "fiscal-years": {
            post: {
                body: {
                    isShortYear?: boolean | undefined;
                    disabled?: boolean | undefined;
                    year: string;
                    yearStartDate: string;
                    yearEndDate: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        year: string;
                        yearStartDate: Date;
                        yearEndDate: Date;
                        isShortYear: boolean;
                        disabled: boolean;
                        autoCreated: boolean;
                        createdAt: Date;
                        updatedAt: Date;
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
} & {
    accounting: {
        "fiscal-years": {
            next: {
                post: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            year: string;
                            yearStartDate: Date;
                            yearEndDate: Date;
                            isShortYear: boolean;
                            disabled: boolean;
                            autoCreated: boolean;
                            createdAt: Date;
                            updatedAt: Date;
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
    };
} & {
    accounting: {
        "fiscal-years": {
            ":id": {
                patch: {
                    body: {
                        year?: string | undefined;
                        yearStartDate?: string | undefined;
                        yearEndDate?: string | undefined;
                        isShortYear?: boolean | undefined;
                        disabled?: boolean | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            year: string;
                            yearStartDate: Date;
                            yearEndDate: Date;
                            isShortYear: boolean;
                            disabled: boolean;
                            autoCreated: boolean;
                            createdAt: Date;
                            updatedAt: Date;
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
    };
} & {
    accounting: {
        "fiscal-years": {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
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
    };
} & {
    accounting: {
        "accounting-periods": {};
    };
} & {
    accounting: {
        "accounting-periods": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        periodName: string;
                        startDate: Date;
                        endDate: Date;
                        docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        closedDocuments: {
                            id: string;
                            documentType: string;
                            closed: boolean;
                        }[];
                    }[];
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
        "accounting-periods": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            periodName: string;
                            startDate: Date;
                            endDate: Date;
                            docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                            amendedFromId: string | null;
                            submittedAt: Date | null;
                            submittedById: string | null;
                            cancelledAt: Date | null;
                            cancelledById: string | null;
                            closedDocuments: {
                                id: string;
                                documentType: string;
                                closed: boolean;
                            }[];
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
    };
} & {
    accounting: {
        "accounting-periods": {
            post: {
                body: {
                    periodName: string;
                    startDate: string;
                    endDate: string;
                    closedDocumentTypes: string[];
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        periodName: string;
                        startDate: Date;
                        endDate: Date;
                        docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        closedDocuments: {
                            id: string;
                            documentType: string;
                            closed: boolean;
                        }[];
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
} & {
    accounting: {
        "accounting-periods": {
            ":id": {
                submit: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                periodName: string;
                                startDate: Date;
                                endDate: Date;
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                closedDocuments: {
                                    id: string;
                                    documentType: string;
                                    closed: boolean;
                                }[];
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
        };
    };
} & {
    accounting: {
        "accounting-periods": {
            ":id": {
                cancel: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                periodName: string;
                                startDate: Date;
                                endDate: Date;
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                closedDocuments: {
                                    id: string;
                                    documentType: string;
                                    closed: boolean;
                                }[];
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
        };
    };
} & {
    accounting: {
        "accounting-periods": {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
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
    };
} & {
    accounting: {
        "period-closing-vouchers": {};
    };
} & {
    accounting: {
        "period-closing-vouchers": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        fiscalYear: string;
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        remarks: string | null;
                        docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        postingDate: Date;
                        documentNo: string | null;
                        errorMessage: string | null;
                        periodStartDate: Date;
                        periodEndDate: Date;
                        closingAccountHeadId: string;
                        granularByDimensions: boolean;
                        gleProcessingStatus: import("./jobs/accounting-jobs.type").AccountingJobStatus;
                        closingAccountHead: {
                            accountName: string;
                            accountNumber: string | null;
                            rootType: import("../../../generated/prisma/enums").AccountRootType;
                        };
                    }[];
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
        "period-closing-vouchers": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            fiscalYear: string;
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            remarks: string | null;
                            docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                            amendedFromId: string | null;
                            submittedAt: Date | null;
                            submittedById: string | null;
                            cancelledAt: Date | null;
                            cancelledById: string | null;
                            postingDate: Date;
                            documentNo: string | null;
                            errorMessage: string | null;
                            periodStartDate: Date;
                            periodEndDate: Date;
                            closingAccountHeadId: string;
                            granularByDimensions: boolean;
                            gleProcessingStatus: import("./jobs/accounting-jobs.type").AccountingJobStatus;
                            closingAccountHead: {
                                accountName: string;
                                accountNumber: string | null;
                                rootType: import("../../../generated/prisma/enums").AccountRootType;
                            };
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
    };
} & {
    accounting: {
        "period-closing-vouchers": {
            post: {
                body: {
                    remarks?: string | null | undefined;
                    granularByDimensions?: boolean | undefined;
                    periodStartDate: string;
                    periodEndDate: string;
                    closingAccountHeadId: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        fiscalYear: string;
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        remarks: string | null;
                        docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        postingDate: Date;
                        documentNo: string | null;
                        errorMessage: string | null;
                        periodStartDate: Date;
                        periodEndDate: Date;
                        closingAccountHeadId: string;
                        granularByDimensions: boolean;
                        gleProcessingStatus: import("./jobs/accounting-jobs.type").AccountingJobStatus;
                        closingAccountHead: {
                            accountName: string;
                            accountNumber: string | null;
                            rootType: import("../../../generated/prisma/enums").AccountRootType;
                        };
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
} & {
    accounting: {
        "period-closing-vouchers": {
            ":id": {
                submit: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                fiscalYear: string;
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                remarks: string | null;
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                postingDate: Date;
                                documentNo: string | null;
                                errorMessage: string | null;
                                periodStartDate: Date;
                                periodEndDate: Date;
                                closingAccountHeadId: string;
                                granularByDimensions: boolean;
                                gleProcessingStatus: import("./jobs/accounting-jobs.type").AccountingJobStatus;
                                closingAccountHead: {
                                    accountName: string;
                                    accountNumber: string | null;
                                    rootType: import("../../../generated/prisma/enums").AccountRootType;
                                };
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
        };
    };
} & {
    accounting: {
        "period-closing-vouchers": {
            ":id": {
                cancel: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                fiscalYear: string;
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                remarks: string | null;
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                postingDate: Date;
                                documentNo: string | null;
                                errorMessage: string | null;
                                periodStartDate: Date;
                                periodEndDate: Date;
                                closingAccountHeadId: string;
                                granularByDimensions: boolean;
                                gleProcessingStatus: import("./jobs/accounting-jobs.type").AccountingJobStatus;
                                closingAccountHead: {
                                    accountName: string;
                                    accountNumber: string | null;
                                    rootType: import("../../../generated/prisma/enums").AccountRootType;
                                };
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
        };
    };
} & {
    accounting: {
        "period-closing-vouchers": {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
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
    };
} & {
    accounting: {
        budgets: {};
    };
} & {
    accounting: {
        budgets: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        fiscalYear: string;
                        monthlyDistribution: {
                            distributionName: string;
                            percentages: {
                                month: number;
                                percentage: import("@prisma/client-runtime-utils").Decimal;
                            }[];
                        } | null;
                        costCenter: {
                            costCenterName: string;
                        } | null;
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        costCenterId: string | null;
                        accounts: {
                            account: {
                                accountName: string;
                                accountNumber: string | null;
                                rootType: import("../../../generated/prisma/enums").AccountRootType;
                            };
                            id: string;
                            idx: number;
                            accountId: string;
                            budgetAmount: import("@prisma/client-runtime-utils").Decimal;
                        }[];
                        docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        budgetAgainst: import("./budget/budget.type").BudgetAgainst;
                        project: string | null;
                        monthlyDistributionId: string | null;
                        applicableOnBookingActualExpenses: boolean;
                        actionIfAnnualExceeded: import("./budget/budget.type").BudgetAction;
                        actionIfAccumulatedMonthlyExceeded: import("./budget/budget.type").BudgetAction;
                        applicableOnMaterialRequest: boolean;
                        actionIfAnnualExceededOnMr: import("./budget/budget.type").BudgetAction;
                        actionIfAccumulatedMonthlyExceededOnMr: import("./budget/budget.type").BudgetAction;
                        applicableOnPurchaseOrder: boolean;
                        actionIfAnnualExceededOnPo: import("./budget/budget.type").BudgetAction;
                        actionIfAccumulatedMonthlyExceededOnPo: import("./budget/budget.type").BudgetAction;
                    }[];
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
        budgets: {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            fiscalYear: string;
                            monthlyDistribution: {
                                distributionName: string;
                                percentages: {
                                    month: number;
                                    percentage: import("@prisma/client-runtime-utils").Decimal;
                                }[];
                            } | null;
                            costCenter: {
                                costCenterName: string;
                            } | null;
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            costCenterId: string | null;
                            accounts: {
                                account: {
                                    accountName: string;
                                    accountNumber: string | null;
                                    rootType: import("../../../generated/prisma/enums").AccountRootType;
                                };
                                id: string;
                                idx: number;
                                accountId: string;
                                budgetAmount: import("@prisma/client-runtime-utils").Decimal;
                            }[];
                            docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                            amendedFromId: string | null;
                            submittedAt: Date | null;
                            submittedById: string | null;
                            cancelledAt: Date | null;
                            cancelledById: string | null;
                            budgetAgainst: import("./budget/budget.type").BudgetAgainst;
                            project: string | null;
                            monthlyDistributionId: string | null;
                            applicableOnBookingActualExpenses: boolean;
                            actionIfAnnualExceeded: import("./budget/budget.type").BudgetAction;
                            actionIfAccumulatedMonthlyExceeded: import("./budget/budget.type").BudgetAction;
                            applicableOnMaterialRequest: boolean;
                            actionIfAnnualExceededOnMr: import("./budget/budget.type").BudgetAction;
                            actionIfAccumulatedMonthlyExceededOnMr: import("./budget/budget.type").BudgetAction;
                            applicableOnPurchaseOrder: boolean;
                            actionIfAnnualExceededOnPo: import("./budget/budget.type").BudgetAction;
                            actionIfAccumulatedMonthlyExceededOnPo: import("./budget/budget.type").BudgetAction;
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
    };
} & {
    accounting: {
        budgets: {
            post: {
                body: {
                    costCenterId?: string | null | undefined;
                    budgetAgainst?: "COST_CENTER" | "PROJECT" | undefined;
                    project?: string | null | undefined;
                    monthlyDistributionId?: string | null | undefined;
                    applicableOnBookingActualExpenses?: boolean | undefined;
                    actionIfAnnualExceeded?: "STOP" | "WARN" | "IGNORE" | undefined;
                    actionIfAccumulatedMonthlyExceeded?: "STOP" | "WARN" | "IGNORE" | undefined;
                    fiscalYear: string;
                    accounts: {
                        accountId: string;
                        budgetAmount: string;
                    }[];
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        fiscalYear: string;
                        monthlyDistribution: {
                            distributionName: string;
                            percentages: {
                                month: number;
                                percentage: import("@prisma/client-runtime-utils").Decimal;
                            }[];
                        } | null;
                        costCenter: {
                            costCenterName: string;
                        } | null;
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        costCenterId: string | null;
                        accounts: {
                            account: {
                                accountName: string;
                                accountNumber: string | null;
                                rootType: import("../../../generated/prisma/enums").AccountRootType;
                            };
                            id: string;
                            idx: number;
                            accountId: string;
                            budgetAmount: import("@prisma/client-runtime-utils").Decimal;
                        }[];
                        docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        budgetAgainst: import("./budget/budget.type").BudgetAgainst;
                        project: string | null;
                        monthlyDistributionId: string | null;
                        applicableOnBookingActualExpenses: boolean;
                        actionIfAnnualExceeded: import("./budget/budget.type").BudgetAction;
                        actionIfAccumulatedMonthlyExceeded: import("./budget/budget.type").BudgetAction;
                        applicableOnMaterialRequest: boolean;
                        actionIfAnnualExceededOnMr: import("./budget/budget.type").BudgetAction;
                        actionIfAccumulatedMonthlyExceededOnMr: import("./budget/budget.type").BudgetAction;
                        applicableOnPurchaseOrder: boolean;
                        actionIfAnnualExceededOnPo: import("./budget/budget.type").BudgetAction;
                        actionIfAccumulatedMonthlyExceededOnPo: import("./budget/budget.type").BudgetAction;
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
} & {
    accounting: {
        budgets: {
            ":id": {
                submit: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                fiscalYear: string;
                                monthlyDistribution: {
                                    distributionName: string;
                                    percentages: {
                                        month: number;
                                        percentage: import("@prisma/client-runtime-utils").Decimal;
                                    }[];
                                } | null;
                                costCenter: {
                                    costCenterName: string;
                                } | null;
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                costCenterId: string | null;
                                accounts: {
                                    account: {
                                        accountName: string;
                                        accountNumber: string | null;
                                        rootType: import("../../../generated/prisma/enums").AccountRootType;
                                    };
                                    id: string;
                                    idx: number;
                                    accountId: string;
                                    budgetAmount: import("@prisma/client-runtime-utils").Decimal;
                                }[];
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                budgetAgainst: import("./budget/budget.type").BudgetAgainst;
                                project: string | null;
                                monthlyDistributionId: string | null;
                                applicableOnBookingActualExpenses: boolean;
                                actionIfAnnualExceeded: import("./budget/budget.type").BudgetAction;
                                actionIfAccumulatedMonthlyExceeded: import("./budget/budget.type").BudgetAction;
                                applicableOnMaterialRequest: boolean;
                                actionIfAnnualExceededOnMr: import("./budget/budget.type").BudgetAction;
                                actionIfAccumulatedMonthlyExceededOnMr: import("./budget/budget.type").BudgetAction;
                                applicableOnPurchaseOrder: boolean;
                                actionIfAnnualExceededOnPo: import("./budget/budget.type").BudgetAction;
                                actionIfAccumulatedMonthlyExceededOnPo: import("./budget/budget.type").BudgetAction;
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
        };
    };
} & {
    accounting: {
        budgets: {
            ":id": {
                cancel: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                fiscalYear: string;
                                monthlyDistribution: {
                                    distributionName: string;
                                    percentages: {
                                        month: number;
                                        percentage: import("@prisma/client-runtime-utils").Decimal;
                                    }[];
                                } | null;
                                costCenter: {
                                    costCenterName: string;
                                } | null;
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                costCenterId: string | null;
                                accounts: {
                                    account: {
                                        accountName: string;
                                        accountNumber: string | null;
                                        rootType: import("../../../generated/prisma/enums").AccountRootType;
                                    };
                                    id: string;
                                    idx: number;
                                    accountId: string;
                                    budgetAmount: import("@prisma/client-runtime-utils").Decimal;
                                }[];
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                budgetAgainst: import("./budget/budget.type").BudgetAgainst;
                                project: string | null;
                                monthlyDistributionId: string | null;
                                applicableOnBookingActualExpenses: boolean;
                                actionIfAnnualExceeded: import("./budget/budget.type").BudgetAction;
                                actionIfAccumulatedMonthlyExceeded: import("./budget/budget.type").BudgetAction;
                                applicableOnMaterialRequest: boolean;
                                actionIfAnnualExceededOnMr: import("./budget/budget.type").BudgetAction;
                                actionIfAccumulatedMonthlyExceededOnMr: import("./budget/budget.type").BudgetAction;
                                applicableOnPurchaseOrder: boolean;
                                actionIfAnnualExceededOnPo: import("./budget/budget.type").BudgetAction;
                                actionIfAccumulatedMonthlyExceededOnPo: import("./budget/budget.type").BudgetAction;
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
        };
    };
} & {
    accounting: {
        budgets: {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
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
    };
} & {
    accounting: {
        dimensions: {};
    };
} & {
    accounting: {
        dimensions: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        disabled: boolean;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        slot: number;
                        dimensionName: string;
                        referenceDoctype: string | null;
                        mandatoryForBalanceSheet: boolean;
                        mandatoryForProfitAndLoss: boolean;
                        defaultDimensionValue: string | null;
                        autoPostBalancingEntry: boolean;
                        offsettingAccountId: string | null;
                        offsettingAccount: {
                            accountName: string;
                        } | null;
                        filters: {
                            values: {
                                dimValue: string;
                            }[];
                            id: string;
                            disabled: boolean;
                            accounts: {
                                accountId: string;
                            }[];
                            allowOnly: boolean;
                        }[];
                    }[];
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
        dimensions: {
            put: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        disabled: boolean;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        slot: number;
                        dimensionName: string;
                        referenceDoctype: string | null;
                        mandatoryForBalanceSheet: boolean;
                        mandatoryForProfitAndLoss: boolean;
                        defaultDimensionValue: string | null;
                        autoPostBalancingEntry: boolean;
                        offsettingAccountId: string | null;
                        offsettingAccount: {
                            accountName: string;
                        } | null;
                        filters: {
                            values: {
                                dimValue: string;
                            }[];
                            id: string;
                            disabled: boolean;
                            accounts: {
                                accountId: string;
                            }[];
                            allowOnly: boolean;
                        }[];
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
} & {
    accounting: {
        dimensions: {
            ":id": {
                filter: {
                    put: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                disabled: boolean;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                slot: number;
                                dimensionName: string;
                                referenceDoctype: string | null;
                                mandatoryForBalanceSheet: boolean;
                                mandatoryForProfitAndLoss: boolean;
                                defaultDimensionValue: string | null;
                                autoPostBalancingEntry: boolean;
                                offsettingAccountId: string | null;
                                offsettingAccount: {
                                    accountName: string;
                                } | null;
                                filters: {
                                    values: {
                                        dimValue: string;
                                    }[];
                                    id: string;
                                    disabled: boolean;
                                    accounts: {
                                        accountId: string;
                                    }[];
                                    allowOnly: boolean;
                                }[];
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
        };
    };
} & {
    accounting: {
        dimensions: {
            ":id": {
                filter: {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            204: "No Content";
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
        };
    };
} & {
    accounting: {
        banks: {};
    };
} & {
    accounting: {
        banks: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        disabled: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                        website: string | null;
                        bankName: string;
                        swiftNumber: string | null;
                    }[];
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
        banks: {
            post: {
                body: {
                    disabled?: boolean | undefined;
                    website?: string | null | undefined;
                    swiftNumber?: string | null | undefined;
                    bankName: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        id: string;
                        clinicId: string;
                        disabled: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                        website: string | null;
                        bankName: string;
                        swiftNumber: string | null;
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
} & {
    accounting: {
        banks: {
            ":id": {
                patch: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            website: string | null;
                            bankName: string;
                            swiftNumber: string | null;
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
    };
} & {
    accounting: {
        banks: {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
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
    };
} & {
    accounting: {
        banks: {
            accounts: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            bank: {
                                bankName: string;
                            };
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            accountName: string;
                            accountType: string | null;
                            branchCode: string | null;
                            iban: string | null;
                            partyType: string | null;
                            partyId: string | null;
                            bankId: string;
                            isCompanyAccount: boolean;
                            glAccountId: string | null;
                            accountSubtype: string | null;
                            bankAccountNo: string | null;
                            integrationId: string | null;
                            glAccount: {
                                accountName: string;
                                accountCurrencyCode: string;
                            } | null;
                        }[];
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
    };
} & {
    accounting: {
        banks: {
            accounts: {
                post: {
                    body: {
                        disabled?: boolean | undefined;
                        accountType?: string | null | undefined;
                        branchCode?: string | null | undefined;
                        iban?: string | null | undefined;
                        partyType?: string | null | undefined;
                        partyId?: string | null | undefined;
                        isCompanyAccount?: boolean | undefined;
                        glAccountId?: string | null | undefined;
                        accountSubtype?: string | null | undefined;
                        bankAccountNo?: string | null | undefined;
                        accountName: string;
                        bankId: string;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            bank: {
                                bankName: string;
                            };
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            accountName: string;
                            accountType: string | null;
                            branchCode: string | null;
                            iban: string | null;
                            partyType: string | null;
                            partyId: string | null;
                            bankId: string;
                            isCompanyAccount: boolean;
                            glAccountId: string | null;
                            accountSubtype: string | null;
                            bankAccountNo: string | null;
                            integrationId: string | null;
                            glAccount: {
                                accountName: string;
                                accountCurrencyCode: string;
                            } | null;
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
    };
} & {
    accounting: {
        banks: {
            accounts: {
                ":id": {
                    patch: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                bank: {
                                    bankName: string;
                                };
                                id: string;
                                clinicId: string;
                                disabled: boolean;
                                createdAt: Date;
                                updatedAt: Date;
                                accountName: string;
                                accountType: string | null;
                                branchCode: string | null;
                                iban: string | null;
                                partyType: string | null;
                                partyId: string | null;
                                bankId: string;
                                isCompanyAccount: boolean;
                                glAccountId: string | null;
                                accountSubtype: string | null;
                                bankAccountNo: string | null;
                                integrationId: string | null;
                                glAccount: {
                                    accountName: string;
                                    accountCurrencyCode: string;
                                } | null;
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
        };
    };
} & {
    accounting: {
        banks: {
            accounts: {
                ":id": {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            204: "No Content";
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
        };
    };
} & {
    accounting: {
        "bank-transactions": {};
    };
} & {
    accounting: {
        "bank-transactions": {
            get: {
                body: {};
                params: {};
                query: {
                    status?: string | undefined;
                    bankAccountId?: string | undefined;
                    fromDate?: string | undefined;
                    toDate?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        bankAccount: {
                            accountName: string;
                        };
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        description: string | null;
                        currencyCode: string;
                        status: import("./bank/bank-transaction.type").BankTransactionStatus;
                        partyType: string | null;
                        partyId: string | null;
                        docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                        amendedFromId: string | null;
                        postingDate: Date;
                        documentNo: string | null;
                        payments: {
                            id: string;
                            allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                            paymentDocument: string;
                            paymentEntryId: string;
                            paymentRowId: string | null;
                        }[];
                        bankAccountId: string;
                        unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                        deposit: import("@prisma/client-runtime-utils").Decimal;
                        withdrawal: import("@prisma/client-runtime-utils").Decimal;
                        allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                        referenceNumber: string | null;
                        transactionId: string | null;
                        pairedTransactionId: string | null;
                        importId: string | null;
                    }[];
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
} & {
    accounting: {
        "bank-transactions": {
            "import-presets": {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            key: string;
                            labelAr: string;
                            verified: boolean;
                            config: import("./bank/statement-parser").BankImportMappingConfig;
                        }[];
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
    };
} & {
    accounting: {
        "bank-transactions": {
            mappings: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            bankId: string | null;
                            templateName: string;
                            config: import("@prisma/client/runtime/client").JsonValue;
                        }[];
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
    };
} & {
    accounting: {
        "bank-transactions": {
            mappings: {
                post: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            bankId: string | null;
                            templateName: string;
                            config: import("@prisma/client/runtime/client").JsonValue;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        422: {
                            readonly message: "templateName و config مطلوبان";
                        };
                    };
                };
            };
        };
    };
} & {
    accounting: {
        "bank-transactions": {
            mappings: {
                ":id": {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            204: "No Content";
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
        };
    };
} & {
    accounting: {
        "bank-transactions": {
            imports: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            errors: import("@prisma/client/runtime/client").JsonValue | null;
                            bankAccountId: string;
                            fileName: string;
                            mappingId: string | null;
                            totalRows: number;
                            importedRows: number;
                            duplicateRows: number;
                            errorRows: number;
                        }[];
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
    };
} & {
    accounting: {
        "bank-transactions": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            bankAccount: {
                                accountName: string;
                            };
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            description: string | null;
                            currencyCode: string;
                            status: import("./bank/bank-transaction.type").BankTransactionStatus;
                            partyType: string | null;
                            partyId: string | null;
                            docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                            amendedFromId: string | null;
                            postingDate: Date;
                            documentNo: string | null;
                            payments: {
                                id: string;
                                allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentDocument: string;
                                paymentEntryId: string;
                                paymentRowId: string | null;
                            }[];
                            bankAccountId: string;
                            unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                            deposit: import("@prisma/client-runtime-utils").Decimal;
                            withdrawal: import("@prisma/client-runtime-utils").Decimal;
                            allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                            referenceNumber: string | null;
                            transactionId: string | null;
                            pairedTransactionId: string | null;
                            importId: string | null;
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
    };
} & {
    accounting: {
        "bank-transactions": {
            post: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        bankAccount: {
                            accountName: string;
                        };
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        description: string | null;
                        currencyCode: string;
                        status: import("./bank/bank-transaction.type").BankTransactionStatus;
                        partyType: string | null;
                        partyId: string | null;
                        docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                        amendedFromId: string | null;
                        postingDate: Date;
                        documentNo: string | null;
                        payments: {
                            id: string;
                            allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                            paymentDocument: string;
                            paymentEntryId: string;
                            paymentRowId: string | null;
                        }[];
                        bankAccountId: string;
                        unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                        deposit: import("@prisma/client-runtime-utils").Decimal;
                        withdrawal: import("@prisma/client-runtime-utils").Decimal;
                        allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                        referenceNumber: string | null;
                        transactionId: string | null;
                        pairedTransactionId: string | null;
                        importId: string | null;
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
        "bank-transactions": {
            import: {
                post: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            rulesSettled: number;
                            importId: string;
                            totalRows: number;
                            importedRows: number;
                            duplicateRows: number;
                            errorRows: number;
                            errors: {
                                rowNumber: number;
                                message: string;
                            }[];
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
    };
} & {
    accounting: {
        "bank-transactions": {
            ":id": {
                submit: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                bankAccount: {
                                    accountName: string;
                                };
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                description: string | null;
                                currencyCode: string;
                                status: import("./bank/bank-transaction.type").BankTransactionStatus;
                                partyType: string | null;
                                partyId: string | null;
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                postingDate: Date;
                                documentNo: string | null;
                                payments: {
                                    id: string;
                                    allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentDocument: string;
                                    paymentEntryId: string;
                                    paymentRowId: string | null;
                                }[];
                                bankAccountId: string;
                                unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                deposit: import("@prisma/client-runtime-utils").Decimal;
                                withdrawal: import("@prisma/client-runtime-utils").Decimal;
                                allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                referenceNumber: string | null;
                                transactionId: string | null;
                                pairedTransactionId: string | null;
                                importId: string | null;
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
        };
    };
} & {
    accounting: {
        "bank-transactions": {
            ":id": {
                cancel: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                bankAccount: {
                                    accountName: string;
                                };
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                description: string | null;
                                currencyCode: string;
                                status: import("./bank/bank-transaction.type").BankTransactionStatus;
                                partyType: string | null;
                                partyId: string | null;
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                postingDate: Date;
                                documentNo: string | null;
                                payments: {
                                    id: string;
                                    allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentDocument: string;
                                    paymentEntryId: string;
                                    paymentRowId: string | null;
                                }[];
                                bankAccountId: string;
                                unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                deposit: import("@prisma/client-runtime-utils").Decimal;
                                withdrawal: import("@prisma/client-runtime-utils").Decimal;
                                allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                referenceNumber: string | null;
                                transactionId: string | null;
                                pairedTransactionId: string | null;
                                importId: string | null;
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
        };
    };
} & {
    accounting: {
        "bank-transactions": {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
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
    };
} & {
    accounting: {
        "bank-transactions": {
            rules: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: ({
                            contraAccount: {
                                accountName: string;
                            };
                        } & {
                            priority: number;
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            bankAccountId: string | null;
                            ruleName: string;
                            descriptionContains: string | null;
                            direction: import("./bank/bank-transaction.type").BankRuleDirection;
                            minAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            maxAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            contraAccountId: string;
                        })[];
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
    };
} & {
    accounting: {
        "bank-transactions": {
            rules: {
                post: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            priority: number;
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            bankAccountId: string | null;
                            ruleName: string;
                            descriptionContains: string | null;
                            direction: import("./bank/bank-transaction.type").BankRuleDirection;
                            minAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            maxAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            contraAccountId: string;
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
    };
} & {
    accounting: {
        "bank-transactions": {
            rules: {
                ":ruleId": {
                    delete: {
                        body: {};
                        params: {
                            ruleId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            204: "No Content";
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
        };
    };
} & {
    accounting: {
        "bank-transactions": {
            rules: {
                apply: {
                    post: {
                        body: {};
                        params: {};
                        query: {};
                        headers: {};
                        response: {
                            200: import("./bank/bank-rules.service").RuleRunResult;
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
        };
    };
} & {
    accounting: {
        "bank-transactions": {
            clearance: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        bankAccountId: string;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./bank/bank-clearance.service").ClearanceVoucherRow[];
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
    };
} & {
    accounting: {
        "bank-transactions": {
            clearance: {
                post: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            updated: number;
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
    };
} & {
    accounting: {
        "bank-transactions": {
            ":id": {
                candidates: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./bank/bank-reconciliation.service").ReconciliationCandidate[];
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
        };
    };
} & {
    accounting: {
        "bank-transactions": {
            ":id": {
                allocate: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                bankAccount: {
                                    accountName: string;
                                };
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                description: string | null;
                                currencyCode: string;
                                status: import("./bank/bank-transaction.type").BankTransactionStatus;
                                partyType: string | null;
                                partyId: string | null;
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                postingDate: Date;
                                documentNo: string | null;
                                payments: {
                                    id: string;
                                    allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentDocument: string;
                                    paymentEntryId: string;
                                    paymentRowId: string | null;
                                }[];
                                bankAccountId: string;
                                unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                deposit: import("@prisma/client-runtime-utils").Decimal;
                                withdrawal: import("@prisma/client-runtime-utils").Decimal;
                                allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                referenceNumber: string | null;
                                transactionId: string | null;
                                pairedTransactionId: string | null;
                                importId: string | null;
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
        };
    };
} & {
    accounting: {
        "bank-transactions": {
            ":id": {
                unallocate: {
                    ":paymentId": {
                        post: {
                            body: {};
                            params: {
                                id: string;
                                paymentId: string;
                            };
                            query: {};
                            headers: {};
                            response: {
                                200: {
                                    bankAccount: {
                                        accountName: string;
                                    };
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    description: string | null;
                                    currencyCode: string;
                                    status: import("./bank/bank-transaction.type").BankTransactionStatus;
                                    partyType: string | null;
                                    partyId: string | null;
                                    docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                    amendedFromId: string | null;
                                    postingDate: Date;
                                    documentNo: string | null;
                                    payments: {
                                        id: string;
                                        allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                        paymentDocument: string;
                                        paymentEntryId: string;
                                        paymentRowId: string | null;
                                    }[];
                                    bankAccountId: string;
                                    unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                    deposit: import("@prisma/client-runtime-utils").Decimal;
                                    withdrawal: import("@prisma/client-runtime-utils").Decimal;
                                    allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                    referenceNumber: string | null;
                                    transactionId: string | null;
                                    pairedTransactionId: string | null;
                                    importId: string | null;
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
            };
        };
    };
} & {
    accounting: {
        "bank-transactions": {
            ":id": {
                "create-payment-entry": {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                bankAccount: {
                                    accountName: string;
                                };
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                description: string | null;
                                currencyCode: string;
                                status: import("./bank/bank-transaction.type").BankTransactionStatus;
                                partyType: string | null;
                                partyId: string | null;
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                postingDate: Date;
                                documentNo: string | null;
                                payments: {
                                    id: string;
                                    allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentDocument: string;
                                    paymentEntryId: string;
                                    paymentRowId: string | null;
                                }[];
                                bankAccountId: string;
                                unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                deposit: import("@prisma/client-runtime-utils").Decimal;
                                withdrawal: import("@prisma/client-runtime-utils").Decimal;
                                allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                referenceNumber: string | null;
                                transactionId: string | null;
                                pairedTransactionId: string | null;
                                importId: string | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            409: {
                                readonly message: string;
                                readonly candidate: import("./bank/bank-reconciliation.service").ReconciliationCandidate;
                            };
                            422: {
                                readonly message: "نوع الطرف ومعرّفه مطلوبان";
                            } | {
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
        };
    };
} & {
    accounting: {
        "bank-transactions": {
            ":id": {
                "create-journal-entry": {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                bankAccount: {
                                    accountName: string;
                                };
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                description: string | null;
                                currencyCode: string;
                                status: import("./bank/bank-transaction.type").BankTransactionStatus;
                                partyType: string | null;
                                partyId: string | null;
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                postingDate: Date;
                                documentNo: string | null;
                                payments: {
                                    id: string;
                                    allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentDocument: string;
                                    paymentEntryId: string;
                                    paymentRowId: string | null;
                                }[];
                                bankAccountId: string;
                                unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                deposit: import("@prisma/client-runtime-utils").Decimal;
                                withdrawal: import("@prisma/client-runtime-utils").Decimal;
                                allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                referenceNumber: string | null;
                                transactionId: string | null;
                                pairedTransactionId: string | null;
                                importId: string | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            422: {
                                readonly message: "الحساب المقابل مطلوب";
                            } | {
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
        };
    };
} & {
    accounting: {
        "bank-transactions": {
            ":id": {
                "internal-transfer": {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                transaction: import("./bank/bank-transaction.type").BankTransactionResponse;
                                counterpartId: string;
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
        };
    };
} & {
    accounting: {
        "opening-invoices": {};
    };
} & {
    accounting: {
        "opening-invoices": {
            status: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: import("./opening/opening-invoice-tool.type").OpeningToolStatus;
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
    };
} & {
    accounting: {
        "opening-invoices": {
            post: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("./opening/opening-invoice-tool.type").OpeningInvoiceToolResult;
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
} & {
    accounting: {
        adapters: {};
    };
} & {
    accounting: {
        adapters: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        key: import("./adapters/adapter.type").AdapterKey;
                        flagKey: "enable_clinic_invoice_adapter" | "enable_expense_adapter" | "enable_pos_sale_adapter";
                        labelAr: string;
                        postings: number;
                    }[];
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
        adapters: {
            ":key": {
                run: {
                    post: {
                        body: {
                            fromDate: string;
                            toDate: string;
                        };
                        params: {
                            key: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./adapters/adapter.type").AdapterRunResult;
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
        };
    };
} & {
    accounting: {
        adapters: {
            ":key": {
                reconciliation: {
                    get: {
                        body: {};
                        params: {
                            key: string;
                        };
                        query: {
                            fromDate: string;
                            toDate: string;
                        };
                        headers: {};
                        response: {
                            200: import("./adapters/adapter.type").AdapterReconciliationReport;
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
        };
    };
} & {
    accounting: {
        readiness: {};
    };
} & {
    accounting: {
        readiness: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("./readiness/accounting-readiness.service").AccountingReadiness;
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
        deferred: {};
    };
} & {
    accounting: {
        deferred: {
            schedule: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        type?: string | undefined;
                    };
                    headers: {};
                    response: {
                        200: import("./deferred/deferred.report").DeferredScheduleReport;
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
    };
} & {
    accounting: {
        deferred: {
            runs: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            type: import("../../../generated/prisma/enums").DeferredType | null;
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            status: string;
                            errorMessage: string | null;
                            periodStartDate: Date;
                            periodEndDate: Date;
                            entriesCreated: number;
                            amountPosted: import("@prisma/client-runtime-utils").Decimal;
                        }[];
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
    };
} & {
    accounting: {
        deferred: {
            run: {
                post: {
                    body: {
                        type?: string | undefined;
                        periodStartDate: string;
                        periodEndDate: string;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: import("./deferred/deferred.service").DeferredRunResult;
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
    };
} & {
    accounting: {
        "tax-withholding": {};
    };
} & {
    accounting: {
        "tax-withholding": {
            categories: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            disabled: boolean;
                            title: string;
                            accountId: string | null;
                            basis: import("../../../generated/prisma/enums").TaxWithholdingBasis;
                            taxOnExcessAmount: boolean;
                            roundOffTaxAmount: boolean;
                            disableSingleThreshold: boolean;
                            disableCumulativeThreshold: boolean;
                            rates: {
                                id: string;
                                rate: import("@prisma/client-runtime-utils").Decimal;
                                fromDate: Date;
                                toDate: Date;
                                singleThreshold: import("@prisma/client-runtime-utils").Decimal;
                                cumulativeThreshold: import("@prisma/client-runtime-utils").Decimal;
                            }[];
                        }[];
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
    };
} & {
    accounting: {
        "tax-withholding": {
            categories: {
                post: {
                    body: {
                        accountId?: string | null | undefined;
                        disabled: boolean;
                        title: string;
                        basis: "GROSS" | "NET";
                        taxOnExcessAmount: boolean;
                        roundOffTaxAmount: boolean;
                        disableSingleThreshold: boolean;
                        disableCumulativeThreshold: boolean;
                        rates: {
                            rate: string;
                            fromDate: string;
                            toDate: string;
                            singleThreshold: string;
                            cumulativeThreshold: string;
                        }[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                            disabled: boolean;
                            title: string;
                            accountId: string | null;
                            basis: import("../../../generated/prisma/enums").TaxWithholdingBasis;
                            taxOnExcessAmount: boolean;
                            roundOffTaxAmount: boolean;
                            disableSingleThreshold: boolean;
                            disableCumulativeThreshold: boolean;
                            rates: {
                                id: string;
                                rate: import("@prisma/client-runtime-utils").Decimal;
                                fromDate: Date;
                                toDate: Date;
                                singleThreshold: import("@prisma/client-runtime-utils").Decimal;
                                cumulativeThreshold: import("@prisma/client-runtime-utils").Decimal;
                            }[];
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
    };
} & {
    accounting: {
        "tax-withholding": {
            categories: {
                ":id": {
                    patch: {
                        body: {
                            accountId?: string | null | undefined;
                            disabled: boolean;
                            title: string;
                            basis: "GROSS" | "NET";
                            taxOnExcessAmount: boolean;
                            roundOffTaxAmount: boolean;
                            disableSingleThreshold: boolean;
                            disableCumulativeThreshold: boolean;
                            rates: {
                                rate: string;
                                fromDate: string;
                                toDate: string;
                                singleThreshold: string;
                                cumulativeThreshold: string;
                            }[];
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                disabled: boolean;
                                title: string;
                                accountId: string | null;
                                basis: import("../../../generated/prisma/enums").TaxWithholdingBasis;
                                taxOnExcessAmount: boolean;
                                roundOffTaxAmount: boolean;
                                disableSingleThreshold: boolean;
                                disableCumulativeThreshold: boolean;
                                rates: {
                                    id: string;
                                    rate: import("@prisma/client-runtime-utils").Decimal;
                                    fromDate: Date;
                                    toDate: Date;
                                    singleThreshold: import("@prisma/client-runtime-utils").Decimal;
                                    cumulativeThreshold: import("@prisma/client-runtime-utils").Decimal;
                                }[];
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "فئة الاستقطاع غير موجودة";
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
        };
    };
} & {
    accounting: {
        "tax-withholding": {
            details: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate?: string | undefined;
                        toDate?: string | undefined;
                    };
                    headers: {};
                    response: {
                        200: import("./tax-withholding/tax-withholding.report").WithholdingDetailRow[];
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
    };
} & {
    accounting: {
        "tax-withholding": {
            summary: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate?: string | undefined;
                        toDate?: string | undefined;
                    };
                    headers: {};
                    response: {
                        200: import("./tax-withholding/tax-withholding.report").WithholdingSummaryRow[];
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
    };
} & {
    accounting: {
        "tax-withholding": {
            entries: {
                ":id": {
                    certificate: {
                        patch: {
                            body: {
                                certificateNo?: string | null | undefined;
                            };
                            params: {
                                id: string;
                            };
                            query: {};
                            headers: {};
                            response: {
                                200: {
                                    id: string;
                                    clinicId: string;
                                    createdById: string | null;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    rate: import("@prisma/client-runtime-utils").Decimal;
                                    taxAmount: import("@prisma/client-runtime-utils").Decimal;
                                    partyType: string;
                                    partyId: string;
                                    postingDate: Date;
                                    voucherType: string;
                                    voucherId: string;
                                    voucherNo: string;
                                    taxableAmount: import("@prisma/client-runtime-utils").Decimal;
                                    categoryId: string;
                                    certificateNo: string | null;
                                };
                                401: {
                                    readonly message: "غير مصرح";
                                };
                                403: {
                                    readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                                };
                                404: {
                                    readonly message: "سجل الاستقطاع غير موجود";
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
            };
        };
    };
} & {
    accounting: {
        "pos-shifts": {};
    };
} & {
    accounting: {
        "pos-shifts": {
            profiles: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            name: string;
                            id: string;
                            disabled: boolean;
                            writeOffAccountId: string | null;
                            users: {
                                userId: string;
                            }[];
                            warehouseId: string | null;
                            writeOffLimit: import("@prisma/client-runtime-utils").Decimal;
                        }[];
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
    };
} & {
    accounting: {
        "pos-shifts": {
            profiles: {
                post: {
                    body: {
                        disabled?: boolean | undefined;
                        writeOffAccountId?: string | null | undefined;
                        warehouseId?: string | null | undefined;
                        userIds?: string[] | undefined;
                        name: string;
                        writeOffLimit: string;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            name: string;
                            id: string;
                            disabled: boolean;
                            writeOffAccountId: string | null;
                            users: {
                                userId: string;
                            }[];
                            warehouseId: string | null;
                            writeOffLimit: import("@prisma/client-runtime-utils").Decimal;
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
    };
} & {
    accounting: {
        "pos-shifts": {
            current: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            profile: {
                                name: string;
                                id: string;
                            };
                            openedAt: Date;
                            balances: {
                                amount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("../invoices/invoices.type").PaymentMethod;
                            }[];
                        } | null;
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
    };
} & {
    accounting: {
        "pos-shifts": {
            open: {
                post: {
                    body: {
                        profileId: string;
                        balances: {
                            amount: string;
                            paymentMethod: "CASH" | "CARD" | "TRANSFER";
                        }[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                            status: import("../../../generated/prisma/enums").PosShiftStatus;
                            openedAt: Date;
                            balances: {
                                id: string;
                                amount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("../invoices/invoices.type").PaymentMethod;
                                openingId: string;
                            }[];
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
    };
} & {
    accounting: {
        "pos-shifts": {
            ":id": {
                expectation: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./pos-shift/pos-shift.service").ShiftExpectation[];
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
        };
    };
} & {
    accounting: {
        "pos-shifts": {
            ":id": {
                close: {
                    post: {
                        body: {
                            counted: {
                                paymentMethod: "CASH" | "CARD" | "TRANSFER";
                                countedAmount: string;
                            }[];
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                balances: {
                                    id: string;
                                    paymentMethod: import("../invoices/invoices.type").PaymentMethod;
                                    difference: import("@prisma/client-runtime-utils").Decimal;
                                    expectedAmount: import("@prisma/client-runtime-utils").Decimal;
                                    countedAmount: import("@prisma/client-runtime-utils").Decimal;
                                    closingId: string;
                                }[];
                                closedAt: Date;
                                totalDifference: import("@prisma/client-runtime-utils").Decimal;
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
        };
    };
} & {
    accounting: {
        "pos-shifts": {
            register: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate?: string | undefined;
                        toDate?: string | undefined;
                    };
                    headers: {};
                    response: {
                        200: {
                            openingId: string;
                            profileName: string;
                            cashierName: string;
                            openedAt: Date;
                            closedAt: Date | null;
                            status: import("../../../generated/prisma/enums").PosShiftStatus;
                            saleCount: number;
                            salesTotal: string;
                            totalDifference: string | null;
                            balances: {
                                paymentMethod: import("../invoices/invoices.type").PaymentMethod;
                                difference: import("@prisma/client-runtime-utils").Decimal;
                                expectedAmount: import("@prisma/client-runtime-utils").Decimal;
                                countedAmount: import("@prisma/client-runtime-utils").Decimal;
                            }[];
                        }[];
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
    };
} & {
    accounting: {
        dunning: {};
    };
} & {
    accounting: {
        dunning: {
            types: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
                            incomeAccountId: string | null;
                            rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                            dunningFee: import("@prisma/client-runtime-utils").Decimal;
                            letterBody: string | null;
                        }[];
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
    };
} & {
    accounting: {
        dunning: {
            types: {
                post: {
                    body: {
                        disabled?: boolean | undefined;
                        incomeAccountId?: string | null | undefined;
                        letterBody?: string | null | undefined;
                        title: string;
                        rateOfInterest: string;
                        dunningFee: string;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
                            incomeAccountId: string | null;
                            rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                            dunningFee: import("@prisma/client-runtime-utils").Decimal;
                            letterBody: string | null;
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
    };
} & {
    accounting: {
        dunning: {
            types: {
                ":id": {
                    put: {
                        body: {
                            disabled?: boolean | undefined;
                            incomeAccountId?: string | null | undefined;
                            letterBody?: string | null | undefined;
                            title: string;
                            rateOfInterest: string;
                            dunningFee: string;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                disabled: boolean;
                                createdAt: Date;
                                updatedAt: Date;
                                title: string;
                                incomeAccountId: string | null;
                                rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                                dunningFee: import("@prisma/client-runtime-utils").Decimal;
                                letterBody: string | null;
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
        };
    };
} & {
    accounting: {
        dunning: {
            overdue: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        partyType?: string | undefined;
                        asOf?: string | undefined;
                        partyId: string;
                    };
                    headers: {};
                    response: {
                        200: import("./dunning/dunning.service").OverdueInvoiceRow[];
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
    };
} & {
    accounting: {
        dunning: {
            get: {
                body: {};
                params: {};
                query: {
                    status?: string | undefined;
                };
                headers: {};
                response: {
                    200: ({
                        type: {
                            id: string;
                            title: string;
                        } | null;
                        overdues: {
                            id: string;
                            dueDate: Date;
                            outstanding: import("@prisma/client-runtime-utils").Decimal;
                            salesInvoiceId: string;
                            invoiceNo: string;
                            overdueDays: number;
                            interest: import("@prisma/client-runtime-utils").Decimal;
                            dunningId: string;
                        }[];
                    } & {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        status: import("../../../generated/prisma/enums").DunningStatus;
                        partyType: string;
                        partyId: string;
                        postingDate: Date;
                        journalEntryId: string | null;
                        rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                        dunningFee: import("@prisma/client-runtime-utils").Decimal;
                        typeId: string | null;
                        totalOutstanding: import("@prisma/client-runtime-utils").Decimal;
                        totalInterest: import("@prisma/client-runtime-utils").Decimal;
                        dunningAmount: import("@prisma/client-runtime-utils").Decimal;
                    })[];
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
} & {
    accounting: {
        dunning: {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            type: {
                                id: string;
                                clinicId: string;
                                disabled: boolean;
                                createdAt: Date;
                                updatedAt: Date;
                                title: string;
                                incomeAccountId: string | null;
                                rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                                dunningFee: import("@prisma/client-runtime-utils").Decimal;
                                letterBody: string | null;
                            } | null;
                            overdues: {
                                id: string;
                                dueDate: Date;
                                outstanding: import("@prisma/client-runtime-utils").Decimal;
                                salesInvoiceId: string;
                                invoiceNo: string;
                                overdueDays: number;
                                interest: import("@prisma/client-runtime-utils").Decimal;
                                dunningId: string;
                            }[];
                        } & {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            status: import("../../../generated/prisma/enums").DunningStatus;
                            partyType: string;
                            partyId: string;
                            postingDate: Date;
                            journalEntryId: string | null;
                            rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                            dunningFee: import("@prisma/client-runtime-utils").Decimal;
                            typeId: string | null;
                            totalOutstanding: import("@prisma/client-runtime-utils").Decimal;
                            totalInterest: import("@prisma/client-runtime-utils").Decimal;
                            dunningAmount: import("@prisma/client-runtime-utils").Decimal;
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
    };
} & {
    accounting: {
        dunning: {
            post: {
                body: {
                    partyType?: string | undefined;
                    rateOfInterest?: string | null | undefined;
                    dunningFee?: string | null | undefined;
                    typeId?: string | null | undefined;
                    salesInvoiceIds?: string[] | undefined;
                    partyId: string;
                    postingDate: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        overdues: {
                            id: string;
                            dueDate: Date;
                            outstanding: import("@prisma/client-runtime-utils").Decimal;
                            salesInvoiceId: string;
                            invoiceNo: string;
                            overdueDays: number;
                            interest: import("@prisma/client-runtime-utils").Decimal;
                            dunningId: string;
                        }[];
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        status: import("../../../generated/prisma/enums").DunningStatus;
                        partyType: string;
                        partyId: string;
                        postingDate: Date;
                        journalEntryId: string | null;
                        rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                        dunningFee: import("@prisma/client-runtime-utils").Decimal;
                        typeId: string | null;
                        totalOutstanding: import("@prisma/client-runtime-utils").Decimal;
                        totalInterest: import("@prisma/client-runtime-utils").Decimal;
                        dunningAmount: import("@prisma/client-runtime-utils").Decimal;
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
} & {
    accounting: {
        dunning: {
            ":id": {
                submit: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                overdues: {
                                    id: string;
                                    dueDate: Date;
                                    outstanding: import("@prisma/client-runtime-utils").Decimal;
                                    salesInvoiceId: string;
                                    invoiceNo: string;
                                    overdueDays: number;
                                    interest: import("@prisma/client-runtime-utils").Decimal;
                                    dunningId: string;
                                }[];
                            } & {
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                status: import("../../../generated/prisma/enums").DunningStatus;
                                partyType: string;
                                partyId: string;
                                postingDate: Date;
                                journalEntryId: string | null;
                                rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                                dunningFee: import("@prisma/client-runtime-utils").Decimal;
                                typeId: string | null;
                                totalOutstanding: import("@prisma/client-runtime-utils").Decimal;
                                totalInterest: import("@prisma/client-runtime-utils").Decimal;
                                dunningAmount: import("@prisma/client-runtime-utils").Decimal;
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
        };
    };
} & {
    accounting: {
        dunning: {
            ":id": {
                refresh: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                overdues: {
                                    salesInvoiceId: string;
                                }[];
                            } & {
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                status: import("../../../generated/prisma/enums").DunningStatus;
                                partyType: string;
                                partyId: string;
                                postingDate: Date;
                                journalEntryId: string | null;
                                rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                                dunningFee: import("@prisma/client-runtime-utils").Decimal;
                                typeId: string | null;
                                totalOutstanding: import("@prisma/client-runtime-utils").Decimal;
                                totalInterest: import("@prisma/client-runtime-utils").Decimal;
                                dunningAmount: import("@prisma/client-runtime-utils").Decimal;
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
        };
    };
} & {
    accounting: {
        dunning: {
            ":id": {
                cancel: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                status: import("../../../generated/prisma/enums").DunningStatus;
                                partyType: string;
                                partyId: string;
                                postingDate: Date;
                                journalEntryId: string | null;
                                rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                                dunningFee: import("@prisma/client-runtime-utils").Decimal;
                                typeId: string | null;
                                totalOutstanding: import("@prisma/client-runtime-utils").Decimal;
                                totalInterest: import("@prisma/client-runtime-utils").Decimal;
                                dunningAmount: import("@prisma/client-runtime-utils").Decimal;
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
        };
    };
} & {
    accounting: {
        subscriptions: {};
    };
} & {
    accounting: {
        subscriptions: {
            get: {
                body: {};
                params: {};
                query: {
                    status?: string | undefined;
                };
                headers: {};
                response: {
                    200: ({
                        _count: {
                            invoices: number;
                        };
                        plans: {
                            id: string;
                            rate: import("@prisma/client-runtime-utils").Decimal;
                            costCenterId: string;
                            incomeAccountId: string;
                            itemName: string;
                            qty: import("@prisma/client-runtime-utils").Decimal;
                            enableDeferredRevenue: boolean;
                            deferredAccountId: string | null;
                            subscriptionId: string;
                            firstPeriodOnly: boolean;
                        }[];
                    } & {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        status: import("../../../generated/prisma/enums").SubscriptionStatus;
                        interval: import("../../../generated/prisma/enums").SubscriptionInterval;
                        partyType: string;
                        partyId: string;
                        startDate: Date;
                        endDate: Date | null;
                        taxTemplateId: string | null;
                        intervalCount: number;
                        trialEndDate: Date | null;
                        lastInvoicedPeriodEnd: Date | null;
                        generateInvoiceAtPeriodStart: boolean;
                        daysUntilDue: number;
                        submitGeneratedInvoice: boolean;
                    })[];
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
} & {
    accounting: {
        subscriptions: {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            invoices: {
                                id: string;
                                createdAt: Date;
                                periodStartDate: Date;
                                periodEndDate: Date;
                                salesInvoiceId: string;
                                subscriptionId: string;
                            }[];
                            plans: {
                                id: string;
                                rate: import("@prisma/client-runtime-utils").Decimal;
                                costCenterId: string;
                                incomeAccountId: string;
                                itemName: string;
                                qty: import("@prisma/client-runtime-utils").Decimal;
                                enableDeferredRevenue: boolean;
                                deferredAccountId: string | null;
                                subscriptionId: string;
                                firstPeriodOnly: boolean;
                            }[];
                        } & {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            status: import("../../../generated/prisma/enums").SubscriptionStatus;
                            interval: import("../../../generated/prisma/enums").SubscriptionInterval;
                            partyType: string;
                            partyId: string;
                            startDate: Date;
                            endDate: Date | null;
                            taxTemplateId: string | null;
                            intervalCount: number;
                            trialEndDate: Date | null;
                            lastInvoicedPeriodEnd: Date | null;
                            generateInvoiceAtPeriodStart: boolean;
                            daysUntilDue: number;
                            submitGeneratedInvoice: boolean;
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
    };
} & {
    accounting: {
        subscriptions: {
            post: {
                body: {
                    partyType?: string | undefined;
                    endDate?: string | null | undefined;
                    taxTemplateId?: string | null | undefined;
                    trialEndDate?: string | null | undefined;
                    generateInvoiceAtPeriodStart?: boolean | undefined;
                    daysUntilDue?: number | undefined;
                    submitGeneratedInvoice?: boolean | undefined;
                    interval: "YEAR" | "MONTH" | "WEEK" | "DAY";
                    partyId: string;
                    startDate: string;
                    intervalCount: number;
                    plans: {
                        rate: string;
                        costCenterId: string;
                        incomeAccountId: string;
                        itemName: string;
                        qty: string;
                    }[];
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        plans: {
                            id: string;
                            rate: import("@prisma/client-runtime-utils").Decimal;
                            costCenterId: string;
                            incomeAccountId: string;
                            itemName: string;
                            qty: import("@prisma/client-runtime-utils").Decimal;
                            enableDeferredRevenue: boolean;
                            deferredAccountId: string | null;
                            subscriptionId: string;
                            firstPeriodOnly: boolean;
                        }[];
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        status: import("../../../generated/prisma/enums").SubscriptionStatus;
                        interval: import("../../../generated/prisma/enums").SubscriptionInterval;
                        partyType: string;
                        partyId: string;
                        startDate: Date;
                        endDate: Date | null;
                        taxTemplateId: string | null;
                        intervalCount: number;
                        trialEndDate: Date | null;
                        lastInvoicedPeriodEnd: Date | null;
                        generateInvoiceAtPeriodStart: boolean;
                        daysUntilDue: number;
                        submitGeneratedInvoice: boolean;
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
} & {
    accounting: {
        subscriptions: {
            ":id": {
                put: {
                    body: {
                        partyType?: string | undefined;
                        endDate?: string | null | undefined;
                        taxTemplateId?: string | null | undefined;
                        trialEndDate?: string | null | undefined;
                        generateInvoiceAtPeriodStart?: boolean | undefined;
                        daysUntilDue?: number | undefined;
                        submitGeneratedInvoice?: boolean | undefined;
                        interval: "YEAR" | "MONTH" | "WEEK" | "DAY";
                        partyId: string;
                        startDate: string;
                        intervalCount: number;
                        plans: {
                            rate: string;
                            costCenterId: string;
                            incomeAccountId: string;
                            itemName: string;
                            qty: string;
                        }[];
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            plans: {
                                id: string;
                                rate: import("@prisma/client-runtime-utils").Decimal;
                                costCenterId: string;
                                incomeAccountId: string;
                                itemName: string;
                                qty: import("@prisma/client-runtime-utils").Decimal;
                                enableDeferredRevenue: boolean;
                                deferredAccountId: string | null;
                                subscriptionId: string;
                                firstPeriodOnly: boolean;
                            }[];
                        } & {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            status: import("../../../generated/prisma/enums").SubscriptionStatus;
                            interval: import("../../../generated/prisma/enums").SubscriptionInterval;
                            partyType: string;
                            partyId: string;
                            startDate: Date;
                            endDate: Date | null;
                            taxTemplateId: string | null;
                            intervalCount: number;
                            trialEndDate: Date | null;
                            lastInvoicedPeriodEnd: Date | null;
                            generateInvoiceAtPeriodStart: boolean;
                            daysUntilDue: number;
                            submitGeneratedInvoice: boolean;
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
    };
} & {
    accounting: {
        subscriptions: {
            ":id": {
                cancel: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                status: import("../../../generated/prisma/enums").SubscriptionStatus;
                                interval: import("../../../generated/prisma/enums").SubscriptionInterval;
                                partyType: string;
                                partyId: string;
                                startDate: Date;
                                endDate: Date | null;
                                taxTemplateId: string | null;
                                intervalCount: number;
                                trialEndDate: Date | null;
                                lastInvoicedPeriodEnd: Date | null;
                                generateInvoiceAtPeriodStart: boolean;
                                daysUntilDue: number;
                                submitGeneratedInvoice: boolean;
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
        };
    };
} & {
    accounting: {
        subscriptions: {
            run: {
                post: {
                    body: {
                        asOf?: string | undefined;
                        subscriptionId?: string | undefined;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: import("./subscription/subscription.service").SubscriptionRunResult;
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
    };
} & {
    accounting: {
        "membership-plans": {};
    };
} & {
    accounting: {
        "membership-plans": {
            get: {
                body: {};
                params: {};
                query: {
                    status?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        name: string;
                        id: string;
                        createdAt: Date;
                        _count: {
                            memberships: number;
                        };
                        description: string | null;
                        code: string;
                        status: import("../../../generated/prisma/enums").MembershipPlanStatus;
                        benefits: {
                            service: {
                                name: string;
                                id: string;
                            } | null;
                            id: string;
                            idx: number;
                            labelAr: string | null;
                            serviceId: string | null;
                            discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            discountPercent: import("@prisma/client-runtime-utils").Decimal | null;
                            benefitType: import("../../../generated/prisma/enums").MembershipBenefitType;
                            unitsPerPeriod: number | null;
                        }[];
                        tierRank: number;
                        billingInterval: import("../../../generated/prisma/enums").SubscriptionInterval;
                        intervalCount: number;
                        fee: import("@prisma/client-runtime-utils").Decimal;
                        enrollmentFee: import("@prisma/client-runtime-utils").Decimal;
                        deferRevenue: boolean;
                        maxPatients: number | null;
                        autoRenew: boolean;
                        graceDays: number;
                    }[];
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
} & {
    accounting: {
        "membership-plans": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            name: string;
                            id: string;
                            createdAt: Date;
                            _count: {
                                memberships: number;
                            };
                            description: string | null;
                            code: string;
                            status: import("../../../generated/prisma/enums").MembershipPlanStatus;
                            benefits: {
                                service: {
                                    name: string;
                                    id: string;
                                } | null;
                                id: string;
                                idx: number;
                                labelAr: string | null;
                                serviceId: string | null;
                                discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                discountPercent: import("@prisma/client-runtime-utils").Decimal | null;
                                benefitType: import("../../../generated/prisma/enums").MembershipBenefitType;
                                unitsPerPeriod: number | null;
                            }[];
                            tierRank: number;
                            billingInterval: import("../../../generated/prisma/enums").SubscriptionInterval;
                            intervalCount: number;
                            fee: import("@prisma/client-runtime-utils").Decimal;
                            enrollmentFee: import("@prisma/client-runtime-utils").Decimal;
                            deferRevenue: boolean;
                            maxPatients: number | null;
                            autoRenew: boolean;
                            graceDays: number;
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
    };
} & {
    accounting: {
        "membership-plans": {
            post: {
                body: {
                    description?: string | null | undefined;
                    benefits?: {
                        labelAr?: string | null | undefined;
                        serviceId?: string | null | undefined;
                        discountAmount?: string | null | undefined;
                        discountPercent?: string | null | undefined;
                        unitsPerPeriod?: number | null | undefined;
                        benefitType: "SERVICE_DISCOUNT" | "PRODUCT_DISCOUNT" | "INCLUDED_UNITS" | "PRIORITY_BOOKING" | "PERK";
                    }[] | undefined;
                    tierRank?: number | undefined;
                    intervalCount?: number | undefined;
                    enrollmentFee?: string | undefined;
                    deferRevenue?: boolean | undefined;
                    maxPatients?: number | null | undefined;
                    autoRenew?: boolean | undefined;
                    graceDays?: number | undefined;
                    name: string;
                    billingInterval: "YEAR" | "MONTH";
                    fee: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        readonly valueAssessment: {
                            estimatedValue: string;
                            fee: string;
                            belowValue: boolean;
                            partial: boolean;
                        };
                        readonly name: string;
                        readonly id: string;
                        readonly createdAt: Date;
                        readonly _count: {
                            memberships: number;
                        };
                        readonly description: string | null;
                        readonly code: string;
                        readonly status: import("../../../generated/prisma/enums").MembershipPlanStatus;
                        readonly benefits: {
                            service: {
                                name: string;
                                id: string;
                            } | null;
                            id: string;
                            idx: number;
                            labelAr: string | null;
                            serviceId: string | null;
                            discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            discountPercent: import("@prisma/client-runtime-utils").Decimal | null;
                            benefitType: import("../../../generated/prisma/enums").MembershipBenefitType;
                            unitsPerPeriod: number | null;
                        }[];
                        readonly tierRank: number;
                        readonly billingInterval: import("../../../generated/prisma/enums").SubscriptionInterval;
                        readonly intervalCount: number;
                        readonly fee: import("@prisma/client-runtime-utils").Decimal;
                        readonly enrollmentFee: import("@prisma/client-runtime-utils").Decimal;
                        readonly deferRevenue: boolean;
                        readonly maxPatients: number | null;
                        readonly autoRenew: boolean;
                        readonly graceDays: number;
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
} & {
    accounting: {
        "membership-plans": {
            ":id": {
                put: {
                    body: {
                        description?: string | null | undefined;
                        benefits?: {
                            labelAr?: string | null | undefined;
                            serviceId?: string | null | undefined;
                            discountAmount?: string | null | undefined;
                            discountPercent?: string | null | undefined;
                            unitsPerPeriod?: number | null | undefined;
                            benefitType: "SERVICE_DISCOUNT" | "PRODUCT_DISCOUNT" | "INCLUDED_UNITS" | "PRIORITY_BOOKING" | "PERK";
                        }[] | undefined;
                        tierRank?: number | undefined;
                        intervalCount?: number | undefined;
                        enrollmentFee?: string | undefined;
                        deferRevenue?: boolean | undefined;
                        maxPatients?: number | null | undefined;
                        autoRenew?: boolean | undefined;
                        graceDays?: number | undefined;
                        name: string;
                        billingInterval: "YEAR" | "MONTH";
                        fee: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            valueAssessment: {
                                estimatedValue: string;
                                fee: string;
                                belowValue: boolean;
                                partial: boolean;
                            };
                            name: string;
                            id: string;
                            createdAt: Date;
                            _count: {
                                memberships: number;
                            };
                            description: string | null;
                            code: string;
                            status: import("../../../generated/prisma/enums").MembershipPlanStatus;
                            benefits: {
                                service: {
                                    name: string;
                                    id: string;
                                } | null;
                                id: string;
                                idx: number;
                                labelAr: string | null;
                                serviceId: string | null;
                                discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                discountPercent: import("@prisma/client-runtime-utils").Decimal | null;
                                benefitType: import("../../../generated/prisma/enums").MembershipBenefitType;
                                unitsPerPeriod: number | null;
                            }[];
                            tierRank: number;
                            billingInterval: import("../../../generated/prisma/enums").SubscriptionInterval;
                            intervalCount: number;
                            fee: import("@prisma/client-runtime-utils").Decimal;
                            enrollmentFee: import("@prisma/client-runtime-utils").Decimal;
                            deferRevenue: boolean;
                            maxPatients: number | null;
                            autoRenew: boolean;
                            graceDays: number;
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
    };
} & {
    accounting: {
        "membership-plans": {
            ":id": {
                status: {
                    post: {
                        body: {
                            status: "ACTIVE" | "INACTIVE";
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                name: string;
                                id: string;
                                createdAt: Date;
                                _count: {
                                    memberships: number;
                                };
                                description: string | null;
                                code: string;
                                status: import("../../../generated/prisma/enums").MembershipPlanStatus;
                                benefits: {
                                    service: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    id: string;
                                    idx: number;
                                    labelAr: string | null;
                                    serviceId: string | null;
                                    discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                    discountPercent: import("@prisma/client-runtime-utils").Decimal | null;
                                    benefitType: import("../../../generated/prisma/enums").MembershipBenefitType;
                                    unitsPerPeriod: number | null;
                                }[];
                                tierRank: number;
                                billingInterval: import("../../../generated/prisma/enums").SubscriptionInterval;
                                intervalCount: number;
                                fee: import("@prisma/client-runtime-utils").Decimal;
                                enrollmentFee: import("@prisma/client-runtime-utils").Decimal;
                                deferRevenue: boolean;
                                maxPatients: number | null;
                                autoRenew: boolean;
                                graceDays: number;
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
        };
    };
} & {
    accounting: {
        memberships: {};
    };
} & {
    accounting: {
        memberships: {
            get: {
                body: {};
                params: {};
                query: {
                    status?: string | undefined;
                    ownerId?: string | undefined;
                    planId?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        owner: {
                            name: string;
                            id: string;
                            phone: string;
                            code: string;
                        };
                        subscription: {
                            startDate: Date;
                        };
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        code: string;
                        plan: {
                            name: string;
                            id: string;
                            status: import("../../../generated/prisma/enums").MembershipPlanStatus;
                            tierRank: number;
                        };
                        status: import("../../../generated/prisma/enums").MembershipStatus;
                        cancelledAt: Date | null;
                        ownerId: string;
                        cancelReason: string | null;
                        planId: string;
                        subscriptionId: string;
                        currentPeriodStart: Date;
                        currentPeriodEnd: Date;
                        feeSnapshot: import("@prisma/client-runtime-utils").Decimal;
                        intervalSnapshot: import("../../../generated/prisma/enums").SubscriptionInterval;
                        intervalCountSnapshot: number;
                        graceDaysSnapshot: number;
                        autoRenewSnapshot: boolean;
                        scheduledPlanId: string | null;
                        scheduledPlan: {
                            name: string;
                            id: string;
                        } | null;
                    }[];
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
} & {
    accounting: {
        memberships: {
            "by-owner": {
                ":ownerId": {
                    get: {
                        body: {};
                        params: {
                            ownerId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                membership: import("./membership/membership.type").MembershipDetailResponse | null;
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
        };
    };
} & {
    accounting: {
        memberships: {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./membership/membership.type").MembershipDetailResponse;
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
    };
} & {
    accounting: {
        memberships: {
            post: {
                body: {
                    ownerId: string;
                    planId: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        membership: import("./membership/membership.type").MembershipDetailResponse;
                        billingError: string | null;
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
} & {
    accounting: {
        memberships: {
            ":id": {
                cancel: {
                    post: {
                        body: {
                            reason: string;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./membership/membership.type").MembershipDetailResponse;
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
        };
    };
} & {
    accounting: {
        memberships: {
            ":id": {
                "schedule-plan-change": {
                    post: {
                        body: {
                            planId: string;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./membership/membership.type").MembershipDetailResponse;
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
        };
    };
} & {
    accounting: {
        memberships: {
            run: {
                post: {
                    body: {
                        asOf?: string | undefined;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            policiesExpired: number;
                            billed: number;
                            rolled: number;
                            statusChanges: {
                                membershipId: string;
                                from: import("../../../generated/prisma/enums").MembershipStatus;
                                to: import("../../../generated/prisma/enums").MembershipStatus;
                            }[];
                            errors: {
                                membershipId: string;
                                message: string;
                            }[];
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
    };
} & {
    accounting: {
        insurers: {};
    };
} & {
    accounting: {
        insurers: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        name: string;
                        address: string | null;
                        id: string;
                        createdAt: Date;
                        _count: {
                            products: number;
                        };
                        email: string | null;
                        phone: string | null;
                        code: string;
                        notes: string | null;
                        active: boolean;
                        contactPerson: string | null;
                        settlementDays: number;
                    }[];
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
        insurers: {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            name: string;
                            address: string | null;
                            id: string;
                            createdAt: Date;
                            _count: {
                                products: number;
                            };
                            email: string | null;
                            phone: string | null;
                            code: string;
                            notes: string | null;
                            active: boolean;
                            contactPerson: string | null;
                            settlementDays: number;
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
    };
} & {
    accounting: {
        insurers: {
            post: {
                body: {
                    address?: string | null | undefined;
                    email?: string | null | undefined;
                    phone?: string | null | undefined;
                    notes?: string | null | undefined;
                    contactPerson?: string | null | undefined;
                    settlementDays?: number | undefined;
                    name: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        name: string;
                        address: string | null;
                        id: string;
                        createdAt: Date;
                        _count: {
                            products: number;
                        };
                        email: string | null;
                        phone: string | null;
                        code: string;
                        notes: string | null;
                        active: boolean;
                        contactPerson: string | null;
                        settlementDays: number;
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
} & {
    accounting: {
        insurers: {
            ":id": {
                put: {
                    body: {
                        address?: string | null | undefined;
                        email?: string | null | undefined;
                        phone?: string | null | undefined;
                        notes?: string | null | undefined;
                        contactPerson?: string | null | undefined;
                        settlementDays?: number | undefined;
                        name: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            name: string;
                            address: string | null;
                            id: string;
                            createdAt: Date;
                            _count: {
                                products: number;
                            };
                            email: string | null;
                            phone: string | null;
                            code: string;
                            notes: string | null;
                            active: boolean;
                            contactPerson: string | null;
                            settlementDays: number;
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
    };
} & {
    accounting: {
        insurers: {
            ":id": {
                status: {
                    post: {
                        body: {
                            active: boolean;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                name: string;
                                address: string | null;
                                id: string;
                                createdAt: Date;
                                _count: {
                                    products: number;
                                };
                                email: string | null;
                                phone: string | null;
                                code: string;
                                notes: string | null;
                                active: boolean;
                                contactPerson: string | null;
                                settlementDays: number;
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
        };
    };
} & {
    accounting: {
        "insurance-products": {};
    };
} & {
    accounting: {
        "insurance-products": {
            get: {
                body: {};
                params: {};
                query: {
                    insurerId?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        insurer: {
                            name: string;
                            id: string;
                        };
                        name: string;
                        id: string;
                        createdAt: Date;
                        _count: {
                            policies: number;
                        };
                        code: string;
                        active: boolean;
                        insurerId: string;
                        coveragePercentDefault: import("@prisma/client-runtime-utils").Decimal;
                        annualCap: import("@prisma/client-runtime-utils").Decimal | null;
                        perClaimCap: import("@prisma/client-runtime-utils").Decimal | null;
                        deductibleFixed: import("@prisma/client-runtime-utils").Decimal;
                        deductiblePercent: import("@prisma/client-runtime-utils").Decimal;
                        coverageRows: {
                            service: {
                                level: import("../../../generated/prisma/enums").ServiceLevel;
                                name: string;
                                id: string;
                            };
                            id: string;
                            idx: number;
                            serviceId: string;
                            coveragePercent: import("@prisma/client-runtime-utils").Decimal;
                        }[];
                    }[];
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
} & {
    accounting: {
        "insurance-products": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            insurer: {
                                name: string;
                                id: string;
                            };
                            name: string;
                            id: string;
                            createdAt: Date;
                            _count: {
                                policies: number;
                            };
                            code: string;
                            active: boolean;
                            insurerId: string;
                            coveragePercentDefault: import("@prisma/client-runtime-utils").Decimal;
                            annualCap: import("@prisma/client-runtime-utils").Decimal | null;
                            perClaimCap: import("@prisma/client-runtime-utils").Decimal | null;
                            deductibleFixed: import("@prisma/client-runtime-utils").Decimal;
                            deductiblePercent: import("@prisma/client-runtime-utils").Decimal;
                            coverageRows: {
                                service: {
                                    level: import("../../../generated/prisma/enums").ServiceLevel;
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                idx: number;
                                serviceId: string;
                                coveragePercent: import("@prisma/client-runtime-utils").Decimal;
                            }[];
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
    };
} & {
    accounting: {
        "insurance-products": {
            post: {
                body: {
                    annualCap?: string | null | undefined;
                    perClaimCap?: string | null | undefined;
                    deductibleFixed?: string | undefined;
                    deductiblePercent?: string | undefined;
                    coverageRows?: {
                        serviceId: string;
                        coveragePercent: string;
                    }[] | undefined;
                    name: string;
                    insurerId: string;
                    coveragePercentDefault: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        insurer: {
                            name: string;
                            id: string;
                        };
                        name: string;
                        id: string;
                        createdAt: Date;
                        _count: {
                            policies: number;
                        };
                        code: string;
                        active: boolean;
                        insurerId: string;
                        coveragePercentDefault: import("@prisma/client-runtime-utils").Decimal;
                        annualCap: import("@prisma/client-runtime-utils").Decimal | null;
                        perClaimCap: import("@prisma/client-runtime-utils").Decimal | null;
                        deductibleFixed: import("@prisma/client-runtime-utils").Decimal;
                        deductiblePercent: import("@prisma/client-runtime-utils").Decimal;
                        coverageRows: {
                            service: {
                                level: import("../../../generated/prisma/enums").ServiceLevel;
                                name: string;
                                id: string;
                            };
                            id: string;
                            idx: number;
                            serviceId: string;
                            coveragePercent: import("@prisma/client-runtime-utils").Decimal;
                        }[];
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
} & {
    accounting: {
        "insurance-products": {
            ":id": {
                put: {
                    body: {
                        annualCap?: string | null | undefined;
                        perClaimCap?: string | null | undefined;
                        deductibleFixed?: string | undefined;
                        deductiblePercent?: string | undefined;
                        coverageRows?: {
                            serviceId: string;
                            coveragePercent: string;
                        }[] | undefined;
                        name: string;
                        insurerId: string;
                        coveragePercentDefault: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            insurer: {
                                name: string;
                                id: string;
                            };
                            name: string;
                            id: string;
                            createdAt: Date;
                            _count: {
                                policies: number;
                            };
                            code: string;
                            active: boolean;
                            insurerId: string;
                            coveragePercentDefault: import("@prisma/client-runtime-utils").Decimal;
                            annualCap: import("@prisma/client-runtime-utils").Decimal | null;
                            perClaimCap: import("@prisma/client-runtime-utils").Decimal | null;
                            deductibleFixed: import("@prisma/client-runtime-utils").Decimal;
                            deductiblePercent: import("@prisma/client-runtime-utils").Decimal;
                            coverageRows: {
                                service: {
                                    level: import("../../../generated/prisma/enums").ServiceLevel;
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                idx: number;
                                serviceId: string;
                                coveragePercent: import("@prisma/client-runtime-utils").Decimal;
                            }[];
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
    };
} & {
    accounting: {
        "insurance-products": {
            ":id": {
                status: {
                    post: {
                        body: {
                            active: boolean;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                insurer: {
                                    name: string;
                                    id: string;
                                };
                                name: string;
                                id: string;
                                createdAt: Date;
                                _count: {
                                    policies: number;
                                };
                                code: string;
                                active: boolean;
                                insurerId: string;
                                coveragePercentDefault: import("@prisma/client-runtime-utils").Decimal;
                                annualCap: import("@prisma/client-runtime-utils").Decimal | null;
                                perClaimCap: import("@prisma/client-runtime-utils").Decimal | null;
                                deductibleFixed: import("@prisma/client-runtime-utils").Decimal;
                                deductiblePercent: import("@prisma/client-runtime-utils").Decimal;
                                coverageRows: {
                                    service: {
                                        level: import("../../../generated/prisma/enums").ServiceLevel;
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    idx: number;
                                    serviceId: string;
                                    coveragePercent: import("@prisma/client-runtime-utils").Decimal;
                                }[];
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
        };
    };
} & {
    accounting: {
        "patient-policies": {};
    };
} & {
    accounting: {
        "patient-policies": {
            get: {
                body: {};
                params: {};
                query: {
                    patientId?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        patient: {
                            owner: {
                                name: string;
                                id: string;
                            } | null;
                            name: string;
                            id: string;
                        };
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        notes: string | null;
                        status: import("../../../generated/prisma/enums").PatientPolicyStatus;
                        patientId: string;
                        productId: string;
                        policyNumber: string;
                        policyStart: Date;
                        policyEnd: Date;
                        capConsumed: import("@prisma/client-runtime-utils").Decimal;
                        product: {
                            insurer: {
                                name: string;
                                id: string;
                            };
                            name: string;
                            id: string;
                            coveragePercentDefault: import("@prisma/client-runtime-utils").Decimal;
                            annualCap: import("@prisma/client-runtime-utils").Decimal | null;
                        };
                    }[];
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
} & {
    accounting: {
        "patient-policies": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            patient: {
                                owner: {
                                    name: string;
                                    id: string;
                                } | null;
                                name: string;
                                id: string;
                            };
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            notes: string | null;
                            status: import("../../../generated/prisma/enums").PatientPolicyStatus;
                            patientId: string;
                            productId: string;
                            policyNumber: string;
                            policyStart: Date;
                            policyEnd: Date;
                            capConsumed: import("@prisma/client-runtime-utils").Decimal;
                            product: {
                                insurer: {
                                    name: string;
                                    id: string;
                                };
                                name: string;
                                id: string;
                                coveragePercentDefault: import("@prisma/client-runtime-utils").Decimal;
                                annualCap: import("@prisma/client-runtime-utils").Decimal | null;
                            };
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
    };
} & {
    accounting: {
        "patient-policies": {
            post: {
                body: {
                    notes?: string | null | undefined;
                    status?: "ACTIVE" | "CANCELLED" | "SUSPENDED" | undefined;
                    patientId: string;
                    productId: string;
                    policyNumber: string;
                    policyStart: string;
                    policyEnd: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        patient: {
                            owner: {
                                name: string;
                                id: string;
                            } | null;
                            name: string;
                            id: string;
                        };
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        notes: string | null;
                        status: import("../../../generated/prisma/enums").PatientPolicyStatus;
                        patientId: string;
                        productId: string;
                        policyNumber: string;
                        policyStart: Date;
                        policyEnd: Date;
                        capConsumed: import("@prisma/client-runtime-utils").Decimal;
                        product: {
                            insurer: {
                                name: string;
                                id: string;
                            };
                            name: string;
                            id: string;
                            coveragePercentDefault: import("@prisma/client-runtime-utils").Decimal;
                            annualCap: import("@prisma/client-runtime-utils").Decimal | null;
                        };
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
} & {
    accounting: {
        "patient-policies": {
            ":id": {
                put: {
                    body: {
                        notes?: string | null | undefined;
                        status?: "ACTIVE" | "CANCELLED" | "SUSPENDED" | undefined;
                        patientId: string;
                        productId: string;
                        policyNumber: string;
                        policyStart: string;
                        policyEnd: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            patient: {
                                owner: {
                                    name: string;
                                    id: string;
                                } | null;
                                name: string;
                                id: string;
                            };
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            notes: string | null;
                            status: import("../../../generated/prisma/enums").PatientPolicyStatus;
                            patientId: string;
                            productId: string;
                            policyNumber: string;
                            policyStart: Date;
                            policyEnd: Date;
                            capConsumed: import("@prisma/client-runtime-utils").Decimal;
                            product: {
                                insurer: {
                                    name: string;
                                    id: string;
                                };
                                name: string;
                                id: string;
                                coveragePercentDefault: import("@prisma/client-runtime-utils").Decimal;
                                annualCap: import("@prisma/client-runtime-utils").Decimal | null;
                            };
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
    };
} & {
    accounting: {
        "insurance-claims": {};
    };
} & {
    accounting: {
        "insurance-claims": {
            get: {
                body: {};
                params: {};
                query: {
                    status?: string | undefined;
                    insurerId?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        owner: {
                            name: string;
                            id: string;
                        };
                        patient: {
                            name: string;
                            id: string;
                        };
                        invoice: {
                            id: string;
                            code: string;
                            total: import("@prisma/client-runtime-utils").Decimal;
                            copayShare: import("@prisma/client-runtime-utils").Decimal | null;
                        };
                        insurer: {
                            name: string;
                            id: string;
                        };
                        id: string;
                        createdAt: Date;
                        status: import("../../../generated/prisma/enums").InsuranceClaimStatus;
                        submittedAt: Date | null;
                        documentNo: string | null;
                        policyNumberSnapshot: string;
                        serviceDate: Date;
                        claimedAmount: import("@prisma/client-runtime-utils").Decimal;
                        approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
                        settledAmount: import("@prisma/client-runtime-utils").Decimal;
                    }[];
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
} & {
    accounting: {
        "insurance-claims": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            owner: {
                                name: string;
                                id: string;
                            };
                            patient: {
                                name: string;
                                id: string;
                            };
                            invoice: {
                                id: string;
                                code: string;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                copayShare: import("@prisma/client-runtime-utils").Decimal | null;
                            };
                            insurer: {
                                name: string;
                                id: string;
                            };
                            id: string;
                            createdAt: Date;
                            status: import("../../../generated/prisma/enums").InsuranceClaimStatus;
                            submittedAt: Date | null;
                            documentNo: string | null;
                            policyId: string;
                            policyNumberSnapshot: string;
                            serviceDate: Date;
                            claimedAmount: import("@prisma/client-runtime-utils").Decimal;
                            approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            settledAmount: import("@prisma/client-runtime-utils").Decimal;
                            coverageSnapshot: import("@prisma/client/runtime/client").JsonValue;
                            adjudicatedAt: Date | null;
                            rejectionReason: string | null;
                            insurerReference: string | null;
                            rejectionResolution: import("../../../generated/prisma/enums").ClaimRejectionResolution | null;
                            resolutionJournalEntryId: string | null;
                            resolvedAt: Date | null;
                            lines: {
                                id: string;
                                description: string;
                                idx: number;
                                lineRef: string;
                                lineTotal: import("@prisma/client-runtime-utils").Decimal;
                                coveragePercent: import("@prisma/client-runtime-utils").Decimal;
                                insurerAmount: import("@prisma/client-runtime-utils").Decimal;
                            }[];
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
    };
} & {
    accounting: {
        "insurance-claims": {
            ":id": {
                submit: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                owner: {
                                    name: string;
                                    id: string;
                                };
                                patient: {
                                    name: string;
                                    id: string;
                                };
                                invoice: {
                                    id: string;
                                    code: string;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    copayShare: import("@prisma/client-runtime-utils").Decimal | null;
                                };
                                insurer: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                status: import("../../../generated/prisma/enums").InsuranceClaimStatus;
                                submittedAt: Date | null;
                                documentNo: string | null;
                                policyId: string;
                                policyNumberSnapshot: string;
                                serviceDate: Date;
                                claimedAmount: import("@prisma/client-runtime-utils").Decimal;
                                approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                settledAmount: import("@prisma/client-runtime-utils").Decimal;
                                coverageSnapshot: import("@prisma/client/runtime/client").JsonValue;
                                adjudicatedAt: Date | null;
                                rejectionReason: string | null;
                                insurerReference: string | null;
                                rejectionResolution: import("../../../generated/prisma/enums").ClaimRejectionResolution | null;
                                resolutionJournalEntryId: string | null;
                                resolvedAt: Date | null;
                                lines: {
                                    id: string;
                                    description: string;
                                    idx: number;
                                    lineRef: string;
                                    lineTotal: import("@prisma/client-runtime-utils").Decimal;
                                    coveragePercent: import("@prisma/client-runtime-utils").Decimal;
                                    insurerAmount: import("@prisma/client-runtime-utils").Decimal;
                                }[];
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
        };
    };
} & {
    accounting: {
        "insurance-claims": {
            ":id": {
                cancel: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                owner: {
                                    name: string;
                                    id: string;
                                };
                                patient: {
                                    name: string;
                                    id: string;
                                };
                                invoice: {
                                    id: string;
                                    code: string;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    copayShare: import("@prisma/client-runtime-utils").Decimal | null;
                                };
                                insurer: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                status: import("../../../generated/prisma/enums").InsuranceClaimStatus;
                                submittedAt: Date | null;
                                documentNo: string | null;
                                policyId: string;
                                policyNumberSnapshot: string;
                                serviceDate: Date;
                                claimedAmount: import("@prisma/client-runtime-utils").Decimal;
                                approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                settledAmount: import("@prisma/client-runtime-utils").Decimal;
                                coverageSnapshot: import("@prisma/client/runtime/client").JsonValue;
                                adjudicatedAt: Date | null;
                                rejectionReason: string | null;
                                insurerReference: string | null;
                                rejectionResolution: import("../../../generated/prisma/enums").ClaimRejectionResolution | null;
                                resolutionJournalEntryId: string | null;
                                resolvedAt: Date | null;
                                lines: {
                                    id: string;
                                    description: string;
                                    idx: number;
                                    lineRef: string;
                                    lineTotal: import("@prisma/client-runtime-utils").Decimal;
                                    coveragePercent: import("@prisma/client-runtime-utils").Decimal;
                                    insurerAmount: import("@prisma/client-runtime-utils").Decimal;
                                }[];
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
        };
    };
} & {
    accounting: {
        "insurance-claims": {
            ":id": {
                adjudicate: {
                    post: {
                        body: {
                            rejectionReason?: string | null | undefined;
                            insurerReference?: string | null | undefined;
                            approvedAmount: string;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                owner: {
                                    name: string;
                                    id: string;
                                };
                                patient: {
                                    name: string;
                                    id: string;
                                };
                                invoice: {
                                    id: string;
                                    code: string;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    copayShare: import("@prisma/client-runtime-utils").Decimal | null;
                                };
                                insurer: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                status: import("../../../generated/prisma/enums").InsuranceClaimStatus;
                                submittedAt: Date | null;
                                documentNo: string | null;
                                policyId: string;
                                policyNumberSnapshot: string;
                                serviceDate: Date;
                                claimedAmount: import("@prisma/client-runtime-utils").Decimal;
                                approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                settledAmount: import("@prisma/client-runtime-utils").Decimal;
                                coverageSnapshot: import("@prisma/client/runtime/client").JsonValue;
                                adjudicatedAt: Date | null;
                                rejectionReason: string | null;
                                insurerReference: string | null;
                                rejectionResolution: import("../../../generated/prisma/enums").ClaimRejectionResolution | null;
                                resolutionJournalEntryId: string | null;
                                resolvedAt: Date | null;
                                lines: {
                                    id: string;
                                    description: string;
                                    idx: number;
                                    lineRef: string;
                                    lineTotal: import("@prisma/client-runtime-utils").Decimal;
                                    coveragePercent: import("@prisma/client-runtime-utils").Decimal;
                                    insurerAmount: import("@prisma/client-runtime-utils").Decimal;
                                }[];
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
        };
    };
} & {
    accounting: {
        "insurance-claims": {
            ":id": {
                "resolve-rejection": {
                    post: {
                        body: {
                            resolution: "REBILL_OWNER" | "WRITE_OFF";
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                owner: {
                                    name: string;
                                    id: string;
                                };
                                patient: {
                                    name: string;
                                    id: string;
                                };
                                invoice: {
                                    id: string;
                                    code: string;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    copayShare: import("@prisma/client-runtime-utils").Decimal | null;
                                };
                                insurer: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                status: import("../../../generated/prisma/enums").InsuranceClaimStatus;
                                submittedAt: Date | null;
                                documentNo: string | null;
                                policyId: string;
                                policyNumberSnapshot: string;
                                serviceDate: Date;
                                claimedAmount: import("@prisma/client-runtime-utils").Decimal;
                                approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                settledAmount: import("@prisma/client-runtime-utils").Decimal;
                                coverageSnapshot: import("@prisma/client/runtime/client").JsonValue;
                                adjudicatedAt: Date | null;
                                rejectionReason: string | null;
                                insurerReference: string | null;
                                rejectionResolution: import("../../../generated/prisma/enums").ClaimRejectionResolution | null;
                                resolutionJournalEntryId: string | null;
                                resolvedAt: Date | null;
                                lines: {
                                    id: string;
                                    description: string;
                                    idx: number;
                                    lineRef: string;
                                    lineTotal: import("@prisma/client-runtime-utils").Decimal;
                                    coveragePercent: import("@prisma/client-runtime-utils").Decimal;
                                    insurerAmount: import("@prisma/client-runtime-utils").Decimal;
                                }[];
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
        };
    };
} & {
    accounting: {
        "statements-of-accounts": {};
    };
} & {
    accounting: {
        "statements-of-accounts": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: ({
                        customers: {
                            id: string;
                            email: string | null;
                            partyType: string;
                            partyId: string;
                            psoaId: string;
                        }[];
                    } & {
                        subject: string | null;
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        reportType: import("../../../generated/prisma/enums").PsoaReportType;
                        enabled: boolean;
                        title: string;
                        fromDate: Date | null;
                        toDate: Date | null;
                        frequency: import("../../../generated/prisma/enums").PsoaFrequency;
                        bodyText: string | null;
                        ccEmails: string[];
                        lastSentAt: Date | null;
                    })[];
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
        "statements-of-accounts": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            customers: {
                                id: string;
                                email: string | null;
                                partyType: string;
                                partyId: string;
                                psoaId: string;
                            }[];
                        } & {
                            subject: string | null;
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            reportType: import("../../../generated/prisma/enums").PsoaReportType;
                            enabled: boolean;
                            title: string;
                            fromDate: Date | null;
                            toDate: Date | null;
                            frequency: import("../../../generated/prisma/enums").PsoaFrequency;
                            bodyText: string | null;
                            ccEmails: string[];
                            lastSentAt: Date | null;
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
    };
} & {
    accounting: {
        "statements-of-accounts": {
            post: {
                body: {
                    subject?: string | null | undefined;
                    enabled?: boolean | undefined;
                    fromDate?: string | null | undefined;
                    toDate?: string | null | undefined;
                    bodyText?: string | null | undefined;
                    ccEmails?: string[] | undefined;
                    reportType: "PARTY_LEDGER" | "RECEIVABLE_AGEING";
                    title: string;
                    frequency: "MANUAL" | "WEEKLY" | "MONTHLY" | "QUARTERLY";
                    customers: {
                        email?: string | null | undefined;
                        partyType: string;
                        partyId: string;
                    }[];
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        customers: {
                            id: string;
                            email: string | null;
                            partyType: string;
                            partyId: string;
                            psoaId: string;
                        }[];
                        subject: string | null;
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        reportType: import("../../../generated/prisma/enums").PsoaReportType;
                        enabled: boolean;
                        title: string;
                        fromDate: Date | null;
                        toDate: Date | null;
                        frequency: import("../../../generated/prisma/enums").PsoaFrequency;
                        bodyText: string | null;
                        ccEmails: string[];
                        lastSentAt: Date | null;
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
} & {
    accounting: {
        "statements-of-accounts": {
            ":id": {
                put: {
                    body: {
                        subject?: string | null | undefined;
                        enabled?: boolean | undefined;
                        fromDate?: string | null | undefined;
                        toDate?: string | null | undefined;
                        bodyText?: string | null | undefined;
                        ccEmails?: string[] | undefined;
                        reportType: "PARTY_LEDGER" | "RECEIVABLE_AGEING";
                        title: string;
                        frequency: "MANUAL" | "WEEKLY" | "MONTHLY" | "QUARTERLY";
                        customers: {
                            email?: string | null | undefined;
                            partyType: string;
                            partyId: string;
                        }[];
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            customers: {
                                id: string;
                                email: string | null;
                                partyType: string;
                                partyId: string;
                                psoaId: string;
                            }[];
                        } & {
                            subject: string | null;
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            reportType: import("../../../generated/prisma/enums").PsoaReportType;
                            enabled: boolean;
                            title: string;
                            fromDate: Date | null;
                            toDate: Date | null;
                            frequency: import("../../../generated/prisma/enums").PsoaFrequency;
                            bodyText: string | null;
                            ccEmails: string[];
                            lastSentAt: Date | null;
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
    };
} & {
    accounting: {
        "statements-of-accounts": {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            ok: boolean;
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
    };
} & {
    accounting: {
        "statements-of-accounts": {
            ":id": {
                preview: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {
                            asOf?: string | undefined;
                        };
                        headers: {};
                        response: {
                            200: import("./psoa/psoa.service").CustomerStatement[];
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
        };
    };
} & {
    accounting: {
        "statements-of-accounts": {
            ":id": {
                send: {
                    post: {
                        body: {
                            asOf?: string | undefined;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./psoa/psoa.service").SendStatementsResult;
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
        };
    };
} & {
    accounting: {
        repost: {};
    };
} & {
    accounting: {
        repost: {
            "voucher-types": {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: readonly ["sales_invoice", "purchase_invoice", "journal_entry", "payment_entry"];
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
    };
} & {
    accounting: {
        repost: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: ({
                        items: {
                            id: string;
                            status: import("../../../generated/prisma/enums").RepostStatus;
                            voucherType: string;
                            voucherId: string;
                            voucherNo: string | null;
                            errorMessage: string | null;
                            glCountAfter: number | null;
                            repostId: string;
                        }[];
                    } & {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        reason: string;
                        status: import("../../../generated/prisma/enums").RepostStatus;
                        errorMessage: string | null;
                        completedAt: Date | null;
                    })[];
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
        repost: {
            candidates: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        voucherType: string;
                    };
                    headers: {};
                    response: {
                        200: import("./repost/repost.service").RepostCandidate[];
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
    };
} & {
    accounting: {
        repost: {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            items: {
                                id: string;
                                status: import("../../../generated/prisma/enums").RepostStatus;
                                voucherType: string;
                                voucherId: string;
                                voucherNo: string | null;
                                errorMessage: string | null;
                                glCountAfter: number | null;
                                repostId: string;
                            }[];
                        } & {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            reason: string;
                            status: import("../../../generated/prisma/enums").RepostStatus;
                            errorMessage: string | null;
                            completedAt: Date | null;
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
    };
} & {
    accounting: {
        repost: {
            post: {
                body: {
                    reason: string;
                    vouchers: {
                        voucherNo?: string | null | undefined;
                        voucherType: string;
                        voucherId: string;
                    }[];
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        items: {
                            id: string;
                            status: import("../../../generated/prisma/enums").RepostStatus;
                            voucherType: string;
                            voucherId: string;
                            voucherNo: string | null;
                            errorMessage: string | null;
                            glCountAfter: number | null;
                            repostId: string;
                        }[];
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        reason: string;
                        status: import("../../../generated/prisma/enums").RepostStatus;
                        errorMessage: string | null;
                        completedAt: Date | null;
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
} & {
    accounting: {
        repost: {
            ":id": {
                run: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                repostId: string;
                                results: import("./repost/repost.service").RepostVoucherResult[];
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
        };
    };
} & {
    accounting: {
        "cost-centers": {};
    };
} & {
    accounting: {
        "cost-centers": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        disabled: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                        isGroup: boolean;
                        lft: number;
                        rgt: number;
                        costCenterName: string;
                        costCenterNumber: string | null;
                        parentCostCenterId: string | null;
                    }[];
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
        "cost-centers": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            isGroup: boolean;
                            lft: number;
                            rgt: number;
                            costCenterName: string;
                            costCenterNumber: string | null;
                            parentCostCenterId: string | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "مركز التكلفة غير موجود";
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
    };
} & {
    accounting: {
        "cost-centers": {
            post: {
                body: {
                    disabled?: boolean | undefined;
                    isGroup?: boolean | undefined;
                    costCenterNumber?: string | null | undefined;
                    parentCostCenterId?: string | null | undefined;
                    costCenterName: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        id: string;
                        clinicId: string;
                        disabled: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                        isGroup: boolean;
                        lft: number;
                        rgt: number;
                        costCenterName: string;
                        costCenterNumber: string | null;
                        parentCostCenterId: string | null;
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
} & {
    accounting: {
        "cost-centers": {
            ":id": {
                patch: {
                    body: {
                        disabled?: boolean | undefined;
                        isGroup?: boolean | undefined;
                        costCenterName?: string | undefined;
                        costCenterNumber?: string | null | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            isGroup: boolean;
                            lft: number;
                            rgt: number;
                            costCenterName: string;
                            costCenterNumber: string | null;
                            parentCostCenterId: string | null;
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
    };
} & {
    accounting: {
        "cost-centers": {
            ":id": {
                move: {
                    post: {
                        body: {
                            parentCostCenterId: string | null;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                disabled: boolean;
                                createdAt: Date;
                                updatedAt: Date;
                                isGroup: boolean;
                                lft: number;
                                rgt: number;
                                costCenterName: string;
                                costCenterNumber: string | null;
                                parentCostCenterId: string | null;
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
        };
    };
} & {
    accounting: {
        "cost-centers": {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
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
    };
} & {
    accounting: {
        "cost-center-allocations": {};
    };
} & {
    accounting: {
        "cost-center-allocations": {
            get: {
                body: {};
                params: {};
                query: {
                    limit?: number | undefined;
                    docstatus?: "DRAFT" | "SUBMITTED" | "CANCELLED" | undefined;
                };
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        documentNo: string | null;
                        percentages: {
                            costCenter: {
                                costCenterName: string;
                                costCenterNumber: string | null;
                            };
                            id: string;
                            costCenterId: string;
                            percentage: import("@prisma/client-runtime-utils").Decimal;
                        }[];
                        mainCostCenterId: string;
                        validFrom: Date;
                        mainCostCenter: {
                            id: string;
                            costCenterName: string;
                            costCenterNumber: string | null;
                        };
                    }[];
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
} & {
    accounting: {
        "cost-center-allocations": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                            amendedFromId: string | null;
                            submittedAt: Date | null;
                            submittedById: string | null;
                            cancelledAt: Date | null;
                            cancelledById: string | null;
                            documentNo: string | null;
                            percentages: {
                                costCenter: {
                                    costCenterName: string;
                                    costCenterNumber: string | null;
                                };
                                id: string;
                                costCenterId: string;
                                percentage: import("@prisma/client-runtime-utils").Decimal;
                            }[];
                            mainCostCenterId: string;
                            validFrom: Date;
                            mainCostCenter: {
                                id: string;
                                costCenterName: string;
                                costCenterNumber: string | null;
                            };
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "المستند غير موجود";
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
    };
} & {
    accounting: {
        "cost-center-allocations": {
            post: {
                body: {
                    rows: {
                        costCenterId: string;
                        percentage: string;
                    }[];
                    mainCostCenterId: string;
                    validFrom: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        documentNo: string | null;
                        percentages: {
                            costCenter: {
                                costCenterName: string;
                                costCenterNumber: string | null;
                            };
                            id: string;
                            costCenterId: string;
                            percentage: import("@prisma/client-runtime-utils").Decimal;
                        }[];
                        mainCostCenterId: string;
                        validFrom: Date;
                        mainCostCenter: {
                            id: string;
                            costCenterName: string;
                            costCenterNumber: string | null;
                        };
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
} & {
    accounting: {
        "cost-center-allocations": {
            ":id": {
                patch: {
                    body: {
                        rows: {
                            costCenterId: string;
                            percentage: string;
                        }[];
                        mainCostCenterId: string;
                        validFrom: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                            amendedFromId: string | null;
                            submittedAt: Date | null;
                            submittedById: string | null;
                            cancelledAt: Date | null;
                            cancelledById: string | null;
                            documentNo: string | null;
                            percentages: {
                                costCenter: {
                                    costCenterName: string;
                                    costCenterNumber: string | null;
                                };
                                id: string;
                                costCenterId: string;
                                percentage: import("@prisma/client-runtime-utils").Decimal;
                            }[];
                            mainCostCenterId: string;
                            validFrom: Date;
                            mainCostCenter: {
                                id: string;
                                costCenterName: string;
                                costCenterNumber: string | null;
                            };
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "المستند غير موجود";
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
    };
} & {
    accounting: {
        "cost-center-allocations": {
            ":id": {
                submit: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./cost-center-allocation/cost-center-allocation.type").CostCenterAllocationVoucher;
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "المستند غير موجود";
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
        };
    };
} & {
    accounting: {
        "cost-center-allocations": {
            ":id": {
                cancel: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./cost-center-allocation/cost-center-allocation.type").CostCenterAllocationVoucher;
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "المستند غير موجود";
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
        };
    };
} & {
    accounting: {
        "cost-center-allocations": {
            ":id": {
                amend: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./cost-center-allocation/cost-center-allocation.type").CostCenterAllocationVoucher;
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "المستند غير موجود";
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
        };
    };
} & {
    accounting: {
        "modes-of-payment": {};
    };
} & {
    accounting: {
        "modes-of-payment": {
            get: {
                body: {};
                params: {};
                query: {
                    includeDisabled?: boolean | undefined;
                };
                headers: {};
                response: {
                    200: {
                        type: import("./mode-of-payment/mode-of-payment.type").ModeOfPaymentType;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        enabled: boolean;
                        modeOfPaymentName: string;
                        defaultAccountId: string | null;
                        defaultAccount: {
                            id: string;
                            accountName: string;
                            accountNumber: string | null;
                        } | null;
                    }[];
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
} & {
    accounting: {
        "modes-of-payment": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            type: import("./mode-of-payment/mode-of-payment.type").ModeOfPaymentType;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            enabled: boolean;
                            modeOfPaymentName: string;
                            defaultAccountId: string | null;
                            defaultAccount: {
                                id: string;
                                accountName: string;
                                accountNumber: string | null;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "طريقة الدفع غير موجودة";
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
    };
} & {
    accounting: {
        "modes-of-payment": {
            post: {
                body: {
                    type?: "BANK" | "CASH" | "GENERAL" | "PHONE" | undefined;
                    enabled?: boolean | undefined;
                    defaultAccountId?: string | null | undefined;
                    modeOfPaymentName: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        type: import("./mode-of-payment/mode-of-payment.type").ModeOfPaymentType;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        enabled: boolean;
                        modeOfPaymentName: string;
                        defaultAccountId: string | null;
                        defaultAccount: {
                            id: string;
                            accountName: string;
                            accountNumber: string | null;
                        } | null;
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
} & {
    accounting: {
        "modes-of-payment": {
            ":id": {
                patch: {
                    body: {
                        type?: "BANK" | "CASH" | "GENERAL" | "PHONE" | undefined;
                        enabled?: boolean | undefined;
                        modeOfPaymentName?: string | undefined;
                        defaultAccountId?: string | null | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            type: import("./mode-of-payment/mode-of-payment.type").ModeOfPaymentType;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            enabled: boolean;
                            modeOfPaymentName: string;
                            defaultAccountId: string | null;
                            defaultAccount: {
                                id: string;
                                accountName: string;
                                accountNumber: string | null;
                            } | null;
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
    };
} & {
    accounting: {
        "modes-of-payment": {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
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
    };
} & {
    accounting: {
        "currency-exchanges": {};
    };
} & {
    accounting: {
        "currency-exchanges": {
            get: {
                body: {};
                params: {};
                query: {
                    limit?: number | undefined;
                };
                headers: {};
                response: {
                    200: {
                        date: Date;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                        fromCurrencyCode: string;
                        toCurrencyCode: string;
                        forBuying: boolean;
                        forSelling: boolean;
                    }[];
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
} & {
    accounting: {
        "currency-exchanges": {
            resolve: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        date: string;
                        fromCurrencyCode: string;
                        toCurrencyCode: string;
                        side: "buying" | "selling";
                    };
                    headers: {};
                    response: {
                        200: import("./currency-exchange/currency-exchange.type").ResolvedRate;
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
    };
} & {
    accounting: {
        "currency-exchanges": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            date: Date;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                            fromCurrencyCode: string;
                            toCurrencyCode: string;
                            forBuying: boolean;
                            forSelling: boolean;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "سعر الصرف غير موجود";
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
    };
} & {
    accounting: {
        "currency-exchanges": {
            post: {
                body: {
                    forBuying?: boolean | undefined;
                    forSelling?: boolean | undefined;
                    date: string;
                    exchangeRate: string;
                    fromCurrencyCode: string;
                    toCurrencyCode: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        date: Date;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                        fromCurrencyCode: string;
                        toCurrencyCode: string;
                        forBuying: boolean;
                        forSelling: boolean;
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
} & {
    accounting: {
        "currency-exchanges": {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
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
    };
} & {
    accounting: {
        "finance-books": {};
    };
} & {
    accounting: {
        "finance-books": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        disabled: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                        financeBookName: string;
                    }[];
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
        "finance-books": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            financeBookName: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "الدفتر المالي غير موجود";
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
    };
} & {
    accounting: {
        "finance-books": {
            post: {
                body: {
                    disabled?: boolean | undefined;
                    financeBookName: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        id: string;
                        clinicId: string;
                        disabled: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                        financeBookName: string;
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
} & {
    accounting: {
        "finance-books": {
            ":id": {
                patch: {
                    body: {
                        disabled?: boolean | undefined;
                        financeBookName?: string | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            financeBookName: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "الدفتر المالي غير موجود";
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
    };
} & {
    accounting: {
        "finance-books": {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "الدفتر المالي غير موجود";
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
    };
} & {
    accounting: {
        "journal-entries": {};
    };
} & {
    accounting: {
        "journal-entries": {
            templates: {
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
                            accountIds: string[];
                            voucherType: string;
                            templateTitle: string;
                        }[];
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
    };
} & {
    accounting: {
        "journal-entries": {
            templates: {
                post: {
                    body: {
                        voucherType?: string | undefined;
                        accountIds: string[];
                        templateTitle: string;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            accountIds: string[];
                            voucherType: string;
                            templateTitle: string;
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
    };
} & {
    accounting: {
        "journal-entries": {
            templates: {
                ":id": {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            204: "No Content";
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "القالب غير موجود";
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
        };
    };
} & {
    accounting: {
        "journal-entries": {
            get: {
                body: {};
                params: {};
                query: {
                    limit?: number | undefined;
                    docstatus?: "DRAFT" | "SUBMITTED" | "CANCELLED" | undefined;
                    voucherType?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        postingDate: Date;
                        rows: {
                            account: {
                                accountName: string;
                                accountNumber: string | null;
                                accountType: import("../../../generated/prisma/enums").AccountType | null;
                            };
                            id: string;
                            idx: number;
                            costCenterId: string | null;
                            accountId: string;
                            debit: import("@prisma/client-runtime-utils").Decimal;
                            credit: import("@prisma/client-runtime-utils").Decimal;
                            debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                            creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                            partyType: string | null;
                            partyId: string | null;
                            dim1: string | null;
                            dim2: string | null;
                            dim3: string | null;
                            dim4: string | null;
                            userRemark: string | null;
                            exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                            referenceType: string | null;
                            referenceId: string | null;
                        }[];
                        voucherType: string;
                        documentNo: string | null;
                        chequeNo: string | null;
                        chequeDate: Date | null;
                        remark: string | null;
                        multiCurrency: boolean;
                        isSystemGenerated: boolean;
                        totalDebit: import("@prisma/client-runtime-utils").Decimal;
                        totalCredit: import("@prisma/client-runtime-utils").Decimal;
                    }[];
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
} & {
    accounting: {
        "journal-entries": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                            amendedFromId: string | null;
                            submittedAt: Date | null;
                            submittedById: string | null;
                            cancelledAt: Date | null;
                            cancelledById: string | null;
                            postingDate: Date;
                            rows: {
                                account: {
                                    accountName: string;
                                    accountNumber: string | null;
                                    accountType: import("../../../generated/prisma/enums").AccountType | null;
                                };
                                id: string;
                                idx: number;
                                costCenterId: string | null;
                                accountId: string;
                                debit: import("@prisma/client-runtime-utils").Decimal;
                                credit: import("@prisma/client-runtime-utils").Decimal;
                                debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                partyType: string | null;
                                partyId: string | null;
                                dim1: string | null;
                                dim2: string | null;
                                dim3: string | null;
                                dim4: string | null;
                                userRemark: string | null;
                                exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                                referenceType: string | null;
                                referenceId: string | null;
                            }[];
                            voucherType: string;
                            documentNo: string | null;
                            chequeNo: string | null;
                            chequeDate: Date | null;
                            remark: string | null;
                            multiCurrency: boolean;
                            isSystemGenerated: boolean;
                            totalDebit: import("@prisma/client-runtime-utils").Decimal;
                            totalCredit: import("@prisma/client-runtime-utils").Decimal;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "المستند غير موجود";
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
    };
} & {
    accounting: {
        "journal-entries": {
            post: {
                body: {
                    voucherType?: string | undefined;
                    chequeNo?: string | null | undefined;
                    chequeDate?: string | null | undefined;
                    remark?: string | null | undefined;
                    postingDate: string;
                    rows: {
                        costCenterId?: string | null | undefined;
                        debit?: string | undefined;
                        credit?: string | undefined;
                        dim1?: string | null | undefined;
                        dim2?: string | null | undefined;
                        dim3?: string | null | undefined;
                        dim4?: string | null | undefined;
                        userRemark?: string | null | undefined;
                        accountId: string;
                    }[];
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        postingDate: Date;
                        rows: {
                            account: {
                                accountName: string;
                                accountNumber: string | null;
                                accountType: import("../../../generated/prisma/enums").AccountType | null;
                            };
                            id: string;
                            idx: number;
                            costCenterId: string | null;
                            accountId: string;
                            debit: import("@prisma/client-runtime-utils").Decimal;
                            credit: import("@prisma/client-runtime-utils").Decimal;
                            debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                            creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                            partyType: string | null;
                            partyId: string | null;
                            dim1: string | null;
                            dim2: string | null;
                            dim3: string | null;
                            dim4: string | null;
                            userRemark: string | null;
                            exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                            referenceType: string | null;
                            referenceId: string | null;
                        }[];
                        voucherType: string;
                        documentNo: string | null;
                        chequeNo: string | null;
                        chequeDate: Date | null;
                        remark: string | null;
                        multiCurrency: boolean;
                        isSystemGenerated: boolean;
                        totalDebit: import("@prisma/client-runtime-utils").Decimal;
                        totalCredit: import("@prisma/client-runtime-utils").Decimal;
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
} & {
    accounting: {
        "journal-entries": {
            ":id": {
                patch: {
                    body: {
                        voucherType?: string | undefined;
                        chequeNo?: string | null | undefined;
                        chequeDate?: string | null | undefined;
                        remark?: string | null | undefined;
                        postingDate: string;
                        rows: {
                            costCenterId?: string | null | undefined;
                            debit?: string | undefined;
                            credit?: string | undefined;
                            dim1?: string | null | undefined;
                            dim2?: string | null | undefined;
                            dim3?: string | null | undefined;
                            dim4?: string | null | undefined;
                            userRemark?: string | null | undefined;
                            accountId: string;
                        }[];
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                            amendedFromId: string | null;
                            submittedAt: Date | null;
                            submittedById: string | null;
                            cancelledAt: Date | null;
                            cancelledById: string | null;
                            postingDate: Date;
                            rows: {
                                account: {
                                    accountName: string;
                                    accountNumber: string | null;
                                    accountType: import("../../../generated/prisma/enums").AccountType | null;
                                };
                                id: string;
                                idx: number;
                                costCenterId: string | null;
                                accountId: string;
                                debit: import("@prisma/client-runtime-utils").Decimal;
                                credit: import("@prisma/client-runtime-utils").Decimal;
                                debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                partyType: string | null;
                                partyId: string | null;
                                dim1: string | null;
                                dim2: string | null;
                                dim3: string | null;
                                dim4: string | null;
                                userRemark: string | null;
                                exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                                referenceType: string | null;
                                referenceId: string | null;
                            }[];
                            voucherType: string;
                            documentNo: string | null;
                            chequeNo: string | null;
                            chequeDate: Date | null;
                            remark: string | null;
                            multiCurrency: boolean;
                            isSystemGenerated: boolean;
                            totalDebit: import("@prisma/client-runtime-utils").Decimal;
                            totalCredit: import("@prisma/client-runtime-utils").Decimal;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "المستند غير موجود";
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
    };
} & {
    accounting: {
        "journal-entries": {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
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
    };
} & {
    accounting: {
        "journal-entries": {
            ":id": {
                submit: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                postingDate: Date;
                                rows: {
                                    account: {
                                        accountName: string;
                                        accountNumber: string | null;
                                        accountType: import("../../../generated/prisma/enums").AccountType | null;
                                    };
                                    id: string;
                                    idx: number;
                                    costCenterId: string | null;
                                    accountId: string;
                                    debit: import("@prisma/client-runtime-utils").Decimal;
                                    credit: import("@prisma/client-runtime-utils").Decimal;
                                    debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                    creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                    partyType: string | null;
                                    partyId: string | null;
                                    dim1: string | null;
                                    dim2: string | null;
                                    dim3: string | null;
                                    dim4: string | null;
                                    userRemark: string | null;
                                    exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                                    referenceType: string | null;
                                    referenceId: string | null;
                                }[];
                                voucherType: string;
                                documentNo: string | null;
                                chequeNo: string | null;
                                chequeDate: Date | null;
                                remark: string | null;
                                multiCurrency: boolean;
                                isSystemGenerated: boolean;
                                totalDebit: import("@prisma/client-runtime-utils").Decimal;
                                totalCredit: import("@prisma/client-runtime-utils").Decimal;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "المستند غير موجود";
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
        };
    };
} & {
    accounting: {
        "journal-entries": {
            ":id": {
                cancel: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                postingDate: Date;
                                rows: {
                                    account: {
                                        accountName: string;
                                        accountNumber: string | null;
                                        accountType: import("../../../generated/prisma/enums").AccountType | null;
                                    };
                                    id: string;
                                    idx: number;
                                    costCenterId: string | null;
                                    accountId: string;
                                    debit: import("@prisma/client-runtime-utils").Decimal;
                                    credit: import("@prisma/client-runtime-utils").Decimal;
                                    debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                    creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                    partyType: string | null;
                                    partyId: string | null;
                                    dim1: string | null;
                                    dim2: string | null;
                                    dim3: string | null;
                                    dim4: string | null;
                                    userRemark: string | null;
                                    exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                                    referenceType: string | null;
                                    referenceId: string | null;
                                }[];
                                voucherType: string;
                                documentNo: string | null;
                                chequeNo: string | null;
                                chequeDate: Date | null;
                                remark: string | null;
                                multiCurrency: boolean;
                                isSystemGenerated: boolean;
                                totalDebit: import("@prisma/client-runtime-utils").Decimal;
                                totalCredit: import("@prisma/client-runtime-utils").Decimal;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "المستند غير موجود";
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
        };
    };
} & {
    accounting: {
        "journal-entries": {
            ":id": {
                amend: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                postingDate: Date;
                                rows: {
                                    account: {
                                        accountName: string;
                                        accountNumber: string | null;
                                        accountType: import("../../../generated/prisma/enums").AccountType | null;
                                    };
                                    id: string;
                                    idx: number;
                                    costCenterId: string | null;
                                    accountId: string;
                                    debit: import("@prisma/client-runtime-utils").Decimal;
                                    credit: import("@prisma/client-runtime-utils").Decimal;
                                    debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                    creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                    partyType: string | null;
                                    partyId: string | null;
                                    dim1: string | null;
                                    dim2: string | null;
                                    dim3: string | null;
                                    dim4: string | null;
                                    userRemark: string | null;
                                    exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                                    referenceType: string | null;
                                    referenceId: string | null;
                                }[];
                                voucherType: string;
                                documentNo: string | null;
                                chequeNo: string | null;
                                chequeDate: Date | null;
                                remark: string | null;
                                multiCurrency: boolean;
                                isSystemGenerated: boolean;
                                totalDebit: import("@prisma/client-runtime-utils").Decimal;
                                totalCredit: import("@prisma/client-runtime-utils").Decimal;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "المستند غير موجود";
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
        };
    };
} & {
    accounting: {
        "exchange-rate-revaluations": {};
    };
} & {
    accounting: {
        "exchange-rate-revaluations": {
            scan: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        date: string;
                    };
                    headers: {};
                    response: {
                        200: import("./exchange-rate-revaluation/exchange-rate-revaluation.service").ErrScanRow[];
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
    };
} & {
    accounting: {
        "exchange-rate-revaluations": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        postingDate: Date;
                        rows: {
                            account: {
                                accountName: string;
                                accountNumber: string | null;
                            };
                            id: string;
                            accountCurrencyCode: string;
                            idx: number;
                            accountId: string;
                            partyType: string | null;
                            partyId: string | null;
                            balanceInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                            bookedBase: import("@prisma/client-runtime-utils").Decimal;
                            currentExchangeRate: import("@prisma/client-runtime-utils").Decimal;
                            newBase: import("@prisma/client-runtime-utils").Decimal;
                            gainLoss: import("@prisma/client-runtime-utils").Decimal;
                            isZeroForeignSweep: boolean;
                        }[];
                        documentNo: string | null;
                        journalEntryId: string | null;
                        roundingLossAllowance: import("@prisma/client-runtime-utils").Decimal;
                        totalGainLoss: import("@prisma/client-runtime-utils").Decimal;
                    }[];
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
        "exchange-rate-revaluations": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                            amendedFromId: string | null;
                            submittedAt: Date | null;
                            submittedById: string | null;
                            cancelledAt: Date | null;
                            cancelledById: string | null;
                            postingDate: Date;
                            rows: {
                                account: {
                                    accountName: string;
                                    accountNumber: string | null;
                                };
                                id: string;
                                accountCurrencyCode: string;
                                idx: number;
                                accountId: string;
                                partyType: string | null;
                                partyId: string | null;
                                balanceInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                bookedBase: import("@prisma/client-runtime-utils").Decimal;
                                currentExchangeRate: import("@prisma/client-runtime-utils").Decimal;
                                newBase: import("@prisma/client-runtime-utils").Decimal;
                                gainLoss: import("@prisma/client-runtime-utils").Decimal;
                                isZeroForeignSweep: boolean;
                            }[];
                            documentNo: string | null;
                            journalEntryId: string | null;
                            roundingLossAllowance: import("@prisma/client-runtime-utils").Decimal;
                            totalGainLoss: import("@prisma/client-runtime-utils").Decimal;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "المستند غير موجود";
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
    };
} & {
    accounting: {
        "exchange-rate-revaluations": {
            post: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        postingDate: Date;
                        rows: {
                            account: {
                                accountName: string;
                                accountNumber: string | null;
                            };
                            id: string;
                            accountCurrencyCode: string;
                            idx: number;
                            accountId: string;
                            partyType: string | null;
                            partyId: string | null;
                            balanceInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                            bookedBase: import("@prisma/client-runtime-utils").Decimal;
                            currentExchangeRate: import("@prisma/client-runtime-utils").Decimal;
                            newBase: import("@prisma/client-runtime-utils").Decimal;
                            gainLoss: import("@prisma/client-runtime-utils").Decimal;
                            isZeroForeignSweep: boolean;
                        }[];
                        documentNo: string | null;
                        journalEntryId: string | null;
                        roundingLossAllowance: import("@prisma/client-runtime-utils").Decimal;
                        totalGainLoss: import("@prisma/client-runtime-utils").Decimal;
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
        "exchange-rate-revaluations": {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
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
    };
} & {
    accounting: {
        "exchange-rate-revaluations": {
            ":id": {
                submit: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                postingDate: Date;
                                rows: {
                                    account: {
                                        accountName: string;
                                        accountNumber: string | null;
                                    };
                                    id: string;
                                    accountCurrencyCode: string;
                                    idx: number;
                                    accountId: string;
                                    partyType: string | null;
                                    partyId: string | null;
                                    balanceInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                    bookedBase: import("@prisma/client-runtime-utils").Decimal;
                                    currentExchangeRate: import("@prisma/client-runtime-utils").Decimal;
                                    newBase: import("@prisma/client-runtime-utils").Decimal;
                                    gainLoss: import("@prisma/client-runtime-utils").Decimal;
                                    isZeroForeignSweep: boolean;
                                }[];
                                documentNo: string | null;
                                journalEntryId: string | null;
                                roundingLossAllowance: import("@prisma/client-runtime-utils").Decimal;
                                totalGainLoss: import("@prisma/client-runtime-utils").Decimal;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "المستند غير موجود";
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
        };
    };
} & {
    accounting: {
        "exchange-rate-revaluations": {
            ":id": {
                cancel: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                postingDate: Date;
                                rows: {
                                    account: {
                                        accountName: string;
                                        accountNumber: string | null;
                                    };
                                    id: string;
                                    accountCurrencyCode: string;
                                    idx: number;
                                    accountId: string;
                                    partyType: string | null;
                                    partyId: string | null;
                                    balanceInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                    bookedBase: import("@prisma/client-runtime-utils").Decimal;
                                    currentExchangeRate: import("@prisma/client-runtime-utils").Decimal;
                                    newBase: import("@prisma/client-runtime-utils").Decimal;
                                    gainLoss: import("@prisma/client-runtime-utils").Decimal;
                                    isZeroForeignSweep: boolean;
                                }[];
                                documentNo: string | null;
                                journalEntryId: string | null;
                                roundingLossAllowance: import("@prisma/client-runtime-utils").Decimal;
                                totalGainLoss: import("@prisma/client-runtime-utils").Decimal;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "المستند غير موجود";
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
        };
    };
} & {
    accounting: {
        "exchange-rate-revaluations": {
            ":id": {
                amend: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                postingDate: Date;
                                rows: {
                                    account: {
                                        accountName: string;
                                        accountNumber: string | null;
                                    };
                                    id: string;
                                    accountCurrencyCode: string;
                                    idx: number;
                                    accountId: string;
                                    partyType: string | null;
                                    partyId: string | null;
                                    balanceInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                    bookedBase: import("@prisma/client-runtime-utils").Decimal;
                                    currentExchangeRate: import("@prisma/client-runtime-utils").Decimal;
                                    newBase: import("@prisma/client-runtime-utils").Decimal;
                                    gainLoss: import("@prisma/client-runtime-utils").Decimal;
                                    isZeroForeignSweep: boolean;
                                }[];
                                documentNo: string | null;
                                journalEntryId: string | null;
                                roundingLossAllowance: import("@prisma/client-runtime-utils").Decimal;
                                totalGainLoss: import("@prisma/client-runtime-utils").Decimal;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "المستند غير موجود";
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
        };
    };
} & {
    accounting: {
        parties: {};
    };
} & {
    accounting: {
        parties: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("./party/party.type").PartyListRow[];
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
        parties: {
            ":partyType": {
                ":partyId": {
                    patch: {
                        body: {
                            disabled?: boolean | undefined;
                            defaultCurrencyCode?: string | null | undefined;
                            creditLimit?: string | null | undefined;
                            bypassCreditLimitCheck?: boolean | undefined;
                            accountId?: string | null | undefined;
                            isFrozen?: boolean | undefined;
                        };
                        params: {
                            partyType: string;
                            partyId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                account: {
                                    account: {
                                        accountName: string;
                                        accountNumber: string | null;
                                        accountType: import("../../../generated/prisma/enums").AccountType | null;
                                    };
                                    id: string;
                                    clinicId: string;
                                    accountId: string;
                                    partyType: string;
                                    partyId: string;
                                } | null;
                                creditLimit: {
                                    id: string;
                                    clinicId: string;
                                    creditLimit: import("@prisma/client-runtime-utils").Decimal;
                                    bypassCreditLimitCheck: boolean;
                                    partyType: string;
                                    partyId: string;
                                } | null;
                                config: {
                                    id: string;
                                    clinicId: string;
                                    disabled: boolean;
                                    defaultCurrencyCode: string | null;
                                    partyType: string;
                                    partyId: string;
                                    paymentTermsTemplateId: string | null;
                                    isFrozen: boolean;
                                } | null;
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
        };
    };
} & {
    accounting: {
        parties: {
            ":partyType": {
                ":partyId": {
                    "open-vouchers": {
                        get: {
                            body: {};
                            params: {
                                partyType: string;
                                partyId: string;
                            };
                            query: {};
                            headers: {};
                            response: {
                                200: {
                                    voucherType: string;
                                    voucherId: string;
                                    voucherNo: string | null;
                                    outstanding: string;
                                }[];
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
            };
        };
    };
} & {
    accounting: {
        parties: {
            ":partyType": {
                ":partyId": {
                    "open-balance": {
                        get: {
                            body: {};
                            params: {
                                partyType: string;
                                partyId: string;
                            };
                            query: {};
                            headers: {};
                            response: {
                                200: {
                                    outstanding: string;
                                    voucherCount: number;
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
            };
        };
    };
} & {
    accounting: {
        "payment-entries": {};
    };
} & {
    accounting: {
        "payment-entries": {
            get: {
                body: {};
                params: {};
                query: {
                    limit?: number | undefined;
                    partyId?: string | undefined;
                    docstatus?: "DRAFT" | "SUBMITTED" | "CANCELLED" | undefined;
                    fromDate?: string | undefined;
                    toDate?: string | undefined;
                    paymentType?: "INTERNAL_TRANSFER" | "RECEIVE" | "PAY" | undefined;
                };
                headers: {};
                response: {
                    200: import("./payment-entry/payment-entry.type").PaymentEntryListRow[];
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
} & {
    accounting: {
        "payment-entries": {
            advances: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        partyType: string;
                        partyId: string;
                    };
                    headers: {};
                    response: {
                        200: import("./payment-entry/advances.service").AdvanceSource[];
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
    };
} & {
    accounting: {
        "payment-entries": {
            outstanding: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate?: string | undefined;
                        toDate?: string | undefined;
                        minAmount?: string | undefined;
                        maxAmount?: string | undefined;
                        partyType: string;
                        partyId: string;
                    };
                    headers: {};
                    response: {
                        200: import("./payment-entry/get-outstanding.service").OutstandingForParty;
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
    };
} & {
    accounting: {
        "payment-entries": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./payment-entry/payment-entry.type").PaymentEntryResponse;
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
    };
} & {
    accounting: {
        "payment-entries": {
            post: {
                body: {
                    references?: {
                        referenceDoctype: "journal_entry" | "sales_invoice" | "purchase_invoice" | "insurance_claim";
                        referenceId: string;
                        allocatedAmount: string;
                    }[] | undefined;
                    costCenterId?: string | null | undefined;
                    partyType?: string | null | undefined;
                    partyId?: string | null | undefined;
                    projectId?: string | null | undefined;
                    isOpening?: boolean | undefined;
                    remarks?: string | null | undefined;
                    modeOfPaymentId?: string | null | undefined;
                    paidFromId?: string | null | undefined;
                    paidToId?: string | null | undefined;
                    receivedAmount?: string | null | undefined;
                    referenceNo?: string | null | undefined;
                    referenceDate?: string | null | undefined;
                    deductions?: {
                        costCenterId: string;
                        accountId: string;
                        amount: string;
                    }[] | undefined;
                    postingDate: string;
                    paidAmount: string;
                    paymentType: "INTERNAL_TRANSFER" | "RECEIVE" | "PAY";
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        clinic: {
                            name: string;
                        };
                        modeOfPayment: {
                            modeOfPaymentName: string;
                        } | null;
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        costCenterId: string | null;
                        status: import("./payment-entry/payment-entry.type").PaymentEntryStatus;
                        partyType: string | null;
                        partyId: string | null;
                        projectId: string | null;
                        isOpening: boolean;
                        remarks: string | null;
                        docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        postingDate: Date;
                        documentNo: string | null;
                        inWords: string | null;
                        modeOfPaymentId: string | null;
                        paidAmount: import("@prisma/client-runtime-utils").Decimal;
                        clearanceDate: Date | null;
                        paymentType: import("./payment-entry/payment-entry.type").PaymentType;
                        paidFromId: string;
                        paidFromAccountCurrencyCode: string | null;
                        paidToId: string;
                        paidToAccountCurrencyCode: string | null;
                        sourceExchangeRate: import("@prisma/client-runtime-utils").Decimal;
                        basePaidAmount: import("@prisma/client-runtime-utils").Decimal;
                        receivedAmount: import("@prisma/client-runtime-utils").Decimal;
                        targetExchangeRate: import("@prisma/client-runtime-utils").Decimal;
                        baseReceivedAmount: import("@prisma/client-runtime-utils").Decimal;
                        totalAllocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                        unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                        differenceAmount: import("@prisma/client-runtime-utils").Decimal;
                        referenceNo: string | null;
                        referenceDate: Date | null;
                        bookAdvanceInSeparateAccount: boolean;
                        paidFrom: {
                            accountName: string;
                            accountNumber: string | null;
                            accountType: import("../../../generated/prisma/enums").AccountType | null;
                        };
                        paidTo: {
                            accountName: string;
                            accountNumber: string | null;
                            accountType: import("../../../generated/prisma/enums").AccountType | null;
                        };
                        deductions: {
                            account: {
                                accountName: string;
                                accountNumber: string | null;
                            };
                            costCenter: {
                                costCenterName: string;
                            };
                            id: string;
                            idx: number;
                            costCenterId: string;
                            accountId: string;
                            amount: import("@prisma/client-runtime-utils").Decimal;
                            isExchangeGainLoss: boolean;
                        }[];
                        partyName: string | null;
                        references: import("./payment-entry/payment-entry.type").PaymentEntryReferenceDisplay[];
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
} & {
    accounting: {
        "payment-entries": {
            ":id": {
                patch: {
                    body: {
                        references?: {
                            referenceDoctype: "journal_entry" | "sales_invoice" | "purchase_invoice" | "insurance_claim";
                            referenceId: string;
                            allocatedAmount: string;
                        }[] | undefined;
                        costCenterId?: string | null | undefined;
                        partyType?: string | null | undefined;
                        partyId?: string | null | undefined;
                        projectId?: string | null | undefined;
                        isOpening?: boolean | undefined;
                        remarks?: string | null | undefined;
                        modeOfPaymentId?: string | null | undefined;
                        paidFromId?: string | null | undefined;
                        paidToId?: string | null | undefined;
                        receivedAmount?: string | null | undefined;
                        referenceNo?: string | null | undefined;
                        referenceDate?: string | null | undefined;
                        deductions?: {
                            costCenterId: string;
                            accountId: string;
                            amount: string;
                        }[] | undefined;
                        postingDate: string;
                        paidAmount: string;
                        paymentType: "INTERNAL_TRANSFER" | "RECEIVE" | "PAY";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./payment-entry/payment-entry.type").PaymentEntryResponse;
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
    };
} & {
    accounting: {
        "payment-entries": {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
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
    };
} & {
    accounting: {
        "payment-entries": {
            ":id": {
                submit: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./payment-entry/payment-entry.type").PaymentEntryResponse;
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
        };
    };
} & {
    accounting: {
        "payment-entries": {
            ":id": {
                cancel: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./payment-entry/payment-entry.type").PaymentEntryResponse;
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
        };
    };
} & {
    accounting: {
        "payment-entries": {
            ":id": {
                amend: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./payment-entry/payment-entry.type").PaymentEntryResponse;
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
        };
    };
} & {
    accounting: {
        "payment-reconciliation": {};
    };
} & {
    accounting: {
        "payment-reconciliation": {
            get: {
                body: {};
                params: {};
                query: {
                    fromDate?: string | undefined;
                    toDate?: string | undefined;
                    minAmount?: string | undefined;
                    maxAmount?: string | undefined;
                    partyType: string;
                    partyId: string;
                };
                headers: {};
                response: {
                    200: import("./payment-entry/get-outstanding.service").OutstandingForParty;
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
} & {
    accounting: {
        "payment-reconciliation": {
            reconcile: {
                post: {
                    body: {
                        partyType: string;
                        partyId: string;
                        allocations: {
                            differenceAmount?: string | null | undefined;
                            differenceAccountId?: string | null | undefined;
                            invoiceId: string;
                            paymentType: string;
                            allocatedAmount: string;
                            paymentId: string;
                            invoiceType: string;
                        }[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: import("./payment-entry/reconciliation.service").ReconciliationResult[];
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
    };
} & {
    accounting: {
        "payment-reconciliation": {
            unreconcile: {
                post: {
                    body: {
                        remarks?: string | null | undefined;
                        partyType: string;
                        partyId: string;
                        paymentType: string;
                        paymentId: string;
                        selections: {
                            againstVoucherType: string;
                            againstVoucherId: string;
                        }[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: import("./payment-entry/unreconcile.service").UnreconcileResult;
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
    };
} & {
    accounting: {
        "payment-terms": {};
    };
} & {
    accounting: {
        "payment-terms": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        discount: import("@prisma/client-runtime-utils").Decimal;
                        modeOfPayment: {
                            modeOfPaymentName: string;
                        } | null;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        modeOfPaymentId: string | null;
                        invoicePortion: import("@prisma/client-runtime-utils").Decimal;
                        discountType: import("./payment-terms/payment-terms.type").PaymentDiscountType;
                        paymentTermName: string;
                        dueDateBasedOn: import("./payment-terms/payment-terms.type").DueDateBasis;
                        creditDays: number;
                        creditMonths: number;
                        discountValidityBasedOn: import("./payment-terms/payment-terms.type").DueDateBasis;
                        discountValidity: number;
                    }[];
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
        "payment-terms": {
            post: {
                body: {
                    modeOfPaymentId?: string | null | undefined;
                    discount: string;
                    invoicePortion: string;
                    discountType: "PERCENTAGE" | "AMOUNT";
                    paymentTermName: string;
                    dueDateBasedOn: "DAYS_AFTER_INVOICE_DATE" | "DAYS_AFTER_INVOICE_MONTH_END" | "MONTHS_AFTER_INVOICE_MONTH_END";
                    creditDays: number;
                    creditMonths: number;
                    discountValidityBasedOn: "DAYS_AFTER_INVOICE_DATE" | "DAYS_AFTER_INVOICE_MONTH_END" | "MONTHS_AFTER_INVOICE_MONTH_END";
                    discountValidity: number;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        discount: import("@prisma/client-runtime-utils").Decimal;
                        modeOfPayment: {
                            modeOfPaymentName: string;
                        } | null;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        modeOfPaymentId: string | null;
                        invoicePortion: import("@prisma/client-runtime-utils").Decimal;
                        discountType: import("./payment-terms/payment-terms.type").PaymentDiscountType;
                        paymentTermName: string;
                        dueDateBasedOn: import("./payment-terms/payment-terms.type").DueDateBasis;
                        creditDays: number;
                        creditMonths: number;
                        discountValidityBasedOn: import("./payment-terms/payment-terms.type").DueDateBasis;
                        discountValidity: number;
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
} & {
    accounting: {
        "payment-terms": {
            ":id": {
                patch: {
                    body: {
                        modeOfPaymentId?: string | null | undefined;
                        discount: string;
                        invoicePortion: string;
                        discountType: "PERCENTAGE" | "AMOUNT";
                        paymentTermName: string;
                        dueDateBasedOn: "DAYS_AFTER_INVOICE_DATE" | "DAYS_AFTER_INVOICE_MONTH_END" | "MONTHS_AFTER_INVOICE_MONTH_END";
                        creditDays: number;
                        creditMonths: number;
                        discountValidityBasedOn: "DAYS_AFTER_INVOICE_DATE" | "DAYS_AFTER_INVOICE_MONTH_END" | "MONTHS_AFTER_INVOICE_MONTH_END";
                        discountValidity: number;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            discount: import("@prisma/client-runtime-utils").Decimal;
                            modeOfPayment: {
                                modeOfPaymentName: string;
                            } | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            modeOfPaymentId: string | null;
                            invoicePortion: import("@prisma/client-runtime-utils").Decimal;
                            discountType: import("./payment-terms/payment-terms.type").PaymentDiscountType;
                            paymentTermName: string;
                            dueDateBasedOn: import("./payment-terms/payment-terms.type").DueDateBasis;
                            creditDays: number;
                            creditMonths: number;
                            discountValidityBasedOn: import("./payment-terms/payment-terms.type").DueDateBasis;
                            discountValidity: number;
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
    };
} & {
    accounting: {
        "payment-terms": {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            ok: boolean;
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
    };
} & {
    accounting: {
        "payment-terms": {
            templates: {
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
                            rows: {
                                id: string;
                                idx: number;
                                termId: string;
                                term: {
                                    invoicePortion: import("@prisma/client-runtime-utils").Decimal;
                                    paymentTermName: string;
                                };
                            }[];
                            templateName: string;
                            allocatePaymentBasedOnPaymentTerms: boolean;
                        }[];
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
    };
} & {
    accounting: {
        "payment-terms": {
            templates: {
                post: {
                    body: {
                        templateName: string;
                        allocatePaymentBasedOnPaymentTerms: boolean;
                        termIds: string[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            rows: {
                                id: string;
                                idx: number;
                                termId: string;
                                term: {
                                    invoicePortion: import("@prisma/client-runtime-utils").Decimal;
                                    paymentTermName: string;
                                };
                            }[];
                            templateName: string;
                            allocatePaymentBasedOnPaymentTerms: boolean;
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
    };
} & {
    accounting: {
        "payment-terms": {
            templates: {
                ":id": {
                    patch: {
                        body: {
                            templateName: string;
                            allocatePaymentBasedOnPaymentTerms: boolean;
                            termIds: string[];
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                rows: {
                                    id: string;
                                    idx: number;
                                    termId: string;
                                    term: {
                                        invoicePortion: import("@prisma/client-runtime-utils").Decimal;
                                        paymentTermName: string;
                                    };
                                }[];
                                templateName: string;
                                allocatePaymentBasedOnPaymentTerms: boolean;
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
        };
    };
} & {
    accounting: {
        "payment-terms": {
            templates: {
                ":id": {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                ok: boolean;
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
        };
    };
} & {
    accounting: {
        tax: {};
    };
} & {
    accounting: {
        tax: {
            "sales-templates": {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
                            isDefault: boolean;
                            taxCategoryId: string | null;
                            taxes: {
                                id: string;
                                description: string;
                                idx: number;
                                chargeType: import("./sales-invoice/sales-invoice.type").TaxChargeType;
                                rate: import("@prisma/client-runtime-utils").Decimal;
                                taxAmount: import("@prisma/client-runtime-utils").Decimal;
                                rowId: number | null;
                                includedInPrintRate: boolean;
                                accountHead: {
                                    accountName: string;
                                };
                                accountHeadId: string;
                                costCenterId: string | null;
                            }[];
                        }[];
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
    };
} & {
    accounting: {
        tax: {
            "sales-templates": {
                post: {
                    body: {
                        taxCategoryId?: string | null | undefined;
                        disabled: boolean;
                        title: string;
                        isDefault: boolean;
                        taxes: {
                            rowId?: number | null | undefined;
                            costCenterId?: string | null | undefined;
                            category?: "TOTAL" | "VALUATION" | "VALUATION_AND_TOTAL" | undefined;
                            addDeductTax?: "ADD" | "DEDUCT" | undefined;
                            description: string;
                            chargeType: "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
                            rate: string;
                            taxAmount: string;
                            includedInPrintRate: boolean;
                            accountHeadId: string;
                        }[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
                            isDefault: boolean;
                            taxCategoryId: string | null;
                            taxes: {
                                id: string;
                                description: string;
                                idx: number;
                                chargeType: import("./sales-invoice/sales-invoice.type").TaxChargeType;
                                rate: import("@prisma/client-runtime-utils").Decimal;
                                taxAmount: import("@prisma/client-runtime-utils").Decimal;
                                rowId: number | null;
                                includedInPrintRate: boolean;
                                accountHead: {
                                    accountName: string;
                                };
                                accountHeadId: string;
                                costCenterId: string | null;
                            }[];
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
    };
} & {
    accounting: {
        tax: {
            "sales-templates": {
                ":id": {
                    patch: {
                        body: {
                            taxCategoryId?: string | null | undefined;
                            disabled: boolean;
                            title: string;
                            isDefault: boolean;
                            taxes: {
                                rowId?: number | null | undefined;
                                costCenterId?: string | null | undefined;
                                category?: "TOTAL" | "VALUATION" | "VALUATION_AND_TOTAL" | undefined;
                                addDeductTax?: "ADD" | "DEDUCT" | undefined;
                                description: string;
                                chargeType: "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
                                rate: string;
                                taxAmount: string;
                                includedInPrintRate: boolean;
                                accountHeadId: string;
                            }[];
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                disabled: boolean;
                                createdAt: Date;
                                updatedAt: Date;
                                title: string;
                                isDefault: boolean;
                                taxCategoryId: string | null;
                                taxes: {
                                    id: string;
                                    description: string;
                                    idx: number;
                                    chargeType: import("./sales-invoice/sales-invoice.type").TaxChargeType;
                                    rate: import("@prisma/client-runtime-utils").Decimal;
                                    taxAmount: import("@prisma/client-runtime-utils").Decimal;
                                    rowId: number | null;
                                    includedInPrintRate: boolean;
                                    accountHead: {
                                        accountName: string;
                                    };
                                    accountHeadId: string;
                                    costCenterId: string | null;
                                }[];
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
        };
    };
} & {
    accounting: {
        tax: {
            "sales-templates": {
                ":id": {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                ok: boolean;
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
        };
    };
} & {
    accounting: {
        tax: {
            "purchase-templates": {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
                            isDefault: boolean;
                            taxCategoryId: string | null;
                            taxes: {
                                id: string;
                                description: string;
                                idx: number;
                                chargeType: import("./sales-invoice/sales-invoice.type").TaxChargeType;
                                rate: import("@prisma/client-runtime-utils").Decimal;
                                taxAmount: import("@prisma/client-runtime-utils").Decimal;
                                rowId: number | null;
                                includedInPrintRate: boolean;
                                accountHead: {
                                    accountName: string;
                                };
                                accountHeadId: string;
                                costCenterId: string | null;
                                category: import("./purchase-invoice/purchase-invoice.type").TaxRowCategory;
                                addDeductTax: import("./purchase-invoice/purchase-invoice.type").TaxAddDeduct;
                            }[];
                        }[];
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
    };
} & {
    accounting: {
        tax: {
            "purchase-templates": {
                post: {
                    body: {
                        taxCategoryId?: string | null | undefined;
                        disabled: boolean;
                        title: string;
                        isDefault: boolean;
                        taxes: {
                            rowId?: number | null | undefined;
                            costCenterId?: string | null | undefined;
                            category?: "TOTAL" | "VALUATION" | "VALUATION_AND_TOTAL" | undefined;
                            addDeductTax?: "ADD" | "DEDUCT" | undefined;
                            description: string;
                            chargeType: "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
                            rate: string;
                            taxAmount: string;
                            includedInPrintRate: boolean;
                            accountHeadId: string;
                        }[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
                            isDefault: boolean;
                            taxCategoryId: string | null;
                            taxes: {
                                id: string;
                                description: string;
                                idx: number;
                                chargeType: import("./sales-invoice/sales-invoice.type").TaxChargeType;
                                rate: import("@prisma/client-runtime-utils").Decimal;
                                taxAmount: import("@prisma/client-runtime-utils").Decimal;
                                rowId: number | null;
                                includedInPrintRate: boolean;
                                accountHead: {
                                    accountName: string;
                                };
                                accountHeadId: string;
                                costCenterId: string | null;
                                category: import("./purchase-invoice/purchase-invoice.type").TaxRowCategory;
                                addDeductTax: import("./purchase-invoice/purchase-invoice.type").TaxAddDeduct;
                            }[];
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
    };
} & {
    accounting: {
        tax: {
            "purchase-templates": {
                ":id": {
                    patch: {
                        body: {
                            taxCategoryId?: string | null | undefined;
                            disabled: boolean;
                            title: string;
                            isDefault: boolean;
                            taxes: {
                                rowId?: number | null | undefined;
                                costCenterId?: string | null | undefined;
                                category?: "TOTAL" | "VALUATION" | "VALUATION_AND_TOTAL" | undefined;
                                addDeductTax?: "ADD" | "DEDUCT" | undefined;
                                description: string;
                                chargeType: "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
                                rate: string;
                                taxAmount: string;
                                includedInPrintRate: boolean;
                                accountHeadId: string;
                            }[];
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                disabled: boolean;
                                createdAt: Date;
                                updatedAt: Date;
                                title: string;
                                isDefault: boolean;
                                taxCategoryId: string | null;
                                taxes: {
                                    id: string;
                                    description: string;
                                    idx: number;
                                    chargeType: import("./sales-invoice/sales-invoice.type").TaxChargeType;
                                    rate: import("@prisma/client-runtime-utils").Decimal;
                                    taxAmount: import("@prisma/client-runtime-utils").Decimal;
                                    rowId: number | null;
                                    includedInPrintRate: boolean;
                                    accountHead: {
                                        accountName: string;
                                    };
                                    accountHeadId: string;
                                    costCenterId: string | null;
                                    category: import("./purchase-invoice/purchase-invoice.type").TaxRowCategory;
                                    addDeductTax: import("./purchase-invoice/purchase-invoice.type").TaxAddDeduct;
                                }[];
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
        };
    };
} & {
    accounting: {
        tax: {
            "purchase-templates": {
                ":id": {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                ok: boolean;
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
        };
    };
} & {
    accounting: {
        tax: {
            "item-templates": {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
                            rows: {
                                id: string;
                                taxRate: import("@prisma/client-runtime-utils").Decimal;
                                taxTypeAccountId: string;
                                taxType: {
                                    accountName: string;
                                };
                            }[];
                        }[];
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
    };
} & {
    accounting: {
        tax: {
            "item-templates": {
                post: {
                    body: {
                        disabled: boolean;
                        title: string;
                        rows: {
                            taxRate: string;
                            taxTypeAccountId: string;
                        }[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
                            rows: {
                                id: string;
                                taxRate: import("@prisma/client-runtime-utils").Decimal;
                                taxTypeAccountId: string;
                                taxType: {
                                    accountName: string;
                                };
                            }[];
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
    };
} & {
    accounting: {
        tax: {
            "item-templates": {
                ":id": {
                    patch: {
                        body: {
                            disabled: boolean;
                            title: string;
                            rows: {
                                taxRate: string;
                                taxTypeAccountId: string;
                            }[];
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                clinicId: string;
                                disabled: boolean;
                                createdAt: Date;
                                updatedAt: Date;
                                title: string;
                                rows: {
                                    id: string;
                                    taxRate: import("@prisma/client-runtime-utils").Decimal;
                                    taxTypeAccountId: string;
                                    taxType: {
                                        accountName: string;
                                    };
                                }[];
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
        };
    };
} & {
    accounting: {
        tax: {
            "item-templates": {
                ":id": {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                ok: boolean;
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
        };
    };
} & {
    accounting: {
        tax: {
            categories: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
                        }[];
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
    };
} & {
    accounting: {
        tax: {
            categories: {
                post: {
                    body: {
                        disabled: boolean;
                        title: string;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
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
    };
} & {
    accounting: {
        tax: {
            categories: {
                ":id": {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                ok: boolean;
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
        };
    };
} & {
    accounting: {
        tax: {
            rules: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            priority: number;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            taxCategoryId: string | null;
                            partyType: string | null;
                            partyId: string | null;
                            fromDate: Date | null;
                            toDate: Date | null;
                            itemId: string | null;
                            taxType: string;
                            salesTaxTemplateId: string | null;
                            purchaseTaxTemplateId: string | null;
                            itemCategory: string | null;
                            salesTemplate: {
                                title: string;
                            } | null;
                            purchaseTemplate: {
                                title: string;
                            } | null;
                        }[];
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
    };
} & {
    accounting: {
        tax: {
            rules: {
                post: {
                    body: {
                        taxCategoryId?: string | null | undefined;
                        partyType?: string | null | undefined;
                        partyId?: string | null | undefined;
                        fromDate?: string | null | undefined;
                        toDate?: string | null | undefined;
                        itemId?: string | null | undefined;
                        salesTaxTemplateId?: string | null | undefined;
                        purchaseTaxTemplateId?: string | null | undefined;
                        itemCategory?: string | null | undefined;
                        priority: number;
                        taxType: "SALES" | "PURCHASE";
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            priority: number;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            taxCategoryId: string | null;
                            partyType: string | null;
                            partyId: string | null;
                            fromDate: Date | null;
                            toDate: Date | null;
                            itemId: string | null;
                            taxType: string;
                            salesTaxTemplateId: string | null;
                            purchaseTaxTemplateId: string | null;
                            itemCategory: string | null;
                            salesTemplate: {
                                title: string;
                            } | null;
                            purchaseTemplate: {
                                title: string;
                            } | null;
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
    };
} & {
    accounting: {
        tax: {
            rules: {
                ":id": {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                ok: boolean;
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
        };
    };
} & {
    accounting: {
        tax: {
            preview: {
                post: {
                    body: {
                        applyDiscountOn?: "GRAND_TOTAL" | "NET_TOTAL" | null | undefined;
                        discountAmount?: string | null | undefined;
                        isCashOrNonTradeDiscount?: boolean | undefined;
                        currencyPrecision?: number | undefined;
                        roundRowWiseTax?: boolean | undefined;
                        taxes: {
                            rate?: string | undefined;
                            taxAmount?: string | undefined;
                            rowId?: number | null | undefined;
                            includedInPrintRate?: boolean | undefined;
                            category?: "TOTAL" | "VALUATION" | "VALUATION_AND_TOTAL" | undefined;
                            addDeductTax?: "ADD" | "DEDUCT" | undefined;
                            key: string;
                            chargeType: "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
                            accountHead: string;
                        }[];
                        items: {
                            rate?: string | undefined;
                            isFreeItem?: boolean | undefined;
                            itemTaxRates?: {
                                [x: string]: string;
                            } | null | undefined;
                            key: string;
                            qty: string;
                        }[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: import("./tax/tax-calculator").CalcResult;
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
    };
} & {
    accounting: {
        tax: {
            "resolve-template": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        taxCategoryId?: string | undefined;
                        partyType?: string | undefined;
                        partyId?: string | undefined;
                        itemId?: string | undefined;
                        itemCategory?: string | undefined;
                        date: string;
                        taxType: "SALES" | "PURCHASE";
                    };
                    headers: {};
                    response: {
                        200: {
                            templateId: string | null;
                            ruleId: string | null;
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
    };
} & {
    accounting: {
        "sales-invoices": {};
    };
} & {
    accounting: {
        "sales-invoices": {
            get: {
                body: {};
                params: {};
                query: {
                    status?: "DRAFT" | "SUBMITTED" | "CANCELLED" | "UNPAID" | "PAID" | "PARTLY_PAID" | "OVERDUE" | "RETURN" | "CREDIT_NOTE_ISSUED" | "INTERNAL_TRANSFER" | "CONSOLIDATED" | undefined;
                    limit?: number | undefined;
                    partyId?: string | undefined;
                    docstatus?: "DRAFT" | "SUBMITTED" | "CANCELLED" | undefined;
                    isReturn?: boolean | undefined;
                    fromDate?: string | undefined;
                    toDate?: string | undefined;
                };
                headers: {};
                response: {
                    200: import("./sales-invoice/sales-invoice.type").SalesInvoiceListRow[];
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
} & {
    accounting: {
        "sales-invoices": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./sales-invoice/sales-invoice.type").SalesInvoiceResponse;
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
    };
} & {
    accounting: {
        "sales-invoices": {
            post: {
                body: {
                    writeOffAccountId?: string | null | undefined;
                    taxCategoryId?: string | null | undefined;
                    taxes?: {
                        rate?: string | undefined;
                        taxAmount?: string | undefined;
                        rowId?: number | null | undefined;
                        includedInPrintRate?: boolean | undefined;
                        costCenterId?: string | null | undefined;
                        description: string;
                        chargeType: "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
                        accountHeadId: string;
                    }[] | undefined;
                    costCenterId?: string | null | undefined;
                    schedule?: {
                        description?: string | null | undefined;
                        modeOfPaymentId?: string | null | undefined;
                        dueDate: string;
                        invoicePortion: string;
                        paymentAmount: string;
                    }[] | undefined;
                    partyType?: string | undefined;
                    projectId?: string | null | undefined;
                    isOpening?: boolean | undefined;
                    dueDate?: string | null | undefined;
                    remarks?: string | null | undefined;
                    paymentTermsTemplateId?: string | null | undefined;
                    debitToId?: string | null | undefined;
                    isReturn?: boolean | undefined;
                    returnAgainstId?: string | null | undefined;
                    updateOutstandingForSelf?: boolean | undefined;
                    poNo?: string | null | undefined;
                    poDate?: string | null | undefined;
                    taxesAndChargesTemplateId?: string | null | undefined;
                    applyDiscountOn?: "GRAND_TOTAL" | "NET_TOTAL" | undefined;
                    additionalDiscountPercentage?: string | undefined;
                    discountAmount?: string | undefined;
                    isCashOrNonTradeDiscount?: boolean | undefined;
                    additionalDiscountAccountId?: string | null | undefined;
                    disableRoundedTotal?: boolean | undefined;
                    allocateAdvancesAutomatically?: boolean | undefined;
                    writeOffAmount?: string | undefined;
                    writeOffCostCenterId?: string | null | undefined;
                    ignoreDefaultPaymentTermsTemplate?: boolean | undefined;
                    advances?: {
                        referenceType: "journal_entry" | "payment_entry";
                        referenceId: string;
                        allocatedAmount: string;
                    }[] | undefined;
                    items: {
                        description?: string | null | undefined;
                        rate?: string | undefined;
                        projectId?: string | null | undefined;
                        discountAmount?: string | null | undefined;
                        itemCode?: string | null | undefined;
                        uom?: string | null | undefined;
                        priceListRate?: string | null | undefined;
                        marginType?: "PERCENTAGE" | "AMOUNT" | null | undefined;
                        marginRateOrAmount?: string | null | undefined;
                        discountPercentage?: string | null | undefined;
                        isFreeItem?: boolean | undefined;
                        discountAccountId?: string | null | undefined;
                        itemTaxTemplateId?: string | null | undefined;
                        costCenterId: string;
                        incomeAccountId: string;
                        itemName: string;
                        qty: string;
                    }[];
                    partyId: string;
                    postingDate: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        clinic: {
                            name: string;
                        };
                        paymentTermsTemplate: {
                            templateName: string;
                        } | null;
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        writeOffAccountId: string | null;
                        unrealizedProfitLossAccountId: string | null;
                        currencyCode: string;
                        taxCategoryId: string | null;
                        taxes: {
                            id: string;
                            description: string;
                            idx: number;
                            chargeType: import("./sales-invoice/sales-invoice.type").TaxChargeType;
                            rate: import("@prisma/client-runtime-utils").Decimal;
                            taxAmount: import("@prisma/client-runtime-utils").Decimal;
                            rowId: number | null;
                            includedInPrintRate: boolean;
                            accountHead: {
                                accountName: string;
                                accountNumber: string | null;
                            };
                            accountHeadId: string;
                            costCenterId: string | null;
                            total: import("@prisma/client-runtime-utils").Decimal;
                            taxAmountAfterDiscountAmount: import("@prisma/client-runtime-utils").Decimal;
                        }[];
                        costCenterId: string | null;
                        status: import("./sales-invoice/sales-invoice.type").SalesInvoiceStatus;
                        items: {
                            costCenter: {
                                costCenterName: string;
                            };
                            itemTaxTemplate: {
                                title: string;
                            } | null;
                            id: string;
                            description: string | null;
                            idx: number;
                            rate: import("@prisma/client-runtime-utils").Decimal;
                            costCenterId: string;
                            projectId: string | null;
                            amount: import("@prisma/client-runtime-utils").Decimal;
                            discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            incomeAccountId: string;
                            itemCode: string | null;
                            itemName: string;
                            qty: import("@prisma/client-runtime-utils").Decimal;
                            uom: string | null;
                            conversionFactor: import("@prisma/client-runtime-utils").Decimal;
                            priceListRate: import("@prisma/client-runtime-utils").Decimal | null;
                            marginType: import("./sales-invoice/sales-invoice.type").MarginType | null;
                            marginRateOrAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            discountPercentage: import("@prisma/client-runtime-utils").Decimal | null;
                            netRate: import("@prisma/client-runtime-utils").Decimal;
                            netAmount: import("@prisma/client-runtime-utils").Decimal;
                            isFreeItem: boolean;
                            discountAccountId: string | null;
                            itemTaxTemplateId: string | null;
                            itemTaxRates: string | null;
                            enableDeferredRevenue: boolean;
                            deferredAccountId: string | null;
                            serviceStartDate: Date | null;
                            serviceEndDate: Date | null;
                            serviceStopDate: Date | null;
                            incomeAccount: {
                                accountName: string;
                                accountNumber: string | null;
                            };
                        }[];
                        partyType: string;
                        partyId: string;
                        projectId: string | null;
                        isOpening: boolean;
                        dueDate: Date | null;
                        remarks: string | null;
                        docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        postingDate: Date;
                        paymentTermsTemplateId: string | null;
                        documentNo: string | null;
                        postingTime: string | null;
                        setPostingTime: boolean;
                        conversionRate: import("@prisma/client-runtime-utils").Decimal;
                        debitToId: string;
                        partyAccountCurrencyCode: string | null;
                        isReturn: boolean;
                        returnAgainstId: string | null;
                        updateOutstandingForSelf: boolean;
                        isInternalCustomer: boolean;
                        poNo: string | null;
                        poDate: Date | null;
                        taxesAndChargesTemplateId: string | null;
                        applyDiscountOn: import("./sales-invoice/sales-invoice.type").ApplyDiscountOn;
                        additionalDiscountPercentage: import("@prisma/client-runtime-utils").Decimal;
                        discountAmount: import("@prisma/client-runtime-utils").Decimal;
                        isCashOrNonTradeDiscount: boolean;
                        additionalDiscountAccountId: string | null;
                        total: import("@prisma/client-runtime-utils").Decimal;
                        netTotal: import("@prisma/client-runtime-utils").Decimal;
                        totalTaxesAndCharges: import("@prisma/client-runtime-utils").Decimal;
                        grandTotal: import("@prisma/client-runtime-utils").Decimal;
                        roundingAdjustment: import("@prisma/client-runtime-utils").Decimal;
                        roundedTotal: import("@prisma/client-runtime-utils").Decimal;
                        disableRoundedTotal: boolean;
                        inWords: string | null;
                        outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
                        totalAdvance: import("@prisma/client-runtime-utils").Decimal;
                        writeOffAmount: import("@prisma/client-runtime-utils").Decimal;
                        writeOffCostCenterId: string | null;
                        ignoreDefaultPaymentTermsTemplate: boolean;
                        returnAgainst: {
                            documentNo: string | null;
                        } | null;
                        debitTo: {
                            accountName: string;
                            accountNumber: string | null;
                        };
                        taxesAndChargesTemplate: {
                            title: string;
                        } | null;
                        advances: {
                            id: string;
                            idx: number;
                            referenceType: string;
                            referenceId: string;
                            allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                            exchangeGainLossJeId: string | null;
                            exchangeGainLoss: import("@prisma/client-runtime-utils").Decimal;
                            advanceAmount: import("@prisma/client-runtime-utils").Decimal;
                            refExchangeRate: import("@prisma/client-runtime-utils").Decimal;
                        }[];
                        partyName: string | null;
                        schedule: import("./sales-invoice/sales-invoice.type").PaymentScheduleRow[];
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
} & {
    accounting: {
        "sales-invoices": {
            ":id": {
                patch: {
                    body: {
                        writeOffAccountId?: string | null | undefined;
                        taxCategoryId?: string | null | undefined;
                        taxes?: {
                            rate?: string | undefined;
                            taxAmount?: string | undefined;
                            rowId?: number | null | undefined;
                            includedInPrintRate?: boolean | undefined;
                            costCenterId?: string | null | undefined;
                            description: string;
                            chargeType: "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
                            accountHeadId: string;
                        }[] | undefined;
                        costCenterId?: string | null | undefined;
                        schedule?: {
                            description?: string | null | undefined;
                            modeOfPaymentId?: string | null | undefined;
                            dueDate: string;
                            invoicePortion: string;
                            paymentAmount: string;
                        }[] | undefined;
                        partyType?: string | undefined;
                        projectId?: string | null | undefined;
                        isOpening?: boolean | undefined;
                        dueDate?: string | null | undefined;
                        remarks?: string | null | undefined;
                        paymentTermsTemplateId?: string | null | undefined;
                        debitToId?: string | null | undefined;
                        isReturn?: boolean | undefined;
                        returnAgainstId?: string | null | undefined;
                        updateOutstandingForSelf?: boolean | undefined;
                        poNo?: string | null | undefined;
                        poDate?: string | null | undefined;
                        taxesAndChargesTemplateId?: string | null | undefined;
                        applyDiscountOn?: "GRAND_TOTAL" | "NET_TOTAL" | undefined;
                        additionalDiscountPercentage?: string | undefined;
                        discountAmount?: string | undefined;
                        isCashOrNonTradeDiscount?: boolean | undefined;
                        additionalDiscountAccountId?: string | null | undefined;
                        disableRoundedTotal?: boolean | undefined;
                        allocateAdvancesAutomatically?: boolean | undefined;
                        writeOffAmount?: string | undefined;
                        writeOffCostCenterId?: string | null | undefined;
                        ignoreDefaultPaymentTermsTemplate?: boolean | undefined;
                        advances?: {
                            referenceType: "journal_entry" | "payment_entry";
                            referenceId: string;
                            allocatedAmount: string;
                        }[] | undefined;
                        items: {
                            description?: string | null | undefined;
                            rate?: string | undefined;
                            projectId?: string | null | undefined;
                            discountAmount?: string | null | undefined;
                            itemCode?: string | null | undefined;
                            uom?: string | null | undefined;
                            priceListRate?: string | null | undefined;
                            marginType?: "PERCENTAGE" | "AMOUNT" | null | undefined;
                            marginRateOrAmount?: string | null | undefined;
                            discountPercentage?: string | null | undefined;
                            isFreeItem?: boolean | undefined;
                            discountAccountId?: string | null | undefined;
                            itemTaxTemplateId?: string | null | undefined;
                            costCenterId: string;
                            incomeAccountId: string;
                            itemName: string;
                            qty: string;
                        }[];
                        partyId: string;
                        postingDate: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./sales-invoice/sales-invoice.type").SalesInvoiceResponse;
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
    };
} & {
    accounting: {
        "sales-invoices": {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
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
    };
} & {
    accounting: {
        "sales-invoices": {
            ":id": {
                "return-draft": {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                postingDate: string;
                                partyType: string;
                                partyId: string;
                                isReturn: boolean;
                                updateOutstandingForSelf: boolean;
                                isOpening: boolean;
                                applyDiscountOn: "GRAND_TOTAL" | "NET_TOTAL";
                                additionalDiscountPercentage: string;
                                discountAmount: string;
                                isCashOrNonTradeDiscount: boolean;
                                disableRoundedTotal: boolean;
                                writeOffAmount: string;
                                ignoreDefaultPaymentTermsTemplate: boolean;
                                items: {
                                    itemName: string;
                                    qty: string;
                                    rate: string;
                                    isFreeItem: boolean;
                                    incomeAccountId: string;
                                    costCenterId: string;
                                    itemCode?: string | null | undefined;
                                    description?: string | null | undefined;
                                    uom?: string | null | undefined;
                                    priceListRate?: string | null | undefined;
                                    marginType?: "PERCENTAGE" | "AMOUNT" | null | undefined;
                                    marginRateOrAmount?: string | null | undefined;
                                    discountPercentage?: string | null | undefined;
                                    discountAmount?: string | null | undefined;
                                    discountAccountId?: string | null | undefined;
                                    itemTaxTemplateId?: string | null | undefined;
                                    projectId?: string | null | undefined;
                                    enableDeferredRevenue?: boolean | undefined;
                                    deferredAccountId?: string | null | undefined;
                                    serviceStartDate?: string | null | undefined;
                                    serviceEndDate?: string | null | undefined;
                                    serviceStopDate?: string | null | undefined;
                                }[];
                                taxes: {
                                    chargeType: "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
                                    accountHeadId: string;
                                    rate: string;
                                    taxAmount: string;
                                    description: string;
                                    includedInPrintRate: boolean;
                                    rowId?: number | null | undefined;
                                    costCenterId?: string | null | undefined;
                                }[];
                                schedule: {
                                    dueDate: string;
                                    invoicePortion: string;
                                    paymentAmount: string;
                                    description?: string | null | undefined;
                                    modeOfPaymentId?: string | null | undefined;
                                }[];
                                allocateAdvancesAutomatically: boolean;
                                advances: {
                                    referenceType: "journal_entry" | "payment_entry";
                                    referenceId: string;
                                    allocatedAmount: string;
                                }[];
                                dueDate?: string | null | undefined;
                                currencyCode?: string | null | undefined;
                                conversionRate?: string | null | undefined;
                                debitToId?: string | null | undefined;
                                returnAgainstId?: string | null | undefined;
                                poNo?: string | null | undefined;
                                poDate?: string | null | undefined;
                                taxesAndChargesTemplateId?: string | null | undefined;
                                taxCategoryId?: string | null | undefined;
                                additionalDiscountAccountId?: string | null | undefined;
                                writeOffAccountId?: string | null | undefined;
                                writeOffCostCenterId?: string | null | undefined;
                                paymentTermsTemplateId?: string | null | undefined;
                                costCenterId?: string | null | undefined;
                                projectId?: string | null | undefined;
                                remarks?: string | null | undefined;
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
        };
    };
} & {
    accounting: {
        "sales-invoices": {
            ":id": {
                submit: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./sales-invoice/sales-invoice.type").SalesInvoiceResponse;
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
        };
    };
} & {
    accounting: {
        "sales-invoices": {
            ":id": {
                cancel: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./sales-invoice/sales-invoice.type").SalesInvoiceResponse;
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
        };
    };
} & {
    accounting: {
        "sales-invoices": {
            ":id": {
                amend: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./sales-invoice/sales-invoice.type").SalesInvoiceResponse;
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
        };
    };
} & {
    accounting: {
        "purchase-invoices": {};
    };
} & {
    accounting: {
        "purchase-invoices": {
            get: {
                body: {};
                params: {};
                query: {
                    status?: "DRAFT" | "SUBMITTED" | "CANCELLED" | "UNPAID" | "PAID" | "PARTLY_PAID" | "OVERDUE" | "RETURN" | "INTERNAL_TRANSFER" | "DEBIT_NOTE_ISSUED" | undefined;
                    limit?: number | undefined;
                    partyId?: string | undefined;
                    docstatus?: "DRAFT" | "SUBMITTED" | "CANCELLED" | undefined;
                    isReturn?: boolean | undefined;
                    onHold?: boolean | undefined;
                    fromDate?: string | undefined;
                    toDate?: string | undefined;
                };
                headers: {};
                response: {
                    200: import("./purchase-invoice/purchase-invoice.type").PurchaseInvoiceListRow[];
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
} & {
    accounting: {
        "purchase-invoices": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./purchase-invoice/purchase-invoice.type").PurchaseInvoiceResponse;
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
    };
} & {
    accounting: {
        "purchase-invoices": {
            post: {
                body: {
                    writeOffAccountId?: string | null | undefined;
                    taxCategoryId?: string | null | undefined;
                    taxes?: {
                        rate?: string | undefined;
                        taxAmount?: string | undefined;
                        rowId?: number | null | undefined;
                        includedInPrintRate?: boolean | undefined;
                        costCenterId?: string | null | undefined;
                        category?: "TOTAL" | "VALUATION" | "VALUATION_AND_TOTAL" | undefined;
                        addDeductTax?: "ADD" | "DEDUCT" | undefined;
                        description: string;
                        chargeType: "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
                        accountHeadId: string;
                    }[] | undefined;
                    costCenterId?: string | null | undefined;
                    schedule?: {
                        description?: string | null | undefined;
                        modeOfPaymentId?: string | null | undefined;
                        dueDate: string;
                        invoicePortion: string;
                        paymentAmount: string;
                    }[] | undefined;
                    partyType?: string | undefined;
                    projectId?: string | null | undefined;
                    isOpening?: boolean | undefined;
                    dueDate?: string | null | undefined;
                    remarks?: string | null | undefined;
                    paymentTermsTemplateId?: string | null | undefined;
                    isReturn?: boolean | undefined;
                    returnAgainstId?: string | null | undefined;
                    updateOutstandingForSelf?: boolean | undefined;
                    taxesAndChargesTemplateId?: string | null | undefined;
                    applyDiscountOn?: "GRAND_TOTAL" | "NET_TOTAL" | undefined;
                    additionalDiscountPercentage?: string | undefined;
                    discountAmount?: string | undefined;
                    isCashOrNonTradeDiscount?: boolean | undefined;
                    additionalDiscountAccountId?: string | null | undefined;
                    disableRoundedTotal?: boolean | undefined;
                    allocateAdvancesAutomatically?: boolean | undefined;
                    writeOffAmount?: string | undefined;
                    writeOffCostCenterId?: string | null | undefined;
                    ignoreDefaultPaymentTermsTemplate?: boolean | undefined;
                    advances?: {
                        referenceType: "journal_entry" | "payment_entry";
                        referenceId: string;
                        allocatedAmount: string;
                    }[] | undefined;
                    creditToId?: string | null | undefined;
                    billNo?: string | null | undefined;
                    billDate?: string | null | undefined;
                    isPaid?: boolean | undefined;
                    modeOfPaymentId?: string | null | undefined;
                    cashBankAccountId?: string | null | undefined;
                    paidAmount?: string | undefined;
                    items: {
                        description?: string | null | undefined;
                        rate?: string | undefined;
                        projectId?: string | null | undefined;
                        discountAmount?: string | null | undefined;
                        itemCode?: string | null | undefined;
                        uom?: string | null | undefined;
                        priceListRate?: string | null | undefined;
                        marginType?: "PERCENTAGE" | "AMOUNT" | null | undefined;
                        marginRateOrAmount?: string | null | undefined;
                        discountPercentage?: string | null | undefined;
                        isFreeItem?: boolean | undefined;
                        itemTaxTemplateId?: string | null | undefined;
                        costCenterId: string;
                        expenseAccountId: string;
                        itemName: string;
                        qty: string;
                    }[];
                    partyId: string;
                    postingDate: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        clinic: {
                            name: string;
                        };
                        paymentTermsTemplate: {
                            templateName: string;
                        } | null;
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        writeOffAccountId: string | null;
                        unrealizedProfitLossAccountId: string | null;
                        currencyCode: string;
                        taxCategoryId: string | null;
                        taxes: {
                            id: string;
                            description: string;
                            idx: number;
                            chargeType: import("./sales-invoice/sales-invoice.type").TaxChargeType;
                            rate: import("@prisma/client-runtime-utils").Decimal;
                            taxAmount: import("@prisma/client-runtime-utils").Decimal;
                            rowId: number | null;
                            includedInPrintRate: boolean;
                            accountHead: {
                                accountName: string;
                                accountNumber: string | null;
                            };
                            accountHeadId: string;
                            costCenterId: string | null;
                            total: import("@prisma/client-runtime-utils").Decimal;
                            taxAmountAfterDiscountAmount: import("@prisma/client-runtime-utils").Decimal;
                            category: import("./purchase-invoice/purchase-invoice.type").TaxRowCategory;
                            addDeductTax: import("./purchase-invoice/purchase-invoice.type").TaxAddDeduct;
                        }[];
                        costCenterId: string | null;
                        status: import("./purchase-invoice/purchase-invoice.type").PurchaseInvoiceStatus;
                        items: {
                            costCenter: {
                                costCenterName: string;
                            };
                            itemTaxTemplate: {
                                title: string;
                            } | null;
                            id: string;
                            description: string | null;
                            idx: number;
                            rate: import("@prisma/client-runtime-utils").Decimal;
                            costCenterId: string;
                            projectId: string | null;
                            amount: import("@prisma/client-runtime-utils").Decimal;
                            discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            expenseAccountId: string;
                            itemCode: string | null;
                            itemName: string;
                            qty: import("@prisma/client-runtime-utils").Decimal;
                            uom: string | null;
                            conversionFactor: import("@prisma/client-runtime-utils").Decimal;
                            priceListRate: import("@prisma/client-runtime-utils").Decimal | null;
                            marginType: import("./sales-invoice/sales-invoice.type").MarginType | null;
                            marginRateOrAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            discountPercentage: import("@prisma/client-runtime-utils").Decimal | null;
                            netRate: import("@prisma/client-runtime-utils").Decimal;
                            netAmount: import("@prisma/client-runtime-utils").Decimal;
                            isFreeItem: boolean;
                            itemTaxTemplateId: string | null;
                            itemTaxRates: string | null;
                            expenseAccount: {
                                accountName: string;
                                accountNumber: string | null;
                            };
                        }[];
                        partyType: string;
                        partyId: string;
                        projectId: string | null;
                        isOpening: boolean;
                        dueDate: Date | null;
                        remarks: string | null;
                        docstatus: import("./accounting-period/accounting-period.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        postingDate: Date;
                        paymentTermsTemplateId: string | null;
                        taxWithholdingCategoryId: string | null;
                        documentNo: string | null;
                        conversionRate: import("@prisma/client-runtime-utils").Decimal;
                        partyAccountCurrencyCode: string | null;
                        isReturn: boolean;
                        returnAgainstId: string | null;
                        updateOutstandingForSelf: boolean;
                        taxesAndChargesTemplateId: string | null;
                        applyDiscountOn: import("./sales-invoice/sales-invoice.type").ApplyDiscountOn;
                        additionalDiscountPercentage: import("@prisma/client-runtime-utils").Decimal;
                        discountAmount: import("@prisma/client-runtime-utils").Decimal;
                        isCashOrNonTradeDiscount: boolean;
                        additionalDiscountAccountId: string | null;
                        total: import("@prisma/client-runtime-utils").Decimal;
                        netTotal: import("@prisma/client-runtime-utils").Decimal;
                        totalTaxesAndCharges: import("@prisma/client-runtime-utils").Decimal;
                        grandTotal: import("@prisma/client-runtime-utils").Decimal;
                        roundingAdjustment: import("@prisma/client-runtime-utils").Decimal;
                        roundedTotal: import("@prisma/client-runtime-utils").Decimal;
                        disableRoundedTotal: boolean;
                        inWords: string | null;
                        outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
                        totalAdvance: import("@prisma/client-runtime-utils").Decimal;
                        writeOffAmount: import("@prisma/client-runtime-utils").Decimal;
                        writeOffCostCenterId: string | null;
                        ignoreDefaultPaymentTermsTemplate: boolean;
                        returnAgainst: {
                            documentNo: string | null;
                        } | null;
                        taxesAndChargesTemplate: {
                            title: string;
                        } | null;
                        advances: {
                            id: string;
                            idx: number;
                            referenceType: string;
                            referenceId: string;
                            allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                            exchangeGainLossJeId: string | null;
                            exchangeGainLoss: import("@prisma/client-runtime-utils").Decimal;
                            advanceAmount: import("@prisma/client-runtime-utils").Decimal;
                            refExchangeRate: import("@prisma/client-runtime-utils").Decimal;
                        }[];
                        creditToId: string;
                        billNo: string | null;
                        billDate: Date | null;
                        onHold: boolean;
                        releaseDate: Date | null;
                        holdComment: string | null;
                        isPaid: boolean;
                        modeOfPaymentId: string | null;
                        cashBankAccountId: string | null;
                        paidAmount: import("@prisma/client-runtime-utils").Decimal;
                        isInternalSupplier: boolean;
                        applyTds: boolean;
                        taxWithholdingAmount: import("@prisma/client-runtime-utils").Decimal;
                        creditTo: {
                            accountName: string;
                            accountNumber: string | null;
                        };
                        cashBankAccount: {
                            accountName: string;
                        } | null;
                        partyName: string | null;
                        schedule: import("./sales-invoice/sales-invoice.type").PaymentScheduleRow[];
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
} & {
    accounting: {
        "purchase-invoices": {
            ":id": {
                patch: {
                    body: {
                        writeOffAccountId?: string | null | undefined;
                        taxCategoryId?: string | null | undefined;
                        taxes?: {
                            rate?: string | undefined;
                            taxAmount?: string | undefined;
                            rowId?: number | null | undefined;
                            includedInPrintRate?: boolean | undefined;
                            costCenterId?: string | null | undefined;
                            category?: "TOTAL" | "VALUATION" | "VALUATION_AND_TOTAL" | undefined;
                            addDeductTax?: "ADD" | "DEDUCT" | undefined;
                            description: string;
                            chargeType: "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
                            accountHeadId: string;
                        }[] | undefined;
                        costCenterId?: string | null | undefined;
                        schedule?: {
                            description?: string | null | undefined;
                            modeOfPaymentId?: string | null | undefined;
                            dueDate: string;
                            invoicePortion: string;
                            paymentAmount: string;
                        }[] | undefined;
                        partyType?: string | undefined;
                        projectId?: string | null | undefined;
                        isOpening?: boolean | undefined;
                        dueDate?: string | null | undefined;
                        remarks?: string | null | undefined;
                        paymentTermsTemplateId?: string | null | undefined;
                        isReturn?: boolean | undefined;
                        returnAgainstId?: string | null | undefined;
                        updateOutstandingForSelf?: boolean | undefined;
                        taxesAndChargesTemplateId?: string | null | undefined;
                        applyDiscountOn?: "GRAND_TOTAL" | "NET_TOTAL" | undefined;
                        additionalDiscountPercentage?: string | undefined;
                        discountAmount?: string | undefined;
                        isCashOrNonTradeDiscount?: boolean | undefined;
                        additionalDiscountAccountId?: string | null | undefined;
                        disableRoundedTotal?: boolean | undefined;
                        allocateAdvancesAutomatically?: boolean | undefined;
                        writeOffAmount?: string | undefined;
                        writeOffCostCenterId?: string | null | undefined;
                        ignoreDefaultPaymentTermsTemplate?: boolean | undefined;
                        advances?: {
                            referenceType: "journal_entry" | "payment_entry";
                            referenceId: string;
                            allocatedAmount: string;
                        }[] | undefined;
                        creditToId?: string | null | undefined;
                        billNo?: string | null | undefined;
                        billDate?: string | null | undefined;
                        isPaid?: boolean | undefined;
                        modeOfPaymentId?: string | null | undefined;
                        cashBankAccountId?: string | null | undefined;
                        paidAmount?: string | undefined;
                        items: {
                            description?: string | null | undefined;
                            rate?: string | undefined;
                            projectId?: string | null | undefined;
                            discountAmount?: string | null | undefined;
                            itemCode?: string | null | undefined;
                            uom?: string | null | undefined;
                            priceListRate?: string | null | undefined;
                            marginType?: "PERCENTAGE" | "AMOUNT" | null | undefined;
                            marginRateOrAmount?: string | null | undefined;
                            discountPercentage?: string | null | undefined;
                            isFreeItem?: boolean | undefined;
                            itemTaxTemplateId?: string | null | undefined;
                            costCenterId: string;
                            expenseAccountId: string;
                            itemName: string;
                            qty: string;
                        }[];
                        partyId: string;
                        postingDate: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./purchase-invoice/purchase-invoice.type").PurchaseInvoiceResponse;
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
    };
} & {
    accounting: {
        "purchase-invoices": {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
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
    };
} & {
    accounting: {
        "purchase-invoices": {
            ":id": {
                "return-draft": {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                postingDate: string;
                                partyType: string;
                                partyId: string;
                                isPaid: boolean;
                                paidAmount: string;
                                isReturn: boolean;
                                updateOutstandingForSelf: boolean;
                                isOpening: boolean;
                                applyDiscountOn: "GRAND_TOTAL" | "NET_TOTAL";
                                additionalDiscountPercentage: string;
                                discountAmount: string;
                                isCashOrNonTradeDiscount: boolean;
                                disableRoundedTotal: boolean;
                                writeOffAmount: string;
                                ignoreDefaultPaymentTermsTemplate: boolean;
                                items: {
                                    itemName: string;
                                    qty: string;
                                    rate: string;
                                    isFreeItem: boolean;
                                    expenseAccountId: string;
                                    costCenterId: string;
                                    itemCode?: string | null | undefined;
                                    description?: string | null | undefined;
                                    uom?: string | null | undefined;
                                    priceListRate?: string | null | undefined;
                                    marginType?: "PERCENTAGE" | "AMOUNT" | null | undefined;
                                    marginRateOrAmount?: string | null | undefined;
                                    discountPercentage?: string | null | undefined;
                                    discountAmount?: string | null | undefined;
                                    itemTaxTemplateId?: string | null | undefined;
                                    projectId?: string | null | undefined;
                                }[];
                                taxes: {
                                    chargeType: "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
                                    accountHeadId: string;
                                    rate: string;
                                    taxAmount: string;
                                    description: string;
                                    includedInPrintRate: boolean;
                                    category: "TOTAL" | "VALUATION" | "VALUATION_AND_TOTAL";
                                    addDeductTax: "ADD" | "DEDUCT";
                                    rowId?: number | null | undefined;
                                    costCenterId?: string | null | undefined;
                                }[];
                                schedule: {
                                    dueDate: string;
                                    invoicePortion: string;
                                    paymentAmount: string;
                                    description?: string | null | undefined;
                                    modeOfPaymentId?: string | null | undefined;
                                }[];
                                allocateAdvancesAutomatically: boolean;
                                advances: {
                                    referenceType: "journal_entry" | "payment_entry";
                                    referenceId: string;
                                    allocatedAmount: string;
                                }[];
                                dueDate?: string | null | undefined;
                                currencyCode?: string | null | undefined;
                                conversionRate?: string | null | undefined;
                                creditToId?: string | null | undefined;
                                billNo?: string | null | undefined;
                                billDate?: string | null | undefined;
                                modeOfPaymentId?: string | null | undefined;
                                cashBankAccountId?: string | null | undefined;
                                returnAgainstId?: string | null | undefined;
                                taxesAndChargesTemplateId?: string | null | undefined;
                                taxCategoryId?: string | null | undefined;
                                additionalDiscountAccountId?: string | null | undefined;
                                applyTds?: boolean | undefined;
                                taxWithholdingCategoryId?: string | null | undefined;
                                writeOffAccountId?: string | null | undefined;
                                writeOffCostCenterId?: string | null | undefined;
                                paymentTermsTemplateId?: string | null | undefined;
                                costCenterId?: string | null | undefined;
                                projectId?: string | null | undefined;
                                remarks?: string | null | undefined;
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
        };
    };
} & {
    accounting: {
        "purchase-invoices": {
            ":id": {
                hold: {
                    post: {
                        body: {
                            releaseDate?: string | null | undefined;
                            holdComment: string;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./purchase-invoice/purchase-invoice.type").PurchaseInvoiceResponse;
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
        };
    };
} & {
    accounting: {
        "purchase-invoices": {
            ":id": {
                release: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./purchase-invoice/purchase-invoice.type").PurchaseInvoiceResponse;
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
        };
    };
} & {
    accounting: {
        "purchase-invoices": {
            ":id": {
                submit: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./purchase-invoice/purchase-invoice.type").PurchaseInvoiceResponse;
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
        };
    };
} & {
    accounting: {
        "purchase-invoices": {
            ":id": {
                cancel: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./purchase-invoice/purchase-invoice.type").PurchaseInvoiceResponse;
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
        };
    };
} & {
    accounting: {
        "purchase-invoices": {
            ":id": {
                amend: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./purchase-invoice/purchase-invoice.type").PurchaseInvoiceResponse;
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
        };
    };
} & {
    accounting: {
        reports: {};
    };
} & {
    accounting: {
        reports: {
            "general-ledger": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        costCenterId?: string | undefined;
                        accountId?: string | undefined;
                        voucherType?: string | undefined;
                        showCancelled?: boolean | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/general-ledger.service").GeneralLedgerReport;
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
    };
} & {
    accounting: {
        reports: {
            "receivable-payable": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        summary?: boolean | undefined;
                        partyType?: string | undefined;
                        partyId?: string | undefined;
                        side?: string | undefined;
                        basedOn?: string | undefined;
                        ranges?: string | undefined;
                        asOf: string;
                    };
                    headers: {};
                    response: {
                        200: {
                            rows: never[];
                            summary: import("./reports/receivable-payable.service").ArApSummaryRow[];
                            asOf: Date;
                            basedOn: import("./reports/ageing-buckets").AgeingBasedOn;
                            bucketLabels: string[];
                            bucketTotals: string[];
                            totalOutstanding: string;
                            totalOutstandingBase: string;
                        } | {
                            summary: never[];
                            asOf: Date;
                            basedOn: import("./reports/ageing-buckets").AgeingBasedOn;
                            bucketLabels: string[];
                            rows: import("./reports/receivable-payable.service").ArApRow[];
                            bucketTotals: string[];
                            totalOutstanding: string;
                            totalOutstandingBase: string;
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
    };
} & {
    accounting: {
        reports: {
            "balance-sheet": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        periodicity?: string | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/statement-engine/financial-statements.service").BalanceSheetReport;
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
    };
} & {
    accounting: {
        reports: {
            "profit-and-loss": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        periodicity?: string | undefined;
                        accumulatedValues?: boolean | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/statement-engine/financial-statements.service").ProfitAndLossReport;
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
    };
} & {
    accounting: {
        reports: {
            "cash-flow": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        periodicity?: string | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/statement-engine/financial-statements.service").CashFlowReport;
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
    };
} & {
    accounting: {
        reports: {
            "trial-balance": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/trial-balance.service").TrialBalanceReport;
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
    };
} & {
    accounting: {
        reports: {
            "party-trial-balance": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate: string;
                        toDate: string;
                        side: "RECEIVABLE" | "PAYABLE";
                    };
                    headers: {};
                    response: {
                        200: import("./reports/party-trial-balance.service").PartyTrialBalanceReport;
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
    };
} & {
    accounting: {
        reports: {
            "payment-ledger": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        accountType?: "RECEIVABLE" | "PAYABLE" | undefined;
                        partyType?: string | undefined;
                        partyId?: string | undefined;
                        includeDelinked?: boolean | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/payment-ledger-report.service").PaymentLedgerReportRow[];
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
    };
} & {
    accounting: {
        reports: {
            "insurance-claims-register": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        status?: string | undefined;
                        insurerId?: string | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/membership-insurance-reports.service").ClaimsRegisterReport;
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
    };
} & {
    accounting: {
        reports: {
            "membership-revenue": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/membership-insurance-reports.service").MembershipRevenueReport;
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
    };
} & {
    accounting: {
        reports: {
            "benefit-usage": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/membership-insurance-reports.service").BenefitUsageReport;
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
    };
} & {
    accounting: {
        reports: {
            "sales-register": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        partyId?: string | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/sales-register.service").SalesRegisterReport;
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
    };
} & {
    accounting: {
        reports: {
            "item-wise-sales-register": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        partyId?: string | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/sales-register.service").ItemWiseSalesRegisterReport;
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
    };
} & {
    accounting: {
        reports: {
            "purchase-register": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        partyId?: string | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/purchase-register.service").PurchaseRegisterReport;
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
    };
} & {
    accounting: {
        reports: {
            "item-wise-purchase-register": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        partyId?: string | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/purchase-register.service").ItemWisePurchaseRegisterReport;
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
    };
} & {
    accounting: {
        reports: {
            "payment-period": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        partyId?: string | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/payment-reports.service").PaymentPeriodRow[];
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
    };
} & {
    accounting: {
        reports: {
            "sales-payment-summary": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/payment-reports.service").SalesPaymentSummaryRow[];
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
    };
} & {
    accounting: {
        reports: {
            "party-ledger-summary": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate: string;
                        toDate: string;
                        side: "RECEIVABLE" | "PAYABLE";
                    };
                    headers: {};
                    response: {
                        200: import("./reports/p9-4-reports.service").PartyLedgerSummaryReport;
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
    };
} & {
    accounting: {
        reports: {
            "gross-profit": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/p9-4-reports.service").GrossProfitReport;
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
    };
} & {
    accounting: {
        reports: {
            "invoice-trends": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        year: string;
                        side: "sales" | "purchase";
                    };
                    headers: {};
                    response: {
                        200: import("./reports/p9-4-reports.service").InvoiceTrendsReport;
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
    };
} & {
    accounting: {
        reports: {
            "ledger-debug": {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: import("./reports/p9-4-reports.service").LedgerDebugReport;
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
    };
} & {
    accounting: {
        reports: {
            "budget-variance": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fiscalYear: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/budget-variance.service").BudgetVarianceReport;
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
    };
} & {
    accounting: {
        reports: {
            "bank-reconciliation-statement": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        bankAccountId: string;
                        asOf: string;
                    };
                    headers: {};
                    response: {
                        200: import("./bank/bank-clearance.service").BankReconciliationStatementReport;
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
    };
} & {
    accounting: {
        reports: {
            "bank-clearance-summary": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        bankAccountId: string;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./bank/bank-clearance.service").BankClearanceSummaryReport;
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
    };
} & {
    accounting: {
        reports: {
            "dimension-balance": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        slot: string;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/dimension-balance.service").DimensionBalanceReport;
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
    };
} & {
    accounting: {
        reports: {
            "financial-ratios": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/p1210-reports.service").FinancialRatiosReport;
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
    };
} & {
    accounting: {
        reports: {
            profitability: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        groupBy?: string | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/p1210-reports.service").ProfitabilityRow[];
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
    };
} & {
    accounting: {
        reports: {
            "withholding-summary": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("./reports/p1210-reports.service").WithholdingSummaryRow[];
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
