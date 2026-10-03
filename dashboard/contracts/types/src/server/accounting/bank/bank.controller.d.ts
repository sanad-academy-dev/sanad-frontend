import Elysia from "elysia";
/** [P11.1] HTTP surface for the Bank + Bank Account masters (§14). */
export declare const bankController: Elysia<"/accounting/banks", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "bank.upsert": import("@sinclair/typebox").TObject<{
            bankName: import("@sinclair/typebox").TString;
            swiftNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            website: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "bank.account.upsert": import("@sinclair/typebox").TObject<{
            bankId: import("@sinclair/typebox").TString;
            accountName: import("@sinclair/typebox").TString;
            isCompanyAccount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            glAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            accountType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            accountSubtype: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            iban: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            branchCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            bankAccountNo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            partyType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            partyId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
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
        banks: {};
    };
} & {
    accounting: {
        banks: {
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
                        website: string | null;
                        bankName: string;
                        swiftNumber: string | null;
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
        banks: {
            post: {
                body: {
                    disabled?: boolean | undefined;
                    website?: string | null | undefined;
                    swiftNumber?: string | null | undefined;
                    bankName: string;
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
                        website: string | null;
                        bankName: string;
                        swiftNumber: string | null;
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
        banks: {
            ":id": {
                patch: {
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
                            website: string | null;
                            bankName: string;
                            swiftNumber: string | null;
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
        banks: {
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
} & {
    accounting: {
        banks: {
            accounts: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            bank: {
                                bankName: string;
                            };
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            accountName: string;
                            accountType: string | null;
                            branchCode: string | null;
                            iban: string | null;
                            partyType: string | null;
                            partyId: string | null;
                            bankId: string;
                            isCompanyAccount: boolean;
                            glAccountId: string | null;
                            accountSubtype: string | null;
                            bankAccountNo: string | null;
                            integrationId: string | null;
                            glAccount: {
                                accountName: string;
                                accountCurrencyCode: string;
                            } | null;
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
    };
} & {
    accounting: {
        banks: {
            accounts: {
                post: {
                    body: {
                        disabled?: boolean | undefined;
                        accountType?: string | null | undefined;
                        branchCode?: string | null | undefined;
                        iban?: string | null | undefined;
                        partyType?: string | null | undefined;
                        partyId?: string | null | undefined;
                        isCompanyAccount?: boolean | undefined;
                        glAccountId?: string | null | undefined;
                        accountSubtype?: string | null | undefined;
                        bankAccountNo?: string | null | undefined;
                        accountName: string;
                        bankId: string;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            bank: {
                                bankName: string;
                            };
                            id: string;
                            clinicId: string;
                            disabled: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            accountName: string;
                            accountType: string | null;
                            branchCode: string | null;
                            iban: string | null;
                            partyType: string | null;
                            partyId: string | null;
                            bankId: string;
                            isCompanyAccount: boolean;
                            glAccountId: string | null;
                            accountSubtype: string | null;
                            bankAccountNo: string | null;
                            integrationId: string | null;
                            glAccount: {
                                accountName: string;
                                accountCurrencyCode: string;
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
        banks: {
            accounts: {
                ":id": {
                    patch: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                bank: {
                                    bankName: string;
                                };
                                id: string;
                                clinicId: string;
                                disabled: boolean;
                                createdAt: Date;
                                updatedAt: Date;
                                accountName: string;
                                accountType: string | null;
                                branchCode: string | null;
                                iban: string | null;
                                partyType: string | null;
                                partyId: string | null;
                                bankId: string;
                                isCompanyAccount: boolean;
                                glAccountId: string | null;
                                accountSubtype: string | null;
                                bankAccountNo: string | null;
                                integrationId: string | null;
                                glAccount: {
                                    accountName: string;
                                    accountCurrencyCode: string;
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
        banks: {
            accounts: {
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
