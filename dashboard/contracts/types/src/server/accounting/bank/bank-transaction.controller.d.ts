import Elysia from "elysia";
import { type BankTransactionStatus } from "@/server/accounting/bank/bank-transaction.type";
export declare const bankTransactionController: Elysia<"/accounting/bank-transactions", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
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
        "bank-transactions": {};
    };
} & {
    accounting: {
        "bank-transactions": {
            get: {
                body: {};
                params: {};
                query: {
                    status?: string | undefined;
                    bankAccountId?: string | undefined;
                    fromDate?: string | undefined;
                    toDate?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        bankAccount: {
                            accountName: string;
                        };
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        description: string | null;
                        currencyCode: string;
                        status: BankTransactionStatus;
                        partyType: string | null;
                        partyId: string | null;
                        docstatus: import("@/server/accounting/bank/bank-transaction.type").DocStatus;
                        amendedFromId: string | null;
                        postingDate: Date;
                        documentNo: string | null;
                        payments: {
                            id: string;
                            allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                            paymentDocument: string;
                            paymentEntryId: string;
                            paymentRowId: string | null;
                        }[];
                        bankAccountId: string;
                        unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                        deposit: import("@prisma/client-runtime-utils").Decimal;
                        withdrawal: import("@prisma/client-runtime-utils").Decimal;
                        allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                        referenceNumber: string | null;
                        transactionId: string | null;
                        pairedTransactionId: string | null;
                        importId: string | null;
                    }[];
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
        "bank-transactions": {
            "import-presets": {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            key: string;
                            labelAr: string;
                            verified: boolean;
                            config: import("@/server/accounting/bank/statement-parser").BankImportMappingConfig;
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
        "bank-transactions": {
            mappings: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            bankId: string | null;
                            templateName: string;
                            config: import("@prisma/client/runtime/client").JsonValue;
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
        "bank-transactions": {
            mappings: {
                post: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            bankId: string | null;
                            templateName: string;
                            config: import("@prisma/client/runtime/client").JsonValue;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        422: {
                            readonly message: "templateName و config مطلوبان";
                        };
                    };
                };
            };
        };
    };
} & {
    accounting: {
        "bank-transactions": {
            mappings: {
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
    };
} & {
    accounting: {
        "bank-transactions": {
            imports: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            errors: import("@prisma/client/runtime/client").JsonValue | null;
                            bankAccountId: string;
                            fileName: string;
                            mappingId: string | null;
                            totalRows: number;
                            importedRows: number;
                            duplicateRows: number;
                            errorRows: number;
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
        "bank-transactions": {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            bankAccount: {
                                accountName: string;
                            };
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            description: string | null;
                            currencyCode: string;
                            status: BankTransactionStatus;
                            partyType: string | null;
                            partyId: string | null;
                            docstatus: import("@/server/accounting/bank/bank-transaction.type").DocStatus;
                            amendedFromId: string | null;
                            postingDate: Date;
                            documentNo: string | null;
                            payments: {
                                id: string;
                                allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentDocument: string;
                                paymentEntryId: string;
                                paymentRowId: string | null;
                            }[];
                            bankAccountId: string;
                            unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                            deposit: import("@prisma/client-runtime-utils").Decimal;
                            withdrawal: import("@prisma/client-runtime-utils").Decimal;
                            allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                            referenceNumber: string | null;
                            transactionId: string | null;
                            pairedTransactionId: string | null;
                            importId: string | null;
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
        "bank-transactions": {
            post: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        bankAccount: {
                            accountName: string;
                        };
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        description: string | null;
                        currencyCode: string;
                        status: BankTransactionStatus;
                        partyType: string | null;
                        partyId: string | null;
                        docstatus: import("@/server/accounting/bank/bank-transaction.type").DocStatus;
                        amendedFromId: string | null;
                        postingDate: Date;
                        documentNo: string | null;
                        payments: {
                            id: string;
                            allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                            paymentDocument: string;
                            paymentEntryId: string;
                            paymentRowId: string | null;
                        }[];
                        bankAccountId: string;
                        unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                        deposit: import("@prisma/client-runtime-utils").Decimal;
                        withdrawal: import("@prisma/client-runtime-utils").Decimal;
                        allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                        referenceNumber: string | null;
                        transactionId: string | null;
                        pairedTransactionId: string | null;
                        importId: string | null;
                    };
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
        "bank-transactions": {
            import: {
                post: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            rulesSettled: number;
                            importId: string;
                            totalRows: number;
                            importedRows: number;
                            duplicateRows: number;
                            errorRows: number;
                            errors: {
                                rowNumber: number;
                                message: string;
                            }[];
                        };
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
        "bank-transactions": {
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
                            200: {
                                bankAccount: {
                                    accountName: string;
                                };
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                description: string | null;
                                currencyCode: string;
                                status: BankTransactionStatus;
                                partyType: string | null;
                                partyId: string | null;
                                docstatus: import("@/server/accounting/bank/bank-transaction.type").DocStatus;
                                amendedFromId: string | null;
                                postingDate: Date;
                                documentNo: string | null;
                                payments: {
                                    id: string;
                                    allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentDocument: string;
                                    paymentEntryId: string;
                                    paymentRowId: string | null;
                                }[];
                                bankAccountId: string;
                                unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                deposit: import("@prisma/client-runtime-utils").Decimal;
                                withdrawal: import("@prisma/client-runtime-utils").Decimal;
                                allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                referenceNumber: string | null;
                                transactionId: string | null;
                                pairedTransactionId: string | null;
                                importId: string | null;
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
        "bank-transactions": {
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
                            200: {
                                bankAccount: {
                                    accountName: string;
                                };
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                description: string | null;
                                currencyCode: string;
                                status: BankTransactionStatus;
                                partyType: string | null;
                                partyId: string | null;
                                docstatus: import("@/server/accounting/bank/bank-transaction.type").DocStatus;
                                amendedFromId: string | null;
                                postingDate: Date;
                                documentNo: string | null;
                                payments: {
                                    id: string;
                                    allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentDocument: string;
                                    paymentEntryId: string;
                                    paymentRowId: string | null;
                                }[];
                                bankAccountId: string;
                                unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                deposit: import("@prisma/client-runtime-utils").Decimal;
                                withdrawal: import("@prisma/client-runtime-utils").Decimal;
                                allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                referenceNumber: string | null;
                                transactionId: string | null;
                                pairedTransactionId: string | null;
                                importId: string | null;
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
        "bank-transactions": {
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
        "bank-transactions": {
            rules: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: ({
                            contraAccount: {
                                accountName: string;
                            };
                        } & {
                            priority: number;
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            bankAccountId: string | null;
                            ruleName: string;
                            descriptionContains: string | null;
                            direction: import("@/server/accounting/bank/bank-transaction.type").BankRuleDirection;
                            minAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            maxAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            contraAccountId: string;
                        })[];
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
        "bank-transactions": {
            rules: {
                post: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            priority: number;
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            bankAccountId: string | null;
                            ruleName: string;
                            descriptionContains: string | null;
                            direction: import("@/server/accounting/bank/bank-transaction.type").BankRuleDirection;
                            minAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            maxAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            contraAccountId: string;
                        };
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
        "bank-transactions": {
            rules: {
                ":ruleId": {
                    delete: {
                        body: {};
                        params: {
                            ruleId: string;
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
    };
} & {
    accounting: {
        "bank-transactions": {
            rules: {
                apply: {
                    post: {
                        body: {};
                        params: {};
                        query: {};
                        headers: {};
                        response: {
                            200: import("@/server/accounting/bank/bank-rules.service").RuleRunResult;
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
    };
} & {
    accounting: {
        "bank-transactions": {
            clearance: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        bankAccountId: string;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/bank/bank-clearance.service").ClearanceVoucherRow[];
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
        "bank-transactions": {
            clearance: {
                post: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            updated: number;
                        };
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
        "bank-transactions": {
            ":id": {
                candidates: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("@/server/accounting/bank/bank-reconciliation.service").ReconciliationCandidate[];
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
        "bank-transactions": {
            ":id": {
                allocate: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                bankAccount: {
                                    accountName: string;
                                };
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                description: string | null;
                                currencyCode: string;
                                status: BankTransactionStatus;
                                partyType: string | null;
                                partyId: string | null;
                                docstatus: import("@/server/accounting/bank/bank-transaction.type").DocStatus;
                                amendedFromId: string | null;
                                postingDate: Date;
                                documentNo: string | null;
                                payments: {
                                    id: string;
                                    allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentDocument: string;
                                    paymentEntryId: string;
                                    paymentRowId: string | null;
                                }[];
                                bankAccountId: string;
                                unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                deposit: import("@prisma/client-runtime-utils").Decimal;
                                withdrawal: import("@prisma/client-runtime-utils").Decimal;
                                allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                referenceNumber: string | null;
                                transactionId: string | null;
                                pairedTransactionId: string | null;
                                importId: string | null;
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
        "bank-transactions": {
            ":id": {
                unallocate: {
                    ":paymentId": {
                        post: {
                            body: {};
                            params: {
                                id: string;
                                paymentId: string;
                            };
                            query: {};
                            headers: {};
                            response: {
                                200: {
                                    bankAccount: {
                                        accountName: string;
                                    };
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    description: string | null;
                                    currencyCode: string;
                                    status: BankTransactionStatus;
                                    partyType: string | null;
                                    partyId: string | null;
                                    docstatus: import("@/server/accounting/bank/bank-transaction.type").DocStatus;
                                    amendedFromId: string | null;
                                    postingDate: Date;
                                    documentNo: string | null;
                                    payments: {
                                        id: string;
                                        allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                        paymentDocument: string;
                                        paymentEntryId: string;
                                        paymentRowId: string | null;
                                    }[];
                                    bankAccountId: string;
                                    unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                    deposit: import("@prisma/client-runtime-utils").Decimal;
                                    withdrawal: import("@prisma/client-runtime-utils").Decimal;
                                    allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                    referenceNumber: string | null;
                                    transactionId: string | null;
                                    pairedTransactionId: string | null;
                                    importId: string | null;
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
    };
} & {
    accounting: {
        "bank-transactions": {
            ":id": {
                "create-payment-entry": {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                bankAccount: {
                                    accountName: string;
                                };
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                description: string | null;
                                currencyCode: string;
                                status: BankTransactionStatus;
                                partyType: string | null;
                                partyId: string | null;
                                docstatus: import("@/server/accounting/bank/bank-transaction.type").DocStatus;
                                amendedFromId: string | null;
                                postingDate: Date;
                                documentNo: string | null;
                                payments: {
                                    id: string;
                                    allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentDocument: string;
                                    paymentEntryId: string;
                                    paymentRowId: string | null;
                                }[];
                                bankAccountId: string;
                                unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                deposit: import("@prisma/client-runtime-utils").Decimal;
                                withdrawal: import("@prisma/client-runtime-utils").Decimal;
                                allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                referenceNumber: string | null;
                                transactionId: string | null;
                                pairedTransactionId: string | null;
                                importId: string | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            409: {
                                readonly message: string;
                                readonly candidate: import("@/server/accounting/bank/bank-reconciliation.service").ReconciliationCandidate;
                            };
                            422: {
                                readonly message: "نوع الطرف ومعرّفه مطلوبان";
                            } | {
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
        "bank-transactions": {
            ":id": {
                "create-journal-entry": {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                bankAccount: {
                                    accountName: string;
                                };
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                description: string | null;
                                currencyCode: string;
                                status: BankTransactionStatus;
                                partyType: string | null;
                                partyId: string | null;
                                docstatus: import("@/server/accounting/bank/bank-transaction.type").DocStatus;
                                amendedFromId: string | null;
                                postingDate: Date;
                                documentNo: string | null;
                                payments: {
                                    id: string;
                                    allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentDocument: string;
                                    paymentEntryId: string;
                                    paymentRowId: string | null;
                                }[];
                                bankAccountId: string;
                                unallocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                deposit: import("@prisma/client-runtime-utils").Decimal;
                                withdrawal: import("@prisma/client-runtime-utils").Decimal;
                                allocatedAmount: import("@prisma/client-runtime-utils").Decimal;
                                referenceNumber: string | null;
                                transactionId: string | null;
                                pairedTransactionId: string | null;
                                importId: string | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            422: {
                                readonly message: "الحساب المقابل مطلوب";
                            } | {
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
        "bank-transactions": {
            ":id": {
                "internal-transfer": {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                transaction: import("@/server/accounting/bank/bank-transaction.type").BankTransactionResponse;
                                counterpartId: string;
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
