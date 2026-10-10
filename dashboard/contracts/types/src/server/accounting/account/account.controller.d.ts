import Elysia from "elysia";
export declare const accountController: Elysia<"/accounting/accounts", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "accounting-account.create": import("@sinclair/typebox").TObject<{
            accountName: import("@sinclair/typebox").TString;
            accountNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            parentAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            isGroup: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            rootType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ASSET">, import("@sinclair/typebox").TLiteral<"LIABILITY">, import("@sinclair/typebox").TLiteral<"INCOME">, import("@sinclair/typebox").TLiteral<"EXPENSE">, import("@sinclair/typebox").TLiteral<"EQUITY">]>;
            accountType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"BANK">, import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"RECEIVABLE">, import("@sinclair/typebox").TLiteral<"PAYABLE">, import("@sinclair/typebox").TLiteral<"TAX">, import("@sinclair/typebox").TLiteral<"STOCK">, import("@sinclair/typebox").TLiteral<"FIXED_ASSET">, import("@sinclair/typebox").TLiteral<"ACCUMULATED_DEPRECIATION">, import("@sinclair/typebox").TLiteral<"DEPRECIATION">, import("@sinclair/typebox").TLiteral<"EXPENSE_ACCOUNT">, import("@sinclair/typebox").TLiteral<"INCOME_ACCOUNT">, import("@sinclair/typebox").TLiteral<"CHARGEABLE">, import("@sinclair/typebox").TLiteral<"ROUND_OFF">, import("@sinclair/typebox").TLiteral<"ROUND_OFF_FOR_OPENING">, import("@sinclair/typebox").TLiteral<"TEMPORARY">, import("@sinclair/typebox").TLiteral<"EQUITY">, import("@sinclair/typebox").TLiteral<"DIRECT_INCOME">, import("@sinclair/typebox").TLiteral<"INDIRECT_INCOME">, import("@sinclair/typebox").TLiteral<"DIRECT_EXPENSE">, import("@sinclair/typebox").TLiteral<"INDIRECT_EXPENSE">, import("@sinclair/typebox").TLiteral<"COST_OF_GOODS_SOLD">, import("@sinclair/typebox").TLiteral<"CURRENT_ASSET">, import("@sinclair/typebox").TLiteral<"CURRENT_LIABILITY">, import("@sinclair/typebox").TLiteral<"CAPITAL_WORK_IN_PROGRESS">, import("@sinclair/typebox").TLiteral<"ASSET_RECEIVED_BUT_NOT_BILLED">, import("@sinclair/typebox").TLiteral<"STOCK_RECEIVED_BUT_NOT_BILLED">, import("@sinclair/typebox").TLiteral<"SERVICE_RECEIVED_BUT_NOT_BILLED">, import("@sinclair/typebox").TLiteral<"STOCK_ADJUSTMENT">]>]>>;
            accountCurrencyCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            taxRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            balanceMustBe: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NONE">, import("@sinclair/typebox").TLiteral<"DEBIT">, import("@sinclair/typebox").TLiteral<"CREDIT">]>>;
            freezeAccount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-account.update": import("@sinclair/typebox").TObject<{
            accountName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            accountNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            accountType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"BANK">, import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"RECEIVABLE">, import("@sinclair/typebox").TLiteral<"PAYABLE">, import("@sinclair/typebox").TLiteral<"TAX">, import("@sinclair/typebox").TLiteral<"STOCK">, import("@sinclair/typebox").TLiteral<"FIXED_ASSET">, import("@sinclair/typebox").TLiteral<"ACCUMULATED_DEPRECIATION">, import("@sinclair/typebox").TLiteral<"DEPRECIATION">, import("@sinclair/typebox").TLiteral<"EXPENSE_ACCOUNT">, import("@sinclair/typebox").TLiteral<"INCOME_ACCOUNT">, import("@sinclair/typebox").TLiteral<"CHARGEABLE">, import("@sinclair/typebox").TLiteral<"ROUND_OFF">, import("@sinclair/typebox").TLiteral<"ROUND_OFF_FOR_OPENING">, import("@sinclair/typebox").TLiteral<"TEMPORARY">, import("@sinclair/typebox").TLiteral<"EQUITY">, import("@sinclair/typebox").TLiteral<"DIRECT_INCOME">, import("@sinclair/typebox").TLiteral<"INDIRECT_INCOME">, import("@sinclair/typebox").TLiteral<"DIRECT_EXPENSE">, import("@sinclair/typebox").TLiteral<"INDIRECT_EXPENSE">, import("@sinclair/typebox").TLiteral<"COST_OF_GOODS_SOLD">, import("@sinclair/typebox").TLiteral<"CURRENT_ASSET">, import("@sinclair/typebox").TLiteral<"CURRENT_LIABILITY">, import("@sinclair/typebox").TLiteral<"CAPITAL_WORK_IN_PROGRESS">, import("@sinclair/typebox").TLiteral<"ASSET_RECEIVED_BUT_NOT_BILLED">, import("@sinclair/typebox").TLiteral<"STOCK_RECEIVED_BUT_NOT_BILLED">, import("@sinclair/typebox").TLiteral<"SERVICE_RECEIVED_BUT_NOT_BILLED">, import("@sinclair/typebox").TLiteral<"STOCK_ADJUSTMENT">]>]>>;
            accountCurrencyCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            taxRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            balanceMustBe: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NONE">, import("@sinclair/typebox").TLiteral<"DEBIT">, import("@sinclair/typebox").TLiteral<"CREDIT">]>>;
            freezeAccount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            isGroup: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "accounting-account.move": import("@sinclair/typebox").TObject<{
            parentAccountId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>;
        }>;
        readonly "accounting-account.import": import("@sinclair/typebox").TObject<{
            csv: import("@sinclair/typebox").TString;
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
        accounts: {};
    };
} & {
    accounting: {
        accounts: {
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
                        accountName: string;
                        accountNumber: string | null;
                        parentAccountId: string | null;
                        isGroup: boolean;
                        rootType: import("../../../../generated/prisma/enums").AccountRootType;
                        reportType: import("../../../../generated/prisma/enums").AccountReportType;
                        accountType: import("../../../../generated/prisma/enums").AccountType | null;
                        accountCurrencyCode: string;
                        taxRate: import("@prisma/client-runtime-utils").Decimal | null;
                        balanceMustBe: import("../../../../generated/prisma/enums").BalanceMustBe;
                        freezeAccount: boolean;
                        lft: number;
                        rgt: number;
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
        accounts: {
            import: {
                template: {
                    get: {
                        body: {};
                        params: {};
                        query: {};
                        headers: {};
                        response: {
                            200: string;
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
    };
} & {
    accounting: {
        accounts: {
            import: {
                preview: {
                    post: {
                        body: {
                            csv: string;
                        };
                        params: {};
                        query: {};
                        headers: {};
                        response: {
                            200: import("@/server/accounting/account/coa-import").ImportPlan;
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
        accounts: {
            import: {
                commit: {
                    post: {
                        body: {
                            csv: string;
                        };
                        params: {};
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                created: number;
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
        accounts: {
            import: {
                "seed-standard": {
                    post: {
                        body: {};
                        params: {};
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                created: number;
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
    };
} & {
    accounting: {
        accounts: {
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
                            accountName: string;
                            accountNumber: string | null;
                            parentAccountId: string | null;
                            isGroup: boolean;
                            rootType: import("../../../../generated/prisma/enums").AccountRootType;
                            reportType: import("../../../../generated/prisma/enums").AccountReportType;
                            accountType: import("../../../../generated/prisma/enums").AccountType | null;
                            accountCurrencyCode: string;
                            taxRate: import("@prisma/client-runtime-utils").Decimal | null;
                            balanceMustBe: import("../../../../generated/prisma/enums").BalanceMustBe;
                            freezeAccount: boolean;
                            lft: number;
                            rgt: number;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "الحساب غير موجود";
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
        accounts: {
            post: {
                body: {
                    disabled?: boolean | undefined;
                    accountNumber?: string | null | undefined;
                    parentAccountId?: string | null | undefined;
                    isGroup?: boolean | undefined;
                    accountType?: "EQUITY" | "BANK" | "CASH" | "RECEIVABLE" | "PAYABLE" | "TAX" | "STOCK" | "FIXED_ASSET" | "ACCUMULATED_DEPRECIATION" | "DEPRECIATION" | "EXPENSE_ACCOUNT" | "INCOME_ACCOUNT" | "CHARGEABLE" | "ROUND_OFF" | "ROUND_OFF_FOR_OPENING" | "TEMPORARY" | "DIRECT_INCOME" | "INDIRECT_INCOME" | "DIRECT_EXPENSE" | "INDIRECT_EXPENSE" | "COST_OF_GOODS_SOLD" | "CURRENT_ASSET" | "CURRENT_LIABILITY" | "CAPITAL_WORK_IN_PROGRESS" | "ASSET_RECEIVED_BUT_NOT_BILLED" | "STOCK_RECEIVED_BUT_NOT_BILLED" | "SERVICE_RECEIVED_BUT_NOT_BILLED" | "STOCK_ADJUSTMENT" | null | undefined;
                    accountCurrencyCode?: string | undefined;
                    taxRate?: string | null | undefined;
                    balanceMustBe?: "NONE" | "DEBIT" | "CREDIT" | undefined;
                    freezeAccount?: boolean | undefined;
                    accountName: string;
                    rootType: "ASSET" | "LIABILITY" | "INCOME" | "EXPENSE" | "EQUITY";
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
                        accountName: string;
                        accountNumber: string | null;
                        parentAccountId: string | null;
                        isGroup: boolean;
                        rootType: import("../../../../generated/prisma/enums").AccountRootType;
                        reportType: import("../../../../generated/prisma/enums").AccountReportType;
                        accountType: import("../../../../generated/prisma/enums").AccountType | null;
                        accountCurrencyCode: string;
                        taxRate: import("@prisma/client-runtime-utils").Decimal | null;
                        balanceMustBe: import("../../../../generated/prisma/enums").BalanceMustBe;
                        freezeAccount: boolean;
                        lft: number;
                        rgt: number;
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
        accounts: {
            ":id": {
                patch: {
                    body: {
                        disabled?: boolean | undefined;
                        accountName?: string | undefined;
                        accountNumber?: string | null | undefined;
                        isGroup?: boolean | undefined;
                        accountType?: "EQUITY" | "BANK" | "CASH" | "RECEIVABLE" | "PAYABLE" | "TAX" | "STOCK" | "FIXED_ASSET" | "ACCUMULATED_DEPRECIATION" | "DEPRECIATION" | "EXPENSE_ACCOUNT" | "INCOME_ACCOUNT" | "CHARGEABLE" | "ROUND_OFF" | "ROUND_OFF_FOR_OPENING" | "TEMPORARY" | "DIRECT_INCOME" | "INDIRECT_INCOME" | "DIRECT_EXPENSE" | "INDIRECT_EXPENSE" | "COST_OF_GOODS_SOLD" | "CURRENT_ASSET" | "CURRENT_LIABILITY" | "CAPITAL_WORK_IN_PROGRESS" | "ASSET_RECEIVED_BUT_NOT_BILLED" | "STOCK_RECEIVED_BUT_NOT_BILLED" | "SERVICE_RECEIVED_BUT_NOT_BILLED" | "STOCK_ADJUSTMENT" | null | undefined;
                        accountCurrencyCode?: string | undefined;
                        taxRate?: string | null | undefined;
                        balanceMustBe?: "NONE" | "DEBIT" | "CREDIT" | undefined;
                        freezeAccount?: boolean | undefined;
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
                            accountName: string;
                            accountNumber: string | null;
                            parentAccountId: string | null;
                            isGroup: boolean;
                            rootType: import("../../../../generated/prisma/enums").AccountRootType;
                            reportType: import("../../../../generated/prisma/enums").AccountReportType;
                            accountType: import("../../../../generated/prisma/enums").AccountType | null;
                            accountCurrencyCode: string;
                            taxRate: import("@prisma/client-runtime-utils").Decimal | null;
                            balanceMustBe: import("../../../../generated/prisma/enums").BalanceMustBe;
                            freezeAccount: boolean;
                            lft: number;
                            rgt: number;
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
        accounts: {
            ":id": {
                move: {
                    post: {
                        body: {
                            parentAccountId: string | null;
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
                                accountName: string;
                                accountNumber: string | null;
                                parentAccountId: string | null;
                                isGroup: boolean;
                                rootType: import("../../../../generated/prisma/enums").AccountRootType;
                                reportType: import("../../../../generated/prisma/enums").AccountReportType;
                                accountType: import("../../../../generated/prisma/enums").AccountType | null;
                                accountCurrencyCode: string;
                                taxRate: import("@prisma/client-runtime-utils").Decimal | null;
                                balanceMustBe: import("../../../../generated/prisma/enums").BalanceMustBe;
                                freezeAccount: boolean;
                                lft: number;
                                rgt: number;
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
