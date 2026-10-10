import Elysia from "elysia";
/**
 * [D6] نشر النتائج لوليّ أمر الطفل — واجهة الطاقم.
 *
 * وحدة مستقلّة لا إضافة على `lab-tests` و`radiology`: النشر فعلٌ واحد بقاعدة واحدة
 * يخصّ نوعَي الطلبات، وتوزيعه عليهما كان سيُنتج نسختين من الحكم نفسه تنحرفان.
 *
 * `staffId` يُحلّ من المستخدم لا يُرسله العميل: النشر يُنسب إلى من قرّره، وقبولُه من
 * الجسم يعني أن أي موظّف ينشر باسم مدرّب.
 */
export declare const resultsReleaseController: Elysia<"/results-release", {
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
    "results-release": {};
} & {
    "results-release": {
        lab: {
            ":id": {
                post: {
                    body: {
                        summary: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            releasedToOwnerAt: Date | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                        } | {
                            readonly message: "لا سجلّ طاقم لحسابك في هذه الأكاديمية";
                        };
                        422: {
                            readonly message: string;
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
        };
    };
} & {
    "results-release": {
        radiology: {
            ":id": {
                post: {
                    body: {
                        summary: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            releasedToOwnerAt: Date | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                        } | {
                            readonly message: "لا سجلّ طاقم لحسابك في هذه الأكاديمية";
                        };
                        422: {
                            readonly message: string;
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
        };
    };
} & {
    "results-release": {
        lab: {
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
                            id: string;
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
                            readonly message: string;
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
        };
    };
} & {
    "results-release": {
        radiology: {
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
                            id: string;
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
                            readonly message: string;
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
    resolve: {
        readonly staffId: string | null;
    };
    schema: {};
    standaloneSchema: {};
    response: import("elysia").ExtractErrorFromHandle<{
        readonly staffId: string | null;
    }>;
}>;
