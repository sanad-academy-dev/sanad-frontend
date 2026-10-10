import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { DocStatus, PaymentEntryStatus, PaymentType } from "@/generated/prisma/enums";

export { DocStatus, PaymentEntryStatus, PaymentType };

/**
 * [P7.1] Types for the Payment Entry (BRD §7.4) — cash in/out and matching (M2).
 * P7 is single-currency: both exchange rates are pinned to 1 and
 * received = paid (BR-7.4.2); the multi-currency columns carry 1/base mirrors
 * until P8 activates them. Allocation figures on reference rows are SNAPSHOTS —
 * the submit transaction re-validates them against live PLE outstanding under
 * row locks (BR-7.4.3).
 */

/* ── selects ──────────────────────────────────────────────────────────────────────────── */

export const paymentEntryListSelect = {
	id: true,
	documentNo: true,
	docstatus: true,
	status: true,
	paymentType: true,
	postingDate: true,
	partyType: true,
	partyId: true,
	modeOfPaymentId: true,
	paidAmount: true,
	totalAllocatedAmount: true,
	unallocatedAmount: true,
	referenceNo: true,
	isOpening: true,
	createdAt: true,
	modeOfPayment: { select: { modeOfPaymentName: true } },
	paidFrom: { select: { accountName: true } },
	paidTo: { select: { accountName: true } },
	// minimal reference identities — the reconciliation screen's unreconcile targets
	references: {
		orderBy: { idx: "asc" },
		select: { referenceDoctype: true, referenceId: true },
	},
} as const satisfies Prisma.PaymentEntrySelect;

export type PaymentEntryListPayload = Prisma.PaymentEntryGetPayload<{
	select: typeof paymentEntryListSelect;
}>;
export type PaymentEntryListRow = PaymentEntryListPayload & {
	partyName: string | null;
};

export const paymentEntryReferenceSelect = {
	id: true,
	idx: true,
	referenceDoctype: true,
	referenceId: true,
	dueDate: true,
	billNo: true,
	totalAmount: true,
	outstandingAmount: true,
	allocatedAmount: true,
	exchangeRate: true,
	exchangeGainLoss: true,
	exchangeGainLossJeId: true,
	paymentTermId: true,
	accountId: true,
} as const satisfies Prisma.PaymentEntryReferenceSelect;

export const paymentEntryDeductionSelect = {
	id: true,
	idx: true,
	accountId: true,
	costCenterId: true,
	amount: true,
	isExchangeGainLoss: true,
	account: { select: { accountName: true, accountNumber: true } },
	costCenter: { select: { costCenterName: true } },
} as const satisfies Prisma.PaymentEntryDeductionSelect;

export const paymentEntrySelect = {
	id: true,
	clinicId: true,
	documentNo: true,
	docstatus: true,
	status: true,
	amendedFromId: true,
	paymentType: true,
	postingDate: true,
	partyType: true,
	partyId: true,
	modeOfPaymentId: true,
	paidFromId: true,
	paidFromAccountCurrencyCode: true,
	paidToId: true,
	paidToAccountCurrencyCode: true,
	paidAmount: true,
	sourceExchangeRate: true,
	basePaidAmount: true,
	receivedAmount: true,
	targetExchangeRate: true,
	baseReceivedAmount: true,
	totalAllocatedAmount: true,
	unallocatedAmount: true,
	differenceAmount: true,
	referenceNo: true,
	referenceDate: true,
	clearanceDate: true,
	isOpening: true,
	/** [P12.6] FR-11.3 regime snapshot — the submit hook reads THIS, never the live setting */
	bookAdvanceInSeparateAccount: true,
	costCenterId: true,
	projectId: true,
	inWords: true,
	remarks: true,
	createdById: true,
	submittedAt: true,
	submittedById: true,
	cancelledAt: true,
	cancelledById: true,
	createdAt: true,
	updatedAt: true,
	clinic: { select: { name: true } },
	modeOfPayment: { select: { modeOfPaymentName: true } },
	paidFrom: { select: { accountName: true, accountNumber: true, accountType: true } },
	paidTo: { select: { accountName: true, accountNumber: true, accountType: true } },
	references: { orderBy: { idx: "asc" }, select: paymentEntryReferenceSelect },
	deductions: { orderBy: { idx: "asc" }, select: paymentEntryDeductionSelect },
} as const satisfies Prisma.PaymentEntrySelect;

export type PaymentEntryPayload = Prisma.PaymentEntryGetPayload<{
	select: typeof paymentEntrySelect;
}>;

