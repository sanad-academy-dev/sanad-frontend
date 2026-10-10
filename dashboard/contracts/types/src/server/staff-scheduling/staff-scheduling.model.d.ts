import Elysia from "elysia";
export declare const staffSchedulingModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "staff-scheduling.settings.update": import("@sinclair/typebox").TObject<{
            shift: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MORNING">, import("@sinclair/typebox").TLiteral<"EVENING">, import("@sinclair/typebox").TLiteral<"BOTH">]>]>>;
            morningStartMinute: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            morningEndMinute: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            eveningStartMinute: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            eveningEndMinute: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            onlineBookingEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            inClinicAppointmentsEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            mobileClinicAppointmentsEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "staff-scheduling.working-hour.update": import("@sinclair/typebox").TObject<{
            isWorking: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            startMinute: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            endMinute: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
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
