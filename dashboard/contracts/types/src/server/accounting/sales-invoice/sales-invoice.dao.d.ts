import type { Prisma } from "@/generated/prisma/client";
import { type ListSalesInvoiceFilter, type PaymentScheduleRow, type SalesInvoiceListPayload, type SalesInvoicePayload } from "@/server/accounting/sales-invoice/sales-invoice.type";
type Tx = Prisma.TransactionClient;
/** [P5.2] Prisma queries only — no business logic (repo convention). */
export declare const salesInvoiceDao: {
    list(clinicId: string, filter?: ListSalesInvoiceFilter): Promise<SalesInvoiceListPayload[]>;
    findById(clinicId: string, id: string, tx?: Tx): Promise<SalesInvoicePayload | null>;
    getSchedule(clinicId: string, parentId: string, tx?: Tx): Promise<PaymentScheduleRow[]>;
    replaceSchedule(clinicId: string, parentId: string, rows: Prisma.PaymentScheduleUncheckedCreateInput[], tx?: Tx): Promise<void>;
    deleteSchedule(clinicId: string, parentId: string, tx?: Tx): Promise<void>;
    /** submitted invoices of a party with the same customer PO number (BR-7.2.3). */
    findSubmittedByPo(clinicId: string, partyType: string, partyId: string, poNo: string, excludeId: string, tx?: Tx): Promise<{
        id: string;
        documentNo: string | null;
    } | null>;
};
export {};
