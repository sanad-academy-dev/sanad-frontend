import Elysia from "elysia";
export declare const publicBookingsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "public-bookings.create": import("@sinclair/typebox").TObject<{
            clinicSlug: import("@sinclair/typebox").TString;
            staffId: import("@sinclair/typebox").TString;
            serviceId: import("@sinclair/typebox").TString;
            date: import("@sinclair/typebox").TString;
            startMinute: import("@sinclair/typebox").TNumber;
            consultationTypeId: import("@sinclair/typebox").TString;
            reason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            symptoms: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            clinicalNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            whatsappReminderEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            isEmergency: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            ownerName: import("@sinclair/typebox").TString;
            ownerPhone: import("@sinclair/typebox").TString;
            ownerEmail: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            patientName: import("@sinclair/typebox").TString;
            patientAnimalTypeId: import("@sinclair/typebox").TString;
            attachments: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TUnsafe<File>, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnsafe<File>>]>>;
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
