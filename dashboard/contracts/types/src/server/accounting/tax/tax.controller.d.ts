import Elysia from "elysia";
/**
 * [P4.1] §4.11 tax masters API. Doctype gates per the registry: each master under its own
 * doctype (sales/purchase templates, item template, category, rule → the closest declared
 * doctype key).
 */
export declare const taxController: Elysia<"/accounting/tax", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "accounting-tax-template.create": import("@sinclair/typebox").TObject<{
            title: import("@sinclair/typebox").TString;
            isDefault: import("@sinclair/typebox").TBoolean;
            disabled: import("@sinclair/typebox").TBoolean;
            taxCategoryId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            taxes: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                chargeType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ACTUAL">, import("@sinclair/typebox").TLiteral<"ON_NET_TOTAL">, import("@sinclair/typebox").TLiteral<"ON_PREVIOUS_ROW_AMOUNT">, import("@sinclair/typebox").TLiteral<"ON_PREVIOUS_ROW_TOTAL">, import("@sinclair/typebox").TLiteral<"ON_ITEM_QUANTITY">]>;
                accountHeadId: import("@sinclair/typebox").TString;
                rate: import("@sinclair/typebox").TString;
                taxAmount: import("@sinclair/typebox").TString;
                rowId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
                description: import("@sinclair/typebox").TString;
                includedInPrintRate: import("@sinclair/typebox").TBoolean;
                costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"TOTAL">, import("@sinclair/typebox").TLiteral<"VALUATION">, import("@sinclair/typebox").TLiteral<"VALUATION_AND_TOTAL">]>>;
                addDeductTax: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ADD">, import("@sinclair/typebox").TLiteral<"DEDUCT">]>>;
            }>>;
        }>;
        readonly "accounting-item-tax-template.create": import("@sinclair/typebox").TObject<{
            title: import("@sinclair/typebox").TString;
            disabled: import("@sinclair/typebox").TBoolean;
            rows: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                taxTypeAccountId: import("@sinclair/typebox").TString;
                taxRate: import("@sinclair/typebox").TString;
            }>>;
        }>;
        readonly "accounting-tax-category.create": import("@sinclair/typebox").TObject<{
            title: import("@sinclair/typebox").TString;
            disabled: import("@sinclair/typebox").TBoolean;
        }>;
        readonly "accounting-tax-rule.create": import("@sinclair/typebox").TObject<{
            taxType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SALES">, import("@sinclair/typebox").TLiteral<"PURCHASE">]>;
            salesTaxTemplateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            purchaseTaxTemplateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            partyType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            partyId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            itemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            itemCategory: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            taxCategoryId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            fromDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            toDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            priority: import("@sinclair/typebox").TInteger;
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
        tax: {};
    };
} & {
    accounting: {
        tax: {
            "sales-templates": {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
                            isDefault: boolean;
                            taxCategoryId: string | null;
                            taxes: {
                                id: string;
                                description: string;
                                idx: number;
                                chargeType: import("./tax.type").TaxChargeType;
                                rate: import("@prisma/client-runtime-utils").Decimal;
                                taxAmount: import("@prisma/client-runtime-utils").Decimal;
                                rowId: number | null;
                                includedInPrintRate: boolean;
                                accountHead: {
                                    accountName: string;
                                };
                                accountHeadId: string;
                                costCenterId: string | null;
                            }[];
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
        tax: {
            "sales-templates": {
                post: {
                    body: {
                        taxCategoryId?: string | null | undefined;
                        disabled: boolean;
                        title: string;
                        isDefault: boolean;
                        taxes: {
                            rowId?: number | null | undefined;
                            costCenterId?: string | null | undefined;
                            category?: "TOTAL" | "VALUATION" | "VALUATION_AND_TOTAL" | undefined;
                            addDeductTax?: "ADD" | "DEDUCT" | undefined;
                            description: string;
                            chargeType: "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
                            rate: string;
                            taxAmount: string;
                            includedInPrintRate: boolean;
                            accountHeadId: string;
                        }[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
                            isDefault: boolean;
                            taxCategoryId: string | null;
                            taxes: {
                                id: string;
                                description: string;
                                idx: number;
                                chargeType: import("./tax.type").TaxChargeType;
                                rate: import("@prisma/client-runtime-utils").Decimal;
                                taxAmount: import("@prisma/client-runtime-utils").Decimal;
                                rowId: number | null;
                                includedInPrintRate: boolean;
                                accountHead: {
                                    accountName: string;
                                };
                                accountHeadId: string;
                                costCenterId: string | null;
                            }[];
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
        tax: {
            "sales-templates": {
                ":id": {
                    patch: {
                        body: {
                            taxCategoryId?: string | null | undefined;
                            disabled: boolean;
                            title: string;
                            isDefault: boolean;
                            taxes: {
                                rowId?: number | null | undefined;
                                costCenterId?: string | null | undefined;
                                category?: "TOTAL" | "VALUATION" | "VALUATION_AND_TOTAL" | undefined;
                                addDeductTax?: "ADD" | "DEDUCT" | undefined;
                                description: string;
                                chargeType: "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
                                rate: string;
                                taxAmount: string;
                                includedInPrintRate: boolean;
                                accountHeadId: string;
                            }[];
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
                                disabled: boolean;
                                createdAt: Date;
                                updatedAt: Date;
                                title: string;
                                isDefault: boolean;
                                taxCategoryId: string | null;
                                taxes: {
                                    id: string;
                                    description: string;
                                    idx: number;
                                    chargeType: import("./tax.type").TaxChargeType;
                                    rate: import("@prisma/client-runtime-utils").Decimal;
                                    taxAmount: import("@prisma/client-runtime-utils").Decimal;
                                    rowId: number | null;
                                    includedInPrintRate: boolean;
                                    accountHead: {
                                        accountName: string;
                                    };
                                    accountHeadId: string;
                                    costCenterId: string | null;
                                }[];
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
        tax: {
            "sales-templates": {
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
} & {
    accounting: {
        tax: {
            "purchase-templates": {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
                            isDefault: boolean;
                            taxCategoryId: string | null;
                            taxes: {
                                id: string;
                                description: string;
                                idx: number;
                                chargeType: import("./tax.type").TaxChargeType;
                                rate: import("@prisma/client-runtime-utils").Decimal;
                                taxAmount: import("@prisma/client-runtime-utils").Decimal;
                                rowId: number | null;
                                includedInPrintRate: boolean;
                                accountHead: {
                                    accountName: string;
                                };
                                accountHeadId: string;
                                costCenterId: string | null;
                                category: import("./tax.type").TaxRowCategory;
                                addDeductTax: import("./tax.type").TaxAddDeduct;
                            }[];
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
        tax: {
            "purchase-templates": {
                post: {
                    body: {
                        taxCategoryId?: string | null | undefined;
                        disabled: boolean;
                        title: string;
                        isDefault: boolean;
                        taxes: {
                            rowId?: number | null | undefined;
                            costCenterId?: string | null | undefined;
                            category?: "TOTAL" | "VALUATION" | "VALUATION_AND_TOTAL" | undefined;
                            addDeductTax?: "ADD" | "DEDUCT" | undefined;
                            description: string;
                            chargeType: "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
                            rate: string;
                            taxAmount: string;
                            includedInPrintRate: boolean;
                            accountHeadId: string;
                        }[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
                            isDefault: boolean;
                            taxCategoryId: string | null;
                            taxes: {
                                id: string;
                                description: string;
                                idx: number;
                                chargeType: import("./tax.type").TaxChargeType;
                                rate: import("@prisma/client-runtime-utils").Decimal;
                                taxAmount: import("@prisma/client-runtime-utils").Decimal;
                                rowId: number | null;
                                includedInPrintRate: boolean;
                                accountHead: {
                                    accountName: string;
                                };
                                accountHeadId: string;
                                costCenterId: string | null;
                                category: import("./tax.type").TaxRowCategory;
                                addDeductTax: import("./tax.type").TaxAddDeduct;
                            }[];
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
        tax: {
            "purchase-templates": {
                ":id": {
                    patch: {
                        body: {
                            taxCategoryId?: string | null | undefined;
                            disabled: boolean;
                            title: string;
                            isDefault: boolean;
                            taxes: {
                                rowId?: number | null | undefined;
                                costCenterId?: string | null | undefined;
                                category?: "TOTAL" | "VALUATION" | "VALUATION_AND_TOTAL" | undefined;
                                addDeductTax?: "ADD" | "DEDUCT" | undefined;
                                description: string;
                                chargeType: "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
                                rate: string;
                                taxAmount: string;
                                includedInPrintRate: boolean;
                                accountHeadId: string;
                            }[];
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
                                disabled: boolean;
                                createdAt: Date;
                                updatedAt: Date;
                                title: string;
                                isDefault: boolean;
                                taxCategoryId: string | null;
                                taxes: {
                                    id: string;
                                    description: string;
                                    idx: number;
                                    chargeType: import("./tax.type").TaxChargeType;
                                    rate: import("@prisma/client-runtime-utils").Decimal;
                                    taxAmount: import("@prisma/client-runtime-utils").Decimal;
                                    rowId: number | null;
                                    includedInPrintRate: boolean;
                                    accountHead: {
                                        accountName: string;
                                    };
                                    accountHeadId: string;
                                    costCenterId: string | null;
                                    category: import("./tax.type").TaxRowCategory;
                                    addDeductTax: import("./tax.type").TaxAddDeduct;
                                }[];
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
        tax: {
            "purchase-templates": {
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
} & {
    accounting: {
        tax: {
            "item-templates": {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
                            rows: {
                                id: string;
                                taxRate: import("@prisma/client-runtime-utils").Decimal;
                                taxTypeAccountId: string;
                                taxType: {
                                    accountName: string;
                                };
                            }[];
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
        tax: {
            "item-templates": {
                post: {
                    body: {
                        disabled: boolean;
                        title: string;
                        rows: {
                            taxRate: string;
                            taxTypeAccountId: string;
                        }[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
                            rows: {
                                id: string;
                                taxRate: import("@prisma/client-runtime-utils").Decimal;
                                taxTypeAccountId: string;
                                taxType: {
                                    accountName: string;
                                };
                            }[];
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
        tax: {
            "item-templates": {
                ":id": {
                    patch: {
                        body: {
                            disabled: boolean;
                            title: string;
                            rows: {
                                taxRate: string;
                                taxTypeAccountId: string;
                            }[];
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
                                disabled: boolean;
                                createdAt: Date;
                                updatedAt: Date;
                                title: string;
                                rows: {
                                    id: string;
                                    taxRate: import("@prisma/client-runtime-utils").Decimal;
                                    taxTypeAccountId: string;
                                    taxType: {
                                        accountName: string;
                                    };
                                }[];
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
        tax: {
            "item-templates": {
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
} & {
    accounting: {
        tax: {
            categories: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
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
        tax: {
            categories: {
                post: {
                    body: {
                        disabled: boolean;
                        title: string;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            title: string;
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
        tax: {
            categories: {
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
} & {
    accounting: {
        tax: {
            rules: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            priority: number;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            taxCategoryId: string | null;
                            partyType: string | null;
                            partyId: string | null;
                            fromDate: Date | null;
                            toDate: Date | null;
                            itemId: string | null;
                            taxType: string;
                            salesTaxTemplateId: string | null;
                            purchaseTaxTemplateId: string | null;
                            itemCategory: string | null;
                            salesTemplate: {
                                title: string;
                            } | null;
                            purchaseTemplate: {
                                title: string;
                            } | null;
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
        tax: {
            rules: {
                post: {
                    body: {
                        taxCategoryId?: string | null | undefined;
                        partyType?: string | null | undefined;
                        partyId?: string | null | undefined;
                        fromDate?: string | null | undefined;
                        toDate?: string | null | undefined;
                        itemId?: string | null | undefined;
                        salesTaxTemplateId?: string | null | undefined;
                        purchaseTaxTemplateId?: string | null | undefined;
                        itemCategory?: string | null | undefined;
                        priority: number;
                        taxType: "SALES" | "PURCHASE";
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            priority: number;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            taxCategoryId: string | null;
                            partyType: string | null;
                            partyId: string | null;
                            fromDate: Date | null;
                            toDate: Date | null;
                            itemId: string | null;
                            taxType: string;
                            salesTaxTemplateId: string | null;
                            purchaseTaxTemplateId: string | null;
                            itemCategory: string | null;
                            salesTemplate: {
                                title: string;
                            } | null;
                            purchaseTemplate: {
                                title: string;
                            } | null;
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
        tax: {
            rules: {
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
} & {
    accounting: {
        tax: {
            preview: {
                post: {
                    body: {
                        applyDiscountOn?: "GRAND_TOTAL" | "NET_TOTAL" | null | undefined;
                        discountAmount?: string | null | undefined;
                        isCashOrNonTradeDiscount?: boolean | undefined;
                        currencyPrecision?: number | undefined;
                        roundRowWiseTax?: boolean | undefined;
                        taxes: {
                            rate?: string | undefined;
                            taxAmount?: string | undefined;
                            rowId?: number | null | undefined;
                            includedInPrintRate?: boolean | undefined;
                            category?: "TOTAL" | "VALUATION" | "VALUATION_AND_TOTAL" | undefined;
                            addDeductTax?: "ADD" | "DEDUCT" | undefined;
                            key: string;
                            chargeType: "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
                            accountHead: string;
                        }[];
                        items: {
                            rate?: string | undefined;
                            isFreeItem?: boolean | undefined;
                            itemTaxRates?: {
                                [x: string]: string;
                            } | null | undefined;
                            key: string;
                            qty: string;
                        }[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: import("@/server/accounting/tax/tax-calculator").CalcResult;
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
        tax: {
            "resolve-template": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        taxCategoryId?: string | undefined;
                        partyType?: string | undefined;
                        partyId?: string | undefined;
                        itemId?: string | undefined;
                        itemCategory?: string | undefined;
                        date: string;
                        taxType: "SALES" | "PURCHASE";
                    };
                    headers: {};
                    response: {
                        200: {
                            templateId: string | null;
                            ruleId: string | null;
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
