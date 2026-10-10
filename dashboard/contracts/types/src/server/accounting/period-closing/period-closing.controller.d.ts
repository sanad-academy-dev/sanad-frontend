import Elysia from "elysia";
/** [P10.2] HTTP surface for Period Closing Vouchers (FR-12.3). */
export declare const periodClosingController: Elysia<"/accounting/period-closing-vouchers", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "period-closing.create": import("@sinclair/typebox").TObject<{
            periodStartDate: import("@sinclair/typebox").TString;
            periodEndDate: import("@sinclair/typebox").TString;
            closingAccountHeadId: import("@sinclair/typebox").TString;
            remarks: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            granularByDimensions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
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
        "period-closing-vouchers": {};
    };
} & {
    accounting: {
        "period-closing-vouchers": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        fiscalYear: string;
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        remarks: string | null;
                        docstatus: import("@/server/accounting/period-closing/period-closing.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        postingDate: Date;
                        documentNo: string | null;
                        errorMessage: string | null;
                        periodStartDate: Date;
                        periodEndDate: Date;
                        closingAccountHeadId: string;
                        granularByDimensions: boolean;
                        gleProcessingStatus: import("../jobs/accounting-jobs.type").AccountingJobStatus;
                        closingAccountHead: {
                            accountName: string;
                            accountNumber: string | null;
                            rootType: import("../../../../generated/prisma/enums").AccountRootType;
                        };
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
        "period-closing-vouchers": {
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
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            updatedAt: Date;
                            remarks: string | null;
                            docstatus: import("@/server/accounting/period-closing/period-closing.type").DocStatus;
                            amendedFromId: string | null;
                            submittedAt: Date | null;
                            submittedById: string | null;
                            cancelledAt: Date | null;
                            cancelledById: string | null;
                            postingDate: Date;
                            documentNo: string | null;
                            errorMessage: string | null;
                            periodStartDate: Date;
                            periodEndDate: Date;
                            closingAccountHeadId: string;
                            granularByDimensions: boolean;
                            gleProcessingStatus: import("../jobs/accounting-jobs.type").AccountingJobStatus;
                            closingAccountHead: {
                                accountName: string;
                                accountNumber: string | null;
                                rootType: import("../../../../generated/prisma/enums").AccountRootType;
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
    };
} & {
    accounting: {
        "period-closing-vouchers": {
            post: {
                body: {
                    remarks?: string | null | undefined;
                    granularByDimensions?: boolean | undefined;
                    periodStartDate: string;
                    periodEndDate: string;
                    closingAccountHeadId: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        fiscalYear: string;
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        remarks: string | null;
                        docstatus: import("@/server/accounting/period-closing/period-closing.type").DocStatus;
                        amendedFromId: string | null;
                        submittedAt: Date | null;
                        submittedById: string | null;
                        cancelledAt: Date | null;
                        cancelledById: string | null;
                        postingDate: Date;
                        documentNo: string | null;
                        errorMessage: string | null;
                        periodStartDate: Date;
                        periodEndDate: Date;
                        closingAccountHeadId: string;
                        granularByDimensions: boolean;
                        gleProcessingStatus: import("../jobs/accounting-jobs.type").AccountingJobStatus;
                        closingAccountHead: {
                            accountName: string;
                            accountNumber: string | null;
                            rootType: import("../../../../generated/prisma/enums").AccountRootType;
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
        "period-closing-vouchers": {
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
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                remarks: string | null;
                                docstatus: import("@/server/accounting/period-closing/period-closing.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                postingDate: Date;
                                documentNo: string | null;
                                errorMessage: string | null;
                                periodStartDate: Date;
                                periodEndDate: Date;
                                closingAccountHeadId: string;
                                granularByDimensions: boolean;
                                gleProcessingStatus: import("../jobs/accounting-jobs.type").AccountingJobStatus;
                                closingAccountHead: {
                                    accountName: string;
                                    accountNumber: string | null;
                                    rootType: import("../../../../generated/prisma/enums").AccountRootType;
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
        };
    };
} & {
    accounting: {
        "period-closing-vouchers": {
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
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                remarks: string | null;
                                docstatus: import("@/server/accounting/period-closing/period-closing.type").DocStatus;
                                amendedFromId: string | null;
                                submittedAt: Date | null;
                                submittedById: string | null;
                                cancelledAt: Date | null;
                                cancelledById: string | null;
                                postingDate: Date;
                                documentNo: string | null;
                                errorMessage: string | null;
                                periodStartDate: Date;
                                periodEndDate: Date;
                                closingAccountHeadId: string;
                                granularByDimensions: boolean;
                                gleProcessingStatus: import("../jobs/accounting-jobs.type").AccountingJobStatus;
                                closingAccountHead: {
                                    accountName: string;
                                    accountNumber: string | null;
                                    rootType: import("../../../../generated/prisma/enums").AccountRootType;
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
        };
    };
} & {
    accounting: {
        "period-closing-vouchers": {
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
