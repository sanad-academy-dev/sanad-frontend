import type { ComponentProps } from "react";

import type { Badge } from "@/components/ui/badge";
import {
	DocStatus,
	PaymentEntryStatus,
	PaymentType,
	PurchaseInvoiceStatus,
	SalesInvoiceStatus,
} from "@/generated/prisma/enums";

/**
 * [P0.2 UI] The ONE accounting status → appearance map (CONTRACT gap G8, G6 status ribbon).
 *
 * There are no `--success` / `--warning` tokens in this design system, and the contract
 * forbids inventing hex. So every accounting status resolves to an **existing Badge
 * variant** here, once, and every accounting screen reads it from this file — a second
 * ad-hoc mapping in a later phase is how a "Submitted" badge ends up two different colours
 * on two screens.
 *
 * [P5-UI-fix] Invoice statuses (BR-7.2.1) joined this map in P5, as reserved above — they
 * live here and NOT in the invoice sheet, so the list, the sheet and the print header all
 * read one source. Variants are drawn from the existing Badge set only (no new colours):
 * `primary` = settled, `sub` = needs attention, `destructive` = reversed/void,
 * `outline` = no ledger impact, `secondary` = ledger-live but unsettled.
 */

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>["variant"]>;

export type AccountingStatusAppearance = {
	variant: BadgeVariant;
	/** i18n key under `accounting.docstatus.*` */
	labelKey: string;
};

export const DOCSTATUS_APPEARANCE: Record<DocStatus, AccountingStatusAppearance> = {
	// draft carries no ledger impact — the quietest of the three
	[DocStatus.DRAFT]: { variant: "outline", labelKey: "accounting.docstatus.draft" },
	// submitted is the only state that has touched the ledger — the emphatic one
	[DocStatus.SUBMITTED]: { variant: "primary", labelKey: "accounting.docstatus.submitted" },
	[DocStatus.CANCELLED]: {
		variant: "destructive",
		labelKey: "accounting.docstatus.cancelled",
	},
};

export function docStatusAppearance(status: DocStatus): AccountingStatusAppearance {
	return DOCSTATUS_APPEARANCE[status];
}

/**
 * BR-7.2.1 Sales Invoice statuses. `label` is the Arabic display string; every screen reads
 * it from here rather than re-declaring its own record.
 */
export const SALES_INVOICE_STATUS_APPEARANCE: Record<
	SalesInvoiceStatus,
	AccountingStatusAppearance & { label: string }
> = {
	// no ledger impact yet — quietest
	[SalesInvoiceStatus.DRAFT]: {
		variant: "outline",
		labelKey: "accounting.salesInvoice.status.draft",
		label: "مسودة",
	},
	// ledger-live but not yet settled
	[SalesInvoiceStatus.SUBMITTED]: {
		variant: "secondary",
		labelKey: "accounting.salesInvoice.status.submitted",
		label: "مُرحّلة",
	},
	[SalesInvoiceStatus.UNPAID]: {
		variant: "secondary",
		labelKey: "accounting.salesInvoice.status.unpaid",
		label: "غير مدفوعة",
	},
	[SalesInvoiceStatus.PARTLY_PAID]: {
		variant: "sub",
		labelKey: "accounting.salesInvoice.status.partlyPaid",
		label: "مدفوعة جزئيًا",
	},
	// settled
	[SalesInvoiceStatus.PAID]: {
		variant: "primary",
		labelKey: "accounting.salesInvoice.status.paid",
		label: "مدفوعة",
	},
	// past its due date — needs attention, not an error
	[SalesInvoiceStatus.OVERDUE]: {
		variant: "sub",
		labelKey: "accounting.salesInvoice.status.overdue",
		label: "متأخرة",
	},
	[SalesInvoiceStatus.RETURN]: {
		variant: "outline",
		labelKey: "accounting.salesInvoice.status.return",
		label: "مرتجع",
	},
	[SalesInvoiceStatus.CREDIT_NOTE_ISSUED]: {
		variant: "primary",
		labelKey: "accounting.salesInvoice.status.creditNoteIssued",
		label: "صدر إشعار دائن",
	},
	[SalesInvoiceStatus.INTERNAL_TRANSFER]: {
		variant: "secondary",
		labelKey: "accounting.salesInvoice.status.internalTransfer",
		label: "تحويل داخلي",
	},
	[SalesInvoiceStatus.CONSOLIDATED]: {
		variant: "secondary",
		labelKey: "accounting.salesInvoice.status.consolidated",
		label: "مُجمّعة",
	},
	// reversed per AR-2
	[SalesInvoiceStatus.CANCELLED]: {
		variant: "destructive",
		labelKey: "accounting.salesInvoice.status.cancelled",
		label: "ملغاة",
	},
};

