import { z } from "zod";

/**
 * [P12A.1] FR-17.3 — Opening Invoice Creation Tool. A grid of legacy open balances is
 * mass-created as `isOpening` sales/purchase invoices with ONE item whose GL leg the P5.2
 * rule redirects to the «مؤقت» (TEMPORARY) account — so AR/AP detail migrates WITH its
 * ageing (posting/due dates preserved) while P&L stays untouched.
 */

const amountString = z
	.string({ error: "المبلغ مطلوب" })
	.regex(/^\d+(\.\d{1,9})?$/, "المبلغ يجب أن يكون رقمًا موجبًا");

const dateString = z
	.string({ error: "التاريخ مطلوب" })
	.regex(/^\d{4}-\d{2}-\d{2}$/, "صيغة التاريخ YYYY-MM-DD");

export const openingInvoiceRowSchema = z.object({
	invoiceType: z.enum(["sales", "purchase"], { error: "نوع الفاتورة مطلوب" }),
	/** Owner (customer) for sales, Supplier for purchase — BR-4.10 resolves the account */
	partyType: z.string().trim().min(1).nullish(),
	partyId: z.string({ error: "الطرف مطلوب" }).trim().min(1, "الطرف مطلوب"),
	postingDate: dateString,
	dueDate: dateString.nullish(),
	/** the legacy system's invoice number — kept as the item label + remarks (C7 keeps ours) */
	legacyNo: z.string().trim().nullish(),
	outstanding: amountString.refine((value) => Number(value) > 0, {
		error: "المبلغ المستحق يجب أن يكون أكبر من صفر",
	}),
	costCenterId: z.string().trim().min(1).nullish(),
});

export const createOpeningInvoicesSchema = z.object({
	rows: z.array(openingInvoiceRowSchema).min(1, "أضف سطرًا واحدًا على الأقل").max(500),
});

export type OpeningInvoiceRowInput = z.infer<typeof openingInvoiceRowSchema>;
export type CreateOpeningInvoicesFormInput = z.infer<typeof createOpeningInvoicesSchema>;

export type OpeningInvoiceToolResult = {
	temporaryOpeningAccountId: string;
	created: {
		rowNumber: number;
		invoiceType: "sales" | "purchase";
		id: string;
		documentNo: string | null;
		partyId: string;
		outstanding: string;
	}[];
	errors: { rowNumber: number; message: string }[];
};

export type OpeningToolStatus = {
	temporaryOpeningAccount: { id: string; accountName: string } | null;
	defaultCostCenterId: string | null;
	/** BR-4.10.1 readiness per side — null means that side needs configuring first */
	defaultReceivableAccountId: string | null;
	defaultPayableAccountId: string | null;
	openingSalesInvoices: number;
	openingPurchaseInvoices: number;
};
