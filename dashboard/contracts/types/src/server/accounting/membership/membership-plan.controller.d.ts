import Elysia from "elysia";
import type { MembershipPlanStatus } from "@/generated/prisma/enums";
export declare const membershipPlanController: Elysia<"/accounting/membership-plans", {
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
        "membership-plans": {};
    };
} & {
    accounting: {
        "membership-plans": {
            get: {
                body: {};
                params: {};
                query: {
                    status?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        name: string;
                        id: string;
                        createdAt: Date;
                        _count: {
                            memberships: number;
                        };
                        description: string | null;
                        code: string;
                        status: MembershipPlanStatus;
                        benefits: {
                            service: {
                                name: string;
                                id: string;
                            } | null;
                            id: string;
                            idx: number;
                            labelAr: string | null;
                            serviceId: string | null;
                            discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            discountPercent: import("@prisma/client-runtime-utils").Decimal | null;
                            benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                            unitsPerPeriod: number | null;
                        }[];
                        tierRank: number;
                        billingInterval: import("@/generated/prisma/enums").SubscriptionInterval;
                        intervalCount: number;
                        fee: import("@prisma/client-runtime-utils").Decimal;
                        enrollmentFee: import("@prisma/client-runtime-utils").Decimal;
                        deferRevenue: boolean;
                        maxPatients: number | null;
                        autoRenew: boolean;
                        graceDays: number;
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
        "membership-plans": {
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
                            name: string;
                            id: string;
                            createdAt: Date;
                            _count: {
                                memberships: number;
                            };
                            description: string | null;
                            code: string;
                            status: MembershipPlanStatus;
                            benefits: {
                                service: {
                                    name: string;
                                    id: string;
                                } | null;
                                id: string;
                                idx: number;
                                labelAr: string | null;
                                serviceId: string | null;
                                discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                discountPercent: import("@prisma/client-runtime-utils").Decimal | null;
                                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                unitsPerPeriod: number | null;
                            }[];
                            tierRank: number;
                            billingInterval: import("@/generated/prisma/enums").SubscriptionInterval;
                            intervalCount: number;
                            fee: import("@prisma/client-runtime-utils").Decimal;
                            enrollmentFee: import("@prisma/client-runtime-utils").Decimal;
                            deferRevenue: boolean;
                            maxPatients: number | null;
                            autoRenew: boolean;
                            graceDays: number;
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
        "membership-plans": {
            post: {
                body: {
                    description?: string | null | undefined;
                    benefits?: {
                        labelAr?: string | null | undefined;
                        serviceId?: string | null | undefined;
                        discountAmount?: string | null | undefined;
                        discountPercent?: string | null | undefined;
                        unitsPerPeriod?: number | null | undefined;
                        benefitType: "SERVICE_DISCOUNT" | "PRODUCT_DISCOUNT" | "INCLUDED_UNITS" | "PRIORITY_BOOKING" | "PERK";
                    }[] | undefined;
                    tierRank?: number | undefined;
                    intervalCount?: number | undefined;
                    enrollmentFee?: string | undefined;
                    deferRevenue?: boolean | undefined;
                    maxPatients?: number | null | undefined;
                    autoRenew?: boolean | undefined;
                    graceDays?: number | undefined;
                    name: string;
                    billingInterval: "YEAR" | "MONTH";
                    fee: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        readonly valueAssessment: {
                            estimatedValue: string;
                            fee: string;
                            belowValue: boolean;
                            partial: boolean;
                        };
                        readonly name: string;
                        readonly id: string;
                        readonly createdAt: Date;
                        readonly _count: {
                            memberships: number;
                        };
                        readonly description: string | null;
                        readonly code: string;
                        readonly status: MembershipPlanStatus;
                        readonly benefits: {
                            service: {
                                name: string;
                                id: string;
                            } | null;
                            id: string;
                            idx: number;
                            labelAr: string | null;
                            serviceId: string | null;
                            discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            discountPercent: import("@prisma/client-runtime-utils").Decimal | null;
                            benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                            unitsPerPeriod: number | null;
                        }[];
                        readonly tierRank: number;
                        readonly billingInterval: import("@/generated/prisma/enums").SubscriptionInterval;
                        readonly intervalCount: number;
                        readonly fee: import("@prisma/client-runtime-utils").Decimal;
                        readonly enrollmentFee: import("@prisma/client-runtime-utils").Decimal;
                        readonly deferRevenue: boolean;
                        readonly maxPatients: number | null;
                        readonly autoRenew: boolean;
                        readonly graceDays: number;
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
        "membership-plans": {
            ":id": {
                put: {
                    body: {
                        description?: string | null | undefined;
                        benefits?: {
                            labelAr?: string | null | undefined;
                            serviceId?: string | null | undefined;
                            discountAmount?: string | null | undefined;
                            discountPercent?: string | null | undefined;
                            unitsPerPeriod?: number | null | undefined;
                            benefitType: "SERVICE_DISCOUNT" | "PRODUCT_DISCOUNT" | "INCLUDED_UNITS" | "PRIORITY_BOOKING" | "PERK";
                        }[] | undefined;
                        tierRank?: number | undefined;
                        intervalCount?: number | undefined;
                        enrollmentFee?: string | undefined;
                        deferRevenue?: boolean | undefined;
                        maxPatients?: number | null | undefined;
                        autoRenew?: boolean | undefined;
                        graceDays?: number | undefined;
                        name: string;
                        billingInterval: "YEAR" | "MONTH";
                        fee: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            valueAssessment: {
                                estimatedValue: string;
                                fee: string;
                                belowValue: boolean;
                                partial: boolean;
                            };
                            name: string;
                            id: string;
                            createdAt: Date;
                            _count: {
                                memberships: number;
                            };
                            description: string | null;
                            code: string;
                            status: MembershipPlanStatus;
                            benefits: {
                                service: {
                                    name: string;
                                    id: string;
                                } | null;
                                id: string;
                                idx: number;
                                labelAr: string | null;
                                serviceId: string | null;
                                discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                discountPercent: import("@prisma/client-runtime-utils").Decimal | null;
                                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                unitsPerPeriod: number | null;
                            }[];
                            tierRank: number;
                            billingInterval: import("@/generated/prisma/enums").SubscriptionInterval;
                            intervalCount: number;
                            fee: import("@prisma/client-runtime-utils").Decimal;
                            enrollmentFee: import("@prisma/client-runtime-utils").Decimal;
                            deferRevenue: boolean;
                            maxPatients: number | null;
                            autoRenew: boolean;
                            graceDays: number;
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
        "membership-plans": {
            ":id": {
                status: {
                    post: {
                        body: {
                            status: "ACTIVE" | "INACTIVE";
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                name: string;
                                id: string;
                                createdAt: Date;
                                _count: {
                                    memberships: number;
                                };
                                description: string | null;
                                code: string;
                                status: MembershipPlanStatus;
                                benefits: {
                                    service: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    id: string;
                                    idx: number;
                                    labelAr: string | null;
                                    serviceId: string | null;
                                    discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                    discountPercent: import("@prisma/client-runtime-utils").Decimal | null;
                                    benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                    unitsPerPeriod: number | null;
                                }[];
                                tierRank: number;
                                billingInterval: import("@/generated/prisma/enums").SubscriptionInterval;
                                intervalCount: number;
                                fee: import("@prisma/client-runtime-utils").Decimal;
                                enrollmentFee: import("@prisma/client-runtime-utils").Decimal;
                                deferRevenue: boolean;
                                maxPatients: number | null;
                                autoRenew: boolean;
                                graceDays: number;
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
