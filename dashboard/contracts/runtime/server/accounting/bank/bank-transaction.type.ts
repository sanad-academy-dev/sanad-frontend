import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { BankRuleDirection, BankTransactionStatus, DocStatus } from "@/generated/prisma/enums";

export { BankRuleDirection, BankTransactionStatus, DocStatus };

/** [P11.2] Bank Transaction types (BRD §14). */

/**
 * [P12A-fix5] At or above this candidate score, booking a NEW Payment Entry for a bank
 * transaction plausibly double-books money the books already carry, so the server refuses
 * without an explicit `confirmDuplicate` and the dialog shows what it would duplicate.
 *
 * 80 is the exact-amount award in the §19 matcher scoring — deliberately the AMOUNT term
 * alone rather than amount+same-day (100): the row that produced the owner's duplicate
 * scored 90 (exact amount, date within three days), so a 100 gate would have waved it
 * through. It lives in the shared type module, not the service, because the dialog needs
 * it too and importing the service into a client component would pull `@/lib/db` into the
 * browser bundle.
 */
export const DUPLICATE_CANDIDATE_SCORE = 80;

export const bankTransactionSelect = {
	id: true,
	clinicId: true,
	documentNo: true,
	docstatus: true,
	postingDate: true,
	amendedFromId: true,
	bankAccountId: true,
	deposit: true,
	withdrawal: true,
	currencyCode: true,
	description: true,
	referenceNumber: true,
	transactionId: true,
	status: true,
	partyType: true,
	partyId: true,
	allocatedAmount: true,
	unallocatedAmount: true,
	pairedTransactionId: true,
	importId: true,
	createdAt: true,
	updatedAt: true,
	bankAccount: { select: { accountName: true } },
	payments: {
		orderBy: { createdAt: "asc" },
		select: {
			id: true,
			paymentDocument: true,
			paymentEntryId: true,
			paymentRowId: true,
			allocatedAmount: true,
		},
	},
} as const satisfies Prisma.BankTransactionSelect;

export type BankTransactionResponse = Prisma.BankTransactionGetPayload<{
	select: typeof bankTransactionSelect;
}>;

const amountString = z
	.string()
	.regex(/^\d+(\.\d{1,9})?$/, "المبلغ يجب أن يكون رقمًا موجبًا بحد أقصى 9 منازل عشرية");

export const createBankTransactionSchema = z
	.object({
		postingDate: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, "التاريخ يجب أن يكون بصيغة YYYY-MM-DD"),
		bankAccountId: z.string({ error: "الحساب البنكي مطلوب" }).trim().min(1),
		deposit: amountString.optional().default("0"),
		withdrawal: amountString.optional().default("0"),
		description: z.string().trim().min(1).nullish(),
		referenceNumber: z.string().trim().min(1).nullish(),
		transactionId: z.string().trim().min(1).nullish(),
	})
	.refine((value) => (value.deposit !== "0") !== (value.withdrawal !== "0"), {
		error: "الحركة إيداع أو سحب — أحدهما فقط وبمبلغ غير صفري",
		path: ["deposit"],
	});
export type CreateBankTransactionFormInput = z.infer<typeof createBankTransactionSchema>;

export const importStatementSchema = z.object({
	bankAccountId: z.string({ error: "الحساب البنكي مطلوب" }).trim().min(1),
	fileName: z.string({ error: "اسم الملف مطلوب" }).trim().min(1),
	/** csv content as text, or xlsx as base64 */
	format: z.enum(["csv", "xlsx"]),
	content: z.string({ error: "محتوى الملف مطلوب" }).min(1),
	/** stored mapping id XOR built-in preset key */
	mappingId: z.string().trim().min(1).nullish(),
	presetKey: z.string().trim().min(1).nullish(),
});
export type ImportStatementFormInput = z.infer<typeof importStatementSchema>;

/* ── FR-14.3 bank transaction rules ([P12A.3] «قواعد البنك» screen) ─────────────────────── */

/** shared with `listBankRules` so the response type never drifts from the query */
export const bankRuleInclude = {
	contraAccount: { select: { accountName: true } },
} as const satisfies Prisma.BankTransactionRuleInclude;

export type BankRuleResponse = Prisma.BankTransactionRuleGetPayload<{
	include: typeof bankRuleInclude;
}>;

export const upsertBankRuleSchema = z.object({
	ruleName: z.string({ error: "اسم القاعدة مطلوب" }).trim().min(1, "اسم القاعدة مطلوب"),
	priority: z.coerce
		.number({ error: "الأولوية يجب أن تكون رقمًا" })
		.int("الأولوية يجب أن تكون عددًا صحيحًا")
		.min(0, "الأولوية يجب ألا تكون سالبة")
		.default(0),
	disabled: z.boolean().default(false),
	descriptionContains: z.string().trim().min(1).nullish(),
	direction: z.enum(BankRuleDirection).default(BankRuleDirection.ANY),
	minAmount: amountString.nullish(),
	maxAmount: amountString.nullish(),
	bankAccountId: z.string().trim().min(1).nullish(),
	contraAccountId: z
		.string({ error: "الحساب المقابل مطلوب" })
		.trim()
		.min(1, "الحساب المقابل مطلوب"),
});
export type UpsertBankRuleFormInput = z.infer<typeof upsertBankRuleSchema>;

export type ImportStatementResult = {
	importId: string;
	totalRows: number;
	importedRows: number;
	duplicateRows: number;
	errorRows: number;
	errors: { rowNumber: number; message: string }[];
};
