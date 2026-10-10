import { type CreatePaymentTermFormValues, type CreatePaymentTermsTemplateFormValues } from "@/server/accounting/payment-terms/payment-terms.type";
/** [P3.5] Payment Terms + Templates services (BRD §4.9). */
export declare function createPaymentTerm(clinicId: string, input: CreatePaymentTermFormValues): Promise<{
    discount: import("@prisma/client-runtime-utils").Decimal;
    modeOfPayment: {
        modeOfPaymentName: string;
    } | null;
    id: string;
    clinicId: string;
    createdAt: Date;
    updatedAt: Date;
    modeOfPaymentId: string | null;
    invoicePortion: import("@prisma/client-runtime-utils").Decimal;
    discountType: import("@/server/accounting/payment-terms/payment-terms.type").PaymentDiscountType;
    paymentTermName: string;
    dueDateBasedOn: import("@/server/accounting/payment-terms/payment-terms.type").DueDateBasis;
    creditDays: number;
    creditMonths: number;
    discountValidityBasedOn: import("@/server/accounting/payment-terms/payment-terms.type").DueDateBasis;
    discountValidity: number;
}>;
export declare function updatePaymentTerm(clinicId: string, id: string, input: CreatePaymentTermFormValues): Promise<{
    discount: import("@prisma/client-runtime-utils").Decimal;
    modeOfPayment: {
        modeOfPaymentName: string;
    } | null;
    id: string;
    clinicId: string;
    createdAt: Date;
    updatedAt: Date;
    modeOfPaymentId: string | null;
    invoicePortion: import("@prisma/client-runtime-utils").Decimal;
    discountType: import("@/server/accounting/payment-terms/payment-terms.type").PaymentDiscountType;
    paymentTermName: string;
    dueDateBasedOn: import("@/server/accounting/payment-terms/payment-terms.type").DueDateBasis;
    creditDays: number;
    creditMonths: number;
    discountValidityBasedOn: import("@/server/accounting/payment-terms/payment-terms.type").DueDateBasis;
    discountValidity: number;
}>;
export declare function deletePaymentTerm(clinicId: string, id: string): Promise<void>;
export declare function createPaymentTermsTemplate(clinicId: string, input: CreatePaymentTermsTemplateFormValues): Promise<{
    id: string;
    clinicId: string;
    createdAt: Date;
    updatedAt: Date;
    rows: {
        id: string;
        idx: number;
        termId: string;
        term: {
            invoicePortion: import("@prisma/client-runtime-utils").Decimal;
            paymentTermName: string;
        };
    }[];
    templateName: string;
    allocatePaymentBasedOnPaymentTerms: boolean;
}>;
export declare function updatePaymentTermsTemplate(clinicId: string, id: string, input: CreatePaymentTermsTemplateFormValues): Promise<{
    id: string;
    clinicId: string;
    createdAt: Date;
    updatedAt: Date;
    rows: {
        id: string;
        idx: number;
        termId: string;
        term: {
            invoicePortion: import("@prisma/client-runtime-utils").Decimal;
            paymentTermName: string;
        };
    }[];
    templateName: string;
    allocatePaymentBasedOnPaymentTerms: boolean;
}>;
export declare function deletePaymentTermsTemplate(clinicId: string, id: string): Promise<void>;
