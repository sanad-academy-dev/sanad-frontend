import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { DocStatus, PaymentEntryStatus, PaymentType } from "@/generated/prisma/enums";
export { DocStatus, PaymentEntryStatus, PaymentType };
/**
 * [P7.1] Types for the Payment Entry (BRD §7.4) — cash in/out and matching (M2).
 * P7 is single-currency: both exchange rates are pinned to 1 and
 * received = paid (BR-7.4.2); the multi-currency columns carry 1/base mirrors
 * until P8 activates them. Allocation figures on reference rows are SNAPSHOTS —
 * the submit transaction re-validates them against live PLE outstanding under
 * row locks (BR-7.4.3).
 */
export declare const paymentEntryListSelect: {
    readonly id: true;
    readonly documentNo: true;
    readonly docstatus: true;
    readonly status: true;
    readonly paymentType: true;
    readonly postingDate: true;
    readonly partyType: true;
    readonly partyId: true;
    readonly modeOfPaymentId: true;
    readonly paidAmount: true;
    readonly totalAllocatedAmount: true;
    readonly unallocatedAmount: true;
    readonly referenceNo: true;
    readonly isOpening: true;
    readonly createdAt: true;
    readonly modeOfPayment: {
        readonly select: {
            readonly modeOfPaymentName: true;
        };
    };
    readonly paidFrom: {
        readonly select: {
            readonly accountName: true;
        };
    };
    readonly paidTo: {
        readonly select: {
            readonly accountName: true;
        };
    };
    readonly references: {
        readonly orderBy: {
            readonly idx: "asc";
        };
        readonly select: {
            readonly referenceDoctype: true;
            readonly referenceId: true;
        };
    };
};
export type PaymentEntryListPayload = Prisma.PaymentEntryGetPayload<{
    select: typeof paymentEntryListSelect;
}>;
export type PaymentEntryListRow = PaymentEntryListPayload & {
    partyName: string | null;
};
export declare const paymentEntryReferenceSelect: {
    readonly id: true;
    readonly idx: true;
    readonly referenceDoctype: true;
    readonly referenceId: true;
    readonly dueDate: true;
    readonly billNo: true;
    readonly totalAmount: true;
    readonly outstandingAmount: true;
    readonly allocatedAmount: true;
    readonly exchangeRate: true;
    readonly exchangeGainLoss: true;
    readonly exchangeGainLossJeId: true;
    readonly paymentTermId: true;
    readonly accountId: true;
};
export declare const paymentEntryDeductionSelect: {
    readonly id: true;
    readonly idx: true;
    readonly accountId: true;
    readonly costCenterId: true;
    readonly amount: true;
    readonly isExchangeGainLoss: true;
    readonly account: {
        readonly select: {
            readonly accountName: true;
            readonly accountNumber: true;
        };
    };
    readonly costCenter: {
        readonly select: {
            readonly costCenterName: true;
        };
    };
};
export declare const paymentEntrySelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly documentNo: true;
    readonly docstatus: true;
    readonly status: true;
    readonly amendedFromId: true;
    readonly paymentType: true;
    readonly postingDate: true;
    readonly partyType: true;
    readonly partyId: true;
    readonly modeOfPaymentId: true;
    readonly paidFromId: true;
    readonly paidFromAccountCurrencyCode: true;
    readonly paidToId: true;
    readonly paidToAccountCurrencyCode: true;
    readonly paidAmount: true;
    readonly sourceExchangeRate: true;
    readonly basePaidAmount: true;
    readonly receivedAmount: true;
    readonly targetExchangeRate: true;
    readonly baseReceivedAmount: true;
    readonly totalAllocatedAmount: true;
    readonly unallocatedAmount: true;
    readonly differenceAmount: true;
    readonly referenceNo: true;
    readonly referenceDate: true;
    readonly clearanceDate: true;
    readonly isOpening: true;
    /** [P12.6] FR-11.3 regime snapshot — the submit hook reads THIS, never the live setting */
    readonly bookAdvanceInSeparateAccount: true;
    readonly costCenterId: true;
    readonly projectId: true;
    readonly inWords: true;
    readonly remarks: true;
    readonly createdById: true;
    readonly submittedAt: true;
    readonly submittedById: true;
    readonly cancelledAt: true;
    readonly cancelledById: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly clinic: {
        readonly select: {
            readonly name: true;
        };
    };
    readonly modeOfPayment: {
        readonly select: {
            readonly modeOfPaymentName: true;
        };
    };
    readonly paidFrom: {
        readonly select: {
            readonly accountName: true;
            readonly accountNumber: true;
            readonly accountType: true;
        };
    };
    readonly paidTo: {
        readonly select: {
            readonly accountName: true;
            readonly accountNumber: true;
            readonly accountType: true;
        };
    };
    readonly references: {
        readonly orderBy: {
            readonly idx: "asc";
        };
        readonly select: {
            readonly id: true;
            readonly idx: true;
            readonly referenceDoctype: true;
            readonly referenceId: true;
            readonly dueDate: true;
            readonly billNo: true;
            readonly totalAmount: true;
            readonly outstandingAmount: true;
            readonly allocatedAmount: true;
            readonly exchangeRate: true;
            readonly exchangeGainLoss: true;
            readonly exchangeGainLossJeId: true;
            readonly paymentTermId: true;
            readonly accountId: true;
        };
    };
    readonly deductions: {
        readonly orderBy: {
            readonly idx: "asc";
        };
        readonly select: {
            readonly id: true;
            readonly idx: true;
            readonly accountId: true;
            readonly costCenterId: true;
            readonly amount: true;
            readonly isExchangeGainLoss: true;
            readonly account: {
                readonly select: {
                    readonly accountName: true;
                    readonly accountNumber: true;
                };
            };
            readonly costCenter: {
                readonly select: {
                    readonly costCenterName: true;
                };
            };
        };
    };
};
export type PaymentEntryPayload = Prisma.PaymentEntryGetPayload<{
    select: typeof paymentEntrySelect;
}>;
/** full document = payload + resolved party name + display numbers per reference */
export type PaymentEntryReferenceDisplay = PaymentEntryPayload["references"][number] & {
    referenceNo: string | null;
};
export type PaymentEntryResponse = Omit<PaymentEntryPayload, "references"> & {
    partyName: string | null;
    references: PaymentEntryReferenceDisplay[];
};
/**
 * THE referenceable-doctype list — the single source for the zod schema below AND the
 * TypeBox request model (`payment-entry.model.ts`), pinned against the loader registry
 * and the per-direction allowlist by `reference-doctype-parity.audit.test.ts`.
 *
 * It exists because [MI-P5] added `insurance_claim` to the loader and the service
 * allowlist but not to these two closed enumerations, and the HTTP boundary then
 * answered 422 «بيانات الطلب غير صالحة» for every user: settlement was unreachable
 * through the API while every service-level assertion stayed green. Four hand-kept
 * copies of one list is the defect; this is the fix.
 */
