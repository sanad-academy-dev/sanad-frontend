import Elysia from "elysia";
export declare const fiscalYearController: Elysia<"/accounting/fiscal-years", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "accounting-fiscal-year.create": import("@sinclair/typebox").TObject<{
            year: import("@sinclair/typebox").TString;
            yearStartDate: import("@sinclair/typebox").TString;
            yearEndDate: import("@sinclair/typebox").TString;
            isShortYear: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-fiscal-year.update": import("@sinclair/typebox").TObject<{
            year: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            yearStartDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            yearEndDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            isShortYear: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-fiscal-year.resolve": import("@sinclair/typebox").TObject<{
            date: import("@sinclair/typebox").TString;
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
        "fiscal-years": {};
    };
} & {
    accounting: {
        "fiscal-years": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        year: string;
                        yearStartDate: Date;
                        yearEndDate: Date;
                        isShortYear: boolean;
                        disabled: boolean;
                        autoCreated: boolean;
                        createdAt: Date;
                        updatedAt: Date;
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
        "fiscal-years": {
            resolve: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        date: string;
                    };
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            year: string;
                            yearStartDate: Date;
                            yearEndDate: Date;
                            isShortYear: boolean;
                            disabled: boolean;
                            autoCreated: boolean;
                            createdAt: Date;
                            updatedAt: Date;
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
        "fiscal-years": {
            post: {
                body: {
                    isShortYear?: boolean | undefined;
                    disabled?: boolean | undefined;
                    year: string;
                    yearStartDate: string;
                    yearEndDate: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        year: string;
                        yearStartDate: Date;
                        yearEndDate: Date;
                        isShortYear: boolean;
                        disabled: boolean;
                        autoCreated: boolean;
                        createdAt: Date;
                        updatedAt: Date;
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
        "fiscal-years": {
            next: {
                post: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            year: string;
                            yearStartDate: Date;
                            yearEndDate: Date;
                            isShortYear: boolean;
                            disabled: boolean;
                            autoCreated: boolean;
                            createdAt: Date;
                            updatedAt: Date;
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
    };
} & {
    accounting: {
        "fiscal-years": {
            ":id": {
                patch: {
                    body: {
                        year?: string | undefined;
                        yearStartDate?: string | undefined;
                        yearEndDate?: string | undefined;
                        isShortYear?: boolean | undefined;
                        disabled?: boolean | undefined;
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
                            year: string;
                            yearStartDate: Date;
                            yearEndDate: Date;
                            isShortYear: boolean;
                            disabled: boolean;
                            autoCreated: boolean;
                            createdAt: Date;
                            updatedAt: Date;
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
        "fiscal-years": {
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
