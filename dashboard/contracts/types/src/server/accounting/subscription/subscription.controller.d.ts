import Elysia from "elysia";
import { SubscriptionInterval, SubscriptionStatus } from "@/generated/prisma/enums";
export declare const subscriptionController: Elysia<"/accounting/subscriptions", {
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
        subscriptions: {};
    };
} & {
    accounting: {
        subscriptions: {
            get: {
                body: {};
                params: {};
                query: {
                    status?: string | undefined;
                };
                headers: {};
                response: {
                    200: ({
                        _count: {
                            invoices: number;
                        };
                        plans: {
                            id: string;
                            rate: import("@prisma/client-runtime-utils").Decimal;
                            costCenterId: string;
                            incomeAccountId: string;
                            itemName: string;
                            qty: import("@prisma/client-runtime-utils").Decimal;
                            enableDeferredRevenue: boolean;
                            deferredAccountId: string | null;
                            subscriptionId: string;
                            firstPeriodOnly: boolean;
                        }[];
                    } & {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        status: SubscriptionStatus;
                        interval: SubscriptionInterval;
                        partyType: string;
                        partyId: string;
                        startDate: Date;
                        endDate: Date | null;
                        taxTemplateId: string | null;
                        intervalCount: number;
                        trialEndDate: Date | null;
                        lastInvoicedPeriodEnd: Date | null;
                        generateInvoiceAtPeriodStart: boolean;
                        daysUntilDue: number;
                        submitGeneratedInvoice: boolean;
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
        subscriptions: {
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
                            invoices: {
                                id: string;
                                createdAt: Date;
                                periodStartDate: Date;
                                periodEndDate: Date;
                                salesInvoiceId: string;
                                subscriptionId: string;
                            }[];
                            plans: {
                                id: string;
                                rate: import("@prisma/client-runtime-utils").Decimal;
                                costCenterId: string;
                                incomeAccountId: string;
                                itemName: string;
                                qty: import("@prisma/client-runtime-utils").Decimal;
                                enableDeferredRevenue: boolean;
                                deferredAccountId: string | null;
                                subscriptionId: string;
                                firstPeriodOnly: boolean;
                            }[];
                        } & {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            status: SubscriptionStatus;
                            interval: SubscriptionInterval;
                            partyType: string;
                            partyId: string;
                            startDate: Date;
                            endDate: Date | null;
                            taxTemplateId: string | null;
                            intervalCount: number;
                            trialEndDate: Date | null;
                            lastInvoicedPeriodEnd: Date | null;
                            generateInvoiceAtPeriodStart: boolean;
                            daysUntilDue: number;
                            submitGeneratedInvoice: boolean;
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
        subscriptions: {
            post: {
                body: {
                    partyType?: string | undefined;
                    endDate?: string | null | undefined;
                    taxTemplateId?: string | null | undefined;
                    trialEndDate?: string | null | undefined;
                    generateInvoiceAtPeriodStart?: boolean | undefined;
                    daysUntilDue?: number | undefined;
                    submitGeneratedInvoice?: boolean | undefined;
                    interval: "YEAR" | "MONTH" | "WEEK" | "DAY";
                    partyId: string;
                    startDate: string;
                    intervalCount: number;
                    plans: {
                        rate: string;
                        costCenterId: string;
                        incomeAccountId: string;
                        itemName: string;
                        qty: string;
                    }[];
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        plans: {
                            id: string;
                            rate: import("@prisma/client-runtime-utils").Decimal;
                            costCenterId: string;
                            incomeAccountId: string;
                            itemName: string;
                            qty: import("@prisma/client-runtime-utils").Decimal;
                            enableDeferredRevenue: boolean;
                            deferredAccountId: string | null;
                            subscriptionId: string;
                            firstPeriodOnly: boolean;
                        }[];
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        status: SubscriptionStatus;
                        interval: SubscriptionInterval;
                        partyType: string;
                        partyId: string;
                        startDate: Date;
                        endDate: Date | null;
                        taxTemplateId: string | null;
                        intervalCount: number;
                        trialEndDate: Date | null;
                        lastInvoicedPeriodEnd: Date | null;
                        generateInvoiceAtPeriodStart: boolean;
                        daysUntilDue: number;
                        submitGeneratedInvoice: boolean;
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
        subscriptions: {
            ":id": {
                put: {
                    body: {
                        partyType?: string | undefined;
                        endDate?: string | null | undefined;
                        taxTemplateId?: string | null | undefined;
                        trialEndDate?: string | null | undefined;
                        generateInvoiceAtPeriodStart?: boolean | undefined;
                        daysUntilDue?: number | undefined;
                        submitGeneratedInvoice?: boolean | undefined;
                        interval: "YEAR" | "MONTH" | "WEEK" | "DAY";
                        partyId: string;
                        startDate: string;
                        intervalCount: number;
                        plans: {
                            rate: string;
                            costCenterId: string;
                            incomeAccountId: string;
                            itemName: string;
                            qty: string;
                        }[];
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            plans: {
                                id: string;
                                rate: import("@prisma/client-runtime-utils").Decimal;
                                costCenterId: string;
                                incomeAccountId: string;
                                itemName: string;
                                qty: import("@prisma/client-runtime-utils").Decimal;
                                enableDeferredRevenue: boolean;
                                deferredAccountId: string | null;
                                subscriptionId: string;
                                firstPeriodOnly: boolean;
                            }[];
                        } & {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            status: SubscriptionStatus;
                            interval: SubscriptionInterval;
                            partyType: string;
                            partyId: string;
                            startDate: Date;
                            endDate: Date | null;
                            taxTemplateId: string | null;
                            intervalCount: number;
                            trialEndDate: Date | null;
                            lastInvoicedPeriodEnd: Date | null;
                            generateInvoiceAtPeriodStart: boolean;
                            daysUntilDue: number;
                            submitGeneratedInvoice: boolean;
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
        subscriptions: {
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
                                status: SubscriptionStatus;
                                interval: SubscriptionInterval;
                                partyType: string;
                                partyId: string;
                                startDate: Date;
                                endDate: Date | null;
                                taxTemplateId: string | null;
                                intervalCount: number;
                                trialEndDate: Date | null;
                                lastInvoicedPeriodEnd: Date | null;
                                generateInvoiceAtPeriodStart: boolean;
                                daysUntilDue: number;
                                submitGeneratedInvoice: boolean;
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
        subscriptions: {
            run: {
                post: {
                    body: {
                        asOf?: string | undefined;
                        subscriptionId?: string | undefined;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: import("@/server/accounting/subscription/subscription.service").SubscriptionRunResult;
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
