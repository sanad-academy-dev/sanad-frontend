import Elysia from "elysia";
export declare const insurerController: Elysia<"/accounting/insurers", {
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
        insurers: {};
    };
} & {
    accounting: {
        insurers: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        name: string;
                        address: string | null;
                        id: string;
                        createdAt: Date;
                        _count: {
                            products: number;
                        };
                        email: string | null;
                        phone: string | null;
                        code: string;
                        notes: string | null;
                        active: boolean;
                        contactPerson: string | null;
                        settlementDays: number;
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
        insurers: {
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
                            address: string | null;
                            id: string;
                            createdAt: Date;
                            _count: {
                                products: number;
                            };
                            email: string | null;
                            phone: string | null;
                            code: string;
                            notes: string | null;
                            active: boolean;
                            contactPerson: string | null;
                            settlementDays: number;
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
        insurers: {
            post: {
                body: {
                    address?: string | null | undefined;
                    email?: string | null | undefined;
                    phone?: string | null | undefined;
                    notes?: string | null | undefined;
                    contactPerson?: string | null | undefined;
                    settlementDays?: number | undefined;
                    name: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        name: string;
                        address: string | null;
                        id: string;
                        createdAt: Date;
                        _count: {
                            products: number;
                        };
                        email: string | null;
                        phone: string | null;
                        code: string;
                        notes: string | null;
                        active: boolean;
                        contactPerson: string | null;
                        settlementDays: number;
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
        insurers: {
            ":id": {
                put: {
                    body: {
                        address?: string | null | undefined;
                        email?: string | null | undefined;
                        phone?: string | null | undefined;
                        notes?: string | null | undefined;
                        contactPerson?: string | null | undefined;
                        settlementDays?: number | undefined;
                        name: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            name: string;
                            address: string | null;
                            id: string;
                            createdAt: Date;
                            _count: {
                                products: number;
                            };
                            email: string | null;
                            phone: string | null;
                            code: string;
                            notes: string | null;
                            active: boolean;
                            contactPerson: string | null;
                            settlementDays: number;
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
        insurers: {
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
                                name: string;
                                address: string | null;
                                id: string;
                                createdAt: Date;
                                _count: {
                                    products: number;
                                };
                                email: string | null;
                                phone: string | null;
                                code: string;
                                notes: string | null;
                                active: boolean;
                                contactPerson: string | null;
                                settlementDays: number;
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
