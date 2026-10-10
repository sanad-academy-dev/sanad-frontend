import Elysia from "elysia";
import type { PsoaFrequency, PsoaReportType } from "@/generated/prisma/enums";
export declare const psoaController: Elysia<"/accounting/statements-of-accounts", {
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
        "statements-of-accounts": {};
    };
} & {
    accounting: {
        "statements-of-accounts": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: ({
                        customers: {
                            id: string;
                            email: string | null;
                            partyType: string;
                            partyId: string;
                            psoaId: string;
                        }[];
                    } & {
                        subject: string | null;
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        reportType: PsoaReportType;
                        enabled: boolean;
                        title: string;
                        fromDate: Date | null;
                        toDate: Date | null;
                        frequency: PsoaFrequency;
                        bodyText: string | null;
                        ccEmails: string[];
                        lastSentAt: Date | null;
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
} & {
    accounting: {
        "statements-of-accounts": {
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
                            customers: {
                                id: string;
                                email: string | null;
                                partyType: string;
                                partyId: string;
                                psoaId: string;
                            }[];
                        } & {
                            subject: string | null;
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            reportType: PsoaReportType;
                            enabled: boolean;
                            title: string;
                            fromDate: Date | null;
                            toDate: Date | null;
                            frequency: PsoaFrequency;
                            bodyText: string | null;
                            ccEmails: string[];
                            lastSentAt: Date | null;
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
        "statements-of-accounts": {
            post: {
                body: {
                    subject?: string | null | undefined;
                    enabled?: boolean | undefined;
                    fromDate?: string | null | undefined;
                    toDate?: string | null | undefined;
                    bodyText?: string | null | undefined;
                    ccEmails?: string[] | undefined;
                    reportType: "PARTY_LEDGER" | "RECEIVABLE_AGEING";
                    title: string;
                    frequency: "MANUAL" | "WEEKLY" | "MONTHLY" | "QUARTERLY";
                    customers: {
                        email?: string | null | undefined;
                        partyType: string;
                        partyId: string;
                    }[];
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        customers: {
                            id: string;
                            email: string | null;
                            partyType: string;
                            partyId: string;
                            psoaId: string;
                        }[];
                        subject: string | null;
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        reportType: PsoaReportType;
                        enabled: boolean;
                        title: string;
                        fromDate: Date | null;
                        toDate: Date | null;
                        frequency: PsoaFrequency;
                        bodyText: string | null;
                        ccEmails: string[];
                        lastSentAt: Date | null;
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
        "statements-of-accounts": {
            ":id": {
                put: {
                    body: {
                        subject?: string | null | undefined;
                        enabled?: boolean | undefined;
                        fromDate?: string | null | undefined;
                        toDate?: string | null | undefined;
                        bodyText?: string | null | undefined;
                        ccEmails?: string[] | undefined;
                        reportType: "PARTY_LEDGER" | "RECEIVABLE_AGEING";
                        title: string;
                        frequency: "MANUAL" | "WEEKLY" | "MONTHLY" | "QUARTERLY";
                        customers: {
                            email?: string | null | undefined;
                            partyType: string;
                            partyId: string;
                        }[];
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            customers: {
                                id: string;
                                email: string | null;
                                partyType: string;
                                partyId: string;
                                psoaId: string;
                            }[];
                        } & {
                            subject: string | null;
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            reportType: PsoaReportType;
                            enabled: boolean;
                            title: string;
                            fromDate: Date | null;
                            toDate: Date | null;
                            frequency: PsoaFrequency;
                            bodyText: string | null;
                            ccEmails: string[];
                            lastSentAt: Date | null;
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
        "statements-of-accounts": {
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
        "statements-of-accounts": {
            ":id": {
                preview: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {
                            asOf?: string | undefined;
                        };
                        headers: {};
                        response: {
                            200: import("@/server/accounting/psoa/psoa.service").CustomerStatement[];
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
        "statements-of-accounts": {
            ":id": {
                send: {
                    post: {
                        body: {
                            asOf?: string | undefined;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("@/server/accounting/psoa/psoa.service").SendStatementsResult;
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
