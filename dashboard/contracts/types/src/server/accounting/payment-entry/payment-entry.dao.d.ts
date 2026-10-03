import type { Prisma } from "@/generated/prisma/client";
import { type ListPaymentEntryFilter, type PaymentEntryListPayload, type PaymentEntryPayload } from "@/server/accounting/payment-entry/payment-entry.type";
type Tx = Prisma.TransactionClient;
/** [P7.1] Prisma queries only — no business logic (repo convention). */
export declare const paymentEntryDao: {
    list(clinicId: string, filter?: ListPaymentEntryFilter): Promise<PaymentEntryListPayload[]>;
    findById(clinicId: string, id: string, tx?: Tx): Promise<PaymentEntryPayload | null>;
};
export {};
