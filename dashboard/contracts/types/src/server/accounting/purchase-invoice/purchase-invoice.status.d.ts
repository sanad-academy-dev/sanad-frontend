import type { Prisma } from "@/generated/prisma/client";
import { Prisma as PrismaNs } from "@/generated/prisma/client";
import type { PurchaseInvoiceStatus } from "@/generated/prisma/enums";
import { DocStatus } from "@/generated/prisma/enums";
/**
 * [P6.2] The purchase-invoice status engine — the payable mirror of BR-7.2.1, fed from
 * the payment ledger exactly like the P5 engine (outstanding = Σ non-delinked PLE against
 * the voucher; the §5.2 sign matrix makes a payable's outstanding positive on Cr).
 * DEBIT_NOTE_ISSUED replaces CREDIT_NOTE_ISSUED. Hold (BR-7.3.2) is NOT a status — it is
 * a flag that filters payable pulls without masking the settlement truth.
 */
type Tx = Prisma.TransactionClient;
export type PurchaseStatusInput = {
    docstatus: DocStatus;
    isReturn: boolean;
    isInternalSupplier: boolean;
    outstanding: PrismaNs.Decimal;
    payable: PrismaNs.Decimal;
    dueDate: Date | null;
    today: Date;
    fractionUnits: number;
    hasSubmittedReturn: boolean;
};
export declare function computePurchaseInvoiceStatus(input: PurchaseStatusInput): PurchaseInvoiceStatus;
/** Re-derive one PI's outstanding + status from the PLE and stamp them (no-op for drafts). */
export declare function refreshPurchaseInvoiceSettlement(tx: Tx, clinicId: string, invoiceId: string): Promise<void>;
export {};
