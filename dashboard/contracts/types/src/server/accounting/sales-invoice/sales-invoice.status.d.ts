import type { Prisma } from "@/generated/prisma/client";
import { Prisma as PrismaNs } from "@/generated/prisma/client";
import type { SalesInvoiceStatus } from "@/generated/prisma/enums";
import { DocStatus } from "@/generated/prisma/enums";
/**
 * [P5.5] BR-7.2.1 — the sales-invoice status engine.
 *
 * `computeSalesInvoiceStatus` is the PURE matrix; `refreshSalesInvoiceSettlement` feeds it
 * from the payment ledger (outstanding = Σ non-delinked PLE against the voucher,
 * BR-5.2.2 — never from GL) and stamps the result. The refresh runs on submit and on
 * EVERY payment event through the gl layer's settlement-subscriber seam, so any voucher
 * that settles against an invoice (JE today, Payment Entry from P7) keeps it current.
 *
 * OVERDUE is stamped whenever a refresh runs; between events the stored status can lag a
 * day boundary, so read paths needing exactness re-derive via `computeSalesInvoiceStatus`
 * (Phase-Runner assumption: no daily cron in v1).
 */
type Tx = Prisma.TransactionClient;
export type StatusInput = {
    docstatus: DocStatus;
    isReturn: boolean;
    isInternalCustomer: boolean;
    /** PLE-derived outstanding (signed; receivable-positive) */
    outstanding: PrismaNs.Decimal;
    /** the payable figure the customer row booked (rounded, or grand when disabled) */
    payable: PrismaNs.Decimal;
    dueDate: Date | null;
    today: Date;
    fractionUnits: number;
    /** a SUBMITTED return exists against this invoice */
    hasSubmittedReturn: boolean;
};
export declare function computeSalesInvoiceStatus(input: StatusInput): SalesInvoiceStatus;
/** UTC midnight of "now" — the day boundary BR-7.2.1's overdue test uses. */
export declare function utcToday(now?: Date): Date;
/**
 * Re-derive one invoice's outstanding + status from the PLE and stamp them. Safe to call
 * repeatedly; no-ops for drafts. Runs INSIDE the transaction that moved the ledger.
 */
export declare function refreshSalesInvoiceSettlement(tx: Tx, clinicId: string, invoiceId: string): Promise<void>;
export {};