export function salesInvoiceStatusAppearance(
	status: SalesInvoiceStatus,
): AccountingStatusAppearance & { label: string } {
	return SALES_INVOICE_STATUS_APPEARANCE[status];
}

/**
 * [P6.5] Purchase Invoice statuses — the BR-7.2.1 mirror ([P6.2] status engine), same
 * variant semantics as the sales map: `primary` = settled, `sub` = needs attention,
 * `destructive` = reversed, `outline` = no ledger impact, `secondary` = ledger-live
 * but unsettled. DEBIT_NOTE_ISSUED replaces the CN variant; hold (BR-7.3.2) is a FLAG,
 * not a status — screens render it as a separate indicator, never through this map.
 */
export const PURCHASE_INVOICE_STATUS_APPEARANCE: Record<
	PurchaseInvoiceStatus,
	AccountingStatusAppearance & { label: string }
> = {
	[PurchaseInvoiceStatus.DRAFT]: {
		variant: "outline",
		labelKey: "accounting.purchaseInvoice.status.draft",
		label: "مسودة",
	},
	[PurchaseInvoiceStatus.SUBMITTED]: {
		variant: "secondary",
		labelKey: "accounting.purchaseInvoice.status.submitted",
		label: "مُرحّلة",
	},
	[PurchaseInvoiceStatus.UNPAID]: {
		variant: "secondary",
		labelKey: "accounting.purchaseInvoice.status.unpaid",
		label: "غير مدفوعة",
	},
	[PurchaseInvoiceStatus.PARTLY_PAID]: {
		variant: "sub",
		labelKey: "accounting.purchaseInvoice.status.partlyPaid",
		label: "مدفوعة جزئيًا",
	},
	[PurchaseInvoiceStatus.PAID]: {
		variant: "primary",
		labelKey: "accounting.purchaseInvoice.status.paid",
		label: "مدفوعة",
	},
	[PurchaseInvoiceStatus.OVERDUE]: {
		variant: "sub",
		labelKey: "accounting.purchaseInvoice.status.overdue",
		label: "متأخرة",
	},
	[PurchaseInvoiceStatus.RETURN]: {
		variant: "outline",
		labelKey: "accounting.purchaseInvoice.status.return",
		label: "مرتجع",
	},
	[PurchaseInvoiceStatus.DEBIT_NOTE_ISSUED]: {
		variant: "primary",
		labelKey: "accounting.purchaseInvoice.status.debitNoteIssued",
		label: "صدر إشعار مدين",
	},
	[PurchaseInvoiceStatus.INTERNAL_TRANSFER]: {
		variant: "secondary",
		labelKey: "accounting.purchaseInvoice.status.internalTransfer",
		label: "تحويل داخلي",
	},
	[PurchaseInvoiceStatus.CANCELLED]: {
		variant: "destructive",
		labelKey: "accounting.purchaseInvoice.status.cancelled",
		label: "ملغاة",
	},
};

export function purchaseInvoiceStatusAppearance(
	status: PurchaseInvoiceStatus,
): AccountingStatusAppearance & { label: string } {
	return PURCHASE_INVOICE_STATUS_APPEARANCE[status];
}

/** [P7.9] Payment Entry — status mirrors docstatus (BR-7.4.6), three states only. */
export const PAYMENT_ENTRY_STATUS_APPEARANCE: Record<
	PaymentEntryStatus,
	AccountingStatusAppearance & { label: string }
> = {
	[PaymentEntryStatus.DRAFT]: {
		variant: "outline",
		labelKey: "accounting.paymentEntry.status.draft",
		label: "مسودة",
	},
	[PaymentEntryStatus.SUBMITTED]: {
		variant: "primary",
		labelKey: "accounting.paymentEntry.status.submitted",
		label: "مُرحَّل",
	},
	[PaymentEntryStatus.CANCELLED]: {
		variant: "destructive",
		labelKey: "accounting.paymentEntry.status.cancelled",
		label: "ملغى",
	},
};

export function paymentEntryStatusAppearance(
	status: PaymentEntryStatus,
): AccountingStatusAppearance & { label: string } {
	return PAYMENT_ENTRY_STATUS_APPEARANCE[status];
}

/** §7.4 payment types — label + badge tone for the list/print headers. */
export const PAYMENT_TYPE_APPEARANCE: Record<
	PaymentType,
	{ variant: BadgeVariant; label: string }
> = {
	[PaymentType.RECEIVE]: { variant: "primary", label: "سند قبض" },
	[PaymentType.PAY]: { variant: "sub", label: "سند صرف" },
	[PaymentType.INTERNAL_TRANSFER]: { variant: "secondary", label: "تحويل داخلي" },
};
