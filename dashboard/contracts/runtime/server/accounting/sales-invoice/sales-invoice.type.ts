import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import {
	ApplyDiscountOn,
	DocStatus,
	MarginType,
	SalesInvoiceStatus,
	TaxChargeType,
} from "@/generated/prisma/enums";

export { ApplyDiscountOn, DocStatus, MarginType, SalesInvoiceStatus, TaxChargeType };

/**
 * [P5.1] Types for the ACCOUNTING Sales Invoice (BRD §7.2). Contract C3: this voucher is
 * NOT the clinic's operational `Invoice` — the legacy screen keeps its table and numbering;
 * an adapter posts it into this ledger in a later wiring task.
 *
 * Totals on these types are §8 calculator OUTPUTS (tax-calculator.ts). No caller may
 * compute them locally — the service recalculates on every save and the values here are
 * snapshots of that one source of truth.
 */

/* ── selects ──────────────────────────────────────────────────────────────────────────── */

export const salesInvoiceListSelect = {
	id: true,
	documentNo: true,
	docstatus: true,
	status: true,
	postingDate: true,
	dueDate: true,
	partyType: true,
	partyId: true,
	currencyCode: true,
	isReturn: true,
	returnAgainstId: true,
	grandTotal: true,
	roundedTotal: true,
	disableRoundedTotal: true,
	outstandingAmount: true,
	createdAt: true,
} as const satisfies Prisma.SalesInvoiceSelect;

export type SalesInvoiceListPayload = Prisma.SalesInvoiceGetPayload<{
	select: typeof salesInvoiceListSelect;
}>;
/** list rows carry the resolved party display name (service joins the party master) */
export type SalesInvoiceListRow = SalesInvoiceListPayload & { partyName: string | null };

export const salesInvoiceItemSelect = {
	id: true,
	idx: true,
	itemCode: true,
	itemName: true,
	description: true,
	qty: true,
	uom: true,
	conversionFactor: true,
	priceListRate: true,
	marginType: true,
	marginRateOrAmount: true,
	discountPercentage: true,
	discountAmount: true,
	rate: true,
	amount: true,
	netRate: true,
	netAmount: true,
	isFreeItem: true,
	incomeAccountId: true,
	costCenterId: true,
	discountAccountId: true,
	itemTaxTemplateId: true,
	itemTaxRates: true,
	projectId: true,
	// [P12.2] §15 — يقرؤها مُركِّب القيد (السطر 4) ومهمّة الاعتراف الشهرية
	enableDeferredRevenue: true,
	deferredAccountId: true,
	serviceStartDate: true,
	serviceEndDate: true,
	serviceStopDate: true,
	incomeAccount: { select: { accountName: true, accountNumber: true } },
	costCenter: { select: { costCenterName: true } },
	itemTaxTemplate: { select: { title: true } },
} as const satisfies Prisma.SalesInvoiceItemSelect;

export const salesInvoiceTaxSelect = {
	id: true,
	idx: true,
	chargeType: true,
	accountHeadId: true,
	rate: true,
	taxAmount: true,
	taxAmountAfterDiscountAmount: true,
	total: true,
	rowId: true,
	description: true,
	includedInPrintRate: true,
	costCenterId: true,
	accountHead: { select: { accountName: true, accountNumber: true } },
} as const satisfies Prisma.SalesInvoiceTaxSelect;

export const salesInvoiceSelect = {
	id: true,
	clinicId: true,
	documentNo: true,
	docstatus: true,
	status: true,
	amendedFromId: true,
	postingDate: true,
	postingTime: true,
	setPostingTime: true,
	dueDate: true,
	partyType: true,
	partyId: true,
	currencyCode: true,
	conversionRate: true,
	debitToId: true,
	partyAccountCurrencyCode: true,
	isReturn: true,
	returnAgainstId: true,
	updateOutstandingForSelf: true,
	isOpening: true,
	isInternalCustomer: true,
	unrealizedProfitLossAccountId: true,
	poNo: true,
	poDate: true,
	taxesAndChargesTemplateId: true,
	taxCategoryId: true,
	applyDiscountOn: true,
	additionalDiscountPercentage: true,
	discountAmount: true,
	isCashOrNonTradeDiscount: true,
	additionalDiscountAccountId: true,
	total: true,
	netTotal: true,
	totalTaxesAndCharges: true,
	grandTotal: true,
	roundingAdjustment: true,
	roundedTotal: true,
	disableRoundedTotal: true,
	inWords: true,
	outstandingAmount: true,
	totalAdvance: true,
	writeOffAmount: true,
	writeOffAccountId: true,
	writeOffCostCenterId: true,
	paymentTermsTemplateId: true,
	ignoreDefaultPaymentTermsTemplate: true,
	costCenterId: true,
	projectId: true,
	remarks: true,
	createdById: true,
	submittedAt: true,
	submittedById: true,
	cancelledAt: true,
	cancelledById: true,
	createdAt: true,
	updatedAt: true,
	clinic: { select: { name: true } },
	debitTo: { select: { accountName: true, accountNumber: true } },
	taxesAndChargesTemplate: { select: { title: true } },
	paymentTermsTemplate: { select: { templateName: true } },
	returnAgainst: { select: { documentNo: true } },
	items: { orderBy: { idx: "asc" }, select: salesInvoiceItemSelect },
	taxes: { orderBy: { idx: "asc" }, select: salesInvoiceTaxSelect },
	// [P7.5] §11 advance rows consumed by this invoice
	advances: {
		orderBy: { idx: "asc" },
		select: {
			id: true,
			idx: true,
			referenceType: true,
			referenceId: true,
			advanceAmount: true,
			allocatedAmount: true,
			refExchangeRate: true,
			exchangeGainLoss: true,
			exchangeGainLossJeId: true,
		},
	},
} as const satisfies Prisma.SalesInvoiceSelect;

