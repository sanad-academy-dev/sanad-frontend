import Elysia from "elysia";
import type { ClaimRejectionResolution, InsuranceClaimStatus } from "@/generated/prisma/enums";
export declare const insuranceClaimController: Elysia<"/accounting/insurance-claims", {
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
            doctype: import("@/server/accounting/permissions/accounting-permissions").AccountingDoctypeKey;
            action: import("@/server/accounting/permissions/accounting-permissions").AccountingAction;
        };
    }>;
    macroFn: {
        readonly requireAccounting: (options: {
            doctype: import("@/server/accounting/permissions/accounting-permissions").AccountingDoctypeKey;
            action: import("@/server/accounting/permissions/accounting-permissions").AccountingAction;
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
                actor: import("@/server/accounting/permissions/accounting-permissions.guard").AccountingActor;
            }>;
        };
    };
    parser: {};
    response: {};
}, {
    accounting: {
        "insurance-claims": {};
    };
} & {
    accounting: {
        "insurance-claims": {
            get: {
                body: {};
                params: {};
                query: {
                    status?: string | undefined;
                    insurerId?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        owner: {
                            name: string;
                            id: string;
                        };
                        patient: {
                            name: string;
                            id: string;
                        };
                        invoice: {
                            id: string;
                            code: string;
                            total: import("@prisma/client-runtime-utils").Decimal;
                            copayShare: import("@prisma/client-runtime-utils").Decimal | null;
                        };
                        insurer: {
                            name: string;
                            id: string;
                        };
                        id: string;
                        createdAt: Date;
                        status: InsuranceClaimStatus;
                        submittedAt: Date | null;
                        documentNo: string | null;
                        policyNumberSnapshot: string;
                        serviceDate: Date;
                        claimedAmount: import("@prisma/client-runtime-utils").Decimal;
                        approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
                        settledAmount: import("@prisma/client-runtime-utils").Decimal;
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
        "insurance-claims": {
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
                            owner: {
                                name: string;
                                id: string;
                            };
                            patient: {
                                name: string;
                                id: string;
                            };
                            invoice: {
                                id: string;
                                code: string;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                copayShare: import("@prisma/client-runtime-utils").Decimal | null;
                            };
                            insurer: {
                                name: string;
                                id: string;
                            };
                            id: string;
                            createdAt: Date;
                            status: InsuranceClaimStatus;
                            submittedAt: Date | null;
                            documentNo: string | null;
                            policyId: string;
                            policyNumberSnapshot: string;
                            serviceDate: Date;
                            claimedAmount: import("@prisma/client-runtime-utils").Decimal;
                            approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            settledAmount: import("@prisma/client-runtime-utils").Decimal;
                            coverageSnapshot: import("@prisma/client/runtime/client").JsonValue;
                            adjudicatedAt: Date | null;
                            rejectionReason: string | null;
                            insurerReference: string | null;
                            rejectionResolution: ClaimRejectionResolution | null;
                            resolutionJournalEntryId: string | null;
                            resolvedAt: Date | null;
                            lines: {
                                id: string;
                                description: string;
                                idx: number;
                                lineRef: string;
                                lineTotal: import("@prisma/client-runtime-utils").Decimal;
                                coveragePercent: import("@prisma/client-runtime-utils").Decimal;
                                insurerAmount: import("@prisma/client-runtime-utils").Decimal;
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
        "insurance-claims": {
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
                                owner: {
                                    name: string;
                                    id: string;
                                };
                                patient: {
                                    name: string;
                                    id: string;
                                };
                                invoice: {
                                    id: string;
                                    code: string;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    copayShare: import("@prisma/client-runtime-utils").Decimal | null;
                                };
                                insurer: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                status: InsuranceClaimStatus;
                                submittedAt: Date | null;
                                documentNo: string | null;
                                policyId: string;
                                policyNumberSnapshot: string;
                                serviceDate: Date;
                                claimedAmount: import("@prisma/client-runtime-utils").Decimal;
                                approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                settledAmount: import("@prisma/client-runtime-utils").Decimal;
                                coverageSnapshot: import("@prisma/client/runtime/client").JsonValue;
                                adjudicatedAt: Date | null;
                                rejectionReason: string | null;
                                insurerReference: string | null;
                                rejectionResolution: ClaimRejectionResolution | null;
                                resolutionJournalEntryId: string | null;
                                resolvedAt: Date | null;
                                lines: {
                                    id: string;
                                    description: string;
                                    idx: number;
                                    lineRef: string;
                                    lineTotal: import("@prisma/client-runtime-utils").Decimal;
                                    coveragePercent: import("@prisma/client-runtime-utils").Decimal;
                                    insurerAmount: import("@prisma/client-runtime-utils").Decimal;
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
    };
} & {
    accounting: {
        "insurance-claims": {
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
                                owner: {
                                    name: string;
                                    id: string;
                                };
                                patient: {
                                    name: string;
                                    id: string;
                                };
                                invoice: {
                                    id: string;
                                    code: string;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    copayShare: import("@prisma/client-runtime-utils").Decimal | null;
                                };
                                insurer: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                status: InsuranceClaimStatus;
                                submittedAt: Date | null;
                                documentNo: string | null;
                                policyId: string;
                                policyNumberSnapshot: string;
                                serviceDate: Date;
                                claimedAmount: import("@prisma/client-runtime-utils").Decimal;
                                approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                settledAmount: import("@prisma/client-runtime-utils").Decimal;
                                coverageSnapshot: import("@prisma/client/runtime/client").JsonValue;
                                adjudicatedAt: Date | null;
                                rejectionReason: string | null;
                                insurerReference: string | null;
                                rejectionResolution: ClaimRejectionResolution | null;
                                resolutionJournalEntryId: string | null;
                                resolvedAt: Date | null;
                                lines: {
                                    id: string;
                                    description: string;
                                    idx: number;
                                    lineRef: string;
                                    lineTotal: import("@prisma/client-runtime-utils").Decimal;
                                    coveragePercent: import("@prisma/client-runtime-utils").Decimal;
                                    insurerAmount: import("@prisma/client-runtime-utils").Decimal;
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
    };
} & {
    accounting: {
        "insurance-claims": {
            ":id": {
                adjudicate: {
                    post: {
                        body: {
                            rejectionReason?: string | null | undefined;
                            insurerReference?: string | null | undefined;
                            approvedAmount: string;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                owner: {
                                    name: string;
                                    id: string;
                                };
                                patient: {
                                    name: string;
                                    id: string;
                                };
                                invoice: {
                                    id: string;
                                    code: string;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    copayShare: import("@prisma/client-runtime-utils").Decimal | null;
                                };
                                insurer: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                status: InsuranceClaimStatus;
                                submittedAt: Date | null;
                                documentNo: string | null;
                                policyId: string;
                                policyNumberSnapshot: string;
                                serviceDate: Date;
                                claimedAmount: import("@prisma/client-runtime-utils").Decimal;
                                approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                settledAmount: import("@prisma/client-runtime-utils").Decimal;
                                coverageSnapshot: import("@prisma/client/runtime/client").JsonValue;
                                adjudicatedAt: Date | null;
                                rejectionReason: string | null;
                                insurerReference: string | null;
                                rejectionResolution: ClaimRejectionResolution | null;
                                resolutionJournalEntryId: string | null;
                                resolvedAt: Date | null;
                                lines: {
                                    id: string;
                                    description: string;
                                    idx: number;
                                    lineRef: string;
                                    lineTotal: import("@prisma/client-runtime-utils").Decimal;
                                    coveragePercent: import("@prisma/client-runtime-utils").Decimal;
                                    insurerAmount: import("@prisma/client-runtime-utils").Decimal;
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
    };
} & {
    accounting: {
        "insurance-claims": {
            ":id": {
                "resolve-rejection": {
                    post: {
                        body: {
                            resolution: "REBILL_OWNER" | "WRITE_OFF";
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                owner: {
                                    name: string;
                                    id: string;
                                };
                                patient: {
                                    name: string;
                                    id: string;
                                };
                                invoice: {
                                    id: string;
                                    code: string;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    copayShare: import("@prisma/client-runtime-utils").Decimal | null;
                                };
                                insurer: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                status: InsuranceClaimStatus;
                                submittedAt: Date | null;
                                documentNo: string | null;
                                policyId: string;
                                policyNumberSnapshot: string;
                                serviceDate: Date;
                                claimedAmount: import("@prisma/client-runtime-utils").Decimal;
                                approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                settledAmount: import("@prisma/client-runtime-utils").Decimal;
                                coverageSnapshot: import("@prisma/client/runtime/client").JsonValue;
                                adjudicatedAt: Date | null;
                                rejectionReason: string | null;
                                insurerReference: string | null;
                                rejectionResolution: ClaimRejectionResolution | null;
                                resolutionJournalEntryId: string | null;
                                resolvedAt: Date | null;
                                lines: {
                                    id: string;
                                    description: string;
                                    idx: number;
                                    lineRef: string;
                                    lineTotal: import("@prisma/client-runtime-utils").Decimal;
                                    coveragePercent: import("@prisma/client-runtime-utils").Decimal;
                                    insurerAmount: import("@prisma/client-runtime-utils").Decimal;
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
