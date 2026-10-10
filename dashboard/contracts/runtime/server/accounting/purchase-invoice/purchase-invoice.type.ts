import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import {
	ApplyDiscountOn,
	DocStatus,
	MarginType,
	PurchaseInvoiceStatus,
	TaxAddDeduct,
	TaxChargeType,
	TaxRowCategory,
} from "@/generated/prisma/enums";
import type { PaymentScheduleRow } from "@/server/accounting/sales-invoice/sales-invoice.type";
import { invoiceAdvanceRowSchema } from "@sanad/contracts/runtime/server/accounting/sales-invoice/sales-invoice.type";

export {
	ApplyDiscountOn,
	DocStatus,
	MarginType,
	PurchaseInvoiceStatus,
	TaxAddDeduct,
	TaxChargeType,
	TaxRowCategory,
};

/**
 * [P6.1] Types for the ACCOUNTING Purchase Invoice (BRD §7.3) — the AP mirror of
 * sales-invoice.type.ts. Contract C3: the legacy `Expense` screen is untouched; its
 * adapter is a later wiring task. Totals are §8 calculator OUTPUTS only.
 */

/* ── selects ──────────────────────────────────────────────────────────────────────────── */

export const purchaseInvoiceListSelect = {
	id: true,
	documentNo: true,
	docstatus: true,
	status: true,
	postingDate: true,
	dueDate: true,
	partyType: true,
	partyId: true,
	currencyCode: true,
	billNo: true,
	billDate: true,
	onHold: true,
	releaseDate: true,
	isPaid: true,
	isReturn: true,
	returnAgainstId: true,
	grandTotal: true,
	roundedTotal: true,
	disableRoundedTotal: true,
	outstandingAmount: true,
	createdAt: true,
} as const satisfies Prisma.PurchaseInvoiceSelect;

export type PurchaseInvoiceListPayload = Prisma.PurchaseInvoiceGetPayload<{
	select: typeof purchaseInvoiceListSelect;
}>;
export type PurchaseInvoiceListRow = PurchaseInvoiceListPayload & {
	partyName: string | null;
};

export const purchaseInvoiceItemSelect = {
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
	expenseAccountId: true,
	costCenterId: true,
	itemTaxTemplateId: true,
	itemTaxRates: true,
	projectId: true,
	expenseAccount: { select: { accountName: true, accountNumber: true } },
	costCenter: { select: { costCenterName: true } },
	itemTaxTemplate: { select: { title: true } },
} as const satisfies Prisma.PurchaseInvoiceItemSelect;

export const purchaseInvoiceTaxSelect = {
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
	category: true,
	addDeductTax: true,
	accountHead: { select: { accountName: true, accountNumber: true } },
} as const satisfies Prisma.PurchaseInvoiceTaxSelect;

export const purchaseInvoiceSelect = {
	id: true,
	clinicId: true,
	documentNo: true,
	docstatus: true,
	status: true,
	amendedFromId: true,
	postingDate: true,
	dueDate: true,
	partyType: true,
	partyId: true,
	currencyCode: true,
	conversionRate: true,
	creditToId: true,
	partyAccountCurrencyCode: true,
	billNo: true,
	billDate: true,
	onHold: true,
	releaseDate: true,
	holdComment: true,
	isPaid: true,
	modeOfPaymentId: true,
	cashBankAccountId: true,
	paidAmount: true,
	isReturn: true,
	returnAgainstId: true,
	updateOutstandingForSelf: true,
	isOpening: true,
	isInternalSupplier: true,
	unrealizedProfitLossAccountId: true,
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
	// [P12.3] BR-8.2 — لقطة ما استُقطع فعلًا؛ يقرؤها مُركِّب القيد والتقرير
	applyTds: true,
	taxWithholdingCategoryId: true,
	taxWithholdingAmount: true,
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
	creditTo: { select: { accountName: true, accountNumber: true } },
	cashBankAccount: { select: { accountName: true } },
	taxesAndChargesTemplate: { select: { title: true } },
	paymentTermsTemplate: { select: { templateName: true } },
	returnAgainst: { select: { documentNo: true } },
	items: { orderBy: { idx: "asc" }, select: purchaseInvoiceItemSelect },
	taxes: { orderBy: { idx: "asc" }, select: purchaseInvoiceTaxSelect },
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
} as const satisfies Prisma.PurchaseInvoiceSelect;