export type SalesInvoicePayload = Prisma.SalesInvoiceGetPayload<{
	select: typeof salesInvoiceSelect;
}>;

export const paymentScheduleSelect = {
	id: true,
	idx: true,
	paymentTermId: true,
	description: true,
	dueDate: true,
	invoicePortion: true,
	paymentAmount: true,
	outstanding: true,
	discountType: true,
	discount: true,
	discountDate: true,
	modeOfPaymentId: true,
} as const satisfies Prisma.PaymentScheduleSelect;

export type PaymentScheduleRow = Prisma.PaymentScheduleGetPayload<{
	select: typeof paymentScheduleSelect;
}>;

/** full document = invoice payload + its polymorphic schedule + resolved party name */
export type SalesInvoiceResponse = SalesInvoicePayload & {
	partyName: string | null;
	schedule: PaymentScheduleRow[];
};

/* ── zod schemas (client form + API body) ─────────────────────────────────────────────── */

/** Unsigned ledger amount as string — no JS float ever touches money (contract C2). */
const amountString = z
	.string()
	.regex(/^\d+(\.\d{1,9})?$/, "المبلغ يجب أن يكون رقمًا موجبًا بحد أقصى 9 منازل عشرية");

/** Signed variant — return (credit-note) rows store negative qty/amounts (BR-7.2.2). */
const signedAmountString = z.string().regex(/^-?\d+(\.\d{1,9})?$/, "قيمة رقمية غير صالحة");

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "صيغة التاريخ YYYY-MM-DD");

export const salesInvoiceItemSchema = z.object({
	itemCode: z.string().trim().nullish(),
	itemName: z.string({ error: "اسم الصنف مطلوب" }).trim().min(1, "اسم الصنف مطلوب"),
	description: z.string().trim().nullish(),
	qty: signedAmountString,
	uom: z.string().trim().nullish(),
	priceListRate: amountString.nullish(),
	marginType: z.enum(MarginType).nullish(),
	marginRateOrAmount: amountString.nullish(),
	discountPercentage: amountString.nullish(),
	discountAmount: amountString.nullish(),
	rate: amountString.optional().default("0"),
	isFreeItem: z.boolean().optional().default(false),
	// §7.2: income account + cost center are MANDATORY on every row (P5.2)
	incomeAccountId: z
		.string({ error: "حساب الإيراد مطلوب" })
		.trim()
		.min(1, "حساب الإيراد مطلوب"),
	costCenterId: z.string({ error: "مركز التكلفة مطلوب" }).trim().min(1, "مركز التكلفة مطلوب"),
	discountAccountId: z.string().trim().min(1).nullish(),
	itemTaxTemplateId: z.string().trim().min(1).nullish(),
	projectId: z.string().trim().nullish(),
	// [P12.2] §15 — التأجيل اختياري، لكنه متى فُعِّل لزمه حساب ومدى دورة كاملان،
	// وإلا فالمبلغ يستقرّ في حساب ميزانية بلا جدول يُفرِّغه (يُتحقَّق في الدورة).
	// `optional()` بلا `default(false)` عمدًا: الافتراضي كان سيجعل الحقل مطلوبًا في
	// النوع المُستنتَج، فتنكسر كل مواضع النداء القائمة لأجل حقل لا يعني غيابُه شيئًا.
	enableDeferredRevenue: z.boolean().optional(),
	deferredAccountId: z.string().trim().min(1).nullish(),
	serviceStartDate: z.string().trim().min(1).nullish(),
	serviceEndDate: z.string().trim().min(1).nullish(),
	serviceStopDate: z.string().trim().min(1).nullish(),
});

