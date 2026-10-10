import Elysia from "elysia";
export declare const accountingReportsController: Elysia<"/accounting/reports", {
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
        reports: {};
    };
} & {
    accounting: {
        reports: {
            "general-ledger": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        costCenterId?: string | undefined;
                        accountId?: string | undefined;
                        voucherType?: string | undefined;
                        showCancelled?: boolean | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/general-ledger.service").GeneralLedgerReport;
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
        reports: {
            "receivable-payable": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        summary?: boolean | undefined;
                        partyType?: string | undefined;
                        partyId?: string | undefined;
                        side?: string | undefined;
                        basedOn?: string | undefined;
                        ranges?: string | undefined;
                        asOf: string;
                    };
                    headers: {};
                    response: {
                        200: {
                            rows: never[];
                            summary: import("@/server/accounting/reports/receivable-payable.service").ArApSummaryRow[];
                            asOf: Date;
                            basedOn: import("./ageing-buckets").AgeingBasedOn;
                            bucketLabels: string[];
                            bucketTotals: string[];
                            totalOutstanding: string;
                            totalOutstandingBase: string;
                        } | {
                            summary: never[];
                            asOf: Date;
                            basedOn: import("./ageing-buckets").AgeingBasedOn;
                            bucketLabels: string[];
                            rows: import("@/server/accounting/reports/receivable-payable.service").ArApRow[];
                            bucketTotals: string[];
                            totalOutstanding: string;
                            totalOutstandingBase: string;
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
        reports: {
            "balance-sheet": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        periodicity?: string | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/statement-engine/financial-statements.service").BalanceSheetReport;
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
        reports: {
            "profit-and-loss": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        periodicity?: string | undefined;
                        accumulatedValues?: boolean | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/statement-engine/financial-statements.service").ProfitAndLossReport;
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
        reports: {
            "cash-flow": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        periodicity?: string | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/statement-engine/financial-statements.service").CashFlowReport;
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
        reports: {
            "trial-balance": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/trial-balance.service").TrialBalanceReport;
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
        reports: {
            "party-trial-balance": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate: string;
                        toDate: string;
                        side: "RECEIVABLE" | "PAYABLE";
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/party-trial-balance.service").PartyTrialBalanceReport;
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
        reports: {
            "payment-ledger": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        accountType?: "RECEIVABLE" | "PAYABLE" | undefined;
                        partyType?: string | undefined;
                        partyId?: string | undefined;
                        includeDelinked?: boolean | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/payment-ledger-report.service").PaymentLedgerReportRow[];
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
        reports: {
            "insurance-claims-register": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        status?: string | undefined;
                        insurerId?: string | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/membership-insurance-reports.service").ClaimsRegisterReport;
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
        reports: {
            "membership-revenue": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/membership-insurance-reports.service").MembershipRevenueReport;
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
        reports: {
            "benefit-usage": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/membership-insurance-reports.service").BenefitUsageReport;
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
        reports: {
            "sales-register": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        partyId?: string | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/sales-register.service").SalesRegisterReport;
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
        reports: {
            "item-wise-sales-register": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        partyId?: string | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/sales-register.service").ItemWiseSalesRegisterReport;
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
        reports: {
            "purchase-register": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        partyId?: string | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/purchase-register.service").PurchaseRegisterReport;
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
        reports: {
            "item-wise-purchase-register": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        partyId?: string | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/purchase-register.service").ItemWisePurchaseRegisterReport;
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
        reports: {
            "payment-period": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        partyId?: string | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/payment-reports.service").PaymentPeriodRow[];
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
        reports: {
            "sales-payment-summary": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/payment-reports.service").SalesPaymentSummaryRow[];
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
        reports: {
            "party-ledger-summary": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate: string;
                        toDate: string;
                        side: "RECEIVABLE" | "PAYABLE";
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/p9-4-reports.service").PartyLedgerSummaryReport;
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
        reports: {
            "gross-profit": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/p9-4-reports.service").GrossProfitReport;
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
        reports: {
            "invoice-trends": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        year: string;
                        side: "sales" | "purchase";
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/p9-4-reports.service").InvoiceTrendsReport;
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
        reports: {
            "ledger-debug": {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/p9-4-reports.service").LedgerDebugReport;
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
        reports: {
            "budget-variance": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fiscalYear: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/budget-variance.service").BudgetVarianceReport;
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
        reports: {
            "bank-reconciliation-statement": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        bankAccountId: string;
                        asOf: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/bank/bank-clearance.service").BankReconciliationStatementReport;
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
        reports: {
            "bank-clearance-summary": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        bankAccountId: string;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/bank/bank-clearance.service").BankClearanceSummaryReport;
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
        reports: {
            "dimension-balance": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        slot: string;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/dimension-balance.service").DimensionBalanceReport;
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
        reports: {
            "financial-ratios": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/p1210-reports.service").FinancialRatiosReport;
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
        reports: {
            profitability: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        groupBy?: string | undefined;
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/p1210-reports.service").ProfitabilityRow[];
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
        reports: {
            "withholding-summary": {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate: string;
                        toDate: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/reports/p1210-reports.service").WithholdingSummaryRow[];
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
