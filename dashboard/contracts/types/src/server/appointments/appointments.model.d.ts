import Elysia from "elysia";
export declare const appointmentsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "appointments.create": import("@sinclair/typebox").TObject<{
            ownerId: import("@sinclair/typebox").TString;
            patientId: import("@sinclair/typebox").TString;
            staffId: import("@sinclair/typebox").TString;
            serviceIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            startsAt: import("@sinclair/typebox").TString;
            roomId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            location: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"IN_CLINIC">, import("@sinclair/typebox").TLiteral<"REMOTE">, import("@sinclair/typebox").TLiteral<"HOME_VISIT">, import("@sinclair/typebox").TLiteral<"MOBILE_CLINIC">]>>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SCHEDULED">, import("@sinclair/typebox").TLiteral<"WAITING">]>>;
            priority: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"URGENT">]>]>>;
            isEmergency: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            consultationTypeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            clinicalNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            whatsappReminderEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            images: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            repeatCount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            repeatUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DAY">, import("@sinclair/typebox").TLiteral<"WEEK">, import("@sinclair/typebox").TLiteral<"TWO_WEEKS">, import("@sinclair/typebox").TLiteral<"MONTH">, import("@sinclair/typebox").TLiteral<"YEAR">]>>;
            enrollmentVisitId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "appointments.slotsQuery": import("@sinclair/typebox").TObject<{
            staffId: import("@sinclair/typebox").TString;
            date: import("@sinclair/typebox").TString;
            durationMinutes: import("@sinclair/typebox").TNumber;
            excludeAppointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "appointments.staffByServicesQuery": import("@sinclair/typebox").TObject<{
            serviceIds: import("@sinclair/typebox").TString;
        }>;
        readonly "appointments.updateStatus": import("@sinclair/typebox").TObject<{
            status: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SCHEDULED">, import("@sinclair/typebox").TLiteral<"WAITING">, import("@sinclair/typebox").TLiteral<"CHECK_IN">, import("@sinclair/typebox").TLiteral<"IN_SERVICE">, import("@sinclair/typebox").TLiteral<"HOSPITALIZED">, import("@sinclair/typebox").TLiteral<"AWAITING_PAYMENT">, import("@sinclair/typebox").TLiteral<"DONE">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>;
        }>;
        readonly "appointments.listQuery": import("@sinclair/typebox").TObject<{
            period: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"day">, import("@sinclair/typebox").TLiteral<"week">, import("@sinclair/typebox").TLiteral<"all">]>>;
            view: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"all">, import("@sinclair/typebox").TLiteral<"for-me">]>>;
        }>;
        readonly "appointments.updateReason": import("@sinclair/typebox").TObject<{
            reason: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>;
        }>;
        readonly "appointments.updateLocation": import("@sinclair/typebox").TObject<{
            location: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"IN_CLINIC">, import("@sinclair/typebox").TLiteral<"REMOTE">, import("@sinclair/typebox").TLiteral<"HOME_VISIT">, import("@sinclair/typebox").TLiteral<"MOBILE_CLINIC">]>;
        }>;
        readonly "appointments.createComment": import("@sinclair/typebox").TObject<{
            body: import("@sinclair/typebox").TString;
        }>;
        readonly "appointments.createInternalNote": import("@sinclair/typebox").TObject<{
            body: import("@sinclair/typebox").TString;
            mentionedStaffIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>;
        readonly "appointments.updateInternalNote": import("@sinclair/typebox").TObject<{
            body: import("@sinclair/typebox").TString;
        }>;
        readonly "appointments.updateQueueStatus": import("@sinclair/typebox").TObject<{
            queueStatus: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ON_HOLD">, import("@sinclair/typebox").TLiteral<"NO_SHOW">, import("@sinclair/typebox").TLiteral<"CONFIRMED">]>]>;
        }>;
        readonly "appointments.createDocument": import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TLiteral<"FILE">;
            title: import("@sinclair/typebox").TString;
            url: import("@sinclair/typebox").TString;
            mimeType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            sizeBytes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
        }>, import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TLiteral<"LINK">;
            title: import("@sinclair/typebox").TString;
            url: import("@sinclair/typebox").TString;
        }>]>;
        readonly "appointments.addService": import("@sinclair/typebox").TObject<{
            serviceId: import("@sinclair/typebox").TString;
            quantity: import("@sinclair/typebox").TNumber;
            priceSnapshot: import("@sinclair/typebox").TNumber;
            durationSnapshot: import("@sinclair/typebox").TNumber;
        }>;
        readonly "appointments.updateService": import("@sinclair/typebox").TObject<{
            quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            priceSnapshot: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            durationSnapshot: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "appointments.addProduct": import("@sinclair/typebox").TObject<{
            inventoryItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            nameSnapshot: import("@sinclair/typebox").TString;
            priceSnapshot: import("@sinclair/typebox").TNumber;
            quantity: import("@sinclair/typebox").TInteger;
            freeQuantity: import("@sinclair/typebox").TInteger;
            fullyFree: import("@sinclair/typebox").TBoolean;
        }>;
        readonly "appointments.updateProduct": import("@sinclair/typebox").TObject<{
            quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            freeQuantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            fullyFree: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            priceSnapshot: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "appointments.reschedule": import("@sinclair/typebox").TObject<{
            startsAt: import("@sinclair/typebox").TString;
            comment: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "appointments.refer": import("@sinclair/typebox").TObject<{
            staffId: import("@sinclair/typebox").TString;
            comment: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "appointments.updateRepeatUnit": import("@sinclair/typebox").TObject<{
            repeatUnit: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DAY">, import("@sinclair/typebox").TLiteral<"WEEK">, import("@sinclair/typebox").TLiteral<"TWO_WEEKS">, import("@sinclair/typebox").TLiteral<"MONTH">, import("@sinclair/typebox").TLiteral<"YEAR">]>;
            repeatCount: import("@sinclair/typebox").TInteger;
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
