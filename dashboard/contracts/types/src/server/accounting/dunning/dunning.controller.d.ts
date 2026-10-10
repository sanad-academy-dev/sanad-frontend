import Elysia from "elysia";
import { DunningStatus } from "@/generated/prisma/enums";
export declare const dunningController: Elysia<"/accounting/dunning", {
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
        dunning: {};
    };
} & {
    accounting: {
        dunning: {
            types: {
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
                            incomeAccountId: string | null;
                            rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                            dunningFee: import("@prisma/client-runtime-utils").Decimal;
                            letterBody: string | null;
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
        dunning: {
            types: {
                post: {
                    body: {
                        disabled?: boolean | undefined;
                        incomeAccountId?: string | null | undefined;
                        letterBody?: string | null | undefined;
                        title: string;
                        rateOfInterest: string;
                        dunningFee: string;
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
                            incomeAccountId: string | null;
                            rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                            dunningFee: import("@prisma/client-runtime-utils").Decimal;
                            letterBody: string | null;
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
        dunning: {
            types: {
                ":id": {
                    put: {
                        body: {
                            disabled?: boolean | undefined;
                            incomeAccountId?: string | null | undefined;
                            letterBody?: string | null | undefined;
                            title: string;
                            rateOfInterest: string;
                            dunningFee: string;
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
                                incomeAccountId: string | null;
                                rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                                dunningFee: import("@prisma/client-runtime-utils").Decimal;
                                letterBody: string | null;
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
        dunning: {
            overdue: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        partyType?: string | undefined;
                        asOf?: string | undefined;
                        partyId: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/dunning/dunning.service").OverdueInvoiceRow[];
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
        dunning: {
            get: {
                body: {};
                params: {};
                query: {
                    status?: string | undefined;
                };
                headers: {};
                response: {
                    200: ({
                        type: {
                            id: string;
                            title: string;
                        } | null;
                        overdues: {
                            id: string;
                            dueDate: Date;
                            outstanding: import("@prisma/client-runtime-utils").Decimal;
                            salesInvoiceId: string;
                            invoiceNo: string;
                            overdueDays: number;
                            interest: import("@prisma/client-runtime-utils").Decimal;
                            dunningId: string;
                        }[];
                    } & {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        status: DunningStatus;
                        partyType: string;
                        partyId: string;
                        postingDate: Date;
                        journalEntryId: string | null;
                        rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                        dunningFee: import("@prisma/client-runtime-utils").Decimal;
                        typeId: string | null;
                        totalOutstanding: import("@prisma/client-runtime-utils").Decimal;
                        totalInterest: import("@prisma/client-runtime-utils").Decimal;
                        dunningAmount: import("@prisma/client-runtime-utils").Decimal;
                    })[];
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
        dunning: {
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
                            type: {
                                id: string;
                                clinicId: string;
                                disabled: boolean;
                                createdAt: Date;
                                updatedAt: Date;
                                title: string;
                                incomeAccountId: string | null;
                                rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                                dunningFee: import("@prisma/client-runtime-utils").Decimal;
                                letterBody: string | null;
                            } | null;
                            overdues: {
                                id: string;
                                dueDate: Date;
                                outstanding: import("@prisma/client-runtime-utils").Decimal;
                                salesInvoiceId: string;
                                invoiceNo: string;
                                overdueDays: number;
                                interest: import("@prisma/client-runtime-utils").Decimal;
                                dunningId: string;
                            }[];
                        } & {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            status: DunningStatus;
                            partyType: string;
                            partyId: string;
                            postingDate: Date;
                            journalEntryId: string | null;
                            rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                            dunningFee: import("@prisma/client-runtime-utils").Decimal;
                            typeId: string | null;
                            totalOutstanding: import("@prisma/client-runtime-utils").Decimal;
                            totalInterest: import("@prisma/client-runtime-utils").Decimal;
                            dunningAmount: import("@prisma/client-runtime-utils").Decimal;
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
        dunning: {
            post: {
                body: {
                    partyType?: string | undefined;
                    rateOfInterest?: string | null | undefined;
                    dunningFee?: string | null | undefined;
                    typeId?: string | null | undefined;
                    salesInvoiceIds?: string[] | undefined;
                    partyId: string;
                    postingDate: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        overdues: {
                            id: string;
                            dueDate: Date;
                            outstanding: import("@prisma/client-runtime-utils").Decimal;
                            salesInvoiceId: string;
                            invoiceNo: string;
                            overdueDays: number;
                            interest: import("@prisma/client-runtime-utils").Decimal;
                            dunningId: string;
                        }[];
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        status: DunningStatus;
                        partyType: string;
                        partyId: string;
                        postingDate: Date;
                        journalEntryId: string | null;
                        rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                        dunningFee: import("@prisma/client-runtime-utils").Decimal;
                        typeId: string | null;
                        totalOutstanding: import("@prisma/client-runtime-utils").Decimal;
                        totalInterest: import("@prisma/client-runtime-utils").Decimal;
                        dunningAmount: import("@prisma/client-runtime-utils").Decimal;
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
        dunning: {
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
                                overdues: {
                                    id: string;
                                    dueDate: Date;
                                    outstanding: import("@prisma/client-runtime-utils").Decimal;
                                    salesInvoiceId: string;
                                    invoiceNo: string;
                                    overdueDays: number;
                                    interest: import("@prisma/client-runtime-utils").Decimal;
                                    dunningId: string;
                                }[];
                            } & {
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                status: DunningStatus;
                                partyType: string;
                                partyId: string;
                                postingDate: Date;
                                journalEntryId: string | null;
                                rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                                dunningFee: import("@prisma/client-runtime-utils").Decimal;
                                typeId: string | null;
                                totalOutstanding: import("@prisma/client-runtime-utils").Decimal;
                                totalInterest: import("@prisma/client-runtime-utils").Decimal;
                                dunningAmount: import("@prisma/client-runtime-utils").Decimal;
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
        dunning: {
            ":id": {
                refresh: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                overdues: {
                                    salesInvoiceId: string;
                                }[];
                            } & {
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                status: DunningStatus;
                                partyType: string;
                                partyId: string;
                                postingDate: Date;
                                journalEntryId: string | null;
                                rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                                dunningFee: import("@prisma/client-runtime-utils").Decimal;
                                typeId: string | null;
                                totalOutstanding: import("@prisma/client-runtime-utils").Decimal;
                                totalInterest: import("@prisma/client-runtime-utils").Decimal;
                                dunningAmount: import("@prisma/client-runtime-utils").Decimal;
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
        dunning: {
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
                                status: DunningStatus;
                                partyType: string;
                                partyId: string;
                                postingDate: Date;
                                journalEntryId: string | null;
                                rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
                                dunningFee: import("@prisma/client-runtime-utils").Decimal;
                                typeId: string | null;
                                totalOutstanding: import("@prisma/client-runtime-utils").Decimal;
                                totalInterest: import("@prisma/client-runtime-utils").Decimal;
                                dunningAmount: import("@prisma/client-runtime-utils").Decimal;
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
