import Elysia from "elysia";
export declare const mobileVisitsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "mobileVisits.address.create": import("@sinclair/typebox").TObject<{
            ownerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            line1: import("@sinclair/typebox").TString;
            label: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            district: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            city: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            landmark: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            accessNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            lat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            lng: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "mobileVisits.attach": import("@sinclair/typebox").TObject<{
            appointmentId: import("@sinclair/typebox").TString;
            serviceAddressId: import("@sinclair/typebox").TString;
        }>;
        readonly "mobileVisits.assign": import("@sinclair/typebox").TObject<{
            mobileUnitId: import("@sinclair/typebox").TString;
            sequence: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            windowStart: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            windowEnd: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "mobileVisits.stage": import("@sinclair/typebox").TObject<{
            stage: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PENDING">, import("@sinclair/typebox").TLiteral<"ASSIGNED">, import("@sinclair/typebox").TLiteral<"EN_ROUTE">, import("@sinclair/typebox").TLiteral<"ARRIVED">, import("@sinclair/typebox").TLiteral<"IN_SERVICE">, import("@sinclair/typebox").TLiteral<"COMPLETED">, import("@sinclair/typebox").TLiteral<"FAILED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>;
            reason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NO_ANSWER">, import("@sinclair/typebox").TLiteral<"ADDRESS_NOT_FOUND">, import("@sinclair/typebox").TLiteral<"ACCESS_DENIED">, import("@sinclair/typebox").TLiteral<"PET_UNAVAILABLE">, import("@sinclair/typebox").TLiteral<"OWNER_CANCELLED">, import("@sinclair/typebox").TLiteral<"VEHICLE_ISSUE">, import("@sinclair/typebox").TLiteral<"WEATHER">, import("@sinclair/typebox").TLiteral<"OTHER">]>>;
            note: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            lat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            lng: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            at: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "mobileVisits.reorder": import("@sinclair/typebox").TObject<{
            mobileUnitId: import("@sinclair/typebox").TString;
            orderedVisitIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
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