/** full document = payload + resolved party name + display numbers per reference */
export type PaymentEntryReferenceDisplay = PaymentEntryPayload["references"][number] & {
	referenceNo: string | null;
};
export type PaymentEntryResponse = Omit<PaymentEntryPayload, "references"> & {
	partyName: string | null;
	references: PaymentEntryReferenceDisplay[];
};

/* ── zod schemas ──────────────────────────────────────────────────────────────────────── */

const amountString = z
	.string()
	.regex(/^\d+(\.\d{1,9})?$/, "المبلغ يجب أن يكون رقمًا موجبًا بحد أقصى 9 منازل عشرية");
const signedAmountString = z.string().regex(/^-?\d+(\.\d{1,9})?$/, "قيمة رقمية غير صالحة");
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "صيغة التاريخ YYYY-MM-DD");

/**
 * THE referenceable-doctype list — the single source for the zod schema below AND the
 * TypeBox request model (`payment-entry.model.ts`), pinned against the loader registry
 * and the per-direction allowlist by `reference-doctype-parity.audit.test.ts`.
 *
 * It exists because [MI-P5] added `insurance_claim` to the loader and the service
 * allowlist but not to these two closed enumerations, and the HTTP boundary then
 * answered 422 «بيانات الطلب غير صالحة» for every user: settlement was unreachable
 * through the API while every service-level assertion stayed green. Four hand-kept
 * copies of one list is the defect; this is the fix.
 */
export const PE_REFERENCE_DOCTYPES = [
	"sales_invoice",
	"purchase_invoice",
	"journal_entry",
	"insurance_claim",
] as const;
export type PeReferenceDoctype = (typeof PE_REFERENCE_DOCTYPES)[number];

export const paymentEntryReferenceSchema = z.object({
	referenceDoctype: z.enum(PE_REFERENCE_DOCTYPES, {
		error: "نوع المستند المرجعي غير مدعوم",
	}),
	referenceId: z.string({ error: "المستند المرجعي مطلوب" }).trim().min(1),
	// allocation may be negative when pulling a return/CN against the payment (BR-7.4.3)
	allocatedAmount: signedAmountString,
});

export const paymentEntryDeductionSchema = z.object({
	accountId: z.string({ error: "حساب الخصم مطلوب" }).trim().min(1, "حساب الخصم مطلوب"),
	costCenterId: z.string({ error: "مركز التكلفة مطلوب" }).trim().min(1, "مركز التكلفة مطلوب"),
	/** signed: + debits the account, − credits it (§7.4) */
	amount: signedAmountString,
});

export const createPaymentEntrySchema = z.object({
	paymentType: z.enum(PaymentType),
	postingDate: dateString,
	/** required unless Internal Transfer (BR-7.4.1) — enforced in the service */
	partyType: z.string().trim().min(1).nullish(),
	partyId: z.string().trim().min(1).nullish(),
	modeOfPaymentId: z.string().trim().min(1).nullish(),
	/** empty ⇒ resolved per BR-7.4.1 (party account or MoP default) */
	paidFromId: z.string().trim().min(1).nullish(),
	paidToId: z.string().trim().min(1).nullish(),
	paidAmount: amountString,
	/** empty ⇒ = paidAmount (BR-7.4.2 same-currency default; MANDATORY cross-currency) */
	receivedAmount: amountString.nullish(),
	// [P8.2] manual leg rates (§4.7 "manual wins"); empty ⇒ stored-rate resolution when
	// the leg is foreign, pinned 1 when it is company-currency
	sourceExchangeRate: amountString.nullish(),
	targetExchangeRate: amountString.nullish(),
	referenceNo: z.string().trim().nullish(),
	referenceDate: dateString.nullish(),
	isOpening: z.boolean().optional().default(false),
	costCenterId: z.string().trim().min(1).nullish(),
	projectId: z.string().trim().nullish(),
	remarks: z.string().trim().nullish(),
	references: z.array(paymentEntryReferenceSchema).optional().default([]),
	deductions: z.array(paymentEntryDeductionSchema).optional().default([]),
});

export type CreatePaymentEntryFormInput = z.input<typeof createPaymentEntrySchema>;
export type CreatePaymentEntryFormValues = z.output<typeof createPaymentEntrySchema>;
export type PaymentEntryReferenceInput = z.output<typeof paymentEntryReferenceSchema>;
export type PaymentEntryDeductionInput = z.output<typeof paymentEntryDeductionSchema>;

export type CreatePaymentEntryInput = CreatePaymentEntryFormValues & {
	clinicId: string;
	createdById?: string | null;
};

export type ListPaymentEntryFilter = {
	docstatus?: DocStatus;
	paymentType?: PaymentType;
	partyId?: string;
	fromDate?: string;
	toDate?: string;
	limit?: number;
};
