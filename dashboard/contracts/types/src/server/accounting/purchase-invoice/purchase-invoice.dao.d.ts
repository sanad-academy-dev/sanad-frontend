import type { Prisma } from "@/generated/prisma/client";
import { type ListPurchaseInvoiceFilter, type PurchaseInvoiceListPayload, type PurchaseInvoicePayload } from "@/server/accounting/purchase-invoice/purchase-invoice.type";
import type { PaymentScheduleRow } from "@/server/accounting/sales-invoice/sales-invoice.type";
type Tx = Prisma.TransactionClient;
/** [P6.2] Prisma queries only — no business logic (repo convention). */
export declare const purchaseInvoiceDao: {
    list(clinicId: string, filter?: ListPurchaseInvoiceFilter): Promise<PurchaseInvoiceListPayload[]>;
    findById(clinicId: string, id: string, tx?: Tx): Promise<PurchaseInvoicePayload | null>;
    getSchedule(clinicId: string, parentId: string, tx?: Tx): Promise<PaymentScheduleRow[]>;
    replaceSchedule(clinicId: string, parentId: string, rows: Prisma.PaymentScheduleUncheckedCreateInput[], tx?: Tx): Promise<void>;
    deleteSchedule(clinicId: string, parentId: string, tx?: Tx): Promise<void>;
    /** BR-7.3.1 — a non-cancelled PI of the same supplier carrying the same bill number. */
    findDuplicateBill(clinicId: string, partyType: string, partyId: string, billNo: string, excludeId: string, tx?: Tx): Promise<{
        id: string;
        documentNo: string | null;
    } | null>;
};
export {};
