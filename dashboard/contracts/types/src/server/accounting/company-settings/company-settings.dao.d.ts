import { type UpdateCompanyAccountingSettingsInput } from "@/server/accounting/company-settings/company-settings.type";
export declare const companyAccountingSettingsDao: {
    /**
     * Return the clinic's accounting defaults, lazily creating an empty row on first
     * access so callers always get a stable shape. A missing default that a posting needs
     * still fails loudly in the posting engine (BR-4.1.1) — this only guarantees the row.
     */
    getOrCreate(clinicId: string): Promise<{
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
    }>;
    update(clinicId: string, data: UpdateCompanyAccountingSettingsInput): Promise<{
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
    }>;
};
