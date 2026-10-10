import type { Prisma } from "@/generated/prisma/client";
import type { CreatePurchaseInvoiceFormValues, PurchaseInvoicePayload } from "@/server/accounting/purchase-invoice/purchase-invoice.type";
/**
 * [P6.4] Debit Note flow — the AP mirror of P5.6 (BR-7.2.2 semantics on the §7.3 side).
 *
 * «إنشاء مرتجع» pre-fills a NEGATED copy of a submitted purchase invoice: quantities flip
 * sign, pricing inputs are copied verbatim, ACTUAL tax amounts negate, write-off, the
 * bill reference and the immediate-payment block are dropped (a DN settles the supplier
 * balance — it neither re-pays nor re-registers the supplier's bill), schedule is empty.
 * The §8 calculator then recomputes the whole document from those inputs on create;
 * nothing here does math beyond `-qty`.
 *
 * The qty cap runs INSIDE the submit transaction: per item key (itemCode, else itemName),
 * Σ|returned| across all SUBMITTED returns of the original + this DN ≤ the original's
 * billed qty — and a DN may not contain items the original never billed.
 */
type Tx = Prisma.TransactionClient;
/** The pre-filled return body — the client opens it in the invoice form as a new draft. */
export declare function buildPurchaseReturnDraft(clinicId: string, originalId: string, postingDate?: string): Promise<CreatePurchaseInvoiceFormValues>;
/** BR-7.2.2 mirror — per-item return caps vs the original, checked in the submit tx. */
export declare function assertPurchaseReturnQtyCaps(tx: Tx, doc: Pick<PurchaseInvoicePayload, "id" | "clinicId" | "returnAgainstId" | "items">): Promise<void>;
export {};
