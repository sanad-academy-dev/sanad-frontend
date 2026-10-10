import Elysia from "elysia";
/** [P10.4] HTTP surface for Accounting Dimensions (§4.5). */
export declare const accountingDimensionController: Elysia<"/accounting/dimensions", {
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
        dimensions: {};
    };
} & {
    accounting: {
        dimensions: {
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
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        slot: number;
                        dimensionName: string;
                        referenceDoctype: string | null;
                        mandatoryForBalanceSheet: boolean;
                        mandatoryForProfitAndLoss: boolean;
                        defaultDimensionValue: string | null;
                        autoPostBalancingEntry: boolean;
                        offsettingAccountId: string | null;
                        offsettingAccount: {
                            accountName: string;
                        } | null;
                        filters: {
                            values: {
                                dimValue: string;
                            }[];
                            id: string;
                            disabled: boolean;
                            accounts: {
                                accountId: string;
                            }[];
                            allowOnly: boolean;
                        }[];
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
        dimensions: {
            put: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        disabled: boolean;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        slot: number;
                        dimensionName: string;
                        referenceDoctype: string | null;
                        mandatoryForBalanceSheet: boolean;
                        mandatoryForProfitAndLoss: boolean;
                        defaultDimensionValue: string | null;
                        autoPostBalancingEntry: boolean;
                        offsettingAccountId: string | null;
                        offsettingAccount: {
                            accountName: string;
                        } | null;
                        filters: {
                            values: {
                                dimValue: string;
                            }[];
                            id: string;
                            disabled: boolean;
                            accounts: {
                                accountId: string;
                            }[];
                            allowOnly: boolean;
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
        dimensions: {
            ":id": {
                filter: {
                    put: {
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
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                slot: number;
                                dimensionName: string;
                                referenceDoctype: string | null;
                                mandatoryForBalanceSheet: boolean;
                                mandatoryForProfitAndLoss: boolean;
                                defaultDimensionValue: string | null;
                                autoPostBalancingEntry: boolean;
                                offsettingAccountId: string | null;
                                offsettingAccount: {
                                    accountName: string;
                                } | null;
                                filters: {
                                    values: {
                                        dimValue: string;
                                    }[];
                                    id: string;
                                    disabled: boolean;
                                    accounts: {
                                        accountId: string;
                                    }[];
                                    allowOnly: boolean;
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
} & {
    accounting: {
        dimensions: {
            ":id": {
                filter: {
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
