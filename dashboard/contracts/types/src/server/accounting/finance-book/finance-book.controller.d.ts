import Elysia from "elysia";
/**
 * [P1.10] HTTP surface for Finance Book (BRD §4.6). Plain master CRUD — the doctype is
 * effectively flagged off (no screen consumes it) until parallel-book postings land (P8/P10).
 * The DAO/inline queries are thin enough that no separate service module is warranted.
 */
export declare const financeBookController: Elysia<"/accounting/finance-books", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "accounting-finance-book.create": import("@sinclair/typebox").TObject<{
            financeBookName: import("@sinclair/typebox").TString;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-finance-book.update": import("@sinclair/typebox").TObject<{
            financeBookName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
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
        "finance-books": {};
    };
} & {
    accounting: {
        "finance-books": {
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
                        financeBookName: string;
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
        "finance-books": {
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
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            financeBookName: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "الدفتر المالي غير موجود";
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
        "finance-books": {
            post: {
                body: {
                    disabled?: boolean | undefined;
                    financeBookName: string;
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
                        financeBookName: string;
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
        "finance-books": {
            ":id": {
                patch: {
                    body: {
                        disabled?: boolean | undefined;
                        financeBookName?: string | undefined;
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
                            financeBookName: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "الدفتر المالي غير موجود";
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
        "finance-books": {
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
                            readonly message: "الدفتر المالي غير موجود";
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