export const salesInvoiceTaxRowSchema = z.object({
	chargeType: z.enum(TaxChargeType),
	accountHeadId: z.string({ error: "حساب الضريبة مطلوب" }).trim().min(1, "حساب الضريبة مطلوب"),
	rate: amountString.optional().default("0"),
	/** input only for ACTUAL rows; the §8 calculator overwrites everything else */
	taxAmount: signedAmountString.optional().default("0"),
	rowId: z.coerce.number().int().min(1).nullish(),
	description: z.string({ error: "وصف السطر مطلوب" }).trim().min(1, "وصف السطر مطلوب"),
	includedInPrintRate: z.boolean().optional().default(false),
	costCenterId: z.string().trim().min(1).nullish(),
});

export const paymentScheduleRowSchema = z.object({
	description: z.string().trim().nullish(),
	dueDate: dateString,
	invoicePortion: amountString,
	paymentAmount: signedAmountString,
	modeOfPaymentId: z.string().trim().min(1).nullish(),
});

/** [P7.5] FR-11.1 — one advance row: an open PE/JE credit consumed by this invoice */
export const invoiceAdvanceRowSchema = z.object({
	referenceType: z.enum(["payment_entry", "journal_entry"], {
		error: "نوع الدفعة المقدمة غير مدعوم",
	}),
	referenceId: z.string({ error: "مستند الدفعة المقدمة مطلوب" }).trim().min(1),
	allocatedAmount: amountString,
});

export const createSalesInvoiceSchema = z.object({
	postingDate: dateString,
	dueDate: dateString.nullish(),
	// [P8.1] FR-9.1 — document currency (empty ⇒ company currency) + manual conversion
	// rate override (empty ⇒ §4.7 resolution: stored rate → error, never invented)
	currencyCode: z.string().trim().length(3).nullish(),
	conversionRate: z
		.string()
		.regex(/^\d+(\.\d{1,9})?$/, "سعر التحويل يجب أن يكون رقمًا موجبًا")
		.nullish(),
	partyType: z.string().trim().min(1).default("Owner"),
	partyId: z.string({ error: "العميل مطلوب" }).trim().min(1, "العميل مطلوب"),
	/** empty ⇒ resolved via BR-4.10.1 (party per-company account → company default) */
	debitToId: z.string().trim().min(1).nullish(),
	isReturn: z.boolean().optional().default(false),
	returnAgainstId: z.string().trim().min(1).nullish(),
	updateOutstandingForSelf: z.boolean().optional().default(false),
	isOpening: z.boolean().optional().default(false),
	poNo: z.string().trim().nullish(),
	poDate: dateString.nullish(),
	taxesAndChargesTemplateId: z.string().trim().min(1).nullish(),
	taxCategoryId: z.string().trim().min(1).nullish(),
	applyDiscountOn: z.enum(ApplyDiscountOn).optional().default("GRAND_TOTAL"),
	additionalDiscountPercentage: amountString.optional().default("0"),
	discountAmount: amountString.optional().default("0"),
	isCashOrNonTradeDiscount: z.boolean().optional().default(false),
	additionalDiscountAccountId: z.string().trim().min(1).nullish(),
	disableRoundedTotal: z.boolean().optional().default(false),
	writeOffAmount: amountString.optional().default("0"),
	writeOffAccountId: z.string().trim().min(1).nullish(),
	writeOffCostCenterId: z.string().trim().min(1).nullish(),
	paymentTermsTemplateId: z.string().trim().min(1).nullish(),
	ignoreDefaultPaymentTermsTemplate: z.boolean().optional().default(false),
	costCenterId: z.string().trim().min(1).nullish(),
	projectId: z.string().trim().nullish(),
	remarks: z.string().trim().nullish(),
	items: z.array(salesInvoiceItemSchema).min(1, "الفاتورة تحتاج صنفًا واحدًا على الأقل"),
	taxes: z.array(salesInvoiceTaxRowSchema).optional().default([]),
	/** manual schedule — honoured only with ignoreDefaultPaymentTermsTemplate (BR-4.9.1) */
	schedule: z.array(paymentScheduleRowSchema).optional().default([]),
	// [P7.5] §11 advances — FIFO auto-fill on save, or explicit rows; relinked at submit
	allocateAdvancesAutomatically: z.boolean().optional().default(false),
	advances: z.array(invoiceAdvanceRowSchema).optional().default([]),
});

export type CreateSalesInvoiceFormInput = z.input<typeof createSalesInvoiceSchema>;
export type CreateSalesInvoiceFormValues = z.output<typeof createSalesInvoiceSchema>;
export type SalesInvoiceItemInput = z.output<typeof salesInvoiceItemSchema>;
export type SalesInvoiceTaxRowInput = z.output<typeof salesInvoiceTaxRowSchema>;
export type PaymentScheduleRowInput = z.output<typeof paymentScheduleRowSchema>;

export type CreateSalesInvoiceInput = CreateSalesInvoiceFormValues & {
	clinicId: string;
	createdById?: string | null;
};

export type ListSalesInvoiceFilter = {
	docstatus?: DocStatus;
	status?: SalesInvoiceStatus;
	partyId?: string;
	fromDate?: string;
	toDate?: string;
	isReturn?: boolean;
	limit?: number;
};
