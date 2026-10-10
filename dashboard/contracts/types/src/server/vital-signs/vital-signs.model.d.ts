import Elysia from "elysia";
export declare const vitalSignsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "vitalSigns.list": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            offset: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "vitalSigns.latest": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
        }>;
        readonly "vitalSigns.create": import("@sinclair/typebox").TObject<{
            weight: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            temperature: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            heartRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            respiratoryRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            oxygenSaturation: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            bloodPressure: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            painScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            bodyConditionScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            capillaryRefillSec: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            mucousMembrane: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PINK">, import("@sinclair/typebox").TLiteral<"PALE">, import("@sinclair/typebox").TLiteral<"CYANOTIC">, import("@sinclair/typebox").TLiteral<"ICTERIC">, import("@sinclair/typebox").TLiteral<"CONGESTED">, import("@sinclair/typebox").TLiteral<"MUDDY">]>]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            patientId: import("@sinclair/typebox").TString;
            recordedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            attachTo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"VISIT">, import("@sinclair/typebox").TLiteral<"LAB">, import("@sinclair/typebox").TLiteral<"RADIOLOGY">, import("@sinclair/typebox").TLiteral<"OPERATION">]>;
                id: import("@sinclair/typebox").TString;
            }>>;
        }>;
        readonly "vitalSigns.update": import("@sinclair/typebox").TObject<{
            weight: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            temperature: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            heartRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            respiratoryRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            oxygenSaturation: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            bloodPressure: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            painScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            bodyConditionScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            capillaryRefillSec: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            mucousMembrane: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PINK">, import("@sinclair/typebox").TLiteral<"PALE">, import("@sinclair/typebox").TLiteral<"CYANOTIC">, import("@sinclair/typebox").TLiteral<"ICTERIC">, import("@sinclair/typebox").TLiteral<"CONGESTED">, import("@sinclair/typebox").TLiteral<"MUDDY">]>]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            recordedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "vitalSigns.attach": import("@sinclair/typebox").TObject<{
            target: import("@sinclair/typebox").TObject<{
                type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"VISIT">, import("@sinclair/typebox").TLiteral<"LAB">, import("@sinclair/typebox").TLiteral<"RADIOLOGY">, import("@sinclair/typebox").TLiteral<"OPERATION">]>;
                id: import("@sinclair/typebox").TString;
            }>;
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
