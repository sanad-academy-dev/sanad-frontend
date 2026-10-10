import Elysia from "elysia";
export declare const patientPolicyController: Elysia<"/accounting/patient-policies", {
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
        "patient-policies": {};
    };
} & {
    accounting: {
        "patient-policies": {
            get: {
                body: {};
                params: {};
                query: {
                    patientId?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        patient: {
                            owner: {
                                name: string;
                                id: string;
                            } | null;
                            name: string;
                            id: string;
                        };
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        notes: string | null;
                        status: import("../../../../generated/prisma/enums").PatientPolicyStatus;
                        patientId: string;
                        productId: string;
                        policyNumber: string;
                        policyStart: Date;
                        policyEnd: Date;
                        capConsumed: import("@prisma/client-runtime-utils").Decimal;
                        product: {
                            insurer: {
                                name: string;
                                id: string;
                            };
                            name: string;
                            id: string;
                            coveragePercentDefault: import("@prisma/client-runtime-utils").Decimal;
                            annualCap: import("@prisma/client-runtime-utils").Decimal | null;
                        };
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
        "patient-policies": {
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
                            patient: {
                                owner: {
                                    name: string;
                                    id: string;
                                } | null;
                                name: string;
                                id: string;
                            };
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            notes: string | null;
                            status: import("../../../../generated/prisma/enums").PatientPolicyStatus;
                            patientId: string;
                            productId: string;
                            policyNumber: string;
                            policyStart: Date;
                            policyEnd: Date;
                            capConsumed: import("@prisma/client-runtime-utils").Decimal;
                            product: {
                                insurer: {
                                    name: string;
                                    id: string;
                                };
                                name: string;
                                id: string;
                                coveragePercentDefault: import("@prisma/client-runtime-utils").Decimal;
                                annualCap: import("@prisma/client-runtime-utils").Decimal | null;
                            };
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
        "patient-policies": {
            post: {
                body: {
                    notes?: string | null | undefined;
                    status?: "ACTIVE" | "CANCELLED" | "SUSPENDED" | undefined;
                    patientId: string;
                    productId: string;
                    policyNumber: string;
                    policyStart: string;
                    policyEnd: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        patient: {
                            owner: {
                                name: string;
                                id: string;
                            } | null;
                            name: string;
                            id: string;
                        };
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        notes: string | null;
                        status: import("../../../../generated/prisma/enums").PatientPolicyStatus;
                        patientId: string;
                        productId: string;
                        policyNumber: string;
                        policyStart: Date;
                        policyEnd: Date;
                        capConsumed: import("@prisma/client-runtime-utils").Decimal;
                        product: {
                            insurer: {
                                name: string;
                                id: string;
                            };
                            name: string;
                            id: string;
                            coveragePercentDefault: import("@prisma/client-runtime-utils").Decimal;
                            annualCap: import("@prisma/client-runtime-utils").Decimal | null;
                        };
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
        "patient-policies": {
            ":id": {
                put: {
                    body: {
                        notes?: string | null | undefined;
                        status?: "ACTIVE" | "CANCELLED" | "SUSPENDED" | undefined;
                        patientId: string;
                        productId: string;
                        policyNumber: string;
                        policyStart: string;
                        policyEnd: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            patient: {
                                owner: {
                                    name: string;
                                    id: string;
                                } | null;
                                name: string;
                                id: string;
                            };
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            notes: string | null;
                            status: import("../../../../generated/prisma/enums").PatientPolicyStatus;
                            patientId: string;
                            productId: string;
                            policyNumber: string;
                            policyStart: Date;
                            policyEnd: Date;
                            capConsumed: import("@prisma/client-runtime-utils").Decimal;
                            product: {
                                insurer: {
                                    name: string;
                                    id: string;
                                };
                                name: string;
                                id: string;
                                coveragePercentDefault: import("@prisma/client-runtime-utils").Decimal;
                                annualCap: import("@prisma/client-runtime-utils").Decimal | null;
                            };
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
