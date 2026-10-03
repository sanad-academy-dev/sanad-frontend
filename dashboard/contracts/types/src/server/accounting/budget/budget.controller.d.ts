import Elysia from "elysia";
/** [P10.3] HTTP surface for Budgets (§13). */
export declare const budgetController: Elysia<"/accounting/budgets", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "budget.create": import("@sinclair/typebox").TObject<{
            fiscalYear: import("@sinclair/typebox").TString;
            budgetAgainst: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"COST_CENTER">, import("@sinclair/typebox").TLiteral<"PROJECT">]>>;
            costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            project: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            monthlyDistributionId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            applicableOnBookingActualExpenses: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            actionIfAnnualExceeded: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"STOP">, import("@sinclair/typebox").TLiteral<"WARN">, import("@sinclair/typebox").TLiteral<"IGNORE">]>>;
            actionIfAccumulatedMonthlyExceeded: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"STOP">, import("@sinclair/typebox").TLiteral<"WARN">, import("@sinclair/typebox").TLiteral<"IGNORE">]>>;
            accounts: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                accountId: import("@sinclair/typebox").TString;
                budgetAmount: import("@sinclair/typebox").TString;
            }>>;
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
        budgets: {};
    };
} & {
    accounting: {
        budgets: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        fiscalYear: string;
                        monthlyDistribution: {
                            distributionName: string;
                            percentages: {
                                month: number;
                                percentage: import("@prisma/client-runtime-utils").Decimal;
                            }[];
                        } | null;
                        costCenter: {
                            costCenterName: string;
                        } | null;
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        costCenterId: string | null;
                        accounts: {
                            account: {
                                accountName: string;
                                accountNumber: string | null;
                                rootType: import("../../../../generated/prisma/enums").AccountRootType;
                            };
                            id: string;
                            idx: number;
                            accountId: string;
                            budgetAmount: import("@prisma/client-runtime-utils").Decimal;
                        }[];
                        docstatus: import("@/server/accounting/budget/budget.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        budgetAgainst: import("@/server/accounting/budget/budget.type").BudgetAgainst;
                        project: string | null;
                        monthlyDistributionId: string | null;
                        applicableOnBookingActualExpenses: boolean;
                        actionIfAnnualExceeded: import("@/server/accounting/budget/budget.type").BudgetAction;
                        actionIfAccumulatedMonthlyExceeded: import("@/server/accounting/budget/budget.type").BudgetAction;
                        applicableOnMaterialRequest: boolean;
                        actionIfAnnualExceededOnMr: import("@/server/accounting/budget/budget.type").BudgetAction;
                        actionIfAccumulatedMonthlyExceededOnMr: import("@/server/accounting/budget/budget.type").BudgetAction;
                        applicableOnPurchaseOrder: boolean;
                        actionIfAnnualExceededOnPo: import("@/server/accounting/budget/budget.type").BudgetAction;
                        actionIfAccumulatedMonthlyExceededOnPo: import("@/server/accounting/budget/budget.type").BudgetAction;
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
        budgets: {
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
                            fiscalYear: string;
                            monthlyDistribution: {
                                distributionName: string;
                                percentages: {
                                    month: number;
                                    percentage: import("@prisma/client-runtime-utils").Decimal;
                                }[];
                            } | null;
                            costCenter: {
                                costCenterName: string;
                            } | null;
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            costCenterId: string | null;
                            accounts: {
                                account: {
                                    accountName: string;
                                    accountNumber: string | null;
                                    rootType: import("../../../../generated/prisma/enums").AccountRootType;
                                };
                                id: string;
                                idx: number;
                                accountId: string;
                                budgetAmount: import("@prisma/client-runtime-utils").Decimal;
                            }[];
                            docstatus: import("@/server/accounting/budget/budget.type").DocStatus;
                            amendedFromId: string | null;
                            submittedAt: Date | null;
                            submittedById: string | null;
                            cancelledAt: Date | null;
                            cancelledById: string | null;
                            budgetAgainst: import("@/server/accounting/budget/budget.type").BudgetAgainst;
                            project: string | null;
                            monthlyDistributionId: string | null;
                            applicableOnBookingActualExpenses: boolean;
                            actionIfAnnualExceeded: import("@/server/accounting/budget/budget.type").BudgetAction;
                            actionIfAccumulatedMonthlyExceeded: import("@/server/accounting/budget/budget.type").BudgetAction;
                            applicableOnMaterialRequest: boolean;
                            actionIfAnnualExceededOnMr: import("@/server/accounting/budget/budget.type").BudgetAction;
                            actionIfAccumulatedMonthlyExceededOnMr: import("@/server/accounting/budget/budget.type").BudgetAction;
                            applicableOnPurchaseOrder: boolean;
                            actionIfAnnualExceededOnPo: import("@/server/accounting/budget/budget.type").BudgetAction;
                            actionIfAccumulatedMonthlyExceededOnPo: import("@/server/accounting/budget/budget.type").BudgetAction;
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
        budgets: {
            post: {
                body: {
                    costCenterId?: string | null | undefined;
                    budgetAgainst?: "COST_CENTER" | "PROJECT" | undefined;
                    project?: string | null | undefined;
                    monthlyDistributionId?: string | null | undefined;
                    applicableOnBookingActualExpenses?: boolean | undefined;
                    actionIfAnnualExceeded?: "STOP" | "WARN" | "IGNORE" | undefined;
                    actionIfAccumulatedMonthlyExceeded?: "STOP" | "WARN" | "IGNORE" | undefined;
                    fiscalYear: string;
                    accounts: {
                        accountId: string;
                        budgetAmount: string;
                    }[];
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        fiscalYear: string;
                        monthlyDistribution: {
                            distributionName: string;
                            percentages: {
                                month: number;
                                percentage: import("@prisma/client-runtime-utils").Decimal;
                            }[];
                        } | null;
                        costCenter: {
                            costCenterName: string;
                        } | null;
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        costCenterId: string | null;
                        accounts: {
                            account: {
                                accountName: string;
                                accountNumber: string | null;
                                rootType: import("../../../../generated/prisma/enums").AccountRootType;
                            };
                            id: string;
                            idx: number;
                            accountId: string;
                            budgetAmount: import("@prisma/client-runtime-utils").Decimal;
                        }[];
                        docstatus: import("@/server/accounting/budget/budget.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        budgetAgainst: import("@/server/accounting/budget/budget.type").BudgetAgainst;
                        project: string | null;
                        monthlyDistributionId: string | null;
                        applicableOnBookingActualExpenses: boolean;
                        actionIfAnnualExceeded: import("@/server/accounting/budget/budget.type").BudgetAction;
                        actionIfAccumulatedMonthlyExceeded: import("@/server/accounting/budget/budget.type").BudgetAction;
                        applicableOnMaterialRequest: boolean;
                        actionIfAnnualExceededOnMr: import("@/server/accounting/budget/budget.type").BudgetAction;
                        actionIfAccumulatedMonthlyExceededOnMr: import("@/server/accounting/budget/budget.type").BudgetAction;
                        applicableOnPurchaseOrder: boolean;
                        actionIfAnnualExceededOnPo: import("@/server/accounting/budget/budget.type").BudgetAction;
                        actionIfAccumulatedMonthlyExceededOnPo: import("@/server/accounting/budget/budget.type").BudgetAction;
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
        budgets: {
            ":id": {
                submit: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                fiscalYear: string;
                                monthlyDistribution: {
                                    distributionName: string;
                                    percentages: {
                                        month: number;
                                        percentage: import("@prisma/client-runtime-utils").Decimal;
                                    }[];
                                } | null;
                                costCenter: {
                                    costCenterName: string;
                                } | null;
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                costCenterId: string | null;
                                accounts: {
                                    account: {
                                        accountName: string;
                                        accountNumber: string | null;
                                        rootType: import("../../../../generated/prisma/enums").AccountRootType;
                                    };
                                    id: string;
                                    idx: number;
                                    accountId: string;
                                    budgetAmount: import("@prisma/client-runtime-utils").Decimal;
                                }[];
                                docstatus: import("@/server/accounting/budget/budget.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                budgetAgainst: import("@/server/accounting/budget/budget.type").BudgetAgainst;
                                project: string | null;
                                monthlyDistributionId: string | null;
                                applicableOnBookingActualExpenses: boolean;
                                actionIfAnnualExceeded: import("@/server/accounting/budget/budget.type").BudgetAction;
                                actionIfAccumulatedMonthlyExceeded: import("@/server/accounting/budget/budget.type").BudgetAction;
                                applicableOnMaterialRequest: boolean;
                                actionIfAnnualExceededOnMr: import("@/server/accounting/budget/budget.type").BudgetAction;
                                actionIfAccumulatedMonthlyExceededOnMr: import("@/server/accounting/budget/budget.type").BudgetAction;
                                applicableOnPurchaseOrder: boolean;
                                actionIfAnnualExceededOnPo: import("@/server/accounting/budget/budget.type").BudgetAction;
                                actionIfAccumulatedMonthlyExceededOnPo: import("@/server/accounting/budget/budget.type").BudgetAction;
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
        budgets: {
            ":id": {
                cancel: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                fiscalYear: string;
                                monthlyDistribution: {
                                    distributionName: string;
                                    percentages: {
                                        month: number;
                                        percentage: import("@prisma/client-runtime-utils").Decimal;
                                    }[];
                                } | null;
                                costCenter: {
                                    costCenterName: string;
                                } | null;
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                costCenterId: string | null;
                                accounts: {
                                    account: {
                                        accountName: string;
                                        accountNumber: string | null;
                                        rootType: import("../../../../generated/prisma/enums").AccountRootType;
                                    };
                                    id: string;
                                    idx: number;
                                    accountId: string;
                                    budgetAmount: import("@prisma/client-runtime-utils").Decimal;
                                }[];
                                docstatus: import("@/server/accounting/budget/budget.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                budgetAgainst: import("@/server/accounting/budget/budget.type").BudgetAgainst;
                                project: string | null;
                                monthlyDistributionId: string | null;
                                applicableOnBookingActualExpenses: boolean;
                                actionIfAnnualExceeded: import("@/server/accounting/budget/budget.type").BudgetAction;
                                actionIfAccumulatedMonthlyExceeded: import("@/server/accounting/budget/budget.type").BudgetAction;
                                applicableOnMaterialRequest: boolean;
                                actionIfAnnualExceededOnMr: import("@/server/accounting/budget/budget.type").BudgetAction;
                                actionIfAccumulatedMonthlyExceededOnMr: import("@/server/accounting/budget/budget.type").BudgetAction;
                                applicableOnPurchaseOrder: boolean;
                                actionIfAnnualExceededOnPo: import("@/server/accounting/budget/budget.type").BudgetAction;
                                actionIfAccumulatedMonthlyExceededOnPo: import("@/server/accounting/budget/budget.type").BudgetAction;
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
        budgets: {
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
