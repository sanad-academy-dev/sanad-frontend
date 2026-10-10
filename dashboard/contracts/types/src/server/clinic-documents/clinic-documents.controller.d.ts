import Elysia from "elysia";
export declare const clinicDocumentsController: Elysia<"/clinic-documents", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "clinic-documents.create": import("@sinclair/typebox").TObject<{
            category: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LICENSE">, import("@sinclair/typebox").TLiteral<"REGISTRATION">, import("@sinclair/typebox").TLiteral<"CONTRACT">, import("@sinclair/typebox").TLiteral<"INSURANCE">, import("@sinclair/typebox").TLiteral<"POLICY">, import("@sinclair/typebox").TLiteral<"FINANCIAL">, import("@sinclair/typebox").TLiteral<"OTHER">]>;
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"FILE">, import("@sinclair/typebox").TLiteral<"LINK">]>;
            title: import("@sinclair/typebox").TString;
            url: import("@sinclair/typebox").TString;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            issuedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            expiresAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            mimeType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            sizeBytes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
        }>;
        readonly "clinic-documents.update": import("@sinclair/typebox").TObject<{
            category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LICENSE">, import("@sinclair/typebox").TLiteral<"REGISTRATION">, import("@sinclair/typebox").TLiteral<"CONTRACT">, import("@sinclair/typebox").TLiteral<"INSURANCE">, import("@sinclair/typebox").TLiteral<"POLICY">, import("@sinclair/typebox").TLiteral<"FINANCIAL">, import("@sinclair/typebox").TLiteral<"OTHER">]>>;
            title: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            issuedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            expiresAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "clinic-documents.list": import("@sinclair/typebox").TObject<{
            category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LICENSE">, import("@sinclair/typebox").TLiteral<"REGISTRATION">, import("@sinclair/typebox").TLiteral<"CONTRACT">, import("@sinclair/typebox").TLiteral<"INSURANCE">, import("@sinclair/typebox").TLiteral<"POLICY">, import("@sinclair/typebox").TLiteral<"FINANCIAL">, import("@sinclair/typebox").TLiteral<"OTHER">]>>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            expiry: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"all">, import("@sinclair/typebox").TLiteral<"valid">, import("@sinclair/typebox").TLiteral<"expiring">, import("@sinclair/typebox").TLiteral<"expired">]>>;
            search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            kind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"FILE">, import("@sinclair/typebox").TLiteral<"LINK">]>>;
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
        readonly requirePermission: {
            resource: string;
            action: string;
            minimumScope?: import("../../lib/rbac/rbac-registry").PermissionScope;
        };
    }>;
    macroFn: {
        readonly requirePermission: (options: {
            resource: string;
            action: string;
            minimumScope?: import("../../lib/rbac/rbac-registry").PermissionScope;
        }) => {
            readonly resolve: ({ request }: {
                request: Request;
            }) => Promise<import("elysia").ElysiaCustomStatusResponse<401, {
                readonly message: "غير مصرح";
            }, 401> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
            }, 403> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
            }, 403> | {
                clinicId: string;
                userId: string;
                staffId: string | null;
                branchId: string | null;
                isSuperAdmin: boolean;
                scopeKind: string;
                scopeBranchId: string | null;
                scopeStaffId: string | null;
            }>;
        };
    };
    parser: {};
    response: {};
}, {
    "clinic-documents": {};
} & {
    "clinic-documents": {
        get: {
            body: {};
            params: {};
            query: {
                search?: string | undefined;
                branchId?: string | undefined;
                kind?: "FILE" | "LINK" | undefined;
                category?: "INSURANCE" | "OTHER" | "LICENSE" | "REGISTRATION" | "CONTRACT" | "POLICY" | "FINANCIAL" | undefined;
                expiry?: "all" | "valid" | "expiring" | "expired" | undefined;
            };
            headers: {};
            response: {
                200: {
                    branch: {
                        name: string;
                        id: string;
                    } | null;
                    url: string;
                    id: string;
                    clinicId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    title: string;
                    branchId: string | null;
                    expiresAt: Date | null;
                    kind: import("./clinic-documents.type").DocumentKind;
                    author: {
                        name: string;
                        id: string;
                    };
                    category: import("./clinic-documents.type").ClinicDocumentCategory;
                    mimeType: string | null;
                    sizeBytes: number | null;
                    issuedAt: Date | null;
                }[];
                401: {
                    readonly message: "غير مصرح";
                };
                403: {
                    readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                } | {
                    readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
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
} & {
    "clinic-documents": {
        summary: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("./clinic-documents.type").ClinicDocumentSummary;
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                    } | {
                        readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                    };
                };
            };
        };
    };
} & {
    "clinic-documents": {
        post: {
            body: {
                description?: string | null | undefined;
                branchId?: string | null | undefined;
                expiresAt?: string | null | undefined;
                mimeType?: string | null | undefined;
                sizeBytes?: number | null | undefined;
                issuedAt?: string | null | undefined;
                url: string;
                title: string;
                kind: "FILE" | "LINK";
                category: "INSURANCE" | "OTHER" | "LICENSE" | "REGISTRATION" | "CONTRACT" | "POLICY" | "FINANCIAL";
            };
            params: {};
            query: {};
            headers: {};
            response: {
                201: {
                    branch: {
                        name: string;
                        id: string;
                    } | null;
                    url: string;
                    id: string;
                    clinicId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    title: string;
                    branchId: string | null;
                    expiresAt: Date | null;
                    kind: import("./clinic-documents.type").DocumentKind;
                    author: {
                        name: string;
                        id: string;
                    };
                    category: import("./clinic-documents.type").ClinicDocumentCategory;
                    mimeType: string | null;
                    sizeBytes: number | null;
                    issuedAt: Date | null;
                };
                401: {
                    readonly message: "غير مصرح";
                };
                403: {
                    readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                } | {
                    readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                };
                404: {
                    readonly message: "الفرع غير موجود";
                };
                422: {
                    readonly message: "الرابط يجب أن يبدأ بـ http أو https";
                } | {
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
} & {
    "clinic-documents": {
        ":id": {
            patch: {
                body: {
                    description?: string | null | undefined;
                    title?: string | undefined;
                    branchId?: string | null | undefined;
                    expiresAt?: string | null | undefined;
                    category?: "INSURANCE" | "OTHER" | "LICENSE" | "REGISTRATION" | "CONTRACT" | "POLICY" | "FINANCIAL" | undefined;
                    issuedAt?: string | null | undefined;
                };
                params: {
                    id: string;
                };
                query: {};
                headers: {};
                response: {
                    200: {
                        branch: {
                            name: string;
                            id: string;
                        } | null;
                        url: string;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        description: string | null;
                        title: string;
                        branchId: string | null;
                        expiresAt: Date | null;
                        kind: import("./clinic-documents.type").DocumentKind;
                        author: {
                            name: string;
                            id: string;
                        };
                        category: import("./clinic-documents.type").ClinicDocumentCategory;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        issuedAt: Date | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                    } | {
                        readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                    };
                    404: {
                        readonly message: "المستند غير موجود";
                    } | {
                        readonly message: "الفرع غير موجود";
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
    "clinic-documents": {
        ":id": {
            delete: {
                body: {};
                params: {
                    id: string;
                };
                query: {};
                headers: {};
                response: {
                    200: {
                        ok: boolean;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                    } | {
                        readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
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
