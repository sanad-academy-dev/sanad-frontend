import Elysia from "elysia";
export declare const currencyExchangeController: Elysia<"/accounting/currency-exchanges", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "accounting-currency-exchange.list": import("@sinclair/typebox").TObject<{
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "accounting-currency-exchange.create": import("@sinclair/typebox").TObject<{
            date: import("@sinclair/typebox").TString;
            fromCurrencyCode: import("@sinclair/typebox").TString;
            toCurrencyCode: import("@sinclair/typebox").TString;
            exchangeRate: import("@sinclair/typebox").TString;
            forBuying: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            forSelling: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-currency-exchange.resolve": import("@sinclair/typebox").TObject<{
            fromCurrencyCode: import("@sinclair/typebox").TString;
            toCurrencyCode: import("@sinclair/typebox").TString;
            date: import("@sinclair/typebox").TString;
            side: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"buying">, import("@sinclair/typebox").TLiteral<"selling">]>;
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
        "currency-exchanges": {};
    };
} & {
    accounting: {
        "currency-exchanges": {
            get: {
                body: {};
                params: {};
                query: {
                    limit?: number | undefined;
                };
                headers: {};
                response: {
                    200: {
                        date: Date;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                        fromCurrencyCode: string;
                        toCurrencyCode: string;
                        forBuying: boolean;
                        forSelling: boolean;
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
        "currency-exchanges": {
            resolve: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        date: string;
                        fromCurrencyCode: string;
                        toCurrencyCode: string;
                        side: "buying" | "selling";
                    };
                    headers: {};
                    response: {
                        200: import("./currency-exchange.type").ResolvedRate;
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
        "currency-exchanges": {
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
                            date: Date;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                            fromCurrencyCode: string;
                            toCurrencyCode: string;
                            forBuying: boolean;
                            forSelling: boolean;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "سعر الصرف غير موجود";
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
        "currency-exchanges": {
            post: {
                body: {
                    forBuying?: boolean | undefined;
                    forSelling?: boolean | undefined;
                    date: string;
                    exchangeRate: string;
                    fromCurrencyCode: string;
                    toCurrencyCode: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        date: Date;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        exchangeRate: import("@prisma/client-runtime-utils").Decimal;
                        fromCurrencyCode: string;
                        toCurrencyCode: string;
                        forBuying: boolean;
                        forSelling: boolean;
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
        "currency-exchanges": {
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
