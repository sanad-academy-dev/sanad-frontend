import Elysia from "elysia";
export declare const exchangeRateRevaluationController: Elysia<"/accounting/exchange-rate-revaluations", {
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
        "exchange-rate-revaluations": {};
    };
} & {
    accounting: {
        "exchange-rate-revaluations": {
            scan: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        date: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/exchange-rate-revaluation/exchange-rate-revaluation.service").ErrScanRow[];
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
        "exchange-rate-revaluations": {
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
                        docstatus: import("@/server/accounting/exchange-rate-revaluation/exchange-rate-revaluation.type").DocStatus;
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
                            };
                            id: string;
                            accountCurrencyCode: string;
                            idx: number;
                            accountId: string;
                            partyType: string | null;
                            partyId: string | null;
                            balanceInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                            bookedBase: import("@prisma/client-runtime-utils").Decimal;
                            currentExchangeRate: import("@prisma/client-runtime-utils").Decimal;
                            newBase: import("@prisma/client-runtime-utils").Decimal;
                            gainLoss: import("@prisma/client-runtime-utils").Decimal;
                            isZeroForeignSweep: boolean;
                        }[];
                        documentNo: string | null;
                        journalEntryId: string | null;
                        roundingLossAllowance: import("@prisma/client-runtime-utils").Decimal;
                        totalGainLoss: import("@prisma/client-runtime-utils").Decimal;
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
        "exchange-rate-revaluations": {
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
                            docstatus: import("@/server/accounting/exchange-rate-revaluation/exchange-rate-revaluation.type").DocStatus;
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
                                };
                                id: string;
                                accountCurrencyCode: string;
                                idx: number;
                                accountId: string;
                                partyType: string | null;
                                partyId: string | null;
                                balanceInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                bookedBase: import("@prisma/client-runtime-utils").Decimal;
                                currentExchangeRate: import("@prisma/client-runtime-utils").Decimal;
                                newBase: import("@prisma/client-runtime-utils").Decimal;
                                gainLoss: import("@prisma/client-runtime-utils").Decimal;
                                isZeroForeignSweep: boolean;
                            }[];
                            documentNo: string | null;
                            journalEntryId: string | null;
                            roundingLossAllowance: import("@prisma/client-runtime-utils").Decimal;
                            totalGainLoss: import("@prisma/client-runtime-utils").Decimal;
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
        "exchange-rate-revaluations": {
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
                        docstatus: import("@/server/accounting/exchange-rate-revaluation/exchange-rate-revaluation.type").DocStatus;
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
                            };
                            id: string;
                            accountCurrencyCode: string;
                            idx: number;
                            accountId: string;
                            partyType: string | null;
                            partyId: string | null;
                            balanceInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                            bookedBase: import("@prisma/client-runtime-utils").Decimal;
                            currentExchangeRate: import("@prisma/client-runtime-utils").Decimal;
                            newBase: import("@prisma/client-runtime-utils").Decimal;
                            gainLoss: import("@prisma/client-runtime-utils").Decimal;
                            isZeroForeignSweep: boolean;
                        }[];
                        documentNo: string | null;
                        journalEntryId: string | null;
                        roundingLossAllowance: import("@prisma/client-runtime-utils").Decimal;
                        totalGainLoss: import("@prisma/client-runtime-utils").Decimal;
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
        "exchange-rate-revaluations": {
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
        "exchange-rate-revaluations": {
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
                                docstatus: import("@/server/accounting/exchange-rate-revaluation/exchange-rate-revaluation.type").DocStatus;
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
                                    };
                                    id: string;
                                    accountCurrencyCode: string;
                                    idx: number;
                                    accountId: string;
                                    partyType: string | null;
                                    partyId: string | null;
                                    balanceInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                    bookedBase: import("@prisma/client-runtime-utils").Decimal;
                                    currentExchangeRate: import("@prisma/client-runtime-utils").Decimal;
                                    newBase: import("@prisma/client-runtime-utils").Decimal;
                                    gainLoss: import("@prisma/client-runtime-utils").Decimal;
                                    isZeroForeignSweep: boolean;
                                }[];
                                documentNo: string | null;
                                journalEntryId: string | null;
                                roundingLossAllowance: import("@prisma/client-runtime-utils").Decimal;
                                totalGainLoss: import("@prisma/client-runtime-utils").Decimal;
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
        "exchange-rate-revaluations": {
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
                                docstatus: import("@/server/accounting/exchange-rate-revaluation/exchange-rate-revaluation.type").DocStatus;
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
                                    };
                                    id: string;
                                    accountCurrencyCode: string;
                                    idx: number;
                                    accountId: string;
                                    partyType: string | null;
                                    partyId: string | null;
                                    balanceInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                    bookedBase: import("@prisma/client-runtime-utils").Decimal;
                                    currentExchangeRate: import("@prisma/client-runtime-utils").Decimal;
                                    newBase: import("@prisma/client-runtime-utils").Decimal;
                                    gainLoss: import("@prisma/client-runtime-utils").Decimal;
                                    isZeroForeignSweep: boolean;
                                }[];
                                documentNo: string | null;
                                journalEntryId: string | null;
                                roundingLossAllowance: import("@prisma/client-runtime-utils").Decimal;
                                totalGainLoss: import("@prisma/client-runtime-utils").Decimal;
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
        "exchange-rate-revaluations": {
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
                                docstatus: import("@/server/accounting/exchange-rate-revaluation/exchange-rate-revaluation.type").DocStatus;
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
                                    };
                                    id: string;
                                    accountCurrencyCode: string;
                                    idx: number;
                                    accountId: string;
                                    partyType: string | null;
                                    partyId: string | null;
                                    balanceInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
                                    bookedBase: import("@prisma/client-runtime-utils").Decimal;
                                    currentExchangeRate: import("@prisma/client-runtime-utils").Decimal;
                                    newBase: import("@prisma/client-runtime-utils").Decimal;
                                    gainLoss: import("@prisma/client-runtime-utils").Decimal;
                                    isZeroForeignSweep: boolean;
                                }[];
                                documentNo: string | null;
                                journalEntryId: string | null;
                                roundingLossAllowance: import("@prisma/client-runtime-utils").Decimal;
                                totalGainLoss: import("@prisma/client-runtime-utils").Decimal;
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
