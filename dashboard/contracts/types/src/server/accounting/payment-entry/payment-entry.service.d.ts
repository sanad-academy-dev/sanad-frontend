import { PaymentType } from "@/generated/prisma/enums";
import { paymentEntryDao } from "@/server/accounting/payment-entry/payment-entry.dao";
import type { CreatePaymentEntryInput, PaymentEntryListRow, PaymentEntryPayload, PaymentEntryResponse } from "@/server/accounting/payment-entry/payment-entry.type";
import { type VoucherActor, type VoucherConfig } from "@/server/accounting/voucher/voucher.service";
/** The §7.4 doctypes each payment type may settle (draft-time shape rule). */
export declare const ALLOWED_REFERENCE_DOCTYPES: Record<PaymentType, string[]>;
export declare function createPaymentEntry(input: CreatePaymentEntryInput): Promise<PaymentEntryResponse>;
export declare function updatePaymentEntry(clinicId: string, id: string, input: Omit<CreatePaymentEntryInput, "clinicId" | "createdById">): Promise<PaymentEntryResponse>;
export declare function deletePaymentEntry(clinicId: string, id: string): Promise<void>;
export declare function getPaymentEntry(clinicId: string, id: string): Promise<PaymentEntryResponse>;
export declare function listPaymentEntries(clinicId: string, filter?: Parameters<typeof paymentEntryDao.list>[1]): Promise<PaymentEntryListRow[]>;
export declare function peConfig(actor: VoucherActor): VoucherConfig<PaymentEntryPayload>;
export declare const submitPaymentEntry: (clinicId: string, id: string, actor: VoucherActor) => Promise<PaymentEntryResponse>;
export declare const cancelPaymentEntry: (clinicId: string, id: string, actor: VoucherActor) => Promise<PaymentEntryResponse>;
export declare const amendPaymentEntry: (clinicId: string, id: string, actor: VoucherActor) => Promise<PaymentEntryResponse>;
