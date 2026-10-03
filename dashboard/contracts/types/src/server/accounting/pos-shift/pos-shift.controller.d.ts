import Elysia from "elysia";
export declare const posShiftController: Elysia<"/accounting/pos-shifts", {
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
        "pos-shifts": {};
    };
} & {
    accounting: {
        "pos-shifts": {
            profiles: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            name: string;
                            id: string;
                            disabled: boolean;
                            writeOffAccountId: string | null;
                            users: {
                                userId: string;
                            }[];
                            warehouseId: string | null;
                            writeOffLimit: import("@prisma/client-runtime-utils").Decimal;
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
        "pos-shifts": {
            profiles: {
                post: {
                    body: {
                        disabled?: boolean | undefined;
                        writeOffAccountId?: string | null | undefined;
                        warehouseId?: string | null | undefined;
                        userIds?: string[] | undefined;
                        name: string;
                        writeOffLimit: string;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            name: string;
                            id: string;
                            disabled: boolean;
                            writeOffAccountId: string | null;
                            users: {
                                userId: string;
                            }[];
                            warehouseId: string | null;
                            writeOffLimit: import("@prisma/client-runtime-utils").Decimal;
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
        "pos-shifts": {
            current: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            profile: {
                                name: string;
                                id: string;
                            };
                            openedAt: Date;
                            balances: {
                                amount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("../../invoices/invoices.type").PaymentMethod;
                            }[];
                        } | null;
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
        "pos-shifts": {
            open: {
                post: {
                    body: {
                        profileId: string;
                        balances: {
                            amount: string;
                            paymentMethod: "CASH" | "CARD" | "TRANSFER";
                        }[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                            status: import("../../../../generated/prisma/enums").PosShiftStatus;
                            openedAt: Date;
                            balances: {
                                id: string;
                                amount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("../../invoices/invoices.type").PaymentMethod;
                                openingId: string;
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
} & {
    accounting: {
        "pos-shifts": {
            ":id": {
                expectation: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("@/server/accounting/pos-shift/pos-shift.service").ShiftExpectation[];
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
        "pos-shifts": {
            ":id": {
                close: {
                    post: {
                        body: {
                            counted: {
                                paymentMethod: "CASH" | "CARD" | "TRANSFER";
                                countedAmount: string;
                            }[];
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                balances: {
                                    id: string;
                                    paymentMethod: import("../../invoices/invoices.type").PaymentMethod;
                                    difference: import("@prisma/client-runtime-utils").Decimal;
                                    expectedAmount: import("@prisma/client-runtime-utils").Decimal;
                                    countedAmount: import("@prisma/client-runtime-utils").Decimal;
                                    closingId: string;
                                }[];
                                closedAt: Date;
                                totalDifference: import("@prisma/client-runtime-utils").Decimal;
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
        "pos-shifts": {
            register: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate?: string | undefined;
                        toDate?: string | undefined;
                    };
                    headers: {};
                    response: {
                        200: {
                            openingId: string;
                            profileName: string;
                            cashierName: string;
                            openedAt: Date;
                            closedAt: Date | null;
                            status: import("../../../../generated/prisma/enums").PosShiftStatus;
                            saleCount: number;
                            salesTotal: string;
                            totalDifference: string | null;
                            balances: {
                                paymentMethod: import("../../invoices/invoices.type").PaymentMethod;
                                difference: import("@prisma/client-runtime-utils").Decimal;
                                expectedAmount: import("@prisma/client-runtime-utils").Decimal;
                                countedAmount: import("@prisma/client-runtime-utils").Decimal;
                            }[];
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
