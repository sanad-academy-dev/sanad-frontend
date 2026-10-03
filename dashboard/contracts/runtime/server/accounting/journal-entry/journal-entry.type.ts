import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { DocStatus } from "@/generated/prisma/enums";

export { DocStatus };

/**
 * §7.1 voucher_type values supported in P2 (party-less). The full 16 arrive with P3/P5+.
 * Declared HERE (not in .rules) because this file is imported by the browser bundle and
 * must stay free of Prisma VALUE imports — .rules uses Prisma.Decimal at runtime.
 */
export const JE_VOUCHER_TYPES = [
	"Journal Entry",
	"Bank Entry",
	"Cash Entry",
	"Contra Entry",
	"Opening Entry",
	// [P8.2/P8.4] system-generated FX vouchers (BR-7.4.4 / FR-9.3) — never user-created;
	// the screens keep them read-only via isSystemGenerated
	"Exchange Gain Or Loss",
	"Exchange Rate Revaluation",
] as const;
export type JeVoucherType = (typeof JE_VOUCHER_TYPES)[number];

export function isJeVoucherType(value: string): value is JeVoucherType {
	return (JE_VOUCHER_TYPES as readonly string[]).includes(value);
}

/** [P2.4] Types for Journal Entry (BRD §7.1). */

export const journalEntrySelect = {
	id: true,
	clinicId: true,
	documentNo: true,
	docstatus: true,
	postingDate: true,
	amendedFromId: true,
	voucherType: true,
	chequeNo: true,
	chequeDate: true,
	remark: true,
	multiCurrency: true,
	isSystemGenerated: true,
	totalDebit: true,
	totalCredit: true,
	createdById: true,
	submittedAt: true,
	submittedById: true,
	cancelledAt: true,
	cancelledById: true,
	createdAt: true,
	updatedAt: true,
	rows: {
		orderBy: { idx: "asc" },
		select: {
			id: true,
			idx: true,
			accountId: true,
			debit: true,
			credit: true,
			exchangeRate: true,
			debitInAccountCurrency: true,
			creditInAccountCurrency: true,
			costCenterId: true,
			dim1: true,
			dim2: true,
			dim3: true,
			dim4: true,
			userRemark: true,
			partyType: true,
			partyId: true,
			referenceType: true,
			referenceId: true,
			account: {
				select: { accountName: true, accountNumber: true, accountType: true },
			},
		},
	},
} as const satisfies Prisma.JournalEntrySelect;

export type JournalEntryResponse = Prisma.JournalEntryGetPayload<{
	select: typeof journalEntrySelect;
}>;

/** Amounts travel as strings — no JS float ever touches a ledger amount (contract C2). */
const amountString = z
	.string()
	.regex(/^\d+(\.\d{1,9})?$/, "المبلغ يجب أن يكون رقمًا موجبًا بحد أقصى 9 منازل عشرية");

const jeRowSchema = z.object({
	accountId: z.string({ error: "الحساب مطلوب" }).trim().min(1, "الحساب مطلوب"),
	debit: amountString.optional().default("0"),
	credit: amountString.optional().default("0"),
	// [P8.1] multi-currency rows (BR-7.1.4): with the header flag on and a FOREIGN account,
	// the account-currency pair + rate are the input and base debit/credit derive (service-
	// side). All three are ignored (pinned 1 / mirror base) on single-currency rows.
	exchangeRate: z
		.string()
		.regex(/^\d+(\.\d{1,9})?$/, "سعر الصرف يجب أن يكون رقمًا موجبًا")
		.nullish(),
	debitInAccountCurrency: amountString.nullish(),
	creditInAccountCurrency: amountString.nullish(),
	costCenterId: z.string().trim().min(1).nullish(),
	dim1: z.string().trim().min(1).nullish(),
	dim2: z.string().trim().min(1).nullish(),
	dim3: z.string().trim().min(1).nullish(),
	dim4: z.string().trim().min(1).nullish(),
	userRemark: z.string().trim().nullish(),
	// [P3.3] BR-4.3.3 — required together when the row's account is Receivable/Payable
	// (validated doc-level in journal-entry.rules and again by the engine)
	partyType: z.string().trim().min(1).nullish(),
	partyId: z.string().trim().min(1).nullish(),
	// [P3.4] BR-7.1.2 — settle this row against a submitted voucher (registry-validated)
	referenceType: z.string().trim().min(1).nullish(),
	referenceId: z.string().trim().min(1).nullish(),
});

export const createJournalEntrySchema = z.object({
	voucherType: z.enum(JE_VOUCHER_TYPES).default("Journal Entry"),
	postingDate: z
		.string({ error: "تاريخ الترحيل مطلوب" })
		.regex(/^\d{4}-\d{2}-\d{2}$/, "تاريخ الترحيل مطلوب"),
	chequeNo: z.string().trim().nullish(),
	chequeDate: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.nullish(),
	remark: z.string().trim().nullish(),
	// [P8.1] FR-9.2 — unlocks per-row foreign-currency input (hidden pre-P8)
	multiCurrency: z.boolean().optional().default(false),
	rows: z.array(jeRowSchema).min(2, "قيد اليومية يحتاج سطرين على الأقل"),
});
export type CreateJournalEntryFormInput = z.input<typeof createJournalEntrySchema>;
export type CreateJournalEntryFormValues = z.output<typeof createJournalEntrySchema>;

export type JournalEntryRowInput = z.output<typeof jeRowSchema>;

export type CreateJournalEntryInput = {
	clinicId: string;
	voucherType: string;
	postingDate: Date;
	chequeNo?: string | null;
	chequeDate?: Date | null;
	remark?: string | null;
	multiCurrency?: boolean;
	rows: JournalEntryRowInput[];
	createdById?: string | null;
};

export type ListJournalEntryFilter = {
	docstatus?: DocStatus;
	voucherType?: string;
	limit?: number;
};

/* ── templates (FR-7.1.6) ─────────────────────────────────────────────────────────────── */

export const journalEntryTemplateSelect = {
	id: true,
	clinicId: true,
	templateTitle: true,
	voucherType: true,
	accountIds: true,
	createdAt: true,
	updatedAt: true,
} as const satisfies Prisma.JournalEntryTemplateSelect;

export type JournalEntryTemplateResponse = Prisma.JournalEntryTemplateGetPayload<{
	select: typeof journalEntryTemplateSelect;
}>;

export const createJournalEntryTemplateSchema = z.object({
	templateTitle: z.string({ error: "اسم القالب مطلوب" }).trim().min(1, "اسم القالب مطلوب"),
	voucherType: z.enum(JE_VOUCHER_TYPES).default("Journal Entry"),
	accountIds: z.array(z.string().trim().min(1)).min(1, "أضف حسابًا واحدًا على الأقل"),
});
export type CreateJournalEntryTemplateFormInput = z.input<
	typeof createJournalEntryTemplateSchema
>;
export type CreateJournalEntryTemplateFormValues = z.output<
	typeof createJournalEntryTemplateSchema
>;
