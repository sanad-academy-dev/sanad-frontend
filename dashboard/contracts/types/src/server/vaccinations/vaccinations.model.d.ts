import Elysia from "elysia";
export declare const vaccinationsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "vaccinations.vaccine.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            nameEn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MODIFIED_LIVE">, import("@sinclair/typebox").TLiteral<"KILLED">, import("@sinclair/typebox").TLiteral<"RECOMBINANT">, import("@sinclair/typebox").TLiteral<"TOXOID">, import("@sinclair/typebox").TLiteral<"SUBUNIT">, import("@sinclair/typebox").TLiteral<"OTHER">]>;
            manufacturerName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            catalogProductId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            inventoryItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            antigenCodes: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            species: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DOG">, import("@sinclair/typebox").TLiteral<"CAT">, import("@sinclair/typebox").TLiteral<"HORSE">, import("@sinclair/typebox").TLiteral<"CATTLE">, import("@sinclair/typebox").TLiteral<"SHEEP">, import("@sinclair/typebox").TLiteral<"GOAT">, import("@sinclair/typebox").TLiteral<"CAMEL">, import("@sinclair/typebox").TLiteral<"POULTRY">, import("@sinclair/typebox").TLiteral<"RABBIT">, import("@sinclair/typebox").TLiteral<"SWINE">, import("@sinclair/typebox").TLiteral<"FISH">, import("@sinclair/typebox").TLiteral<"BEE">]>>;
            primarySeriesDoses: import("@sinclair/typebox").TInteger;
            primarySeriesIntervalDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            boosterIntervalDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            immunityOnsetDays: import("@sinclair/typebox").TInteger;
            defaultRoute: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SUBCUTANEOUS">, import("@sinclair/typebox").TLiteral<"INTRAMUSCULAR">, import("@sinclair/typebox").TLiteral<"INTRANASAL">, import("@sinclair/typebox").TLiteral<"ORAL">, import("@sinclair/typebox").TLiteral<"INTRADERMAL">, import("@sinclair/typebox").TLiteral<"TOPICAL">, import("@sinclair/typebox").TLiteral<"OTHER">]>;
            defaultSite: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LEFT_SHOULDER">, import("@sinclair/typebox").TLiteral<"RIGHT_SHOULDER">, import("@sinclair/typebox").TLiteral<"LEFT_HIND_LIMB">, import("@sinclair/typebox").TLiteral<"RIGHT_HIND_LIMB">, import("@sinclair/typebox").TLiteral<"INTERSCAPULAR">, import("@sinclair/typebox").TLiteral<"LEFT_FLANK">, import("@sinclair/typebox").TLiteral<"RIGHT_FLANK">, import("@sinclair/typebox").TLiteral<"NASAL">, import("@sinclair/typebox").TLiteral<"ORAL">, import("@sinclair/typebox").TLiteral<"OTHER">]>]>>;
            defaultDoseVolumeMl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "vaccinations.vaccine.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            nameEn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            kind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MODIFIED_LIVE">, import("@sinclair/typebox").TLiteral<"KILLED">, import("@sinclair/typebox").TLiteral<"RECOMBINANT">, import("@sinclair/typebox").TLiteral<"TOXOID">, import("@sinclair/typebox").TLiteral<"SUBUNIT">, import("@sinclair/typebox").TLiteral<"OTHER">]>>;
            manufacturerName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            catalogProductId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            inventoryItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            antigenCodes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            species: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DOG">, import("@sinclair/typebox").TLiteral<"CAT">, import("@sinclair/typebox").TLiteral<"HORSE">, import("@sinclair/typebox").TLiteral<"CATTLE">, import("@sinclair/typebox").TLiteral<"SHEEP">, import("@sinclair/typebox").TLiteral<"GOAT">, import("@sinclair/typebox").TLiteral<"CAMEL">, import("@sinclair/typebox").TLiteral<"POULTRY">, import("@sinclair/typebox").TLiteral<"RABBIT">, import("@sinclair/typebox").TLiteral<"SWINE">, import("@sinclair/typebox").TLiteral<"FISH">, import("@sinclair/typebox").TLiteral<"BEE">]>>>;
            primarySeriesDoses: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            primarySeriesIntervalDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            boosterIntervalDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            immunityOnsetDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            defaultRoute: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SUBCUTANEOUS">, import("@sinclair/typebox").TLiteral<"INTRAMUSCULAR">, import("@sinclair/typebox").TLiteral<"INTRANASAL">, import("@sinclair/typebox").TLiteral<"ORAL">, import("@sinclair/typebox").TLiteral<"INTRADERMAL">, import("@sinclair/typebox").TLiteral<"TOPICAL">, import("@sinclair/typebox").TLiteral<"OTHER">]>>;
            defaultSite: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LEFT_SHOULDER">, import("@sinclair/typebox").TLiteral<"RIGHT_SHOULDER">, import("@sinclair/typebox").TLiteral<"LEFT_HIND_LIMB">, import("@sinclair/typebox").TLiteral<"RIGHT_HIND_LIMB">, import("@sinclair/typebox").TLiteral<"INTERSCAPULAR">, import("@sinclair/typebox").TLiteral<"LEFT_FLANK">, import("@sinclair/typebox").TLiteral<"RIGHT_FLANK">, import("@sinclair/typebox").TLiteral<"NASAL">, import("@sinclair/typebox").TLiteral<"ORAL">, import("@sinclair/typebox").TLiteral<"OTHER">]>]>>;
            defaultDoseVolumeMl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "vaccinations.protocol.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            nameEn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            species: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DOG">, import("@sinclair/typebox").TLiteral<"CAT">, import("@sinclair/typebox").TLiteral<"HORSE">, import("@sinclair/typebox").TLiteral<"CATTLE">, import("@sinclair/typebox").TLiteral<"SHEEP">, import("@sinclair/typebox").TLiteral<"GOAT">, import("@sinclair/typebox").TLiteral<"CAMEL">, import("@sinclair/typebox").TLiteral<"POULTRY">, import("@sinclair/typebox").TLiteral<"RABBIT">, import("@sinclair/typebox").TLiteral<"SWINE">, import("@sinclair/typebox").TLiteral<"FISH">, import("@sinclair/typebox").TLiteral<"BEE">]>;
            animalTypeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            animalStrainId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            isCore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            doses: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                antigenCode: import("@sinclair/typebox").TString;
                label: import("@sinclair/typebox").TString;
                kind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PRIMARY">, import("@sinclair/typebox").TLiteral<"BOOSTER">, import("@sinclair/typebox").TLiteral<"ANNUAL">, import("@sinclair/typebox").TLiteral<"CATCH_UP">]>>;
                ageWeeksMin: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
                ageWeeksMax: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
                intervalDaysFromPrev: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
                boosterIntervalDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
                notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            }>>;
        }>;
        readonly "vaccinations.protocol.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            nameEn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            species: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DOG">, import("@sinclair/typebox").TLiteral<"CAT">, import("@sinclair/typebox").TLiteral<"HORSE">, import("@sinclair/typebox").TLiteral<"CATTLE">, import("@sinclair/typebox").TLiteral<"SHEEP">, import("@sinclair/typebox").TLiteral<"GOAT">, import("@sinclair/typebox").TLiteral<"CAMEL">, import("@sinclair/typebox").TLiteral<"POULTRY">, import("@sinclair/typebox").TLiteral<"RABBIT">, import("@sinclair/typebox").TLiteral<"SWINE">, import("@sinclair/typebox").TLiteral<"FISH">, import("@sinclair/typebox").TLiteral<"BEE">]>;
            animalTypeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            animalStrainId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            isCore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            doses: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                antigenCode: import("@sinclair/typebox").TString;
                label: import("@sinclair/typebox").TString;
                kind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PRIMARY">, import("@sinclair/typebox").TLiteral<"BOOSTER">, import("@sinclair/typebox").TLiteral<"ANNUAL">, import("@sinclair/typebox").TLiteral<"CATCH_UP">]>>;
                ageWeeksMin: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
                ageWeeksMax: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
                intervalDaysFromPrev: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
                boosterIntervalDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
                notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            }>>;
        }>;
        readonly "vaccinations.administer": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
            vaccineId: import("@sinclair/typebox").TString;
            appointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            administeredById: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            administeredAt: import("@sinclair/typebox").TString;
            doseNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            doseKind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PRIMARY">, import("@sinclair/typebox").TLiteral<"BOOSTER">, import("@sinclair/typebox").TLiteral<"ANNUAL">, import("@sinclair/typebox").TLiteral<"CATCH_UP">]>>;
            route: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SUBCUTANEOUS">, import("@sinclair/typebox").TLiteral<"INTRAMUSCULAR">, import("@sinclair/typebox").TLiteral<"INTRANASAL">, import("@sinclair/typebox").TLiteral<"ORAL">, import("@sinclair/typebox").TLiteral<"INTRADERMAL">, import("@sinclair/typebox").TLiteral<"TOPICAL">, import("@sinclair/typebox").TLiteral<"OTHER">]>;
            site: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LEFT_SHOULDER">, import("@sinclair/typebox").TLiteral<"RIGHT_SHOULDER">, import("@sinclair/typebox").TLiteral<"LEFT_HIND_LIMB">, import("@sinclair/typebox").TLiteral<"RIGHT_HIND_LIMB">, import("@sinclair/typebox").TLiteral<"INTERSCAPULAR">, import("@sinclair/typebox").TLiteral<"LEFT_FLANK">, import("@sinclair/typebox").TLiteral<"RIGHT_FLANK">, import("@sinclair/typebox").TLiteral<"NASAL">, import("@sinclair/typebox").TLiteral<"ORAL">, import("@sinclair/typebox").TLiteral<"OTHER">]>]>>;
            doseVolumeMl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            batchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            allowExpiredBatch: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            expiredBatchReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            adverseReaction: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NONE">, import("@sinclair/typebox").TLiteral<"MILD">, import("@sinclair/typebox").TLiteral<"MODERATE">, import("@sinclair/typebox").TLiteral<"SEVERE">, import("@sinclair/typebox").TLiteral<"ANAPHYLACTIC">]>>;
            adverseReactionNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            protocolDoseId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            carePlanEnrollmentVisitId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "vaccinations.void": import("@sinclair/typebox").TObject<{
            voidReason: import("@sinclair/typebox").TString;
            restoreStock: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "vaccinations.list.query": import("@sinclair/typebox").TObject<{
            q: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            species: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DOG">, import("@sinclair/typebox").TLiteral<"CAT">, import("@sinclair/typebox").TLiteral<"HORSE">, import("@sinclair/typebox").TLiteral<"CATTLE">, import("@sinclair/typebox").TLiteral<"SHEEP">, import("@sinclair/typebox").TLiteral<"GOAT">, import("@sinclair/typebox").TLiteral<"CAMEL">, import("@sinclair/typebox").TLiteral<"POULTRY">, import("@sinclair/typebox").TLiteral<"RABBIT">, import("@sinclair/typebox").TLiteral<"SWINE">, import("@sinclair/typebox").TLiteral<"FISH">, import("@sinclair/typebox").TLiteral<"BEE">]>>;
            activeOnly: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "vaccinations.records.query": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            vaccineId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            from: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            to: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            includeVoided: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            skip: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            take: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "vaccinations.due.query": import("@sinclair/typebox").TObject<{
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            species: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DOG">, import("@sinclair/typebox").TLiteral<"CAT">, import("@sinclair/typebox").TLiteral<"HORSE">, import("@sinclair/typebox").TLiteral<"CATTLE">, import("@sinclair/typebox").TLiteral<"SHEEP">, import("@sinclair/typebox").TLiteral<"GOAT">, import("@sinclair/typebox").TLiteral<"CAMEL">, import("@sinclair/typebox").TLiteral<"POULTRY">, import("@sinclair/typebox").TLiteral<"RABBIT">, import("@sinclair/typebox").TLiteral<"SWINE">, import("@sinclair/typebox").TLiteral<"FISH">, import("@sinclair/typebox").TLiteral<"BEE">]>>;
            horizonDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
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
