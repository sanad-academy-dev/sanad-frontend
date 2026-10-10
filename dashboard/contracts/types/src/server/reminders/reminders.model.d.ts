import Elysia from "elysia";
export declare const remindersModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
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
            /** أسباب مفصولة بفاصلة — فارغ = الكلّ */
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
}, {}, {
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
}>;
