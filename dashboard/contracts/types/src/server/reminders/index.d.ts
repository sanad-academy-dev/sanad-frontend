import Elysia from "elysia";
export declare const remindersServer: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "reminders.createRule": import("@sinclair/typebox").TObject<{
            trigger: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"VACCINATION_DUE">, import("@sinclair/typebox").TLiteral<"GROOMING_DUE">, import("@sinclair/typebox").TLiteral<"NUTRITION_RECHECK_DUE">, import("@sinclair/typebox").TLiteral<"APPOINTMENT_UPCOMING">, import("@sinclair/typebox").TLiteral<"APPOINTMENT_NO_SHOW">, import("@sinclair/typebox").TLiteral<"CARE_PLAN_VISIT_DUE">, import("@sinclair/typebox").TLiteral<"INVOICE_OVERDUE">, import("@sinclair/typebox").TLiteral<"MEMBERSHIP_RENEWAL">, import("@sinclair/typebox").TLiteral<"POST_OP_FOLLOW_UP">]>;
            name: import("@sinclair/typebox").TString;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            offsetHours: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            repeatAfterDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            maxSends: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            channels: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"INBOX">, import("@sinclair/typebox").TLiteral<"EMAIL">, import("@sinclair/typebox").TLiteral<"WHATSAPP">, import("@sinclair/typebox").TLiteral<"SMS">, import("@sinclair/typebox").TLiteral<"PUSH">]>>;
            subjectTemplate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            bodyTemplate: import("@sinclair/typebox").TString;
            quietHoursStart: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            quietHoursEnd: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            horizonDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>;
        readonly "reminders.updateRule": import("@sinclair/typebox").TObject<{
            trigger: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"VACCINATION_DUE">, import("@sinclair/typebox").TLiteral<"GROOMING_DUE">, import("@sinclair/typebox").TLiteral<"NUTRITION_RECHECK_DUE">, import("@sinclair/typebox").TLiteral<"APPOINTMENT_UPCOMING">, import("@sinclair/typebox").TLiteral<"APPOINTMENT_NO_SHOW">, import("@sinclair/typebox").TLiteral<"CARE_PLAN_VISIT_DUE">, import("@sinclair/typebox").TLiteral<"INVOICE_OVERDUE">, import("@sinclair/typebox").TLiteral<"MEMBERSHIP_RENEWAL">, import("@sinclair/typebox").TLiteral<"POST_OP_FOLLOW_UP">]>>;
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            offsetHours: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            repeatAfterDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            maxSends: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            channels: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"INBOX">, import("@sinclair/typebox").TLiteral<"EMAIL">, import("@sinclair/typebox").TLiteral<"WHATSAPP">, import("@sinclair/typebox").TLiteral<"SMS">, import("@sinclair/typebox").TLiteral<"PUSH">]>>>;
            subjectTemplate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            bodyTemplate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            quietHoursStart: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            quietHoursEnd: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            horizonDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>;
        readonly "reminders.previewRule": import("@sinclair/typebox").TObject<{
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>;
        readonly "reminders.runRule": import("@sinclair/typebox").TObject<{
            dryRun: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "reminders.outboxQuery": import("@sinclair/typebox").TObject<{
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"QUEUED">, import("@sinclair/typebox").TLiteral<"SENDING">, import("@sinclair/typebox").TLiteral<"SENT">, import("@sinclair/typebox").TLiteral<"FAILED">, import("@sinclair/typebox").TLiteral<"SKIPPED">, import("@sinclair/typebox").TLiteral<"CANCELLED">, import("@sinclair/typebox").TLiteral<"AWAITING_MANUAL">]>>;
            trigger: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"VACCINATION_DUE">, import("@sinclair/typebox").TLiteral<"GROOMING_DUE">, import("@sinclair/typebox").TLiteral<"NUTRITION_RECHECK_DUE">, import("@sinclair/typebox").TLiteral<"APPOINTMENT_UPCOMING">, import("@sinclair/typebox").TLiteral<"APPOINTMENT_NO_SHOW">, import("@sinclair/typebox").TLiteral<"CARE_PLAN_VISIT_DUE">, import("@sinclair/typebox").TLiteral<"INVOICE_OVERDUE">, import("@sinclair/typebox").TLiteral<"MEMBERSHIP_RENEWAL">, import("@sinclair/typebox").TLiteral<"POST_OP_FOLLOW_UP">]>>;
            ownerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "reminders.recallQuery": import("@sinclair/typebox").TObject<{
            triggers: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            horizonDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            includeHandled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            includeSnoozed: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            q: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "reminders.logContact": import("@sinclair/typebox").TObject<{
            ownerId: import("@sinclair/typebox").TString;
            patientId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            trigger: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"VACCINATION_DUE">, import("@sinclair/typebox").TLiteral<"GROOMING_DUE">, import("@sinclair/typebox").TLiteral<"NUTRITION_RECHECK_DUE">, import("@sinclair/typebox").TLiteral<"APPOINTMENT_UPCOMING">, import("@sinclair/typebox").TLiteral<"APPOINTMENT_NO_SHOW">, import("@sinclair/typebox").TLiteral<"CARE_PLAN_VISIT_DUE">, import("@sinclair/typebox").TLiteral<"INVOICE_OVERDUE">, import("@sinclair/typebox").TLiteral<"MEMBERSHIP_RENEWAL">, import("@sinclair/typebox").TLiteral<"POST_OP_FOLLOW_UP">]>;
            dedupeKey: import("@sinclair/typebox").TString;
            channel: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PHONE">, import("@sinclair/typebox").TLiteral<"WHATSAPP">, import("@sinclair/typebox").TLiteral<"EMAIL">, import("@sinclair/typebox").TLiteral<"SMS">, import("@sinclair/typebox").TLiteral<"IN_PERSON">, import("@sinclair/typebox").TLiteral<"INBOX">]>;
            outcome: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"BOOKED">, import("@sinclair/typebox").TLiteral<"NO_ANSWER">, import("@sinclair/typebox").TLiteral<"CALLBACK_REQUESTED">, import("@sinclair/typebox").TLiteral<"DECLINED">, import("@sinclair/typebox").TLiteral<"WRONG_NUMBER">, import("@sinclair/typebox").TLiteral<"SNOOZED">, import("@sinclair/typebox").TLiteral<"INFORMED">]>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            snoozedUntil: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            bookedAppointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
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
    reminders: {};
} & {
    reminders: {
        meta: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        triggers: {
                            key: string;
                            label: string;
                        }[];
                        channels: {
                            key: string;
                            label: string;
                            configured: boolean;
                        }[];
                        configuredChannels: import("./reminders.type").NotificationChannel[];
                        templateTags: readonly {
                            tag: string;
                            labelAr: string;
                        }[];
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
    reminders: {
        rules: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        name: string;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        active: boolean;
                        trigger: import("./reminders.type").ReminderTrigger;
                        horizonDays: number;
                        offsetHours: number;
                        repeatAfterDays: number | null;
                        maxSends: number;
                        channels: import("./reminders.type").NotificationChannel[];
                        subjectTemplate: string | null;
                        bodyTemplate: string;
                        quietHoursStart: number | null;
                        quietHoursEnd: number | null;
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
    reminders: {
        rules: {
            post: {
                body: {
                    active?: boolean | undefined;
                    horizonDays?: number | undefined;
                    offsetHours?: number | undefined;
                    repeatAfterDays?: number | null | undefined;
                    maxSends?: number | undefined;
                    subjectTemplate?: string | null | undefined;
                    quietHoursStart?: number | null | undefined;
                    quietHoursEnd?: number | null | undefined;
                    name: string;
                    trigger: "VACCINATION_DUE" | "GROOMING_DUE" | "NUTRITION_RECHECK_DUE" | "APPOINTMENT_UPCOMING" | "APPOINTMENT_NO_SHOW" | "CARE_PLAN_VISIT_DUE" | "INVOICE_OVERDUE" | "MEMBERSHIP_RENEWAL" | "POST_OP_FOLLOW_UP";
                    channels: ("WHATSAPP" | "EMAIL" | "SMS" | "INBOX" | "PUSH")[];
                    bodyTemplate: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        name: string;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        active: boolean;
                        trigger: import("./reminders.type").ReminderTrigger;
                        horizonDays: number;
                        offsetHours: number;
                        repeatAfterDays: number | null;
                        maxSends: number;
                        channels: import("./reminders.type").NotificationChannel[];
                        subjectTemplate: string | null;
                        bodyTemplate: string;
                        quietHoursStart: number | null;
                        quietHoursEnd: number | null;
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
                        readonly message: string;
                        readonly kind: import("./reminders.errors").RemindersErrorKind;
                    };
                    409: {
                        readonly message: string;
                        readonly kind: import("./reminders.errors").RemindersErrorKind;
                    };
                    422: {
                        readonly message: string;
                        readonly kind: import("./reminders.errors").RemindersErrorKind;
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
} & {
    reminders: {
        rules: {
            ":id": {
                put: {
                    body: {
                        name?: string | undefined;
                        active?: boolean | undefined;
                        trigger?: "VACCINATION_DUE" | "GROOMING_DUE" | "NUTRITION_RECHECK_DUE" | "APPOINTMENT_UPCOMING" | "APPOINTMENT_NO_SHOW" | "CARE_PLAN_VISIT_DUE" | "INVOICE_OVERDUE" | "MEMBERSHIP_RENEWAL" | "POST_OP_FOLLOW_UP" | undefined;
                        horizonDays?: number | undefined;
                        offsetHours?: number | undefined;
                        repeatAfterDays?: number | null | undefined;
                        maxSends?: number | undefined;
                        channels?: ("WHATSAPP" | "EMAIL" | "SMS" | "INBOX" | "PUSH")[] | undefined;
                        subjectTemplate?: string | null | undefined;
                        bodyTemplate?: string | undefined;
                        quietHoursStart?: number | null | undefined;
                        quietHoursEnd?: number | null | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            name: string;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            active: boolean;
                            trigger: import("./reminders.type").ReminderTrigger;
                            horizonDays: number;
                            offsetHours: number;
                            repeatAfterDays: number | null;
                            maxSends: number;
                            channels: import("./reminders.type").NotificationChannel[];
                            subjectTemplate: string | null;
                            bodyTemplate: string;
                            quietHoursStart: number | null;
                            quietHoursEnd: number | null;
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
                            readonly message: string;
                            readonly kind: import("./reminders.errors").RemindersErrorKind;
                        };
                        409: {
                            readonly message: string;
                            readonly kind: import("./reminders.errors").RemindersErrorKind;
                        };
                        422: {
                            readonly message: string;
                            readonly kind: import("./reminders.errors").RemindersErrorKind;
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
    reminders: {
        rules: {
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
                            readonly message: string;
                            readonly kind: import("./reminders.errors").RemindersErrorKind;
                        };
                        409: {
                            readonly message: string;
                            readonly kind: import("./reminders.errors").RemindersErrorKind;
                        };
                        422: {
                            readonly message: string;
                            readonly kind: import("./reminders.errors").RemindersErrorKind;
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
    reminders: {
        rules: {
            ":id": {
                preview: {
                    post: {
                        body: {
                            limit?: number | undefined;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                summary: import("./reminders.type").EnqueueSummary;
                                preview: import("./reminders.type").PreviewRow[];
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
                                readonly message: string;
                                readonly kind: import("./reminders.errors").RemindersErrorKind;
                            };
                            409: {
                                readonly message: string;
                                readonly kind: import("./reminders.errors").RemindersErrorKind;
                            };
                            422: {
                                readonly message: string;
                                readonly kind: import("./reminders.errors").RemindersErrorKind;
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
    };
} & {
    reminders: {
        rules: {
            ":id": {
                run: {
                    post: {
                        body: {
                            dryRun?: boolean | undefined;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./reminders.type").EnqueueSummary;
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                            } | {
                                readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                            };
                            404: {
                                readonly message: string;
                                readonly kind: import("./reminders.errors").RemindersErrorKind;
                            };
                            409: {
                                readonly message: string;
                                readonly kind: import("./reminders.errors").RemindersErrorKind;
                            };
                            422: {
                                readonly message: string;
                                readonly kind: import("./reminders.errors").RemindersErrorKind;
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
    };
} & {
    reminders: {
        outbox: {
            get: {
                body: {};
                params: {};
                query: {
                    status?: "CANCELLED" | "QUEUED" | "FAILED" | "SKIPPED" | "SENT" | "SENDING" | "AWAITING_MANUAL" | undefined;
                    limit?: string | undefined;
                    ownerId?: string | undefined;
                    trigger?: "VACCINATION_DUE" | "GROOMING_DUE" | "NUTRITION_RECHECK_DUE" | "APPOINTMENT_UPCOMING" | "APPOINTMENT_NO_SHOW" | "CARE_PLAN_VISIT_DUE" | "INVOICE_OVERDUE" | "MEMBERSHIP_RENEWAL" | "POST_OP_FOLLOW_UP" | undefined;
                };
                headers: {};
                response: {
                    200: {
                        owner: {
                            name: string;
                            id: string;
                            phone: string;
                        } | null;
                        patient: {
                            name: string;
                            id: string;
                            code: string;
                        } | null;
                        subject: string | null;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        status: import("./reminders.type").OutboxStatus;
                        body: string;
                        appointmentId: string | null;
                        patientId: string | null;
                        ownerId: string | null;
                        attempts: number;
                        ruleId: string | null;
                        toAddress: string | null;
                        sentAt: Date | null;
                        channel: import("./reminders.type").NotificationChannel;
                        trigger: import("./reminders.type").ReminderTrigger | null;
                        maxAttempts: number;
                        recipientKind: import("../../../generated/prisma/enums").OutboxRecipientKind;
                        dedupeKey: string;
                        scheduledFor: Date;
                        failedAt: Date | null;
                        lastError: string | null;
                        manualLink: string | null;
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
    reminders: {
        outbox: {
            counts: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: Record<string, number>;
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
    };
} & {
    reminders: {
        outbox: {
            dispatch: {
                post: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: import("./outbox.service").DispatchSummary;
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
    };
} & {
    reminders: {
        outbox: {
            ":id": {
                "mark-sent": {
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
                            404: {
                                readonly message: string;
                                readonly kind: import("./reminders.errors").RemindersErrorKind;
                            };
                            409: {
                                readonly message: string;
                                readonly kind: import("./reminders.errors").RemindersErrorKind;
                            };
                            422: {
                                readonly message: string;
                                readonly kind: import("./reminders.errors").RemindersErrorKind;
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
    };
} & {
    reminders: {
        outbox: {
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
                                cancelled: number;
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
                                readonly message: string;
                                readonly kind: import("./reminders.errors").RemindersErrorKind;
                            };
                            409: {
                                readonly message: string;
                                readonly kind: import("./reminders.errors").RemindersErrorKind;
                            };
                            422: {
                                readonly message: string;
                                readonly kind: import("./reminders.errors").RemindersErrorKind;
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
    };
} & {
    reminders: {
        recall: {
            get: {
                body: {};
                params: {};
                query: {
                    q?: string | undefined;
                    horizonDays?: string | undefined;
                    triggers?: string | undefined;
                    includeHandled?: string | undefined;
                    includeSnoozed?: string | undefined;
                };
                headers: {};
                response: {
                    200: import("./reminders.type").RecallBoard;
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
    reminders: {
        recall: {
            contacts: {
                post: {
                    body: {
                        notes?: string | null | undefined;
                        patientId?: string | null | undefined;
                        snoozedUntil?: string | null | undefined;
                        bookedAppointmentId?: string | null | undefined;
                        ownerId: string;
                        channel: "PHONE" | "WHATSAPP" | "EMAIL" | "SMS" | "INBOX" | "IN_PERSON";
                        trigger: "VACCINATION_DUE" | "GROOMING_DUE" | "NUTRITION_RECHECK_DUE" | "APPOINTMENT_UPCOMING" | "APPOINTMENT_NO_SHOW" | "CARE_PLAN_VISIT_DUE" | "INVOICE_OVERDUE" | "MEMBERSHIP_RENEWAL" | "POST_OP_FOLLOW_UP";
                        outcome: "DECLINED" | "NO_ANSWER" | "BOOKED" | "CALLBACK_REQUESTED" | "WRONG_NUMBER" | "SNOOZED" | "INFORMED";
                        dedupeKey: string;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            contact: {
                                patient: {
                                    name: string;
                                    id: string;
                                } | null;
                                id: string;
                                clinicId: string;
                                notes: string | null;
                                patientId: string | null;
                                ownerId: string;
                                channel: import("./reminders.type").RecallContactChannel;
                                trigger: import("./reminders.type").ReminderTrigger;
                                outcome: import("./reminders.type").RecallOutcome;
                                dedupeKey: string;
                                snoozedUntil: Date | null;
                                bookedAppointmentId: string | null;
                                contactedById: string | null;
                                contactedAt: Date;
                                contactedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                            };
                            cancelledMessages: number;
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
                            readonly message: string;
                            readonly kind: import("./reminders.errors").RemindersErrorKind;
                        };
                        409: {
                            readonly message: string;
                            readonly kind: import("./reminders.errors").RemindersErrorKind;
                        };
                        422: {
                            readonly message: string;
                            readonly kind: import("./reminders.errors").RemindersErrorKind;
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
    reminders: {
        recall: {
            contacts: {
                ":ownerId": {
                    get: {
                        body: {};
                        params: {
                            ownerId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                patient: {
                                    name: string;
                                    id: string;
                                } | null;
                                id: string;
                                clinicId: string;
                                notes: string | null;
                                patientId: string | null;
                                ownerId: string;
                                channel: import("./reminders.type").RecallContactChannel;
                                trigger: import("./reminders.type").ReminderTrigger;
                                outcome: import("./reminders.type").RecallOutcome;
                                dedupeKey: string;
                                snoozedUntil: Date | null;
                                bookedAppointmentId: string | null;
                                contactedById: string | null;
                                contactedAt: Date;
                                contactedBy: {
                                    name: string;
                                    id: string;
                                } | null;
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
        };
    };
} & {
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
                        status: import("../../../generated/prisma/enums").ScheduledJobStatus;
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
                        run: import("../scheduler/scheduler.runner").RunSummary;
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
} & {
    cron: {
        tick: {
            post: {
                body: unknown;
                params: {};
                query: {
                    limit?: string | undefined;
                };
                headers: {
                    "x-cron-secret"?: string | undefined;
                };
                response: {
                    200: {
                        ranAt: string;
                        enqueued: number;
                        run: import("../scheduler/scheduler.runner").RunSummary;
                        ok: boolean;
                    };
                    401: {
                        readonly message: "غير مصرح";
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
                    503: {
                        readonly message: "المُجدوِل غير مُهيّأ: اضبط CRON_SECRET (٣٢ محرفًا فأكثر) لتفعيل نبضة التذكيرات";
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
