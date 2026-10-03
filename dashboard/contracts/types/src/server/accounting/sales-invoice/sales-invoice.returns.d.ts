import type { Prisma } from "@/generated/prisma/client";
import type { CreateSalesInvoiceFormValues, SalesInvoicePayload } from "@/server/accounting/sales-invoice/sales-invoice.type";
/**
 * [P5.6] Credit Note flow (BR-7.2.2).
 *
 * «إنشاء مرتجع» pre-fills a NEGATED copy of a submitted invoice: quantities flip sign,
 * pricing inputs are copied verbatim, ACTUAL tax amounts negate, write-off and schedule
 * are dropped (a CN settles — it is not collected). The §8 calculator then recomputes the
 * whole document from those inputs on create; nothing here does math beyond `-qty`.
 *
 * The qty cap runs INSIDE the submit transaction: per item key (itemCode, else itemName),
 * Σ|returned| across all SUBMITTED returns of the original + this CN ≤ the original's
 * billed qty — and a CN may not contain items the original never billed.
 */
type Tx = Prisma.TransactionClient;
/** The pre-filled return body — the client opens it in the invoice form as a new draft. */
export declare function buildReturnDraft(clinicId: string, originalId: string, postingDate?: string): Promise<CreateSalesInvoiceFormValues>;
/** BR-7.2.2 — per-item return caps vs the original, checked in the submit transaction. */
export declare function assertReturnQtyCaps(tx: Tx, doc: Pick<SalesInvoicePayload, "id" | "clinicId" | "returnAgainstId" | "items">): Promise<void>;
export {};
