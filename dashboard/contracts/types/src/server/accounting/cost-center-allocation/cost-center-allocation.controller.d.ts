import Elysia from "elysia";
export declare const costCenterAllocationController: Elysia<"/accounting/cost-center-allocations", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "accounting-cost-center-allocation.list": import("@sinclair/typebox").TObject<{
            docstatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"SUBMITTED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "accounting-cost-center-allocation.create": import("@sinclair/typebox").TObject<{
            mainCostCenterId: import("@sinclair/typebox").TString;
            validFrom: import("@sinclair/typebox").TString;
            rows: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                costCenterId: import("@sinclair/typebox").TString;
                percentage: import("@sinclair/typebox").TString;
            }>>;
        }>;
        readonly "accounting-cost-center-allocation.update": import("@sinclair/typebox").TObject<{
            mainCostCenterId: import("@sinclair/typebox").TString;
            validFrom: import("@sinclair/typebox").TString;
            rows: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                costCenterId: import("@sinclair/typebox").TString;
                percentage: import("@sinclair/typebox").TString;
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
        "cost-center-allocations": {};
    };
} & {
    accounting: {
        "cost-center-allocations": {
            get: {
                body: {};
                params: {};
                query: {
                    limit?: number | undefined;
                    docstatus?: "DRAFT" | "SUBMITTED" | "CANCELLED" | undefined;
                };
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        docstatus: import("./cost-center-allocation.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        documentNo: string | null;
                        percentages: {
                            costCenter: {
                                costCenterName: string;
                                costCenterNumber: string | null;
                            };
                            id: string;
                            costCenterId: string;
                            percentage: import("@prisma/client-runtime-utils").Decimal;
                        }[];
                        mainCostCenterId: string;
                        validFrom: Date;
                        mainCostCenter: {
                            id: string;
                            costCenterName: string;
                            costCenterNumber: string | null;
                        };
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
        "cost-center-allocations": {
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
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            docstatus: import("./cost-center-allocation.type").DocStatus;
                            amendedFromId: string | null;
                            submittedAt: Date | null;
                            submittedById: string | null;
                            cancelledAt: Date | null;
                            cancelledById: string | null;
                            documentNo: string | null;
                            percentages: {
                                costCenter: {
                                    costCenterName: string;
                                    costCenterNumber: string | null;
                                };
                                id: string;
                                costCenterId: string;
                                percentage: import("@prisma/client-runtime-utils").Decimal;
                            }[];
                            mainCostCenterId: string;
                            validFrom: Date;
                            mainCostCenter: {
                                id: string;
                                costCenterName: string;
                                costCenterNumber: string | null;
                            };
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "المستند غير موجود";
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
        "cost-center-allocations": {
            post: {
                body: {
                    rows: {
                        costCenterId: string;
                        percentage: string;
                    }[];
                    mainCostCenterId: string;
                    validFrom: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        docstatus: import("./cost-center-allocation.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        documentNo: string | null;
                        percentages: {
                            costCenter: {
                                costCenterName: string;
                                costCenterNumber: string | null;
                            };
                            id: string;
                            costCenterId: string;
                            percentage: import("@prisma/client-runtime-utils").Decimal;
                        }[];
                        mainCostCenterId: string;
                        validFrom: Date;
                        mainCostCenter: {
                            id: string;
                            costCenterName: string;
                            costCenterNumber: string | null;
                        };
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
        "cost-center-allocations": {
            ":id": {
                patch: {
                    body: {
                        rows: {
                            costCenterId: string;
                            percentage: string;
                        }[];
                        mainCostCenterId: string;
                        validFrom: string;
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
                            docstatus: import("./cost-center-allocation.type").DocStatus;
                            amendedFromId: string | null;
                            submittedAt: Date | null;
                            submittedById: string | null;
                            cancelledAt: Date | null;
                            cancelledById: string | null;
                            documentNo: string | null;
                            percentages: {
                                costCenter: {
                                    costCenterName: string;
                                    costCenterNumber: string | null;
                                };
                                id: string;
                                costCenterId: string;
                                percentage: import("@prisma/client-runtime-utils").Decimal;
                            }[];
                            mainCostCenterId: string;
                            validFrom: Date;
                            mainCostCenter: {
                                id: string;
                                costCenterName: string;
                                costCenterNumber: string | null;
                            };
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                        };
                        404: {
                            readonly message: "المستند غير موجود";
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
        "cost-center-allocations": {
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
                            200: import("./cost-center-allocation.type").CostCenterAllocationVoucher;
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "المستند غير موجود";
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
        "cost-center-allocations": {
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
                            200: import("./cost-center-allocation.type").CostCenterAllocationVoucher;
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "المستند غير موجود";
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
        "cost-center-allocations": {
            ":id": {
                amend: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./cost-center-allocation.type").CostCenterAllocationVoucher;
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string} ${string}`;
                            };
                            404: {
                                readonly message: "المستند غير موجود";
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
