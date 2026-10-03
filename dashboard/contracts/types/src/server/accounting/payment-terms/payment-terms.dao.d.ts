/** [P3.5] Prisma reads for the §4.9 masters. */
export declare const paymentTermsDao: {
    listTerms(clinicId: string): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
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
    }[]>;
    listTemplates(clinicId: string): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
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
    }[]>;
};
