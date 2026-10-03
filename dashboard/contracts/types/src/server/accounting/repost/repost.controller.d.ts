import Elysia from "elysia";
/**
 * [P12.9] FR-6.9 HTTP surface.
 *
 * Gated on `journal_entry.submit` — a repost POSTS ledger entries, so the permission that
 * guards it is a posting permission, not a tool permission. Listing is the same doctype's
 * read.
 */
export declare const repostController: Elysia<"/accounting/repost", {
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
        repost: {};
    };
} & {
    accounting: {
        repost: {
            "voucher-types": {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: readonly ["sales_invoice", "purchase_invoice", "journal_entry", "payment_entry"];
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
        repost: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: ({
                        items: {
                            id: string;
                            status: import("../../../../generated/prisma/enums").RepostStatus;
                            voucherType: string;
                            voucherId: string;
                            voucherNo: string | null;
                            errorMessage: string | null;
                            glCountAfter: number | null;
                            repostId: string;
                        }[];
                    } & {
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        reason: string;
                        status: import("../../../../generated/prisma/enums").RepostStatus;
                        errorMessage: string | null;
                        completedAt: Date | null;
                    })[];
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
        repost: {
            candidates: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        voucherType: string;
                    };
                    headers: {};
                    response: {
                        200: import("@/server/accounting/repost/repost.service").RepostCandidate[];
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
        repost: {
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
                            items: {
                                id: string;
                                status: import("../../../../generated/prisma/enums").RepostStatus;
                                voucherType: string;
                                voucherId: string;
                                voucherNo: string | null;
                                errorMessage: string | null;
                                glCountAfter: number | null;
                                repostId: string;
                            }[];
                        } & {
                            id: string;
                            clinicId: string;
                            createdById: string | null;
                            createdAt: Date;
                            reason: string;
                            status: import("../../../../generated/prisma/enums").RepostStatus;
                            errorMessage: string | null;
                            completedAt: Date | null;
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
        repost: {
            post: {
                body: {
                    reason: string;
                    vouchers: {
                        voucherNo?: string | null | undefined;
                        voucherType: string;
                        voucherId: string;
                    }[];
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        items: {
                            id: string;
                            status: import("../../../../generated/prisma/enums").RepostStatus;
                            voucherType: string;
                            voucherId: string;
                            voucherNo: string | null;
                            errorMessage: string | null;
                            glCountAfter: number | null;
                            repostId: string;
                        }[];
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        reason: string;
                        status: import("../../../../generated/prisma/enums").RepostStatus;
                        errorMessage: string | null;
                        completedAt: Date | null;
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
        repost: {
            ":id": {
                run: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                repostId: string;
                                results: import("@/server/accounting/repost/repost.service").RepostVoucherResult[];
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
