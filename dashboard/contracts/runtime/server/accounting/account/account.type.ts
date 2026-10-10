import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { AccountRootType, AccountType, BalanceMustBe } from "@/generated/prisma/enums";

export const ledgerAccountSelect = {
	id: true,
	clinicId: true,
	accountName: true,
	accountNumber: true,
	parentAccountId: true,
	isGroup: true,
	rootType: true,
	reportType: true,
	accountType: true,
	accountCurrencyCode: true,
	taxRate: true,
	balanceMustBe: true,
	freezeAccount: true,
	disabled: true,
	lft: true,
	rgt: true,
	createdAt: true,
	updatedAt: true,
} as const satisfies Prisma.LedgerAccountSelect;

export type LedgerAccountResponse = Prisma.LedgerAccountGetPayload<{
	select: typeof ledgerAccountSelect;
}>;

const accountNumber = z.string().trim().min(1).nullish();
const optionalId = z.string().trim().min(1).nullish();
// decimal as string to preserve precision (contract C2)
const decimalString = z
	.string()
	.trim()
	.regex(/^\d+(\.\d+)?$/, "قيمة غير صالحة")
	.nullish();

export const createAccountSchema = z.object({
	accountName: z.string({ error: "اسم الحساب مطلوب" }).trim().min(1, "اسم الحساب مطلوب"),
	accountNumber,
	parentAccountId: optionalId,
	isGroup: z.boolean().optional().default(false),
	rootType: z.enum(AccountRootType, { error: "نوع الجذر مطلوب" }),
	accountType: z.enum(AccountType).nullish(),
	accountCurrencyCode: z
		.string()
		.trim()
		.regex(/^[A-Z]{3}$/, "رمز العملة يجب أن يكون 3 أحرف")
		.optional(),
	taxRate: decimalString,
	balanceMustBe: z.enum(BalanceMustBe).optional().default(BalanceMustBe.NONE),
	freezeAccount: z.boolean().optional().default(false),
	disabled: z.boolean().optional().default(false),
});
// z.input (defaults optional) drives useForm; z.output (defaults resolved) is the submit shape.
export type CreateAccountFormInput = z.input<typeof createAccountSchema>;
export type CreateAccountFormValues = z.output<typeof createAccountSchema>;

// rootType and parentAccountId are NOT editable here — moving lives in the move endpoint,
// and root_type is fixed after creation (BR-4.3.2).
export const updateAccountSchema = z.object({
	accountName: z.string().trim().min(1).optional(),
	accountNumber,
	accountType: z.enum(AccountType).nullish(),
	accountCurrencyCode: z
		.string()
		.trim()
		.regex(/^[A-Z]{3}$/, "رمز العملة يجب أن يكون 3 أحرف")
		.optional(),
	taxRate: decimalString,
	balanceMustBe: z.enum(BalanceMustBe).optional(),
	freezeAccount: z.boolean().optional(),
	disabled: z.boolean().optional(),
	isGroup: z.boolean().optional(),
});
export type UpdateAccountFormInput = z.infer<typeof updateAccountSchema>;

export const moveAccountSchema = z.object({
	parentAccountId: z.string().trim().min(1).nullable(),
});
export type MoveAccountFormInput = z.infer<typeof moveAccountSchema>;

// DAO input types derived from Prisma (reportType + lft/rgt are set by the service).
type AccountCreateFields = Prisma.LedgerAccountUncheckedCreateInput;

export type CreateLedgerAccountInput = Pick<
	AccountCreateFields,
	"clinicId" | "accountName" | "rootType"
> &
	Partial<
		Pick<
			AccountCreateFields,
			| "accountNumber"
			| "parentAccountId"
			| "isGroup"
			| "accountType"
			| "accountCurrencyCode"
			| "taxRate"
			| "balanceMustBe"
			| "freezeAccount"
			| "disabled"
			| "createdById"
		>
	>;

export type UpdateLedgerAccountInput = Partial<
	Pick<
		AccountCreateFields,
		| "accountName"
		| "accountNumber"
		| "accountType"
		| "accountCurrencyCode"
		| "taxRate"
		| "balanceMustBe"
		| "freezeAccount"
		| "disabled"
		| "isGroup"
	>
>;
