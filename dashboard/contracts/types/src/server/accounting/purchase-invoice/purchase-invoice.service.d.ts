import { purchaseInvoiceDao } from "@/server/accounting/purchase-invoice/purchase-invoice.dao";
import type { CreatePurchaseInvoiceInput, HoldPurchaseInvoiceFormInput, PurchaseInvoiceListRow, PurchaseInvoicePayload, PurchaseInvoiceResponse } from "@/server/accounting/purchase-invoice/purchase-invoice.type";
import { type VoucherActor, type VoucherConfig } from "@/server/accounting/voucher/voucher.service";
export declare function createPurchaseInvoice(input: CreatePurchaseInvoiceInput): Promise<PurchaseInvoiceResponse>;
export declare function updatePurchaseInvoice(clinicId: string, id: string, input: Omit<CreatePurchaseInvoiceInput, "clinicId" | "createdById">): Promise<PurchaseInvoiceResponse>;
export declare function deletePurchaseInvoice(clinicId: string, id: string): Promise<void>;
export declare function getPurchaseInvoice(clinicId: string, id: string): Promise<PurchaseInvoiceResponse>;
export declare function listPurchaseInvoices(clinicId: string, filter?: Parameters<typeof purchaseInvoiceDao.list>[1]): Promise<PurchaseInvoiceListRow[]>;
/**
 * Hold is a FLAG on a submitted invoice, never a status: the document keeps its live
 * settlement truth (outstanding/status), it is only excluded from payable pulls
 * (`listPartyOpenVouchers` today, the P7 Payment Entry pull tomorrow) until it is
 * released or its release date passes.
 */
export declare function holdPurchaseInvoice(clinicId: string, id: string, input: HoldPurchaseInvoiceFormInput): Promise<PurchaseInvoiceResponse>;
export declare function releasePurchaseInvoice(clinicId: string, id: string): Promise<PurchaseInvoiceResponse>;
export declare function piConfig(actor: VoucherActor): VoucherConfig<PurchaseInvoicePayload>;
export declare const submitPurchaseInvoice: (clinicId: string, id: string, actor: VoucherActor) => Promise<PurchaseInvoiceResponse>;
export declare const cancelPurchaseInvoice: (clinicId: string, id: string, actor: VoucherActor) => Promise<PurchaseInvoiceResponse>;
export declare const amendPurchaseInvoice: (clinicId: string, id: string, actor: VoucherActor) => Promise<PurchaseInvoiceResponse>;
