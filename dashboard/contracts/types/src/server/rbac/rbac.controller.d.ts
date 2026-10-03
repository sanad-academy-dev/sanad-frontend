import Elysia from "elysia";
/**
 * [RBAC P6] Roles & permissions administration.
 *
 * Gated by the `rbac` resource itself — the screen that hands out authority is one of the
 * most sensitive in the app, and it used to be reachable by any authenticated clinic
 * member (`staff-roles.controller.ts` checked a session and nothing else).
 *
 * `rbac.assign` is deliberately a separate permission from `rbac.update`: editing a role
 * creates authority, assigning one distributes it. Whoever holds both can promote
 * themselves.
 */
export declare const rbacController: Elysia<"/rbac", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "rbac.create-role": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "rbac.update-role": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "rbac.set-grants": import("@sinclair/typebox").TObject<{
            grants: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                key: import("@sinclair/typebox").TString;
                scope: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ALL">, import("@sinclair/typebox").TLiteral<"BRANCH">, import("@sinclair/typebox").TLiteral<"OWN">]>;
            }>>;
        }>;
        readonly "rbac.from-template": import("@sinclair/typebox").TObject<{
            templateKey: import("@sinclair/typebox").TString;
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "rbac.set-super-admin": import("@sinclair/typebox").TObject<{
            isSuperAdmin: import("@sinclair/typebox").TBoolean;
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
    rbac: {};
} & {
    rbac: {
        catalogue: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        groups: import("@/lib/rbac/rbac-catalogue").CatalogueGroup[];
                    };
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
    rbac: {
        roles: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("./rbac.type").RoleResponse[];
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
    rbac: {
        roles: {
            post: {
                body: {
                    description?: string | undefined;
                    name: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        name: string;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        description: string | null;
                        isSuperAdmin: boolean;
                        isSystem: boolean;
                        grants: Record<string, string>;
                        staffCount: number;
                    };
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
    };
} & {
    rbac: {
        templates: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        key: string;
                        labelAr: string;
                        labelEn: string;
                        descriptionAr: string;
                        group: "clinical" | "finance" | "accounting" | "hr" | "inventory" | "operations" | "admin";
                        grantCount: number;
                    }[];
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
    rbac: {
        roles: {
            "from-template": {
                post: {
                    body: {
                        name?: string | undefined;
                        templateKey: string;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            name: string;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            description: string | null;
                            isSuperAdmin: boolean;
                            isSystem: boolean;
                            grants: Record<string, string>;
                            staffCount: number;
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
                            readonly message: "القالب غير موجود";
                        };
                        409: {
                            readonly message: "اسم الدور مستخدم من قبل";
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
    rbac: {
        roles: {
            ":id": {
                patch: {
                    body: {
                        description?: string | undefined;
                        name: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./rbac.type").RoleResponse;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                        };
                        404: {
                            readonly message: "الدور غير موجود";
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
    rbac: {
        roles: {
            ":id": {
                grants: {
                    put: {
                        body: {
                            grants: {
                                key: string;
                                scope: "ALL" | "BRANCH" | "OWN";
                            }[];
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./rbac.type").RoleResponse;
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                            } | {
                                readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                            };
                            404: {
                                readonly message: "الدور غير موجود";
                            };
                            409: {
                                readonly message: "دور مدير النظام يتجاوز كل الفحوص — لا معنى لتحديد صلاحيات له";
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
    rbac: {
        roles: {
            ":id": {
                "super-admin": {
                    patch: {
                        body: {
                            isSuperAdmin: boolean;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./rbac.type").RoleResponse;
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                            } | {
                                readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                            };
                            404: {
                                readonly message: "الدور غير موجود";
                            };
                            409: {
                                readonly message: "لا يمكن إزالة آخر دور مدير نظام في الأكاديمية — ستفقد الأكاديمية القدرة على إدارة نفسها نهائيًا";
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
    rbac: {
        roles: {
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
                            success: boolean;
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
                            readonly message: "الدور غير موجود";
                        };
                        409: {
                            readonly message: "لا يمكن حذف دور النظام المُدمَج";
                        } | {
                            readonly message: "لا يمكن إزالة آخر دور مدير نظام في الأكاديمية — ستفقد الأكاديمية القدرة على إدارة نفسها نهائيًا";
                        } | {
                            readonly message: "لا يمكن حذف الدور لأنه مرتبط بموظفين";
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
