import Elysia from "elysia";
/** [P1.7] HTTP surface for Mode of Payment (BRD §4.8). Clinic-scoped master CRUD. */
export declare const modeOfPaymentController: Elysia<"/accounting/modes-of-payment", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "accounting-mode-of-payment.list": import("@sinclair/typebox").TObject<{
            includeDisabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-mode-of-payment.create": import("@sinclair/typebox").TObject<{
            modeOfPaymentName: import("@sinclair/typebox").TString;
            type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"BANK">, import("@sinclair/typebox").TLiteral<"GENERAL">, import("@sinclair/typebox").TLiteral<"PHONE">]>>;
            enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            defaultAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "accounting-mode-of-payment.update": import("@sinclair/typebox").TObject<{
            modeOfPaymentName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"BANK">, import("@sinclair/typebox").TLiteral<"GENERAL">, import("@sinclair/typebox").TLiteral<"PHONE">]>>;
            enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            defaultAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
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
        "modes-of-payment": {};
    };
} & {
    accounting: {
        "modes-of-payment": {
            get: {
                body: {};
                params: {};
                query: {
                    includeDisabled?: boolean | undefined;
                };
                headers: {};
                response: {
                    200: {
                        type: import("./mode-of-payment.type").ModeOfPaymentType;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        enabled: boolean;
                        modeOfPaymentName: string;
                        defaultAccountId: string | null;
                        defaultAccount: {
                            id: string;
                            accountName: string;
                            accountNumber: string | null;
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
        "modes-of-payment": {
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
                            type: import("./mode-of-payment.type").ModeOfPaymentType;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            enabled: boolean;
                            modeOfPaymentName: string;
                            defaultAccountId: string | null;
                            defaultAccount: {
                                id: string;
                                accountName: string;
                                accountNumber: string | null;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "طريقة الدفع غير موجودة";
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
        "modes-of-payment": {
            post: {
                body: {
                    type?: "BANK" | "CASH" | "GENERAL" | "PHONE" | undefined;
                    enabled?: boolean | undefined;
                    defaultAccountId?: string | null | undefined;
                    modeOfPaymentName: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        type: import("./mode-of-payment.type").ModeOfPaymentType;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        enabled: boolean;
                        modeOfPaymentName: string;
                        defaultAccountId: string | null;
                        defaultAccount: {
                            id: string;
                            accountName: string;
                            accountNumber: string | null;
                        } | null;
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
        "modes-of-payment": {
            ":id": {
                patch: {
                    body: {
                        type?: "BANK" | "CASH" | "GENERAL" | "PHONE" | undefined;
                        enabled?: boolean | undefined;
                        modeOfPaymentName?: string | undefined;
                        defaultAccountId?: string | null | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            type: import("./mode-of-payment.type").ModeOfPaymentType;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            enabled: boolean;
                            modeOfPaymentName: string;
                            defaultAccountId: string | null;
                            defaultAccount: {
                                id: string;
                                accountName: string;
                                accountNumber: string | null;
                            } | null;
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
        "modes-of-payment": {
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