export declare const PE_REFERENCE_DOCTYPES: readonly ["sales_invoice", "purchase_invoice", "journal_entry", "insurance_claim"];
export type PeReferenceDoctype = (typeof PE_REFERENCE_DOCTYPES)[number];
export declare const paymentEntryReferenceSchema: z.ZodObject<{
    referenceDoctype: z.ZodEnum<{
        journal_entry: "journal_entry";
        sales_invoice: "sales_invoice";
        purchase_invoice: "purchase_invoice";
        insurance_claim: "insurance_claim";
    }>;
    referenceId: z.ZodString;
    allocatedAmount: z.ZodString;
}, z.core.$strip>;
export declare const paymentEntryDeductionSchema: z.ZodObject<{
    accountId: z.ZodString;
    costCenterId: z.ZodString;
    amount: z.ZodString;
}, z.core.$strip>;
export declare const createPaymentEntrySchema: z.ZodObject<{
    paymentType: z.ZodEnum<{
        readonly RECEIVE: "RECEIVE";
        readonly PAY: "PAY";
        readonly INTERNAL_TRANSFER: "INTERNAL_TRANSFER";
    }>;
    postingDate: z.ZodString;
    partyType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    partyId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    modeOfPaymentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    paidFromId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    paidToId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    paidAmount: z.ZodString;
    receivedAmount: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sourceExchangeRate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    targetExchangeRate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    referenceNo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    referenceDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isOpening: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    costCenterId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    projectId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    remarks: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    references: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        referenceDoctype: z.ZodEnum<{
            journal_entry: "journal_entry";
            sales_invoice: "sales_invoice";
            purchase_invoice: "purchase_invoice";
            insurance_claim: "insurance_claim";
        }>;
        referenceId: z.ZodString;
        allocatedAmount: z.ZodString;
    }, z.core.$strip>>>>;
    deductions: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        accountId: z.ZodString;
        costCenterId: z.ZodString;
        amount: z.ZodString;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
export type CreatePaymentEntryFormInput = z.input<typeof createPaymentEntrySchema>;
export type CreatePaymentEntryFormValues = z.output<typeof createPaymentEntrySchema>;
export type PaymentEntryReferenceInput = z.output<typeof paymentEntryReferenceSchema>;
export type PaymentEntryDeductionInput = z.output<typeof paymentEntryDeductionSchema>;
export type CreatePaymentEntryInput = CreatePaymentEntryFormValues & {
    clinicId: string;
    createdById?: string | null;
};
export type ListPaymentEntryFilter = {
    docstatus?: DocStatus;
    paymentType?: PaymentType;
    partyId?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
};
