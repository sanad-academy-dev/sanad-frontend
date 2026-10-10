import Elysia from "elysia";
/**
 * [P7.1] HTTP surface for the Payment Entry (BRD §7.4) — draft CRUD. The lifecycle
 * routes (submit/cancel/amend), the Get Outstanding dialog data ([P7.2]) and the
 * reconciliation endpoints ([P7.6]) land with their tasks. TypeBox guards the boundary
 * shape; the zod schema applies the canonical defaults.
 */
export declare const paymentEntryController: Elysia<"/accounting/payment-entries", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "accounting-payment-entry.create": import("@sinclair/typebox").TObject<{
            paymentType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"RECEIVE">, import("@sinclair/typebox").TLiteral<"PAY">, import("@sinclair/typebox").TLiteral<"INTERNAL_TRANSFER">]>;
            postingDate: import("@sinclair/typebox").TString;
            partyType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            partyId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            modeOfPaymentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            paidFromId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            paidToId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            paidAmount: import("@sinclair/typebox").TString;
            receivedAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            referenceNo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            referenceDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            isOpening: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            projectId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            remarks: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            references: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                referenceDoctype: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"sales_invoice">, import("@sinclair/typebox").TLiteral<"purchase_invoice">, import("@sinclair/typebox").TLiteral<"journal_entry">, import("@sinclair/typebox").TLiteral<"insurance_claim">]>;
                referenceId: import("@sinclair/typebox").TString;
                allocatedAmount: import("@sinclair/typebox").TString;
            }>>>;
            deductions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                accountId: import("@sinclair/typebox").TString;
                costCenterId: import("@sinclair/typebox").TString;
                amount: import("@sinclair/typebox").TString;
            }>>>;
        }>;
        readonly "accounting-payment-entry.outstanding": import("@sinclair/typebox").TObject<{
            partyType: import("@sinclair/typebox").TString;
            partyId: import("@sinclair/typebox").TString;
            fromDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            toDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            minAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            maxAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "accounting-payment-entry.list": import("@sinclair/typebox").TObject<{
            docstatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"SUBMITTED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            paymentType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"RECEIVE">, import("@sinclair/typebox").TLiteral<"PAY">, import("@sinclair/typebox").TLiteral<"INTERNAL_TRANSFER">]>>;
            partyId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            fromDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            toDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
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
        "payment-entries": {};
    };
} & {
    accounting: {
        "payment-entries": {
            get: {
                body: {};
                params: {};
                query: {
                    limit?: number | undefined;
                    partyId?: string | undefined;
                    docstatus?: "DRAFT" | "SUBMITTED" | "CANCELLED" | undefined;
                    fromDate?: string | undefined;
                    toDate?: string | undefined;
                    paymentType?: "INTERNAL_TRANSFER" | "RECEIVE" | "PAY" | undefined;
                };
                headers: {};
                response: {
                    200: import("@/server/accounting/payment-entry/payment-entry.type").PaymentEntryListRow[];
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
        "payment-entries": {
            advances: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        partyType: string;
                        partyId: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/payment-entry/advances.service").AdvanceSource[];
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
        "payment-entries": {
            outstanding: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate?: string | undefined;
                        toDate?: string | undefined;
                        minAmount?: string | undefined;
                        maxAmount?: string | undefined;
                        partyType: string;
                        partyId: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/payment-entry/get-outstanding.service").OutstandingForParty;
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
        "payment-entries": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("@/server/accounting/payment-entry/payment-entry.type").PaymentEntryResponse;
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
        "payment-entries": {
            post: {
                body: {
                    references?: {
                        referenceDoctype: "journal_entry" | "sales_invoice" | "purchase_invoice" | "insurance_claim";
                        referenceId: string;
                        allocatedAmount: string;
                    }[] | undefined;
                    costCenterId?: string | null | undefined;
                    partyType?: string | null | undefined;
                    partyId?: string | null | undefined;
                    projectId?: string | null | undefined;
                    isOpening?: boolean | undefined;
                    remarks?: string | null | undefined;
                    modeOfPaymentId?: string | null | undefined;
                    paidFromId?: string | null | undefined;
                    paidToId?: string | null | undefined;
                    receivedAmount?: string | null | undefined;
                    referenceNo?: string | null | undefined;
                    referenceDate?: string | null | undefined;
                    deductions?: {
                        costCenterId: string;
                        accountId: string;
                        amount: string;
                    }[] | undefined;
                    postingDate: string;
                    paidAmount: string;
                    paymentType: "INTERNAL_TRANSFER" | "RECEIVE" | "PAY";
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        clinic: {
                            name: string;
                        };
                        modeOfPayment: {
                            modeOfPaymentName: string;
                        } | null;
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        costCenterId: string | null;
                        status: import("@/server/accounting/payment-entry/payment-entry.type").PaymentEntryStatus;
                        partyType: string | null;
                        partyId: string | null;
                        projectId: string | null;
                        isOpening: boolean;
                        remarks: string | null;
                        docstatus: import("@/server/accounting/payment-entry/payment-entry.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        postingDate: Date;
                        documentNo: string | null;
                        inWords: string | null;
                        modeOfPaymentId: string | null;
                        paidAmount: import("@prisma/client-runtime-utils").Decimal;
                        clearanceDate: Date | null;
                        paymentType: import("@/server/accounting/payment-entry/payment-entry.type").PaymentType;
                        paidFromId: string;
                        paidFromAccountCurrencyCode: string | null;
                        paidToId: string;
                        paidToAccountCurrencyCode: string | null;
                        sourceExchangeRate: import("@prisma/client-runtime-utils").Decimal;
                        basePaidAmount: import("@prisma/client-runtime-utils").Decimal;
                        receivedAmount: import("@prisma/client-runtime-utils").Decimal;
                        targetExchangeRate: import("@prisma/client-runtime-utils").Decimal;
                        baseReceivedAmount: import("@prisma/client-runtime-utils").Decimal;
                        totalAllocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                        unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                        differenceAmount: import("@prisma/client-runtime-utils").Decimal;
                        referenceNo: string | null;
                        referenceDate: Date | null;
                        bookAdvanceInSeparateAccount: boolean;
                        paidFrom: {
                            accountName: string;
                            accountNumber: string | null;
                            accountType: import("../../../../generated/prisma/enums").AccountType | null;
                        };
                        paidTo: {
                            accountName: string;
                            accountNumber: string | null;
                            accountType: import("../../../../generated/prisma/enums").AccountType | null;
                        };
                        deductions: {
                            account: {
                                accountName: string;
                                accountNumber: string | null;
                            };
                            costCenter: {
                                costCenterName: string;
                            };
                            id: string;
                            idx: number;
                            costCenterId: string;
                            accountId: string;
                            amount: import("@prisma/client-runtime-utils").Decimal;
                            isExchangeGainLoss: boolean;
                        }[];
                        partyName: string | null;
                        references: import("@/server/accounting/payment-entry/payment-entry.type").PaymentEntryReferenceDisplay[];
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
        "payment-entries": {
            ":id": {
                patch: {
                    body: {
                        references?: {
                            referenceDoctype: "journal_entry" | "sales_invoice" | "purchase_invoice" | "insurance_claim";
                            referenceId: string;
                            allocatedAmount: string;
                        }[] | undefined;
                        costCenterId?: string | null | undefined;
                        partyType?: string | null | undefined;
                        partyId?: string | null | undefined;
                        projectId?: string | null | undefined;
                        isOpening?: boolean | undefined;
                        remarks?: string | null | undefined;
                        modeOfPaymentId?: string | null | undefined;
                        paidFromId?: string | null | undefined;
                        paidToId?: string | null | undefined;
                        receivedAmount?: string | null | undefined;
                        referenceNo?: string | null | undefined;
                        referenceDate?: string | null | undefined;
                        deductions?: {
                            costCenterId: string;
                            accountId: string;
                            amount: string;
                        }[] | undefined;
                        postingDate: string;
                        paidAmount: string;
                        paymentType: "INTERNAL_TRANSFER" | "RECEIVE" | "PAY";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("@/server/accounting/payment-entry/payment-entry.type").PaymentEntryResponse;
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
        "payment-entries": {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
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
        "payment-entries": {
            ":id": {
                submit: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("@/server/accounting/payment-entry/payment-entry.type").PaymentEntryResponse;
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
        "payment-entries": {
            ":id": {
                cancel: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("@/server/accounting/payment-entry/payment-entry.type").PaymentEntryResponse;
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
        "payment-entries": {
            ":id": {
                amend: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("@/server/accounting/payment-entry/payment-entry.type").PaymentEntryResponse;
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
