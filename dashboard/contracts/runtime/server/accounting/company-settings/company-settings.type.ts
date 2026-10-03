import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";

export const companyAccountingSettingsSelect = {
	id: true,
	clinicId: true,
	defaultCurrencyCode: true,
	defaultReceivableAccountId: true,
	defaultPayableAccountId: true,
	defaultIncomeAccountId: true,
	defaultExpenseAccountId: true,
	defaultCashAccountId: true,
	defaultBankAccountId: true,
	roundOffAccountId: true,
	roundOffForOpeningAccountId: true,
	writeOffAccountId: true,
	exchangeGainLossAccountId: true,
	unrealizedExchangeGainLossAccountId: true,
	unrealizedProfitLossAccountId: true,
	defaultDiscountAccountId: true,
	defaultDeferredRevenueAccountId: true,
	defaultDeferredExpenseAccountId: true,
	defaultAdvanceReceivedAccountId: true,
	defaultAdvancePaidAccountId: true,
	roundOffCostCenterId: true,
	defaultCostCenterId: true,
	defaultFinanceBookId: true,
	defaultPaymentTermsTemplateId: true,
	creditLimit: true,
	bypassCreditLimitCheck: true,
	createdAt: true,
	updatedAt: true,
} as const satisfies Prisma.ClinicAccountingSettingsSelect;

export type CompanyAccountingSettingsResponse = Prisma.ClinicAccountingSettingsGetPayload<{
	select: typeof companyAccountingSettingsSelect;
}>;

/** Fields a user may edit (everything except identity/audit columns). Derived from
 * Prisma's create input so decimal money accepts a precision-safe string (contract C2). */
export type UpdateCompanyAccountingSettingsInput = Partial<
	Pick<
		Prisma.ClinicAccountingSettingsUncheckedCreateInput,
		| "defaultCurrencyCode"
		| "defaultReceivableAccountId"
		| "defaultPayableAccountId"
		| "defaultIncomeAccountId"
		| "defaultExpenseAccountId"
		| "defaultCashAccountId"
		| "defaultBankAccountId"
		| "roundOffAccountId"
		| "roundOffForOpeningAccountId"
		| "writeOffAccountId"
		| "exchangeGainLossAccountId"
		| "unrealizedExchangeGainLossAccountId"
		| "unrealizedProfitLossAccountId"
		| "defaultDiscountAccountId"
		| "defaultDeferredRevenueAccountId"
		| "defaultDeferredExpenseAccountId"
		| "defaultAdvanceReceivedAccountId"
		| "defaultAdvancePaidAccountId"
		| "roundOffCostCenterId"
		| "defaultCostCenterId"
		| "defaultFinanceBookId"
		| "defaultPaymentTermsTemplateId"
		| "creditLimit"
		| "bypassCreditLimitCheck"
	>
>;

const nullableId = z.string().trim().min(1).nullish();

export const updateCompanyAccountingSettingsSchema = z.object({
	defaultCurrencyCode: z
		.string()
		.trim()
		.regex(/^[A-Z]{3}$/, "رمز العملة يجب أن يكون 3 أحرف")
		.nullish(),
	defaultReceivableAccountId: nullableId,
	defaultPayableAccountId: nullableId,
	defaultIncomeAccountId: nullableId,
	defaultExpenseAccountId: nullableId,
	defaultCashAccountId: nullableId,
	defaultBankAccountId: nullableId,
	roundOffAccountId: nullableId,
	roundOffForOpeningAccountId: nullableId,
	writeOffAccountId: nullableId,
	exchangeGainLossAccountId: nullableId,
	unrealizedExchangeGainLossAccountId: nullableId,
	unrealizedProfitLossAccountId: nullableId,
	defaultDiscountAccountId: nullableId,
	defaultDeferredRevenueAccountId: nullableId,
	defaultDeferredExpenseAccountId: nullableId,
	defaultAdvanceReceivedAccountId: nullableId,
	defaultAdvancePaidAccountId: nullableId,
	roundOffCostCenterId: nullableId,
	defaultCostCenterId: nullableId,
	defaultFinanceBookId: nullableId,
	defaultPaymentTermsTemplateId: nullableId,
	// decimal-as-string to preserve precision (contract C2 — no JS floats on money)
	creditLimit: z
		.string()
		.trim()
		.regex(/^\d+(\.\d+)?$/, "قيمة غير صالحة")
		.nullish(),
	bypassCreditLimitCheck: z.boolean().optional(),
});

export type UpdateCompanyAccountingSettingsFormInput = z.infer<
	typeof updateCompanyAccountingSettingsSchema
>;
