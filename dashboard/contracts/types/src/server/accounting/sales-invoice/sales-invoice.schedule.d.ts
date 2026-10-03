import type { Prisma } from "@/generated/prisma/client";
import { Prisma as PrismaNs } from "@/generated/prisma/client";
/**
 * [P5.4] BR-4.9.1 — payment-schedule generation on invoice save.
 *
 * Template resolution order: doc → party default (party_accounting_config) → company
 * default (§4.1). With a template: one row per ordered term — due date from the term's
 * basis, amount = payable × portion/100 rounded at currency precision with the rounding
 * delta pushed to the LAST row so Σ = payable exactly. Without any template: a single
 * 100% row due on the invoice's due date (or posting date). The invoice's due_date is
 * then max(schedule due dates).
 */
type Tx = Prisma.TransactionClient;
export declare function resolvePaymentTermsTemplateId(tx: Tx, clinicId: string, party: {
    partyType: string;
    partyId: string;
}, docTemplateId: string | null | undefined): Promise<string | null>;
export type GeneratedScheduleRow = {
    idx: number;
    paymentTermId: string | null;
    description: string | null;
    dueDate: Date;
    invoicePortion: string;
    paymentAmount: string;
    discountType: "PERCENTAGE" | "AMOUNT" | null;
    discount: string;
    discountDate: Date | null;
    modeOfPaymentId: string | null;
};
export declare function generateScheduleRows(tx: Tx, params: {
    clinicId: string;
    templateId: string | null;
    postingDate: Date;
    /** the payable figure the schedule must sum to (rounded, or grand when disabled) */
    payable: PrismaNs.Decimal;
    /** doc-level due date — the no-template fallback row's due date */
    dueDate: Date | null;
    currencyPrecision: number;
}): Promise<GeneratedScheduleRow[]>;
/** BR-4.9.1 — the invoice's due date is the LATEST schedule due date. */
export declare function scheduleDueDate(rows: {
    dueDate: Date;
}[]): Date | null;
/** Σ payment_amount must equal the payable figure exactly (validated again at submit). */
export declare function assertScheduleCoversPayable(rows: {
    paymentAmount: PrismaNs.Decimal | string;
}[], payable: PrismaNs.Decimal, fractionUnits: number): void;
export {};
