import Elysia from "elysia";
import type { ScheduledJobStatus } from "@/generated/prisma/enums";
/**
 * [RC1] شاشة المُجدوِل — مراقبةٌ وتشغيلٌ يدويّ، كلّها مُبوَّبة بالصلاحيات.
 *
 * نبضةُ الـcron نفسها ليست هنا بل في `cron.controller.ts`: حارسُها سرٌّ مشترك لا
 * صلاحية، وعزلُها في ملفّها يُبقي كل مسارٍ هنا تحت رقابة
 * `ungated-routes.audit.test.ts` بدل إعفاء الملفّ كلّه.
 */
export declare const schedulerController: Elysia<"/scheduler", {
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
    scheduler: {};
} & {
    scheduler: {
        jobs: {
            get: {
                body: {};
                params: {};
                query: {
                    status?: "CANCELLED" | "QUEUED" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | undefined;
                    limit?: string | undefined;
                    jobType?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        result: import("@prisma/client/runtime/client").JsonValue;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        status: ScheduledJobStatus;
                        jobType: string;
                        idempotencyKey: string;
                        payload: import("@prisma/client/runtime/client").JsonValue;
                        attempts: number;
                        errorMessage: string | null;
                        startedAt: Date | null;
                        finishedAt: Date | null;
                        maxAttempts: number;
                        scheduledFor: Date;
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
    };
} & {
    scheduler: {
        "job-types": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        jobTypes: string[];
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
    scheduler: {
        "run-now": {
            post: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        enqueued: number;
                        run: import("@/server/scheduler/scheduler.runner").RunSummary;
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
    scheduler: {
        jobs: {
            ":id": {
                requeue: {
                    post: {
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
                            409: {
                                readonly message: "الوظيفة ليست في حالة فشل";
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
