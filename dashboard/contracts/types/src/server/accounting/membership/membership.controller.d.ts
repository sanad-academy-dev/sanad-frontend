import Elysia from "elysia";
import type { MembershipStatus } from "@/generated/prisma/enums";
export declare const membershipController: Elysia<"/accounting/memberships", {
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
        memberships: {};
    };
} & {
    accounting: {
        memberships: {
            get: {
                body: {};
                params: {};
                query: {
                    status?: string | undefined;
                    ownerId?: string | undefined;
                    planId?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        owner: {
                            name: string;
                            id: string;
                            phone: string;
                            code: string;
                        };
                        subscription: {
                            startDate: Date;
                        };
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        code: string;
                        plan: {
                            name: string;
                            id: string;
                            status: import("@/generated/prisma/enums").MembershipPlanStatus;
                            tierRank: number;
                        };
                        status: MembershipStatus;
                        cancelledAt: Date | null;
                        ownerId: string;
                        cancelReason: string | null;
                        planId: string;
                        subscriptionId: string;
                        currentPeriodStart: Date;
                        currentPeriodEnd: Date;
                        feeSnapshot: import("@prisma/client-runtime-utils").Decimal;
                        intervalSnapshot: import("@/generated/prisma/enums").SubscriptionInterval;
                        intervalCountSnapshot: number;
                        graceDaysSnapshot: number;
                        autoRenewSnapshot: boolean;
                        scheduledPlanId: string | null;
                        scheduledPlan: {
                            name: string;
                            id: string;
                        } | null;
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
        memberships: {
            "by-owner": {
                ":ownerId": {
                    get: {
                        body: {};
                        params: {
                            ownerId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                membership: import("@/server/accounting/membership/membership.type").MembershipDetailResponse | null;
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
        memberships: {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("@/server/accounting/membership/membership.type").MembershipDetailResponse;
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
        memberships: {
            post: {
                body: {
                    ownerId: string;
                    planId: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        membership: import("@/server/accounting/membership/membership.type").MembershipDetailResponse;
                        billingError: string | null;
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
        memberships: {
            ":id": {
                cancel: {
                    post: {
                        body: {
                            reason: string;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("@/server/accounting/membership/membership.type").MembershipDetailResponse;
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
        memberships: {
            ":id": {
                "schedule-plan-change": {
                    post: {
                        body: {
                            planId: string;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("@/server/accounting/membership/membership.type").MembershipDetailResponse;
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
        memberships: {
            run: {
                post: {
                    body: {
                        asOf?: string | undefined;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            policiesExpired: number;
                            billed: number;
                            rolled: number;
                            statusChanges: {
                                membershipId: string;
                                from: MembershipStatus;
                                to: MembershipStatus;
                            }[];
                            errors: {
                                membershipId: string;
                                message: string;
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
