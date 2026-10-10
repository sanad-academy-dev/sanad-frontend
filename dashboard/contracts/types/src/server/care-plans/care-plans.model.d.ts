import Elysia from "elysia";
export declare const carePlansModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "care-plans.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            serviceId: import("@sinclair/typebox").TString;
            animalTypeId: import("@sinclair/typebox").TString;
            animalStrainId: import("@sinclair/typebox").TString;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            visitDurationMins: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            price: import("@sinclair/typebox").TNumber;
            visits: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                serviceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                consultationTypeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                durationMins: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
                details: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                intervalUnit: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DAY">, import("@sinclair/typebox").TLiteral<"WEEK">]>;
                intervalValue: import("@sinclair/typebox").TInteger;
                vaccinationProtocolDoseId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                medications: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                    inventoryItemId: import("@sinclair/typebox").TString;
                    quantity: import("@sinclair/typebox").TInteger;
                    freeQuantity: import("@sinclair/typebox").TInteger;
                    fullyFree: import("@sinclair/typebox").TBoolean;
                }>>;
            }>>>;
            medications: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                inventoryItemId: import("@sinclair/typebox").TString;
                quantity: import("@sinclair/typebox").TInteger;
                freeQuantity: import("@sinclair/typebox").TInteger;
                fullyFree: import("@sinclair/typebox").TBoolean;
            }>>>;
        }>;
        readonly "care-plans.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            serviceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            animalTypeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            animalStrainId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            visitDurationMins: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            visits: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                serviceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                consultationTypeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                durationMins: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
                details: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                intervalUnit: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DAY">, import("@sinclair/typebox").TLiteral<"WEEK">]>;
                intervalValue: import("@sinclair/typebox").TInteger;
                vaccinationProtocolDoseId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                medications: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                    inventoryItemId: import("@sinclair/typebox").TString;
                    quantity: import("@sinclair/typebox").TInteger;
                    freeQuantity: import("@sinclair/typebox").TInteger;
                    fullyFree: import("@sinclair/typebox").TBoolean;
                }>>;
            }>>>;
            medications: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                inventoryItemId: import("@sinclair/typebox").TString;
                quantity: import("@sinclair/typebox").TInteger;
                freeQuantity: import("@sinclair/typebox").TInteger;
                fullyFree: import("@sinclair/typebox").TBoolean;
            }>>>;
        }>;
        readonly "care-plans.setStatus": import("@sinclair/typebox").TObject<{
            status: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ACTIVE">, import("@sinclair/typebox").TLiteral<"INACTIVE">]>;
        }>;
        readonly "care-plans.enroll": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
            startedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            sourceAppointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
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
