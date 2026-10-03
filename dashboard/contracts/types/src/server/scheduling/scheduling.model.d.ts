import Elysia from "elysia";
export declare const schedulingModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "scheduling.update": import("@sinclair/typebox").TObject<{
            schedulingEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            workDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SUNDAY">, import("@sinclair/typebox").TLiteral<"MONDAY">, import("@sinclair/typebox").TLiteral<"TUESDAY">, import("@sinclair/typebox").TLiteral<"WEDNESDAY">, import("@sinclair/typebox").TLiteral<"THURSDAY">, import("@sinclair/typebox").TLiteral<"FRIDAY">, import("@sinclair/typebox").TLiteral<"SATURDAY">]>>>;
            shiftsEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            morningStartMinute: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            morningEndMinute: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            eveningStartMinute: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            eveningEndMinute: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            bookingRulesEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            appointmentBookingEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            onlineBookingEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            doubleBookingEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            appointmentBufferEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            appointmentBufferMinutes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            confirmationTimeoutEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            confirmationTimeoutHours: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"H12">, import("@sinclair/typebox").TLiteral<"H24">]>>;
            minimumBookingNoticeEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            minimumBookingNoticeHours: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"H12">, import("@sinclair/typebox").TLiteral<"H24">]>>;
            rescheduleNoticeEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            rescheduleNoticeHours: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"H12">, import("@sinclair/typebox").TLiteral<"H24">]>>;
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
