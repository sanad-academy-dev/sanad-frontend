import Elysia from "elysia";
/**
 * [P7.6] Payment Reconciliation (FR-10.1) — fetch the two panes, then reconcile the
 * user's allocation rows. Reads gate on payment_entry.read; the reconcile action gates
 * on payment_entry.submit (it moves settlement, exactly like posting a payment).
 */
export declare const reconciliationController: Elysia<"/accounting/payment-reconciliation", {
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
        "payment-reconciliation": {};
    };
} & {
    accounting: {
        "payment-reconciliation": {
            get: {
                body: {};
                params: {};
                query: {
                    fromDate?: string | undefined;
                    toDate?: string | undefined;
                    minAmount?: string | undefined;
                    maxAmount?: string | undefined;
                    partyType: string;
                    partyId: string;
                };
                headers: {};
                response: {
                    200: import("./get-outstanding.service").OutstandingForParty;
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
        "payment-reconciliation": {
            reconcile: {
                post: {
                    body: {
                        partyType: string;
                        partyId: string;
                        allocations: {
                            differenceAmount?: string | null | undefined;
                            differenceAccountId?: string | null | undefined;
                            invoiceId: string;
                            paymentType: string;
                            allocatedAmount: string;
                            paymentId: string;
                            invoiceType: string;
                        }[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: import("@/server/accounting/payment-entry/reconciliation.service").ReconciliationResult[];
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
        "payment-reconciliation": {
            unreconcile: {
                post: {
                    body: {
                        remarks?: string | null | undefined;
                        partyType: string;
                        partyId: string;
                        paymentType: string;
                        paymentId: string;
                        selections: {
                            againstVoucherType: string;
                            againstVoucherId: string;
                        }[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: import("@/server/accounting/payment-entry/unreconcile.service").UnreconcileResult;
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
