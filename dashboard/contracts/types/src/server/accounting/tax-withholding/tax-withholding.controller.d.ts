import Elysia from "elysia";
export declare const taxWithholdingController: Elysia<"/accounting/tax-withholding", {
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
        "tax-withholding": {};
    };
} & {
    accounting: {
        "tax-withholding": {
            categories: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            disabled: boolean;
                            title: string;
                            accountId: string | null;
                            basis: import("../../../../generated/prisma/enums").TaxWithholdingBasis;
                            taxOnExcessAmount: boolean;
                            roundOffTaxAmount: boolean;
                            disableSingleThreshold: boolean;
                            disableCumulativeThreshold: boolean;
                            rates: {
                                id: string;
                                rate: import("@prisma/client-runtime-utils").Decimal;
                                fromDate: Date;
                                toDate: Date;
                                singleThreshold: import("@prisma/client-runtime-utils").Decimal;
                                cumulativeThreshold: import("@prisma/client-runtime-utils").Decimal;
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
    };
} & {
    accounting: {
        "tax-withholding": {
            categories: {
                post: {
                    body: {
                        accountId?: string | null | undefined;
                        disabled: boolean;
                        title: string;
                        basis: "GROSS" | "NET";
                        taxOnExcessAmount: boolean;
                        roundOffTaxAmount: boolean;
                        disableSingleThreshold: boolean;
                        disableCumulativeThreshold: boolean;
                        rates: {
                            rate: string;
                            fromDate: string;
                            toDate: string;
                            singleThreshold: string;
                            cumulativeThreshold: string;
                        }[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                            disabled: boolean;
                            title: string;
                            accountId: string | null;
                            basis: import("../../../../generated/prisma/enums").TaxWithholdingBasis;
                            taxOnExcessAmount: boolean;
                            roundOffTaxAmount: boolean;
                            disableSingleThreshold: boolean;
                            disableCumulativeThreshold: boolean;
                            rates: {
                                id: string;
                                rate: import("@prisma/client-runtime-utils").Decimal;
                                fromDate: Date;
                                toDate: Date;
                                singleThreshold: import("@prisma/client-runtime-utils").Decimal;
                                cumulativeThreshold: import("@prisma/client-runtime-utils").Decimal;
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
        "tax-withholding": {
            categories: {
                ":id": {
                    patch: {
                        body: {
                            accountId?: string | null | undefined;
                            disabled: boolean;
                            title: string;
                            basis: "GROSS" | "NET";
                            taxOnExcessAmount: boolean;
                            roundOffTaxAmount: boolean;
                            disableSingleThreshold: boolean;
                            disableCumulativeThreshold: boolean;
                            rates: {
                                rate: string;
                                fromDate: string;
                                toDate: string;
                                singleThreshold: string;
                                cumulativeThreshold: string;
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
                                disabled: boolean;
                                title: string;
                                accountId: string | null;
                                basis: import("../../../../generated/prisma/enums").TaxWithholdingBasis;
                                taxOnExcessAmount: boolean;
                                roundOffTaxAmount: boolean;
                                disableSingleThreshold: boolean;
                                disableCumulativeThreshold: boolean;
                                rates: {
                                    id: string;
                                    rate: import("@prisma/client-runtime-utils").Decimal;
                                    fromDate: Date;
                                    toDate: Date;
                                    singleThreshold: import("@prisma/client-runtime-utils").Decimal;
                                    cumulativeThreshold: import("@prisma/client-runtime-utils").Decimal;
                                }[];
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "فئة الاستقطاع غير موجودة";
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
        "tax-withholding": {
            details: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate?: string | undefined;
                        toDate?: string | undefined;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/tax-withholding/tax-withholding.report").WithholdingDetailRow[];
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
        "tax-withholding": {
            summary: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        fromDate?: string | undefined;
                        toDate?: string | undefined;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/tax-withholding/tax-withholding.report").WithholdingSummaryRow[];
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
        "tax-withholding": {
            entries: {
                ":id": {
                    certificate: {
                        patch: {
                            body: {
                                certificateNo?: string | null | undefined;
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
                                    createdById: string | null;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    rate: import("@prisma/client-runtime-utils").Decimal;
                                    taxAmount: import("@prisma/client-runtime-utils").Decimal;
                                    partyType: string;
                                    partyId: string;
                                    postingDate: Date;
                                    voucherType: string;
                                    voucherId: string;
                                    voucherNo: string;
                                    taxableAmount: import("@prisma/client-runtime-utils").Decimal;
                                    categoryId: string;
                                    certificateNo: string | null;
                                };
                                401: {
                                    readonly message: "غير مصرح";
                                };
                                403: {
                                    readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                                };
                                404: {
                                    readonly message: "سجل الاستقطاع غير موجود";
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
