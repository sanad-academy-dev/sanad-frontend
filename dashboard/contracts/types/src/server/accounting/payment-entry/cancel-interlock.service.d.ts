import type { Prisma } from "@/generated/prisma/client";
/**
 * [P7.8] BR-10.4 — the invoice-cancellation interlock.
 *
 * An invoice being cancelled may carry live settlements from OTHER vouchers (payments,
 * on-account JE credits, linked CN/DNs, consumed advances — every one a non-delinked
 * PLE row of a foreign voucher pointing at the invoice). What happens is governed by
 * `unlink_payment_on_cancellation_of_invoice` (§19):
 *
 *  - ON (default): auto-unlink — the [P7.7] move per linking voucher: delink its
 *    against-invoice slices and re-insert the same sums AGAINST SELF, so every payer's
 *    credit reopens exactly; PE documents drop the matching reference rows and restore
 *    their header totals. The cancel then proceeds; the linking payments stay submitted.
 *
 *  - OFF: BLOCK the cancellation with the Arabic instruction to unreconcile first.
 *
 * Runs INSIDE the invoice's cancel transaction, before the reversal posting — so a
 * blocked cancel leaves nothing behind, and an unlinked one is atomic with the cancel.
 *
 * [P8.0] FX audit: whole-row copies — both amount columns restored verbatim, never
 * split — FX-safe as-is (P8 dossier risk 1).
 */
type Tx = Prisma.TransactionClient;
export declare function enforceInvoiceCancelInterlock(tx: Tx, clinicId: string, invoiceType: string, // "sales_invoice" | "purchase_invoice"
invoiceId: string): Promise<void>;
export {};
