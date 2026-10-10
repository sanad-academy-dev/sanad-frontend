import Elysia from "elysia";
/** [P3.5] Payment Terms + Templates API (BRD §4.9) — doctype `payment_terms_template`. */
export declare const paymentTermsController: Elysia<"/accounting/payment-terms", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
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
} & {
    schema: {};
    standaloneSchema: {};
    macro: Partial<{
        readonly requireAccounting: {
            doctype: import("../permissions/accounting-permissions").AccountingDoctypeKey;
            action: import("../permissions/accounting-permissions").AccountingAction;
        };
    }>;
    macroFn: {
        readonly requireAccounting: (options: {
            doctype: import("../permissions/accounting-permissions").AccountingDoctypeKey;
            action: import("../permissions/accounting-permissions").AccountingAction;
        }) => {
            readonly resolve: ({ request }: {
                request: Request;
            }) => Promise<import("elysia").ElysiaCustomStatusResponse<401, {
                readonly message: "غير مصرح";
            }, 401> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
            }, 403> | {
                clinicId: string;
                userId: string;
                actor: import("../permissions/accounting-permissions.guard").AccountingActor;
            }>;
        };
    };
    parser: {};
    response: {};
}, {
    accounting: {
        "payment-terms": {};
    };
} & {
    accounting: {
        "payment-terms": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
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
                        discountType: import("./payment-terms.type").PaymentDiscountType;
                        paymentTermName: string;
                        dueDateBasedOn: import("./payment-terms.type").DueDateBasis;
                        creditDays: number;
                        creditMonths: number;
                        discountValidityBasedOn: import("./payment-terms.type").DueDateBasis;
                        discountValidity: number;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                    };
                };
            };
        };
    };
} & {
    accounting: {
        "payment-terms": {
            post: {
                body: {
                    modeOfPaymentId?: string | null | undefined;
                    discount: string;
                    invoicePortion: string;
                    discountType: "PERCENTAGE" | "AMOUNT";
                    paymentTermName: string;
                    dueDateBasedOn: "DAYS_AFTER_INVOICE_DATE" | "DAYS_AFTER_INVOICE_MONTH_END" | "MONTHS_AFTER_INVOICE_MONTH_END";
                    creditDays: number;
                    creditMonths: number;
                    discountValidityBasedOn: "DAYS_AFTER_INVOICE_DATE" | "DAYS_AFTER_INVOICE_MONTH_END" | "MONTHS_AFTER_INVOICE_MONTH_END";
                    discountValidity: number;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
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
                        discountType: import("./payment-terms.type").PaymentDiscountType;
                        paymentTermName: string;
                        dueDateBasedOn: import("./payment-terms.type").DueDateBasis;
                        creditDays: number;
                        creditMonths: number;
                        discountValidityBasedOn: import("./payment-terms.type").DueDateBasis;
                        discountValidity: number;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
} & {
    accounting: {
        "payment-terms": {
            ":id": {
                patch: {
                    body: {
                        modeOfPaymentId?: string | null | undefined;
                        discount: string;
                        invoicePortion: string;
                        discountType: "PERCENTAGE" | "AMOUNT";
                        paymentTermName: string;
                        dueDateBasedOn: "DAYS_AFTER_INVOICE_DATE" | "DAYS_AFTER_INVOICE_MONTH_END" | "MONTHS_AFTER_INVOICE_MONTH_END";
                        creditDays: number;
                        creditMonths: number;
                        discountValidityBasedOn: "DAYS_AFTER_INVOICE_DATE" | "DAYS_AFTER_INVOICE_MONTH_END" | "MONTHS_AFTER_INVOICE_MONTH_END";
                        discountValidity: number;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
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
                            discountType: import("./payment-terms.type").PaymentDiscountType;
                            paymentTermName: string;
                            dueDateBasedOn: import("./payment-terms.type").DueDateBasis;
                            creditDays: number;
                            creditMonths: number;
                            discountValidityBasedOn: import("./payment-terms.type").DueDateBasis;
                            discountValidity: number;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    accounting: {
        "payment-terms": {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            ok: boolean;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    accounting: {
        "payment-terms": {
            templates: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
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
                        }[];
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                    };
                };
            };
        };
    };
} & {
    accounting: {
        "payment-terms": {
            templates: {
                post: {
                    body: {
                        templateName: string;
                        allocatePaymentBasedOnPaymentTerms: boolean;
                        termIds: string[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
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
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    accounting: {
        "payment-terms": {
            templates: {
                ":id": {
                    patch: {
                        body: {
                            templateName: string;
                            allocatePaymentBasedOnPaymentTerms: boolean;
                            termIds: string[];
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
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
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    accounting: {
        "payment-terms": {
            templates: {
                ":id": {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                ok: boolean;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
}, {
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
} & {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}>;
