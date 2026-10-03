import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { DueDateBasis, PaymentDiscountType } from "@/generated/prisma/enums";
/** [P3.5] Types for Payment Terms + Templates (BRD §4.9). BROWSER-SAFE (no Prisma values). */
export { DueDateBasis, PaymentDiscountType };
export declare const paymentTermSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly paymentTermName: true;
    readonly invoicePortion: true;
    readonly dueDateBasedOn: true;
    readonly creditDays: true;
    readonly creditMonths: true;
    readonly modeOfPaymentId: true;
    readonly discountType: true;
    readonly discount: true;
    readonly discountValidityBasedOn: true;
    readonly discountValidity: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly modeOfPayment: {
        readonly select: {
            readonly modeOfPaymentName: true;
        };
    };
};
export type PaymentTermResponse = Prisma.PaymentTermGetPayload<{
    select: typeof paymentTermSelect;
}>;
export declare const paymentTermsTemplateSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly templateName: true;
    readonly allocatePaymentBasedOnPaymentTerms: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly rows: {
        readonly orderBy: {
            readonly idx: "asc";
        };
        readonly select: {
            readonly id: true;
            readonly idx: true;
            readonly termId: true;
            readonly term: {
                readonly select: {
                    readonly paymentTermName: true;
                    readonly invoicePortion: true;
                };
            };
        };
    };
};
export type PaymentTermsTemplateResponse = Prisma.PaymentTermsTemplateGetPayload<{
    select: typeof paymentTermsTemplateSelect;
}>;
export declare const createPaymentTermSchema: z.ZodObject<{
    paymentTermName: z.ZodString;
    invoicePortion: z.ZodDefault<z.ZodString>;
    dueDateBasedOn: z.ZodDefault<z.ZodEnum<{
        readonly DAYS_AFTER_INVOICE_DATE: "DAYS_AFTER_INVOICE_DATE";
        readonly DAYS_AFTER_INVOICE_MONTH_END: "DAYS_AFTER_INVOICE_MONTH_END";
        readonly MONTHS_AFTER_INVOICE_MONTH_END: "MONTHS_AFTER_INVOICE_MONTH_END";
    }>>;
    creditDays: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    creditMonths: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    modeOfPaymentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    discountType: z.ZodDefault<z.ZodEnum<{
        readonly PERCENTAGE: "PERCENTAGE";
        readonly AMOUNT: "AMOUNT";
    }>>;
    discount: z.ZodDefault<z.ZodString>;
    discountValidityBasedOn: z.ZodDefault<z.ZodEnum<{
        readonly DAYS_AFTER_INVOICE_DATE: "DAYS_AFTER_INVOICE_DATE";
        readonly DAYS_AFTER_INVOICE_MONTH_END: "DAYS_AFTER_INVOICE_MONTH_END";
        readonly MONTHS_AFTER_INVOICE_MONTH_END: "MONTHS_AFTER_INVOICE_MONTH_END";
    }>>;
    discountValidity: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type CreatePaymentTermFormInput = z.input<typeof createPaymentTermSchema>;
export type CreatePaymentTermFormValues = z.output<typeof createPaymentTermSchema>;
export declare const createPaymentTermsTemplateSchema: z.ZodObject<{
    templateName: z.ZodString;
    allocatePaymentBasedOnPaymentTerms: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    termIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type CreatePaymentTermsTemplateFormInput = z.input<typeof createPaymentTermsTemplateSchema>;
export type CreatePaymentTermsTemplateFormValues = z.output<typeof createPaymentTermsTemplateSchema>;
