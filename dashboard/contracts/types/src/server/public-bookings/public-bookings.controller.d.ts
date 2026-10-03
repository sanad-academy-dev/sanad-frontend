import Elysia from "elysia";
export declare const publicBookingsController: Elysia<"/public-bookings", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
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
}, {
    "public-bookings": {};
} & {
    "public-bookings": {
        post: {
            body: {
                attachments?: File | File[] | undefined;
                reason?: string | undefined;
                clinicalNotes?: string | undefined;
                symptoms?: string | undefined;
                isEmergency?: boolean | undefined;
                whatsappReminderEnabled?: boolean | undefined;
                ownerEmail?: string | undefined;
                date: string;
                staffId: string;
                startMinute: number;
                serviceId: string;
                patientName: string;
                consultationTypeId: string;
                ownerName: string;
                ownerPhone: string;
                patientAnimalTypeId: string;
                clinicSlug: string;
            };
            params: {};
            query: unknown;
            headers: unknown;
            response: {
                201: {
                    code: string;
                    date: string;
                    startMinute: number;
                    durationMinutes: number;
                };
                400: {
                    readonly message: "نوع الطفل غير صالح";
                } | {
                    readonly message: "سبب الزيارة غير صالح";
                } | {
                    readonly message: "رقم الجوال غير صالح";
                };
                404: {
                    readonly message: "الأكاديمية غير موجودة";
                } | {
                    readonly message: "المدرّب غير متاح للحجز";
                } | {
                    readonly message: "الدورة غير متاحة";
                };
                409: {
                    readonly message: "الزيارة لم تعد متاحة";
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
                429: {
                    readonly message: "تم تجاوز الحد المسموح، حاول لاحقًا";
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
