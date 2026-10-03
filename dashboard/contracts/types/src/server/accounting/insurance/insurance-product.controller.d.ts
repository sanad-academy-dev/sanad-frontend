import Elysia from "elysia";
export declare const insuranceProductController: Elysia<"/accounting/insurance-products", {
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
        "insurance-products": {};
    };
} & {
    accounting: {
        "insurance-products": {
            get: {
                body: {};
                params: {};
                query: {
                    insurerId?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        insurer: {
                            name: string;
                            id: string;
                        };
                        name: string;
                        id: string;
                        createdAt: Date;
                        _count: {
                            policies: number;
                        };
                        code: string;
                        active: boolean;
                        insurerId: string;
                        coveragePercentDefault: import("@prisma/client-runtime-utils").Decimal;
                        annualCap: import("@prisma/client-runtime-utils").Decimal | null;
                        perClaimCap: import("@prisma/client-runtime-utils").Decimal | null;
                        deductibleFixed: import("@prisma/client-runtime-utils").Decimal;
                        deductiblePercent: import("@prisma/client-runtime-utils").Decimal;
                        coverageRows: {
                            service: {
                                level: import("../../../../generated/prisma/enums").ServiceLevel;
                                name: string;
                                id: string;
                            };
                            id: string;
                            idx: number;
                            serviceId: string;
                            coveragePercent: import("@prisma/client-runtime-utils").Decimal;
                        }[];
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
        "insurance-products": {
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
                            insurer: {
                                name: string;
                                id: string;
                            };
                            name: string;
                            id: string;
                            createdAt: Date;
                            _count: {
                                policies: number;
                            };
                            code: string;
                            active: boolean;
                            insurerId: string;
                            coveragePercentDefault: import("@prisma/client-runtime-utils").Decimal;
                            annualCap: import("@prisma/client-runtime-utils").Decimal | null;
                            perClaimCap: import("@prisma/client-runtime-utils").Decimal | null;
                            deductibleFixed: import("@prisma/client-runtime-utils").Decimal;
                            deductiblePercent: import("@prisma/client-runtime-utils").Decimal;
                            coverageRows: {
                                service: {
                                    level: import("../../../../generated/prisma/enums").ServiceLevel;
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                idx: number;
                                serviceId: string;
                                coveragePercent: import("@prisma/client-runtime-utils").Decimal;
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
        "insurance-products": {
            post: {
                body: {
                    annualCap?: string | null | undefined;
                    perClaimCap?: string | null | undefined;
                    deductibleFixed?: string | undefined;
                    deductiblePercent?: string | undefined;
                    coverageRows?: {
                        serviceId: string;
                        coveragePercent: string;
                    }[] | undefined;
                    name: string;
                    insurerId: string;
                    coveragePercentDefault: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        insurer: {
                            name: string;
                            id: string;
                        };
                        name: string;
                        id: string;
                        createdAt: Date;
                        _count: {
                            policies: number;
                        };
                        code: string;
                        active: boolean;
                        insurerId: string;
                        coveragePercentDefault: import("@prisma/client-runtime-utils").Decimal;
                        annualCap: import("@prisma/client-runtime-utils").Decimal | null;
                        perClaimCap: import("@prisma/client-runtime-utils").Decimal | null;
                        deductibleFixed: import("@prisma/client-runtime-utils").Decimal;
                        deductiblePercent: import("@prisma/client-runtime-utils").Decimal;
                        coverageRows: {
                            service: {
                                level: import("../../../../generated/prisma/enums").ServiceLevel;
                                name: string;
                                id: string;
                            };
                            id: string;
                            idx: number;
                            serviceId: string;
                            coveragePercent: import("@prisma/client-runtime-utils").Decimal;
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
} & {
    accounting: {
        "insurance-products": {
            ":id": {
                put: {
                    body: {
                        annualCap?: string | null | undefined;
                        perClaimCap?: string | null | undefined;
                        deductibleFixed?: string | undefined;
                        deductiblePercent?: string | undefined;
                        coverageRows?: {
                            serviceId: string;
                            coveragePercent: string;
                        }[] | undefined;
                        name: string;
                        insurerId: string;
                        coveragePercentDefault: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            insurer: {
                                name: string;
                                id: string;
                            };
                            name: string;
                            id: string;
                            createdAt: Date;
                            _count: {
                                policies: number;
                            };
                            code: string;
                            active: boolean;
                            insurerId: string;
                            coveragePercentDefault: import("@prisma/client-runtime-utils").Decimal;
                            annualCap: import("@prisma/client-runtime-utils").Decimal | null;
                            perClaimCap: import("@prisma/client-runtime-utils").Decimal | null;
                            deductibleFixed: import("@prisma/client-runtime-utils").Decimal;
                            deductiblePercent: import("@prisma/client-runtime-utils").Decimal;
                            coverageRows: {
                                service: {
                                    level: import("../../../../generated/prisma/enums").ServiceLevel;
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                idx: number;
                                serviceId: string;
                                coveragePercent: import("@prisma/client-runtime-utils").Decimal;
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
        "insurance-products": {
            ":id": {
                status: {
                    post: {
                        body: {
                            active: boolean;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                insurer: {
                                    name: string;
                                    id: string;
                                };
                                name: string;
                                id: string;
                                createdAt: Date;
                                _count: {
                                    policies: number;
                                };
                                code: string;
                                active: boolean;
                                insurerId: string;
                                coveragePercentDefault: import("@prisma/client-runtime-utils").Decimal;
                                annualCap: import("@prisma/client-runtime-utils").Decimal | null;
                                perClaimCap: import("@prisma/client-runtime-utils").Decimal | null;
                                deductibleFixed: import("@prisma/client-runtime-utils").Decimal;
                                deductiblePercent: import("@prisma/client-runtime-utils").Decimal;
                                coverageRows: {
                                    service: {
                                        level: import("../../../../generated/prisma/enums").ServiceLevel;
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    idx: number;
                                    serviceId: string;
                                    coveragePercent: import("@prisma/client-runtime-utils").Decimal;
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
