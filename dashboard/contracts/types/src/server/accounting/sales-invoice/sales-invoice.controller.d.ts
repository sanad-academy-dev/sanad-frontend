import Elysia from "elysia";
/**
 * [P5.2] HTTP surface for the accounting Sales Invoice (BRD §7.2) — draft CRUD; the
 * lifecycle routes (submit/cancel/amend/return) land with the P5.3 composer. TypeBox
 * guards the boundary shape; the zod schema then applies the canonical defaults so the
 * service always receives a fully-resolved document.
 */
export declare const salesInvoiceController: Elysia<"/accounting/sales-invoices", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "accounting-sales-invoice.create": import("@sinclair/typebox").TObject<{
            postingDate: import("@sinclair/typebox").TString;
            dueDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            partyType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            partyId: import("@sinclair/typebox").TString;
            debitToId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            isReturn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            returnAgainstId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            updateOutstandingForSelf: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            isOpening: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            poNo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            poDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            taxesAndChargesTemplateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            taxCategoryId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            applyDiscountOn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"GRAND_TOTAL">, import("@sinclair/typebox").TLiteral<"NET_TOTAL">]>>;
            additionalDiscountPercentage: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            discountAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            isCashOrNonTradeDiscount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            additionalDiscountAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            disableRoundedTotal: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            writeOffAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            writeOffAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            writeOffCostCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            paymentTermsTemplateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            ignoreDefaultPaymentTermsTemplate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            projectId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            remarks: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            items: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                itemCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                itemName: import("@sinclair/typebox").TString;
                description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                qty: import("@sinclair/typebox").TString;
                uom: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                priceListRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                marginType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PERCENTAGE">, import("@sinclair/typebox").TLiteral<"AMOUNT">]>, import("@sinclair/typebox").TNull]>>;
                marginRateOrAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                discountPercentage: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                discountAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                rate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                isFreeItem: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                incomeAccountId: import("@sinclair/typebox").TString;
                costCenterId: import("@sinclair/typebox").TString;
                discountAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                itemTaxTemplateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                projectId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            }>>;
            taxes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                chargeType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ACTUAL">, import("@sinclair/typebox").TLiteral<"ON_NET_TOTAL">, import("@sinclair/typebox").TLiteral<"ON_PREVIOUS_ROW_AMOUNT">, import("@sinclair/typebox").TLiteral<"ON_PREVIOUS_ROW_TOTAL">, import("@sinclair/typebox").TLiteral<"ON_ITEM_QUANTITY">]>;
                accountHeadId: import("@sinclair/typebox").TString;
                rate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                taxAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                rowId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
                description: import("@sinclair/typebox").TString;
                includedInPrintRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            }>>>;
            schedule: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                dueDate: import("@sinclair/typebox").TString;
                invoicePortion: import("@sinclair/typebox").TString;
                paymentAmount: import("@sinclair/typebox").TString;
                modeOfPaymentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            }>>>;
            allocateAdvancesAutomatically: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            advances: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                referenceType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"payment_entry">, import("@sinclair/typebox").TLiteral<"journal_entry">]>;
                referenceId: import("@sinclair/typebox").TString;
                allocatedAmount: import("@sinclair/typebox").TString;
            }>>>;
        }>;
        readonly "accounting-sales-invoice.list": import("@sinclair/typebox").TObject<{
            docstatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"SUBMITTED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"SUBMITTED">, import("@sinclair/typebox").TLiteral<"UNPAID">, import("@sinclair/typebox").TLiteral<"PAID">, import("@sinclair/typebox").TLiteral<"PARTLY_PAID">, import("@sinclair/typebox").TLiteral<"OVERDUE">, import("@sinclair/typebox").TLiteral<"RETURN">, import("@sinclair/typebox").TLiteral<"CREDIT_NOTE_ISSUED">, import("@sinclair/typebox").TLiteral<"INTERNAL_TRANSFER">, import("@sinclair/typebox").TLiteral<"CONSOLIDATED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            partyId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            fromDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            toDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            isReturn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
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
        "sales-invoices": {};
    };
} & {
    accounting: {
        "sales-invoices": {
            get: {
                body: {};
                params: {};
                query: {
                    status?: "DRAFT" | "SUBMITTED" | "CANCELLED" | "UNPAID" | "PAID" | "PARTLY_PAID" | "OVERDUE" | "RETURN" | "CREDIT_NOTE_ISSUED" | "INTERNAL_TRANSFER" | "CONSOLIDATED" | undefined;
                    limit?: number | undefined;
                    partyId?: string | undefined;
                    docstatus?: "DRAFT" | "SUBMITTED" | "CANCELLED" | undefined;
                    isReturn?: boolean | undefined;
                    fromDate?: string | undefined;
                    toDate?: string | undefined;
                };
                headers: {};
                response: {
                    200: import("@/server/accounting/sales-invoice/sales-invoice.type").SalesInvoiceListRow[];
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
        "sales-invoices": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("@/server/accounting/sales-invoice/sales-invoice.type").SalesInvoiceResponse;
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
        "sales-invoices": {
            post: {
                body: {
                    writeOffAccountId?: string | null | undefined;
                    taxCategoryId?: string | null | undefined;
                    taxes?: {
                        rate?: string | undefined;
                        taxAmount?: string | undefined;
                        rowId?: number | null | undefined;
                        includedInPrintRate?: boolean | undefined;
                        costCenterId?: string | null | undefined;
                        description: string;
                        chargeType: "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
                        accountHeadId: string;
                    }[] | undefined;
                    costCenterId?: string | null | undefined;
                    schedule?: {
                        description?: string | null | undefined;
                        modeOfPaymentId?: string | null | undefined;
                        dueDate: string;
                        invoicePortion: string;
                        paymentAmount: string;
                    }[] | undefined;
                    partyType?: string | undefined;
                    projectId?: string | null | undefined;
                    isOpening?: boolean | undefined;
                    dueDate?: string | null | undefined;
                    remarks?: string | null | undefined;
                    paymentTermsTemplateId?: string | null | undefined;
                    debitToId?: string | null | undefined;
                    isReturn?: boolean | undefined;
                    returnAgainstId?: string | null | undefined;
                    updateOutstandingForSelf?: boolean | undefined;
                    poNo?: string | null | undefined;
                    poDate?: string | null | undefined;
                    taxesAndChargesTemplateId?: string | null | undefined;
                    applyDiscountOn?: "GRAND_TOTAL" | "NET_TOTAL" | undefined;
                    additionalDiscountPercentage?: string | undefined;
                    discountAmount?: string | undefined;
                    isCashOrNonTradeDiscount?: boolean | undefined;
                    additionalDiscountAccountId?: string | null | undefined;
                    disableRoundedTotal?: boolean | undefined;
                    allocateAdvancesAutomatically?: boolean | undefined;
                    writeOffAmount?: string | undefined;
                    writeOffCostCenterId?: string | null | undefined;
                    ignoreDefaultPaymentTermsTemplate?: boolean | undefined;
                    advances?: {
                        referenceType: "journal_entry" | "payment_entry";
                        referenceId: string;
                        allocatedAmount: string;
                    }[] | undefined;
                    items: {
                        description?: string | null | undefined;
                        rate?: string | undefined;
                        projectId?: string | null | undefined;
                        discountAmount?: string | null | undefined;
                        itemCode?: string | null | undefined;
                        uom?: string | null | undefined;
                        priceListRate?: string | null | undefined;
                        marginType?: "PERCENTAGE" | "AMOUNT" | null | undefined;
                        marginRateOrAmount?: string | null | undefined;
                        discountPercentage?: string | null | undefined;
                        isFreeItem?: boolean | undefined;
                        discountAccountId?: string | null | undefined;
                        itemTaxTemplateId?: string | null | undefined;
                        costCenterId: string;
                        incomeAccountId: string;
                        itemName: string;
                        qty: string;
                    }[];
                    partyId: string;
                    postingDate: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        clinic: {
                            name: string;
                        };
                        paymentTermsTemplate: {
                            templateName: string;
                        } | null;
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        writeOffAccountId: string | null;
                        unrealizedProfitLossAccountId: string | null;
                        currencyCode: string;
                        taxCategoryId: string | null;
                        taxes: {
                            id: string;
                            description: string;
                            idx: number;
                            chargeType: import("@/server/accounting/sales-invoice/sales-invoice.type").TaxChargeType;
                            rate: import("@prisma/client-runtime-utils").Decimal;
                            taxAmount: import("@prisma/client-runtime-utils").Decimal;
                            rowId: number | null;
                            includedInPrintRate: boolean;
                            accountHead: {
                                accountName: string;
                                accountNumber: string | null;
                            };
                            accountHeadId: string;
                            costCenterId: string | null;
                            total: import("@prisma/client-runtime-utils").Decimal;
                            taxAmountAfterDiscountAmount: import("@prisma/client-runtime-utils").Decimal;
                        }[];
                        costCenterId: string | null;
                        status: import("@/server/accounting/sales-invoice/sales-invoice.type").SalesInvoiceStatus;
                        items: {
                            costCenter: {
                                costCenterName: string;
                            };
                            itemTaxTemplate: {
                                title: string;
                            } | null;
                            id: string;
                            description: string | null;
                            idx: number;
                            rate: import("@prisma/client-runtime-utils").Decimal;
                            costCenterId: string;
                            projectId: string | null;
                            amount: import("@prisma/client-runtime-utils").Decimal;
                            discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            incomeAccountId: string;
                            itemCode: string | null;
                            itemName: string;
                            qty: import("@prisma/client-runtime-utils").Decimal;
                            uom: string | null;
                            conversionFactor: import("@prisma/client-runtime-utils").Decimal;
                            priceListRate: import("@prisma/client-runtime-utils").Decimal | null;
                            marginType: import("@/server/accounting/sales-invoice/sales-invoice.type").MarginType | null;
                            marginRateOrAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            discountPercentage: import("@prisma/client-runtime-utils").Decimal | null;
                            netRate: import("@prisma/client-runtime-utils").Decimal;
                            netAmount: import("@prisma/client-runtime-utils").Decimal;
                            isFreeItem: boolean;
                            discountAccountId: string | null;
                            itemTaxTemplateId: string | null;
                            itemTaxRates: string | null;
                            enableDeferredRevenue: boolean;
                            deferredAccountId: string | null;
                            serviceStartDate: Date | null;
                            serviceEndDate: Date | null;
                            serviceStopDate: Date | null;
                            incomeAccount: {
                                accountName: string;
                                accountNumber: string | null;
                            };
                        }[];
                        partyType: string;
                        partyId: string;
                        projectId: string | null;
                        isOpening: boolean;
                        dueDate: Date | null;
                        remarks: string | null;
                        docstatus: import("@/server/accounting/sales-invoice/sales-invoice.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        postingDate: Date;
                        paymentTermsTemplateId: string | null;
                        documentNo: string | null;
                        postingTime: string | null;
                        setPostingTime: boolean;
                        conversionRate: import("@prisma/client-runtime-utils").Decimal;
                        debitToId: string;
                        partyAccountCurrencyCode: string | null;
                        isReturn: boolean;
                        returnAgainstId: string | null;
                        updateOutstandingForSelf: boolean;
                        isInternalCustomer: boolean;
                        poNo: string | null;
                        poDate: Date | null;
                        taxesAndChargesTemplateId: string | null;
                        applyDiscountOn: import("@/server/accounting/sales-invoice/sales-invoice.type").ApplyDiscountOn;
                        additionalDiscountPercentage: import("@prisma/client-runtime-utils").Decimal;
                        discountAmount: import("@prisma/client-runtime-utils").Decimal;
                        isCashOrNonTradeDiscount: boolean;
                        additionalDiscountAccountId: string | null;
                        total: import("@prisma/client-runtime-utils").Decimal;
                        netTotal: import("@prisma/client-runtime-utils").Decimal;
                        totalTaxesAndCharges: import("@prisma/client-runtime-utils").Decimal;
                        grandTotal: import("@prisma/client-runtime-utils").Decimal;
                        roundingAdjustment: import("@prisma/client-runtime-utils").Decimal;
                        roundedTotal: import("@prisma/client-runtime-utils").Decimal;
                        disableRoundedTotal: boolean;
                        inWords: string | null;
                        outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
                        totalAdvance: import("@prisma/client-runtime-utils").Decimal;
                        writeOffAmount: import("@prisma/client-runtime-utils").Decimal;
                        writeOffCostCenterId: string | null;
                        ignoreDefaultPaymentTermsTemplate: boolean;
                        returnAgainst: {
                            documentNo: string | null;
                        } | null;
                        debitTo: {
                            accountName: string;
                            accountNumber: string | null;
                        };
                        taxesAndChargesTemplate: {
                            title: string;
                        } | null;
                        advances: {
                            id: string;
                            idx: number;
                            referenceType: string;
                            referenceId: string;
                            allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                            exchangeGainLossJeId: string | null;
                            exchangeGainLoss: import("@prisma/client-runtime-utils").Decimal;
                            advanceAmount: import("@prisma/client-runtime-utils").Decimal;
                            refExchangeRate: import("@prisma/client-runtime-utils").Decimal;
                        }[];
                        partyName: string | null;
                        schedule: import("@/server/accounting/sales-invoice/sales-invoice.type").PaymentScheduleRow[];
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
        "sales-invoices": {
            ":id": {
                patch: {
                    body: {
                        writeOffAccountId?: string | null | undefined;
                        taxCategoryId?: string | null | undefined;
                        taxes?: {
                            rate?: string | undefined;
                            taxAmount?: string | undefined;
                            rowId?: number | null | undefined;
                            includedInPrintRate?: boolean | undefined;
                            costCenterId?: string | null | undefined;
                            description: string;
                            chargeType: "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
                            accountHeadId: string;
                        }[] | undefined;
                        costCenterId?: string | null | undefined;
                        schedule?: {
                            description?: string | null | undefined;
                            modeOfPaymentId?: string | null | undefined;
                            dueDate: string;
                            invoicePortion: string;
                            paymentAmount: string;
                        }[] | undefined;
                        partyType?: string | undefined;
                        projectId?: string | null | undefined;
                        isOpening?: boolean | undefined;
                        dueDate?: string | null | undefined;
                        remarks?: string | null | undefined;
                        paymentTermsTemplateId?: string | null | undefined;
                        debitToId?: string | null | undefined;
                        isReturn?: boolean | undefined;
                        returnAgainstId?: string | null | undefined;
                        updateOutstandingForSelf?: boolean | undefined;
                        poNo?: string | null | undefined;
                        poDate?: string | null | undefined;
                        taxesAndChargesTemplateId?: string | null | undefined;
                        applyDiscountOn?: "GRAND_TOTAL" | "NET_TOTAL" | undefined;
                        additionalDiscountPercentage?: string | undefined;
                        discountAmount?: string | undefined;
                        isCashOrNonTradeDiscount?: boolean | undefined;
                        additionalDiscountAccountId?: string | null | undefined;
                        disableRoundedTotal?: boolean | undefined;
                        allocateAdvancesAutomatically?: boolean | undefined;
                        writeOffAmount?: string | undefined;
                        writeOffCostCenterId?: string | null | undefined;
                        ignoreDefaultPaymentTermsTemplate?: boolean | undefined;
                        advances?: {
                            referenceType: "journal_entry" | "payment_entry";
                            referenceId: string;
                            allocatedAmount: string;
                        }[] | undefined;
                        items: {
                            description?: string | null | undefined;
                            rate?: string | undefined;
                            projectId?: string | null | undefined;
                            discountAmount?: string | null | undefined;
                            itemCode?: string | null | undefined;
                            uom?: string | null | undefined;
                            priceListRate?: string | null | undefined;
                            marginType?: "PERCENTAGE" | "AMOUNT" | null | undefined;
                            marginRateOrAmount?: string | null | undefined;
                            discountPercentage?: string | null | undefined;
                            isFreeItem?: boolean | undefined;
                            discountAccountId?: string | null | undefined;
                            itemTaxTemplateId?: string | null | undefined;
                            costCenterId: string;
                            incomeAccountId: string;
                            itemName: string;
                            qty: string;
                        }[];
                        partyId: string;
                        postingDate: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("@/server/accounting/sales-invoice/sales-invoice.type").SalesInvoiceResponse;
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
        "sales-invoices": {
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
        "sales-invoices": {
            ":id": {
                "return-draft": {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                postingDate: string;
                                partyType: string;
                                partyId: string;
                                isReturn: boolean;
                                updateOutstandingForSelf: boolean;
                                isOpening: boolean;
                                applyDiscountOn: "GRAND_TOTAL" | "NET_TOTAL";
                                additionalDiscountPercentage: string;
                                discountAmount: string;
                                isCashOrNonTradeDiscount: boolean;
                                disableRoundedTotal: boolean;
                                writeOffAmount: string;
                                ignoreDefaultPaymentTermsTemplate: boolean;
                                items: {
                                    itemName: string;
                                    qty: string;
                                    rate: string;
                                    isFreeItem: boolean;
                                    incomeAccountId: string;
                                    costCenterId: string;
                                    itemCode?: string | null | undefined;
                                    description?: string | null | undefined;
                                    uom?: string | null | undefined;
                                    priceListRate?: string | null | undefined;
                                    marginType?: "PERCENTAGE" | "AMOUNT" | null | undefined;
                                    marginRateOrAmount?: string | null | undefined;
                                    discountPercentage?: string | null | undefined;
                                    discountAmount?: string | null | undefined;
                                    discountAccountId?: string | null | undefined;
                                    itemTaxTemplateId?: string | null | undefined;
                                    projectId?: string | null | undefined;
                                    enableDeferredRevenue?: boolean | undefined;
                                    deferredAccountId?: string | null | undefined;
                                    serviceStartDate?: string | null | undefined;
                                    serviceEndDate?: string | null | undefined;
                                    serviceStopDate?: string | null | undefined;
                                }[];
                                taxes: {
                                    chargeType: "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
                                    accountHeadId: string;
                                    rate: string;
                                    taxAmount: string;
                                    description: string;
                                    includedInPrintRate: boolean;
                                    rowId?: number | null | undefined;
                                    costCenterId?: string | null | undefined;
                                }[];
                                schedule: {
                                    dueDate: string;
                                    invoicePortion: string;
                                    paymentAmount: string;
                                    description?: string | null | undefined;
                                    modeOfPaymentId?: string | null | undefined;
                                }[];
                                allocateAdvancesAutomatically: boolean;
                                advances: {
                                    referenceType: "journal_entry" | "payment_entry";
                                    referenceId: string;
                                    allocatedAmount: string;
                                }[];
                                dueDate?: string | null | undefined;
                                currencyCode?: string | null | undefined;
                                conversionRate?: string | null | undefined;
                                debitToId?: string | null | undefined;
                                returnAgainstId?: string | null | undefined;
                                poNo?: string | null | undefined;
                                poDate?: string | null | undefined;
                                taxesAndChargesTemplateId?: string | null | undefined;
                                taxCategoryId?: string | null | undefined;
                                additionalDiscountAccountId?: string | null | undefined;
                                writeOffAccountId?: string | null | undefined;
                                writeOffCostCenterId?: string | null | undefined;
                                paymentTermsTemplateId?: string | null | undefined;
                                costCenterId?: string | null | undefined;
                                projectId?: string | null | undefined;
                                remarks?: string | null | undefined;
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
        "sales-invoices": {
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
                            200: import("@/server/accounting/sales-invoice/sales-invoice.type").SalesInvoiceResponse;
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
        "sales-invoices": {
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
                            200: import("@/server/accounting/sales-invoice/sales-invoice.type").SalesInvoiceResponse;
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
        "sales-invoices": {
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
                            200: import("@/server/accounting/sales-invoice/sales-invoice.type").SalesInvoiceResponse;
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
