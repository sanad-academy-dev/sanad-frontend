import Elysia from "elysia";
/** [P3.1] Party accounting config API (BRD §4.10) — doctype `party_account`. */
export declare const partyController: Elysia<"/accounting/parties", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "accounting-party.update": import("@sinclair/typebox").TObject<{
            accountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            defaultCurrencyCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            creditLimit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            bypassCreditLimitCheck: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            isFrozen: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
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
        parties: {};
    };
} & {
    accounting: {
        parties: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("./party.type").PartyListRow[];
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
        parties: {
            ":partyType": {
                ":partyId": {
                    patch: {
                        body: {
                            disabled?: boolean | undefined;
                            defaultCurrencyCode?: string | null | undefined;
                            creditLimit?: string | null | undefined;
                            bypassCreditLimitCheck?: boolean | undefined;
                            accountId?: string | null | undefined;
                            isFrozen?: boolean | undefined;
                        };
                        params: {
                            partyType: string;
                            partyId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                account: {
                                    account: {
                                        accountName: string;
                                        accountNumber: string | null;
                                        accountType: import("../../../../generated/prisma/enums").AccountType | null;
                                    };
                                    id: string;
                                    clinicId: string;
                                    accountId: string;
                                    partyType: string;
                                    partyId: string;
                                } | null;
                                creditLimit: {
                                    id: string;
                                    clinicId: string;
                                    creditLimit: import("@prisma/client-runtime-utils").Decimal;
                                    bypassCreditLimitCheck: boolean;
                                    partyType: string;
                                    partyId: string;
                                } | null;
                                config: {
                                    id: string;
                                    clinicId: string;
                                    disabled: boolean;
                                    defaultCurrencyCode: string | null;
                                    partyType: string;
                                    partyId: string;
                                    paymentTermsTemplateId: string | null;
                                    isFrozen: boolean;
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
    };
} & {
    accounting: {
        parties: {
            ":partyType": {
                ":partyId": {
                    "open-vouchers": {
                        get: {
                            body: {};
                            params: {
                                partyType: string;
                                partyId: string;
                            };
                            query: {};
                            headers: {};
                            response: {
                                200: {
                                    voucherType: string;
                                    voucherId: string;
                                    voucherNo: string | null;
                                    outstanding: string;
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
            };
        };
    };
} & {
    accounting: {
        parties: {
            ":partyType": {
                ":partyId": {
                    "open-balance": {
                        get: {
                            body: {};
                            params: {
                                partyType: string;
                                partyId: string;
                            };
                            query: {};
                            headers: {};
                            response: {
                                200: {
                                    outstanding: string;
                                    voucherCount: number;
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