export type PurchaseInvoicePayload = Prisma.PurchaseInvoiceGetPayload<{
	select: typeof purchaseInvoiceSelect;
}>;

/** full document = payload + polymorphic schedule + resolved supplier name */
export type PurchaseInvoiceResponse = PurchaseInvoicePayload & {
	partyName: string | null;
	schedule: PaymentScheduleRow[];
};

/* ── zod schemas ──────────────────────────────────────────────────────────────────────── */

const amountString = z
	.string()
	.regex(/^\d+(\.\d{1,9})?$/, "المبلغ يجب أن يكون رقمًا موجبًا بحد أقصى 9 منازل عشرية");
const signedAmountString = z.string().regex(/^-?\d+(\.\d{1,9})?$/, "قيمة رقمية غير صالحة");
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "صيغة التاريخ YYYY-MM-DD");

export const purchaseInvoiceItemSchema = z.object({
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
	// §7.3: expense account + cost center are MANDATORY on every row
	expenseAccountId: z
		.string({ error: "حساب المصروف مطلوب" })
		.trim()
		.min(1, "حساب المصروف مطلوب"),
	costCenterId: z.string({ error: "مركز التكلفة مطلوب" }).trim().min(1, "مركز التكلفة مطلوب"),
	itemTaxTemplateId: z.string().trim().min(1).nullish(),
	projectId: z.string().trim().nullish(),
});

export const purchaseInvoiceTaxRowSchema = z.object({
	chargeType: z.enum(TaxChargeType),
	accountHeadId: z.string({ error: "حساب الضريبة مطلوب" }).trim().min(1, "حساب الضريبة مطلوب"),
	rate: amountString.optional().default("0"),
	taxAmount: signedAmountString.optional().default("0"),
	rowId: z.coerce.number().int().min(1).nullish(),
	description: z.string({ error: "وصف السطر مطلوب" }).trim().min(1, "وصف السطر مطلوب"),
	includedInPrintRate: z.boolean().optional().default(false),
	costCenterId: z.string().trim().min(1).nullish(),
	// §8 step 7 purchase semantics (BR-7.3.3)
	category: z.enum(TaxRowCategory).optional().default("TOTAL"),
	addDeductTax: z.enum(TaxAddDeduct).optional().default("ADD"),
});

export const paymentScheduleRowSchema = z.object({
	description: z.string().trim().nullish(),
	dueDate: dateString,
	invoicePortion: amountString,
	paymentAmount: signedAmountString,
	modeOfPaymentId: z.string().trim().min(1).nullish(),
});

