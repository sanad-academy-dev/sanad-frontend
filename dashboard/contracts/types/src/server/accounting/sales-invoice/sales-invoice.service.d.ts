import type { Prisma } from "@/generated/prisma/client";
import { Prisma as PrismaNs } from "@/generated/prisma/client";
import { salesInvoiceDao } from "@/server/accounting/sales-invoice/sales-invoice.dao";
import { type CreateSalesInvoiceInput, type SalesInvoiceListRow, type SalesInvoicePayload, type SalesInvoiceResponse } from "@/server/accounting/sales-invoice/sales-invoice.type";
import { type VoucherActor, type VoucherConfig } from "@/server/accounting/voucher/voucher.service";
/**
 * [P5.2] Sales Invoice draft lifecycle (BRD §7.2). Submit/cancel — the ledger events —
 * land with the P5.3 composer; this file owns create/update/delete of DRAFTS and the one
 * rule the whole phase hangs on: totals are copied from the §8 calculator's output and
 * from NOWHERE else.
 */
type Tx = Prisma.TransactionClient;
export declare function createSalesInvoice(input: CreateSalesInvoiceInput): Promise<SalesInvoiceResponse>;
export declare function updateSalesInvoice(clinicId: string, id: string, input: Omit<CreateSalesInvoiceInput, "clinicId" | "createdById">): Promise<SalesInvoiceResponse>;
export declare function deleteSalesInvoice(clinicId: string, id: string): Promise<void>;
export declare function getSalesInvoice(clinicId: string, id: string): Promise<SalesInvoiceResponse>;
export declare function listSalesInvoices(clinicId: string, filter?: Parameters<typeof salesInvoiceDao.list>[1]): Promise<SalesInvoiceListRow[]>;
/** BR-7.2.4 / BR-4.10.3 — credit-limit gate; wired into the submit tx by P5.3. */
export declare function assertCreditLimit(tx: Tx, clinicId: string, party: {
    partyType: string;
    partyId: string;
}, addedOutstanding: PrismaNs.Decimal): Promise<void>;
/** Per-call lifecycle config (P0.2 framework) — mirrors the JE pattern. */
export declare function siConfig(actor: VoucherActor): VoucherConfig<SalesInvoicePayload>;
/** doc + resolved party name for the composer's `against` text (loaded pre-submit). */
export declare const submitSalesInvoice: (clinicId: string, id: string, actor: VoucherActor) => Promise<SalesInvoiceResponse>;
export declare const cancelSalesInvoice: (clinicId: string, id: string, actor: VoucherActor) => Promise<SalesInvoiceResponse>;
export declare const amendSalesInvoice: (clinicId: string, id: string, actor: VoucherActor) => Promise<SalesInvoiceResponse>;
export {};
