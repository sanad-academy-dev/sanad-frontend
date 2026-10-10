import Elysia from "elysia";
export declare const paymentTermsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "accounting-payment-term.create": import("@sinclair/typebox").TObject<{
            paymentTermName: import("@sinclair/typebox").TString;
            invoicePortion: import("@sinclair/typebox").TString;
            dueDateBasedOn: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DAYS_AFTER_INVOICE_DATE">, import("@sinclair/typebox").TLiteral<"DAYS_AFTER_INVOICE_MONTH_END">, import("@sinclair/typebox").TLiteral<"MONTHS_AFTER_INVOICE_MONTH_END">]>;
            creditDays: import("@sinclair/typebox").TInteger;
            creditMonths: import("@sinclair/typebox").TInteger;
            modeOfPaymentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            discountType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PERCENTAGE">, import("@sinclair/typebox").TLiteral<"AMOUNT">]>;
            discount: import("@sinclair/typebox").TString;
            discountValidityBasedOn: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DAYS_AFTER_INVOICE_DATE">, import("@sinclair/typebox").TLiteral<"DAYS_AFTER_INVOICE_MONTH_END">, import("@sinclair/typebox").TLiteral<"MONTHS_AFTER_INVOICE_MONTH_END">]>;
            discountValidity: import("@sinclair/typebox").TInteger;
        }>;
        readonly "accounting-payment-terms-template.create": import("@sinclair/typebox").TObject<{
            templateName: import("@sinclair/typebox").TString;
            allocatePaymentBasedOnPaymentTerms: import("@sinclair/typebox").TBoolean;
            termIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
        }>;
    };
    error: {};
}, {
    schema: {};
    standaloneSchema: {};
    macro: {};
    macroFn: {};
    parser: {};
    response: {};
}, {}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}>;
