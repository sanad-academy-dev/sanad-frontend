import Elysia from "elysia";
export declare const mobileAppModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "mobileApp.shift.start": import("@sinclair/typebox").TObject<{
            odometerStart: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            lat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            lng: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "mobileApp.shift.end": import("@sinclair/typebox").TObject<{
            odometerEnd: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>;
        readonly "mobileApp.pings": import("@sinclair/typebox").TObject<{
            pings: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                lat: import("@sinclair/typebox").TNumber;
                lng: import("@sinclair/typebox").TNumber;
                accuracyM: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
                speedKph: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
                heading: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
                altitudeM: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
                batteryPct: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
                isMoving: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                isCharging: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                recordedAt: import("@sinclair/typebox").TString;
            }>>;
        }>;
        readonly "mobileApp.stock.consume": import("@sinclair/typebox").TObject<{
            visitId: import("@sinclair/typebox").TString;
            items: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                itemId: import("@sinclair/typebox").TString;
                qty: import("@sinclair/typebox").TInteger;
                batchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            }>>;
        }>;
        readonly "mobileApp.request.accept": import("@sinclair/typebox").TObject<{
            startsAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            durationMinutes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            animalTypeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "mobileApp.visit.note": import("@sinclair/typebox").TObject<{
            note: import("@sinclair/typebox").TString;
        }>;
        readonly "mobileApp.visit.media": import("@sinclair/typebox").TObject<{
            file: import("@sinclair/typebox").TUnsafe<File>;
            kind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PHOTO">, import("@sinclair/typebox").TLiteral<"SIGNATURE">]>>;
        }>;
        readonly "mobileApp.status": import("@sinclair/typebox").TObject<{
            status: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"AVAILABLE">, import("@sinclair/typebox").TLiteral<"EN_ROUTE">, import("@sinclair/typebox").TLiteral<"ON_SITE">, import("@sinclair/typebox").TLiteral<"RETURNING">, import("@sinclair/typebox").TLiteral<"ON_BREAK">, import("@sinclair/typebox").TLiteral<"OUT_OF_SERVICE">]>;
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
