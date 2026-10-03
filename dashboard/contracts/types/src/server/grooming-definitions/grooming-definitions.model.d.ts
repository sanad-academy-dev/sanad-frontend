import Elysia from "elysia";
export declare const groomingDefinitionsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "groomingDefinitions.upsertDefinition": import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"BATH">, import("@sinclair/typebox").TLiteral<"FULL_GROOM">, import("@sinclair/typebox").TLiteral<"TIDY_UP">, import("@sinclair/typebox").TLiteral<"DESHED">, import("@sinclair/typebox").TLiteral<"NAIL_TRIM">, import("@sinclair/typebox").TLiteral<"EAR_CLEAN">, import("@sinclair/typebox").TLiteral<"ANAL_GLANDS">, import("@sinclair/typebox").TLiteral<"TEETH_BRUSH">, import("@sinclair/typebox").TLiteral<"DEMATTING">, import("@sinclair/typebox").TLiteral<"SHAVE_DOWN">, import("@sinclair/typebox").TLiteral<"MEDICATED_BATH">, import("@sinclair/typebox").TLiteral<"PARASITE_DIP">, import("@sinclair/typebox").TLiteral<"WOUND_CARE_CLIP">, import("@sinclair/typebox").TLiteral<"SPA_ADDON">, import("@sinclair/typebox").TLiteral<"OTHER">]>;
            lane: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"COSMETIC">, import("@sinclair/typebox").TLiteral<"MEDICAL">]>>;
            requiresVetOrder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            isAddOn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            basePrice: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            baseDurationMin: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            dryingMinutes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            speciesScope: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            requiresStation: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "groomingDefinitions.replacePriceRules": import("@sinclair/typebox").TObject<{
            rules: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                animalTypeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                animalStrainId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                sizeBand: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"TOY">, import("@sinclair/typebox").TLiteral<"SMALL">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"LARGE">, import("@sinclair/typebox").TLiteral<"GIANT">]>]>>;
                coatType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LONG_THICK">, import("@sinclair/typebox").TLiteral<"SHORT_THICK">, import("@sinclair/typebox").TLiteral<"LIGHT">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"DOUBLE_COAT">, import("@sinclair/typebox").TLiteral<"NONE">]>]>>;
                price: import("@sinclair/typebox").TNumber;
                durationMin: import("@sinclair/typebox").TInteger;
                dryingMinutes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            }>>;
        }>;
        readonly "groomingDefinitions.upsertModifier": import("@sinclair/typebox").TObject<{
            code: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MATTING">, import("@sinclair/typebox").TLiteral<"SHAVE_DOWN">, import("@sinclair/typebox").TLiteral<"BEHAVIOR">, import("@sinclair/typebox").TLiteral<"SENIOR">, import("@sinclair/typebox").TLiteral<"FLEA">, import("@sinclair/typebox").TLiteral<"SECOND_PET">, import("@sinclair/typebox").TLiteral<"EXPRESS">, import("@sinclair/typebox").TLiteral<"OUT_OF_HOURS">]>;
            labelAr: import("@sinclair/typebox").TString;
            calc: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PERCENT">, import("@sinclair/typebox").TLiteral<"FIXED">, import("@sinclair/typebox").TLiteral<"PER_MINUTE">]>;
            value: import("@sinclair/typebox").TNumber;
            autoAppliesFrom: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            requiresOwnerApproval: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "groomingDefinitions.upsertCapacity": import("@sinclair/typebox").TObject<{
            stations: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            dryerSlots: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            maxPetsPerDay: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            maxHeatSensitiveConcurrent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            dropOffWindowMin: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            requireDepositPercent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            seniorAgeYears: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            quoteReapprovalPercent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "groomingDefinitions.quotePreview": import("@sinclair/typebox").TObject<{
            definitionIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            pet: import("@sinclair/typebox").TObject<{
                animalTypeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                animalStrainId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                sizeBand: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"TOY">, import("@sinclair/typebox").TLiteral<"SMALL">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"LARGE">, import("@sinclair/typebox").TLiteral<"GIANT">]>]>>;
                coatType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LONG_THICK">, import("@sinclair/typebox").TLiteral<"SHORT_THICK">, import("@sinclair/typebox").TLiteral<"LIGHT">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"DOUBLE_COAT">, import("@sinclair/typebox").TLiteral<"NONE">]>]>>;
                weightKg: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
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