export const createPurchaseInvoiceSchema = z.object({
	postingDate: dateString,
	dueDate: dateString.nullish(),
	// [P8.1] FR-9.1 — document currency (empty ⇒ company currency) + manual rate override
	currencyCode: z.string().trim().length(3).nullish(),
	conversionRate: z
		.string()
		.regex(/^\d+(\.\d{1,9})?$/, "سعر التحويل يجب أن يكون رقمًا موجبًا")
		.nullish(),
	partyType: z.string().trim().min(1).default("Supplier"),
	partyId: z.string({ error: "المورد مطلوب" }).trim().min(1, "المورد مطلوب"),
	/** empty ⇒ resolved via BR-4.10.1 (party per-company account → company default payable) */
	creditToId: z.string().trim().min(1).nullish(),
	// §7.3 bill reference (BR-7.3.1)
	billNo: z.string().trim().nullish(),
	billDate: dateString.nullish(),
	// §7.3 immediate payment (posting-map row 6)
	isPaid: z.boolean().optional().default(false),
	modeOfPaymentId: z.string().trim().min(1).nullish(),
	cashBankAccountId: z.string().trim().min(1).nullish(),
	paidAmount: amountString.optional().default("0"),
	isReturn: z.boolean().optional().default(false),
	returnAgainstId: z.string().trim().min(1).nullish(),
	updateOutstandingForSelf: z.boolean().optional().default(false),
	isOpening: z.boolean().optional().default(false),
	taxesAndChargesTemplateId: z.string().trim().min(1).nullish(),
	taxCategoryId: z.string().trim().min(1).nullish(),
	applyDiscountOn: z.enum(ApplyDiscountOn).optional().default("GRAND_TOTAL"),
	additionalDiscountPercentage: amountString.optional().default("0"),
	discountAmount: amountString.optional().default("0"),
	isCashOrNonTradeDiscount: z.boolean().optional().default(false),
	additionalDiscountAccountId: z.string().trim().min(1).nullish(),
	disableRoundedTotal: z.boolean().optional().default(false),
	// [P12.3] BR-8.2 — العلم قرار المستخدم؛ الفئة تبدأ من المورّد والمبلغ يحسبه المحرّك
	applyTds: z.boolean().optional(),
	taxWithholdingCategoryId: z.string().trim().min(1).nullish(),
	writeOffAmount: amountString.optional().default("0"),
	writeOffAccountId: z.string().trim().min(1).nullish(),
	writeOffCostCenterId: z.string().trim().min(1).nullish(),
	paymentTermsTemplateId: z.string().trim().min(1).nullish(),
	ignoreDefaultPaymentTermsTemplate: z.boolean().optional().default(false),
	costCenterId: z.string().trim().min(1).nullish(),
	projectId: z.string().trim().nullish(),
	remarks: z.string().trim().nullish(),
	items: z.array(purchaseInvoiceItemSchema).min(1, "الفاتورة تحتاج صنفًا واحدًا على الأقل"),
	taxes: z.array(purchaseInvoiceTaxRowSchema).optional().default([]),
	schedule: z.array(paymentScheduleRowSchema).optional().default([]),
	// [P7.5] §11 advances — FIFO auto-fill on save, or explicit rows; relinked at submit
	allocateAdvancesAutomatically: z.boolean().optional().default(false),
	advances: z.array(invoiceAdvanceRowSchema).optional().default([]),
});

/** [P6.3] BR-7.3.2 — hold is a flag on a SUBMITTED invoice, never a status. */
export const holdPurchaseInvoiceSchema = z.object({
	holdComment: z.string({ error: "سبب التعليق مطلوب" }).trim().min(1, "سبب التعليق مطلوب"),
	releaseDate: dateString.nullish(),
});
export type HoldPurchaseInvoiceFormInput = z.infer<typeof holdPurchaseInvoiceSchema>;

export type CreatePurchaseInvoiceFormInput = z.input<typeof createPurchaseInvoiceSchema>;
export type CreatePurchaseInvoiceFormValues = z.output<typeof createPurchaseInvoiceSchema>;
export type PurchaseInvoiceItemInput = z.output<typeof purchaseInvoiceItemSchema>;
export type PurchaseInvoiceTaxRowInput = z.output<typeof purchaseInvoiceTaxRowSchema>;

export type CreatePurchaseInvoiceInput = CreatePurchaseInvoiceFormValues & {
	clinicId: string;
	createdById?: string | null;
};

export type ListPurchaseInvoiceFilter = {
	docstatus?: DocStatus;
	status?: PurchaseInvoiceStatus;
	partyId?: string;
	fromDate?: string;
	toDate?: string;
	isReturn?: boolean;
	onHold?: boolean;
	limit?: number;
};
