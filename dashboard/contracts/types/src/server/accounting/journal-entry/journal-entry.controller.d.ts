import Elysia from "elysia";
export declare const journalEntryController: Elysia<"/accounting/journal-entries", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "accounting-journal-entry.list": import("@sinclair/typebox").TObject<{
            docstatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"SUBMITTED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            voucherType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "accounting-journal-entry.create": import("@sinclair/typebox").TObject<{
            voucherType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            postingDate: import("@sinclair/typebox").TString;
            chequeNo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            chequeDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            remark: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            rows: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                accountId: import("@sinclair/typebox").TString;
                debit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                credit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                dim1: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                dim2: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                dim3: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                dim4: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                userRemark: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            }>>;
        }>;
        readonly "accounting-journal-entry.update": import("@sinclair/typebox").TObject<{
            voucherType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            postingDate: import("@sinclair/typebox").TString;
            chequeNo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            chequeDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            remark: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            rows: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                accountId: import("@sinclair/typebox").TString;
                debit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                credit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                dim1: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                dim2: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                dim3: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                dim4: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                userRemark: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            }>>;
        }>;
        readonly "accounting-journal-entry.template-create": import("@sinclair/typebox").TObject<{
            templateTitle: import("@sinclair/typebox").TString;
            voucherType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            accountIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
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
        "journal-entries": {};
    };
} & {
    accounting: {
        "journal-entries": {
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
                            accountIds: string[];
                            voucherType: string;
                            templateTitle: string;
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
        "journal-entries": {
            templates: {
                post: {
                    body: {
                        voucherType?: string | undefined;
                        accountIds: string[];
                        templateTitle: string;
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
                            accountIds: string[];
                            voucherType: string;
                            templateTitle: string;
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
        "journal-entries": {
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
                            204: "No Content";
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "القالب غير موجود";
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
        "journal-entries": {
            get: {
                body: {};
                params: {};
                query: {
                    limit?: number | undefined;
                    docstatus?: "DRAFT" | "SUBMITTED" | "CANCELLED" | undefined;
                    voucherType?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        docstatus: import("@/server/accounting/journal-entry/journal-entry.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        postingDate: Date;
                        rows: {
                            account: {
                                accountName: string;
                                accountNumber: string | null;
                                accountType: import("../../../../generated/prisma/enums").AccountType | null;
                            };
                            id: string;
                            idx: number;
                            costCenterId: string | null;
                            accountId: string;
                            debit: import("@prisma/client-runtime-utils").Decimal;
                            credit: import("@prisma/client-runtime-utils").Decimal;
                            debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                            creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                            partyType: string | null;
                            partyId: string | null;
                            dim1: string | null;
                            dim2: string | null;
                            dim3: string | null;
                            dim4: string | null;
                            userRemark: string | null;
                            exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                            referenceType: string | null;
                            referenceId: string | null;
                        }[];
                        voucherType: string;
                        documentNo: string | null;
                        chequeNo: string | null;
                        chequeDate: Date | null;
                        remark: string | null;
                        multiCurrency: boolean;
                        isSystemGenerated: boolean;
                        totalDebit: import("@prisma/client-runtime-utils").Decimal;
                        totalCredit: import("@prisma/client-runtime-utils").Decimal;
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
        "journal-entries": {
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
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            docstatus: import("@/server/accounting/journal-entry/journal-entry.type").DocStatus;
                            amendedFromId: string | null;
                            submittedAt: Date | null;
                            submittedById: string | null;
                            cancelledAt: Date | null;
                            cancelledById: string | null;
                            postingDate: Date;
                            rows: {
                                account: {
                                    accountName: string;
                                    accountNumber: string | null;
                                    accountType: import("../../../../generated/prisma/enums").AccountType | null;
                                };
                                id: string;
                                idx: number;
                                costCenterId: string | null;
                                accountId: string;
                                debit: import("@prisma/client-runtime-utils").Decimal;
                                credit: import("@prisma/client-runtime-utils").Decimal;
                                debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                partyType: string | null;
                                partyId: string | null;
                                dim1: string | null;
                                dim2: string | null;
                                dim3: string | null;
                                dim4: string | null;
                                userRemark: string | null;
                                exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                                referenceType: string | null;
                                referenceId: string | null;
                            }[];
                            voucherType: string;
                            documentNo: string | null;
                            chequeNo: string | null;
                            chequeDate: Date | null;
                            remark: string | null;
                            multiCurrency: boolean;
                            isSystemGenerated: boolean;
                            totalDebit: import("@prisma/client-runtime-utils").Decimal;
                            totalCredit: import("@prisma/client-runtime-utils").Decimal;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "المستند غير موجود";
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
        "journal-entries": {
            post: {
                body: {
                    voucherType?: string | undefined;
                    chequeNo?: string | null | undefined;
                    chequeDate?: string | null | undefined;
                    remark?: string | null | undefined;
                    postingDate: string;
                    rows: {
                        costCenterId?: string | null | undefined;
                        debit?: string | undefined;
                        credit?: string | undefined;
                        dim1?: string | null | undefined;
                        dim2?: string | null | undefined;
                        dim3?: string | null | undefined;
                        dim4?: string | null | undefined;
                        userRemark?: string | null | undefined;
                        accountId: string;
                    }[];
                };
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
                        docstatus: import("@/server/accounting/journal-entry/journal-entry.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        postingDate: Date;
                        rows: {
                            account: {
                                accountName: string;
                                accountNumber: string | null;
                                accountType: import("../../../../generated/prisma/enums").AccountType | null;
                            };
                            id: string;
                            idx: number;
                            costCenterId: string | null;
                            accountId: string;
                            debit: import("@prisma/client-runtime-utils").Decimal;
                            credit: import("@prisma/client-runtime-utils").Decimal;
                            debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                            creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                            partyType: string | null;
                            partyId: string | null;
                            dim1: string | null;
                            dim2: string | null;
                            dim3: string | null;
                            dim4: string | null;
                            userRemark: string | null;
                            exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                            referenceType: string | null;
                            referenceId: string | null;
                        }[];
                        voucherType: string;
                        documentNo: string | null;
                        chequeNo: string | null;
                        chequeDate: Date | null;
                        remark: string | null;
                        multiCurrency: boolean;
                        isSystemGenerated: boolean;
                        totalDebit: import("@prisma/client-runtime-utils").Decimal;
                        totalCredit: import("@prisma/client-runtime-utils").Decimal;
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
        "journal-entries": {
            ":id": {
                patch: {
                    body: {
                        voucherType?: string | undefined;
                        chequeNo?: string | null | undefined;
                        chequeDate?: string | null | undefined;
                        remark?: string | null | undefined;
                        postingDate: string;
                        rows: {
                            costCenterId?: string | null | undefined;
                            debit?: string | undefined;
                            credit?: string | undefined;
                            dim1?: string | null | undefined;
                            dim2?: string | null | undefined;
                            dim3?: string | null | undefined;
                            dim4?: string | null | undefined;
                            userRemark?: string | null | undefined;
                            accountId: string;
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
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            docstatus: import("@/server/accounting/journal-entry/journal-entry.type").DocStatus;
                            amendedFromId: string | null;
                            submittedAt: Date | null;
                            submittedById: string | null;
                            cancelledAt: Date | null;
                            cancelledById: string | null;
                            postingDate: Date;
                            rows: {
                                account: {
                                    accountName: string;
                                    accountNumber: string | null;
                                    accountType: import("../../../../generated/prisma/enums").AccountType | null;
                                };
                                id: string;
                                idx: number;
                                costCenterId: string | null;
                                accountId: string;
                                debit: import("@prisma/client-runtime-utils").Decimal;
                                credit: import("@prisma/client-runtime-utils").Decimal;
                                debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                partyType: string | null;
                                partyId: string | null;
                                dim1: string | null;
                                dim2: string | null;
                                dim3: string | null;
                                dim4: string | null;
                                userRemark: string | null;
                                exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                                referenceType: string | null;
                                referenceId: string | null;
                            }[];
                            voucherType: string;
                            documentNo: string | null;
                            chequeNo: string | null;
                            chequeDate: Date | null;
                            remark: string | null;
                            multiCurrency: boolean;
                            isSystemGenerated: boolean;
                            totalDebit: import("@prisma/client-runtime-utils").Decimal;
                            totalCredit: import("@prisma/client-runtime-utils").Decimal;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "المستند غير موجود";
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
        "journal-entries": {
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
        "journal-entries": {
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
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                docstatus: import("@/server/accounting/journal-entry/journal-entry.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                postingDate: Date;
                                rows: {
                                    account: {
                                        accountName: string;
                                        accountNumber: string | null;
                                        accountType: import("../../../../generated/prisma/enums").AccountType | null;
                                    };
                                    id: string;
                                    idx: number;
                                    costCenterId: string | null;
                                    accountId: string;
                                    debit: import("@prisma/client-runtime-utils").Decimal;
                                    credit: import("@prisma/client-runtime-utils").Decimal;
                                    debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                    creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                    partyType: string | null;
                                    partyId: string | null;
                                    dim1: string | null;
                                    dim2: string | null;
                                    dim3: string | null;
                                    dim4: string | null;
                                    userRemark: string | null;
                                    exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                                    referenceType: string | null;
                                    referenceId: string | null;
                                }[];
                                voucherType: string;
                                documentNo: string | null;
                                chequeNo: string | null;
                                chequeDate: Date | null;
                                remark: string | null;
                                multiCurrency: boolean;
                                isSystemGenerated: boolean;
                                totalDebit: import("@prisma/client-runtime-utils").Decimal;
                                totalCredit: import("@prisma/client-runtime-utils").Decimal;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "المستند غير موجود";
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
        "journal-entries": {
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
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                docstatus: import("@/server/accounting/journal-entry/journal-entry.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                postingDate: Date;
                                rows: {
                                    account: {
                                        accountName: string;
                                        accountNumber: string | null;
                                        accountType: import("../../../../generated/prisma/enums").AccountType | null;
                                    };
                                    id: string;
                                    idx: number;
                                    costCenterId: string | null;
                                    accountId: string;
                                    debit: import("@prisma/client-runtime-utils").Decimal;
                                    credit: import("@prisma/client-runtime-utils").Decimal;
                                    debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                    creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                    partyType: string | null;
                                    partyId: string | null;
                                    dim1: string | null;
                                    dim2: string | null;
                                    dim3: string | null;
                                    dim4: string | null;
                                    userRemark: string | null;
                                    exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                                    referenceType: string | null;
                                    referenceId: string | null;
                                }[];
                                voucherType: string;
                                documentNo: string | null;
                                chequeNo: string | null;
                                chequeDate: Date | null;
                                remark: string | null;
                                multiCurrency: boolean;
                                isSystemGenerated: boolean;
                                totalDebit: import("@prisma/client-runtime-utils").Decimal;
                                totalCredit: import("@prisma/client-runtime-utils").Decimal;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "المستند غير موجود";
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
        "journal-entries": {
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
                            200: {
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                docstatus: import("@/server/accounting/journal-entry/journal-entry.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                postingDate: Date;
                                rows: {
                                    account: {
                                        accountName: string;
                                        accountNumber: string | null;
                                        accountType: import("../../../../generated/prisma/enums").AccountType | null;
                                    };
                                    id: string;
                                    idx: number;
                                    costCenterId: string | null;
                                    accountId: string;
                                    debit: import("@prisma/client-runtime-utils").Decimal;
                                    credit: import("@prisma/client-runtime-utils").Decimal;
                                    debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                    creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                    partyType: string | null;
                                    partyId: string | null;
                                    dim1: string | null;
                                    dim2: string | null;
                                    dim3: string | null;
                                    dim4: string | null;
                                    userRemark: string | null;
                                    exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                                    referenceType: string | null;
                                    referenceId: string | null;
                                }[];
                                voucherType: string;
                                documentNo: string | null;
                                chequeNo: string | null;
                                chequeDate: Date | null;
                                remark: string | null;
                                multiCurrency: boolean;
                                isSystemGenerated: boolean;
                                totalDebit: import("@prisma/client-runtime-utils").Decimal;
                                totalCredit: import("@prisma/client-runtime-utils").Decimal;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "المستند غير موجود";
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
