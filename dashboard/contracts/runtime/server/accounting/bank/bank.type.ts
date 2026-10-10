import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";

/** [P11.1] Bank + Bank Account types (BRD §14). */

export const bankSelect = {
	id: true,
	clinicId: true,
	bankName: true,
	swiftNumber: true,
	website: true,
	disabled: true,
	createdAt: true,
	updatedAt: true,
} as const satisfies Prisma.BankSelect;

export type BankResponse = Prisma.BankGetPayload<{ select: typeof bankSelect }>;

export const bankAccountSelect = {
	id: true,
	clinicId: true,
	bankId: true,
	accountName: true,
	isCompanyAccount: true,
	glAccountId: true,
	accountType: true,
	accountSubtype: true,
	iban: true,
	branchCode: true,
	bankAccountNo: true,
	partyType: true,
	partyId: true,
	integrationId: true,
	disabled: true,
	createdAt: true,
	updatedAt: true,
	bank: { select: { bankName: true } },
	glAccount: { select: { accountName: true, accountCurrencyCode: true } },
} as const satisfies Prisma.BankAccountSelect;

export type BankAccountResponse = Prisma.BankAccountGetPayload<{
	select: typeof bankAccountSelect;
}>;

export const upsertBankSchema = z.object({
	bankName: z.string({ error: "اسم البنك مطلوب" }).trim().min(1),
	swiftNumber: z.string().trim().min(1).nullish(),
	website: z.string().trim().min(1).nullish(),
	disabled: z.boolean().optional().default(false),
});
export type UpsertBankFormInput = z.infer<typeof upsertBankSchema>;

export const upsertBankAccountSchema = z
	.object({
		bankId: z.string({ error: "البنك مطلوب" }).trim().min(1),
		accountName: z.string({ error: "اسم الحساب مطلوب" }).trim().min(1),
		isCompanyAccount: z.boolean().optional().default(true),
		glAccountId: z.string().trim().min(1).nullish(),
		accountType: z.string().trim().min(1).nullish(),
		accountSubtype: z.string().trim().min(1).nullish(),
		iban: z.string().trim().min(1).nullish(),
		branchCode: z.string().trim().min(1).nullish(),
		bankAccountNo: z.string().trim().min(1).nullish(),
		partyType: z.string().trim().min(1).nullish(),
		partyId: z.string().trim().min(1).nullish(),
		disabled: z.boolean().optional().default(false),
	})
	.refine((value) => !value.isCompanyAccount || !!value.glAccountId, {
		error: "حساب الشركة البنكي يجب أن يرتبط بحساب دفتر أستاذ (§14)",
		path: ["glAccountId"],
	});
export type UpsertBankAccountFormInput = z.infer<typeof upsertBankAccountSchema>;

export type CreateBankInput = Pick<
	Prisma.BankUncheckedCreateInput,
	"clinicId" | "bankName" | "swiftNumber" | "website" | "disabled" | "createdById"
>;

export type CreateBankAccountInput = Pick<
	Prisma.BankAccountUncheckedCreateInput,
	| "clinicId"
	| "bankId"
	| "accountName"
	| "isCompanyAccount"
	| "glAccountId"
	| "accountType"
	| "accountSubtype"
	| "iban"
	| "branchCode"
	| "bankAccountNo"
	| "partyType"
	| "partyId"
	| "disabled"
	| "createdById"
>;
