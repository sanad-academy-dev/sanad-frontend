import Elysia from "elysia";
export declare const notificationsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "notifications.update": import("@sinclair/typebox").TObject<{
            emailEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            customerFollowUp: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            systemUpdates: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            emailBookings: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            emailAppointmentUpdates: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            emailAppointmentCancellations: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            emailReminderApprovalEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            emailReminderApprovalHours: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            emailReminderFollowUpEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            emailReminderFollowUpHours: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            emailReminderPaymentEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            emailReminderPaymentHours: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            emailReminderCommentsEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            emailInvoices: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            emailFormRequest: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            emailFormFollowUp: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            emailTreatmentFollowUp: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
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
