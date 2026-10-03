import Elysia from "elysia";
import type { CatalogSpecies } from "@/generated/prisma/enums";
export declare const nutritionController: Elysia<"/nutrition", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "nutrition.plans.query": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"ACTIVE">, import("@sinclair/typebox").TLiteral<"COMPLETED">, import("@sinclair/typebox").TLiteral<"DISCONTINUED">]>>;
            goal: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MAINTENANCE">, import("@sinclair/typebox").TLiteral<"WEIGHT_LOSS">, import("@sinclair/typebox").TLiteral<"WEIGHT_GAIN">, import("@sinclair/typebox").TLiteral<"GROWTH">, import("@sinclair/typebox").TLiteral<"GESTATION">, import("@sinclair/typebox").TLiteral<"LACTATION">, import("@sinclair/typebox").TLiteral<"RECOVERY">]>>;
            q: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            take: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "nutrition.due.query": import("@sinclair/typebox").TObject<{
            horizonDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "nutrition.plans.create": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
            appointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            prescriberId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            goal: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MAINTENANCE">, import("@sinclair/typebox").TLiteral<"WEIGHT_LOSS">, import("@sinclair/typebox").TLiteral<"WEIGHT_GAIN">, import("@sinclair/typebox").TLiteral<"GROWTH">, import("@sinclair/typebox").TLiteral<"GESTATION">, import("@sinclair/typebox").TLiteral<"LACTATION">, import("@sinclair/typebox").TLiteral<"RECOVERY">]>;
            currentWeightKg: import("@sinclair/typebox").TNumber;
            bodyConditionScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            muscleConditionScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NORMAL">, import("@sinclair/typebox").TLiteral<"MILD_LOSS">, import("@sinclair/typebox").TLiteral<"MODERATE_LOSS">, import("@sinclair/typebox").TLiteral<"SEVERE_LOSS">]>]>>;
            idealWeightKg: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            idealWeightSource: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            lifeStage: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"GROWTH_UNDER_4M">, import("@sinclair/typebox").TLiteral<"GROWTH_OVER_4M">, import("@sinclair/typebox").TLiteral<"ADULT">, import("@sinclair/typebox").TLiteral<"SENIOR">]>;
            activity: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"INACTIVE">, import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MODERATE">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"WORK_LIGHT">, import("@sinclair/typebox").TLiteral<"WORK_MODERATE">, import("@sinclair/typebox").TLiteral<"WORK_HEAVY">]>;
            isNeutered: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            riskFactors: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            medicalConditions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            feedingMethod: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MEAL_FED">, import("@sinclair/typebox").TLiteral<"FREE_CHOICE">, import("@sinclair/typebox").TLiteral<"COMBINATION">]>>;
            mealsPerDay: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            currentDietSummary: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            treatsSummary: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            tableFoodSummary: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            supplementsSummary: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            medicationFoodSummary: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            waterSource: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            environmentNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            currentTreatCaloriePercent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            manualDerFactor: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            targetWeeklyRatePercent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            recheckIntervalDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            items: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                dietFoodId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                nameSnapshot: import("@sinclair/typebox").TString;
                formSnapshot: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRY">, import("@sinclair/typebox").TLiteral<"WET">, import("@sinclair/typebox").TLiteral<"RAW">, import("@sinclair/typebox").TLiteral<"HOME_COOKED">, import("@sinclair/typebox").TLiteral<"TREAT">, import("@sinclair/typebox").TLiteral<"SUPPLEMENT">]>>;
                energyDensityKcalPerKgSnapshot: import("@sinclair/typebox").TNumber;
                energySharePercent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
                householdUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"GRAM">, import("@sinclair/typebox").TLiteral<"CUP">, import("@sinclair/typebox").TLiteral<"CAN">, import("@sinclair/typebox").TLiteral<"SCOOP">, import("@sinclair/typebox").TLiteral<"PIECE">]>>;
                householdUnitGrams: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
                isTreat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            }>>>;
            feedingInstructions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            clinicalNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            transitionDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
        }>;
        readonly "nutrition.plans.update": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
            appointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            prescriberId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            goal: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MAINTENANCE">, import("@sinclair/typebox").TLiteral<"WEIGHT_LOSS">, import("@sinclair/typebox").TLiteral<"WEIGHT_GAIN">, import("@sinclair/typebox").TLiteral<"GROWTH">, import("@sinclair/typebox").TLiteral<"GESTATION">, import("@sinclair/typebox").TLiteral<"LACTATION">, import("@sinclair/typebox").TLiteral<"RECOVERY">]>;
            currentWeightKg: import("@sinclair/typebox").TNumber;
            bodyConditionScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            muscleConditionScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NORMAL">, import("@sinclair/typebox").TLiteral<"MILD_LOSS">, import("@sinclair/typebox").TLiteral<"MODERATE_LOSS">, import("@sinclair/typebox").TLiteral<"SEVERE_LOSS">]>]>>;
            idealWeightKg: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            idealWeightSource: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            lifeStage: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"GROWTH_UNDER_4M">, import("@sinclair/typebox").TLiteral<"GROWTH_OVER_4M">, import("@sinclair/typebox").TLiteral<"ADULT">, import("@sinclair/typebox").TLiteral<"SENIOR">]>;
            activity: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"INACTIVE">, import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MODERATE">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"WORK_LIGHT">, import("@sinclair/typebox").TLiteral<"WORK_MODERATE">, import("@sinclair/typebox").TLiteral<"WORK_HEAVY">]>;
            isNeutered: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            riskFactors: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            medicalConditions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            feedingMethod: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MEAL_FED">, import("@sinclair/typebox").TLiteral<"FREE_CHOICE">, import("@sinclair/typebox").TLiteral<"COMBINATION">]>>;
            mealsPerDay: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            currentDietSummary: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            treatsSummary: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            tableFoodSummary: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            supplementsSummary: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            medicationFoodSummary: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            waterSource: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            environmentNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            currentTreatCaloriePercent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            manualDerFactor: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            targetWeeklyRatePercent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            recheckIntervalDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            items: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                dietFoodId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                nameSnapshot: import("@sinclair/typebox").TString;
                formSnapshot: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRY">, import("@sinclair/typebox").TLiteral<"WET">, import("@sinclair/typebox").TLiteral<"RAW">, import("@sinclair/typebox").TLiteral<"HOME_COOKED">, import("@sinclair/typebox").TLiteral<"TREAT">, import("@sinclair/typebox").TLiteral<"SUPPLEMENT">]>>;
                energyDensityKcalPerKgSnapshot: import("@sinclair/typebox").TNumber;
                energySharePercent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
                householdUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"GRAM">, import("@sinclair/typebox").TLiteral<"CUP">, import("@sinclair/typebox").TLiteral<"CAN">, import("@sinclair/typebox").TLiteral<"SCOOP">, import("@sinclair/typebox").TLiteral<"PIECE">]>>;
                householdUnitGrams: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
                isTreat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            }>>>;
            feedingInstructions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            clinicalNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            transitionDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
        }>;
        readonly "nutrition.plans.discontinue": import("@sinclair/typebox").TObject<{
            reason: import("@sinclair/typebox").TString;
        }>;
        readonly "nutrition.rechecks.create": import("@sinclair/typebox").TObject<{
            weightKg: import("@sinclair/typebox").TNumber;
            recheckedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            bodyConditionScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            muscleConditionScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NORMAL">, import("@sinclair/typebox").TLiteral<"MILD_LOSS">, import("@sinclair/typebox").TLiteral<"MODERATE_LOSS">, import("@sinclair/typebox").TLiteral<"SEVERE_LOSS">]>]>>;
            ownerAdherence: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            performedById: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            adjustmentPercent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            applyAdjustment: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            adjustmentReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "nutrition.calculate": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            species: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DOG">, import("@sinclair/typebox").TLiteral<"CAT">, import("@sinclair/typebox").TLiteral<"HORSE">, import("@sinclair/typebox").TLiteral<"CATTLE">, import("@sinclair/typebox").TLiteral<"SHEEP">, import("@sinclair/typebox").TLiteral<"GOAT">, import("@sinclair/typebox").TLiteral<"CAMEL">, import("@sinclair/typebox").TLiteral<"POULTRY">, import("@sinclair/typebox").TLiteral<"RABBIT">, import("@sinclair/typebox").TLiteral<"SWINE">, import("@sinclair/typebox").TLiteral<"FISH">, import("@sinclair/typebox").TLiteral<"BEE">]>]>>;
            goal: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MAINTENANCE">, import("@sinclair/typebox").TLiteral<"WEIGHT_LOSS">, import("@sinclair/typebox").TLiteral<"WEIGHT_GAIN">, import("@sinclair/typebox").TLiteral<"GROWTH">, import("@sinclair/typebox").TLiteral<"GESTATION">, import("@sinclair/typebox").TLiteral<"LACTATION">, import("@sinclair/typebox").TLiteral<"RECOVERY">]>;
            lifeStage: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"GROWTH_UNDER_4M">, import("@sinclair/typebox").TLiteral<"GROWTH_OVER_4M">, import("@sinclair/typebox").TLiteral<"ADULT">, import("@sinclair/typebox").TLiteral<"SENIOR">]>;
            activity: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"INACTIVE">, import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MODERATE">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"WORK_LIGHT">, import("@sinclair/typebox").TLiteral<"WORK_MODERATE">, import("@sinclair/typebox").TLiteral<"WORK_HEAVY">]>;
            isNeutered: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            currentWeightKg: import("@sinclair/typebox").TNumber;
            idealWeightKg: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            bodyConditionScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            manualDerFactor: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            targetWeeklyRatePercent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            mealsPerDay: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            foods: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                dietFoodId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                nameSnapshot: import("@sinclair/typebox").TString;
                formSnapshot: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRY">, import("@sinclair/typebox").TLiteral<"WET">, import("@sinclair/typebox").TLiteral<"RAW">, import("@sinclair/typebox").TLiteral<"HOME_COOKED">, import("@sinclair/typebox").TLiteral<"TREAT">, import("@sinclair/typebox").TLiteral<"SUPPLEMENT">]>>;
                energyDensityKcalPerKgSnapshot: import("@sinclair/typebox").TNumber;
                energySharePercent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
                householdUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"GRAM">, import("@sinclair/typebox").TLiteral<"CUP">, import("@sinclair/typebox").TLiteral<"CAN">, import("@sinclair/typebox").TLiteral<"SCOOP">, import("@sinclair/typebox").TLiteral<"PIECE">]>>;
                householdUnitGrams: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
                isTreat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            }>>>;
        }>;
        readonly "nutrition.foods.query": import("@sinclair/typebox").TObject<{
            q: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            patientId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            species: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DOG">, import("@sinclair/typebox").TLiteral<"CAT">, import("@sinclair/typebox").TLiteral<"HORSE">, import("@sinclair/typebox").TLiteral<"CATTLE">, import("@sinclair/typebox").TLiteral<"SHEEP">, import("@sinclair/typebox").TLiteral<"GOAT">, import("@sinclair/typebox").TLiteral<"CAMEL">, import("@sinclair/typebox").TLiteral<"POULTRY">, import("@sinclair/typebox").TLiteral<"RABBIT">, import("@sinclair/typebox").TLiteral<"SWINE">, import("@sinclair/typebox").TLiteral<"FISH">, import("@sinclair/typebox").TLiteral<"BEE">]>>;
            kind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MAINTENANCE">, import("@sinclair/typebox").TLiteral<"THERAPEUTIC">, import("@sinclair/typebox").TLiteral<"TREAT">, import("@sinclair/typebox").TLiteral<"SUPPLEMENT">]>>;
            form: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRY">, import("@sinclair/typebox").TLiteral<"WET">, import("@sinclair/typebox").TLiteral<"RAW">, import("@sinclair/typebox").TLiteral<"HOME_COOKED">, import("@sinclair/typebox").TLiteral<"TREAT">, import("@sinclair/typebox").TLiteral<"SUPPLEMENT">]>>;
            activeOnly: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "nutrition.foods.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            nameEn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            brand: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            form: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRY">, import("@sinclair/typebox").TLiteral<"WET">, import("@sinclair/typebox").TLiteral<"RAW">, import("@sinclair/typebox").TLiteral<"HOME_COOKED">, import("@sinclair/typebox").TLiteral<"TREAT">, import("@sinclair/typebox").TLiteral<"SUPPLEMENT">]>>;
            kind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MAINTENANCE">, import("@sinclair/typebox").TLiteral<"THERAPEUTIC">, import("@sinclair/typebox").TLiteral<"TREAT">, import("@sinclair/typebox").TLiteral<"SUPPLEMENT">]>>;
            metabolizableEnergyKcalPerKg: import("@sinclair/typebox").TNumber;
            householdUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"GRAM">, import("@sinclair/typebox").TLiteral<"CUP">, import("@sinclair/typebox").TLiteral<"CAN">, import("@sinclair/typebox").TLiteral<"SCOOP">, import("@sinclair/typebox").TLiteral<"PIECE">]>>;
            householdUnitGrams: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            proteinPercentDm: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            fatPercentDm: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            fiberPercentDm: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            moisturePercent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            sodiumPercentDm: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            phosphorusPercentDm: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            species: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DOG">, import("@sinclair/typebox").TLiteral<"CAT">, import("@sinclair/typebox").TLiteral<"HORSE">, import("@sinclair/typebox").TLiteral<"CATTLE">, import("@sinclair/typebox").TLiteral<"SHEEP">, import("@sinclair/typebox").TLiteral<"GOAT">, import("@sinclair/typebox").TLiteral<"CAMEL">, import("@sinclair/typebox").TLiteral<"POULTRY">, import("@sinclair/typebox").TLiteral<"RABBIT">, import("@sinclair/typebox").TLiteral<"SWINE">, import("@sinclair/typebox").TLiteral<"FISH">, import("@sinclair/typebox").TLiteral<"BEE">]>>>;
            indications: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            lifeStages: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"GROWTH_UNDER_4M">, import("@sinclair/typebox").TLiteral<"GROWTH_OVER_4M">, import("@sinclair/typebox").TLiteral<"ADULT">, import("@sinclair/typebox").TLiteral<"SENIOR">]>>>;
            inventoryItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "nutrition.draftInstructions": import("@sinclair/typebox").TObject<{
            hint: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "nutrition.draftField": import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"instructions">, import("@sinclair/typebox").TLiteral<"clinicalNotes">]>;
            patientId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            goal: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MAINTENANCE">, import("@sinclair/typebox").TLiteral<"WEIGHT_LOSS">, import("@sinclair/typebox").TLiteral<"WEIGHT_GAIN">, import("@sinclair/typebox").TLiteral<"GROWTH">, import("@sinclair/typebox").TLiteral<"GESTATION">, import("@sinclair/typebox").TLiteral<"LACTATION">, import("@sinclair/typebox").TLiteral<"RECOVERY">]>;
            lifeStage: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"GROWTH_UNDER_4M">, import("@sinclair/typebox").TLiteral<"GROWTH_OVER_4M">, import("@sinclair/typebox").TLiteral<"ADULT">, import("@sinclair/typebox").TLiteral<"SENIOR">]>;
            activity: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"INACTIVE">, import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MODERATE">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"WORK_LIGHT">, import("@sinclair/typebox").TLiteral<"WORK_MODERATE">, import("@sinclair/typebox").TLiteral<"WORK_HEAVY">]>;
            isNeutered: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            currentWeightKg: import("@sinclair/typebox").TNumber;
            idealWeightKg: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            bodyConditionScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            muscleConditionScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NORMAL">, import("@sinclair/typebox").TLiteral<"MILD_LOSS">, import("@sinclair/typebox").TLiteral<"MODERATE_LOSS">, import("@sinclair/typebox").TLiteral<"SEVERE_LOSS">]>]>>;
            manualDerFactor: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            targetWeeklyRatePercent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            mealsPerDay: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            feedingMethod: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MEAL_FED">, import("@sinclair/typebox").TLiteral<"FREE_CHOICE">, import("@sinclair/typebox").TLiteral<"COMBINATION">]>>;
            recheckIntervalDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            transitionDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            riskFactors: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            medicalConditions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            currentDietSummary: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            treatsSummary: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            items: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                dietFoodId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                nameSnapshot: import("@sinclair/typebox").TString;
                formSnapshot: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRY">, import("@sinclair/typebox").TLiteral<"WET">, import("@sinclair/typebox").TLiteral<"RAW">, import("@sinclair/typebox").TLiteral<"HOME_COOKED">, import("@sinclair/typebox").TLiteral<"TREAT">, import("@sinclair/typebox").TLiteral<"SUPPLEMENT">]>>;
                energyDensityKcalPerKgSnapshot: import("@sinclair/typebox").TNumber;
                energySharePercent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
                householdUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"GRAM">, import("@sinclair/typebox").TLiteral<"CUP">, import("@sinclair/typebox").TLiteral<"CAN">, import("@sinclair/typebox").TLiteral<"SCOOP">, import("@sinclair/typebox").TLiteral<"PIECE">]>>;
                householdUnitGrams: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
                isTreat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            }>>>;
            hint: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
    };
    error: {};
}, {
    schema: {};
    standaloneSchema: {};
    macro: Partial<{
        readonly requireClinic: boolean;
    }>;
    macroFn: {
        readonly requireClinic: {
            readonly resolve: ({ request }: {
                body: unknown;
                query: Record<string, string>;
                params: {};
                headers: Record<string, string | undefined>;
                cookie: Record<string, import("elysia").Cookie<unknown>>;
                server: import("elysia/universal/server").Server | null;
                redirect: import("elysia").redirect;
                set: {
                    headers: import("elysia").HTTPHeaders;
                    status?: number | keyof import("elysia").StatusMap;
                    redirect?: string;
                    cookie?: Record<string, import("elysia/cookies").ElysiaCookie>;
                };
                path: string;
                route: string;
                request: Request;
                store: {};
                status: <const Code extends number | keyof import("elysia").StatusMap, const T = Code extends 200 | 100 | 101 | 102 | 103 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 300 | 301 | 302 | 303 | 304 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 420 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 ? {
                    readonly 100: "Continue";
                    readonly 101: "Switching Protocols";
                    readonly 102: "Processing";
                    readonly 103: "Early Hints";
                    readonly 200: "OK";
                    readonly 201: "Created";
                    readonly 202: "Accepted";
                    readonly 203: "Non-Authoritative Information";
                    readonly 204: "No Content";
                    readonly 205: "Reset Content";
                    readonly 206: "Partial Content";
                    readonly 207: "Multi-Status";
                    readonly 208: "Already Reported";
                    readonly 300: "Multiple Choices";
                    readonly 301: "Moved Permanently";
                    readonly 302: "Found";
                    readonly 303: "See Other";
                    readonly 304: "Not Modified";
                    readonly 307: "Temporary Redirect";
                    readonly 308: "Permanent Redirect";
                    readonly 400: "Bad Request";
                    readonly 401: "Unauthorized";
                    readonly 402: "Payment Required";
                    readonly 403: "Forbidden";
                    readonly 404: "Not Found";
                    readonly 405: "Method Not Allowed";
                    readonly 406: "Not Acceptable";
                    readonly 407: "Proxy Authentication Required";
                    readonly 408: "Request Timeout";
                    readonly 409: "Conflict";
                    readonly 410: "Gone";
                    readonly 411: "Length Required";
                    readonly 412: "Precondition Failed";
                    readonly 413: "Payload Too Large";
                    readonly 414: "URI Too Long";
                    readonly 415: "Unsupported Media Type";
                    readonly 416: "Range Not Satisfiable";
                    readonly 417: "Expectation Failed";
                    readonly 418: "I'm a teapot";
                    readonly 420: "Enhance Your Calm";
                    readonly 421: "Misdirected Request";
                    readonly 422: "Unprocessable Content";
                    readonly 423: "Locked";
                    readonly 424: "Failed Dependency";
                    readonly 425: "Too Early";
                    readonly 426: "Upgrade Required";
                    readonly 428: "Precondition Required";
                    readonly 429: "Too Many Requests";
                    readonly 431: "Request Header Fields Too Large";
                    readonly 451: "Unavailable For Legal Reasons";
                    readonly 500: "Internal Server Error";
                    readonly 501: "Not Implemented";
                    readonly 502: "Bad Gateway";
                    readonly 503: "Service Unavailable";
                    readonly 504: "Gateway Timeout";
                    readonly 505: "HTTP Version Not Supported";
                    readonly 506: "Variant Also Negotiates";
                    readonly 507: "Insufficient Storage";
                    readonly 508: "Loop Detected";
                    readonly 510: "Not Extended";
                    readonly 511: "Network Authentication Required";
                }[Code] : Code>(code: Code, response?: T) => import("elysia").ElysiaCustomStatusResponse<Code, T, Code extends "Continue" | "Switching Protocols" | "Processing" | "Early Hints" | "OK" | "Created" | "Accepted" | "Non-Authoritative Information" | "No Content" | "Reset Content" | "Partial Content" | "Multi-Status" | "Already Reported" | "Multiple Choices" | "Moved Permanently" | "Found" | "See Other" | "Not Modified" | "Temporary Redirect" | "Permanent Redirect" | "Bad Request" | "Unauthorized" | "Payment Required" | "Forbidden" | "Not Found" | "Method Not Allowed" | "Not Acceptable" | "Proxy Authentication Required" | "Request Timeout" | "Conflict" | "Gone" | "Length Required" | "Precondition Failed" | "Payload Too Large" | "URI Too Long" | "Unsupported Media Type" | "Range Not Satisfiable" | "Expectation Failed" | "I'm a teapot" | "Enhance Your Calm" | "Misdirected Request" | "Unprocessable Content" | "Locked" | "Failed Dependency" | "Too Early" | "Upgrade Required" | "Precondition Required" | "Too Many Requests" | "Request Header Fields Too Large" | "Unavailable For Legal Reasons" | "Internal Server Error" | "Not Implemented" | "Bad Gateway" | "Service Unavailable" | "Gateway Timeout" | "HTTP Version Not Supported" | "Variant Also Negotiates" | "Insufficient Storage" | "Loop Detected" | "Not Extended" | "Network Authentication Required" ? {
                    readonly Continue: 100;
                    readonly "Switching Protocols": 101;
                    readonly Processing: 102;
                    readonly "Early Hints": 103;
                    readonly OK: 200;
                    readonly Created: 201;
                    readonly Accepted: 202;
                    readonly "Non-Authoritative Information": 203;
                    readonly "No Content": 204;
                    readonly "Reset Content": 205;
                    readonly "Partial Content": 206;
                    readonly "Multi-Status": 207;
                    readonly "Already Reported": 208;
                    readonly "Multiple Choices": 300;
                    readonly "Moved Permanently": 301;
                    readonly Found: 302;
                    readonly "See Other": 303;
                    readonly "Not Modified": 304;
                    readonly "Temporary Redirect": 307;
                    readonly "Permanent Redirect": 308;
                    readonly "Bad Request": 400;
                    readonly Unauthorized: 401;
                    readonly "Payment Required": 402;
                    readonly Forbidden: 403;
                    readonly "Not Found": 404;
                    readonly "Method Not Allowed": 405;
                    readonly "Not Acceptable": 406;
                    readonly "Proxy Authentication Required": 407;
                    readonly "Request Timeout": 408;
                    readonly Conflict: 409;
                    readonly Gone: 410;
                    readonly "Length Required": 411;
                    readonly "Precondition Failed": 412;
                    readonly "Payload Too Large": 413;
                    readonly "URI Too Long": 414;
                    readonly "Unsupported Media Type": 415;
                    readonly "Range Not Satisfiable": 416;
                    readonly "Expectation Failed": 417;
                    readonly "I'm a teapot": 418;
                    readonly "Enhance Your Calm": 420;
                    readonly "Misdirected Request": 421;
                    readonly "Unprocessable Content": 422;
                    readonly Locked: 423;
                    readonly "Failed Dependency": 424;
                    readonly "Too Early": 425;
                    readonly "Upgrade Required": 426;
                    readonly "Precondition Required": 428;
                    readonly "Too Many Requests": 429;
                    readonly "Request Header Fields Too Large": 431;
                    readonly "Unavailable For Legal Reasons": 451;
                    readonly "Internal Server Error": 500;
                    readonly "Not Implemented": 501;
                    readonly "Bad Gateway": 502;
                    readonly "Service Unavailable": 503;
                    readonly "Gateway Timeout": 504;
                    readonly "HTTP Version Not Supported": 505;
                    readonly "Variant Also Negotiates": 506;
                    readonly "Insufficient Storage": 507;
                    readonly "Loop Detected": 508;
                    readonly "Not Extended": 510;
                    readonly "Network Authentication Required": 511;
                }[Code] : Code>;
            }) => Promise<import("elysia").ElysiaCustomStatusResponse<401, {
                readonly message: "غير مصرح";
            }, 401> | {
                clinicId: string;
                userId: string;
            }>;
        };
    };
    parser: {};
    response: {};
}, {
    nutrition: {};
} & {
    nutrition: {
        reference: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        bcs: {
                            label: string;
                            detail: string;
                            score: number;
                        }[];
                        weightChangeRates: Record<import("@/server/nutrition/nutrition-energy").EnergySpecies, {
                            loss: import("@/server/nutrition/nutrition-energy").DerFactorBand;
                            gain: import("@/server/nutrition/nutrition-energy").DerFactorBand;
                        }>;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                };
            };
        };
    };
} & {
    nutrition: {
        stats: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("@/server/nutrition/nutrition.type").NutritionStats;
                    401: {
                        readonly message: "غير مصرح";
                    };
                };
            };
        };
    };
} & {
    nutrition: {
        due: {
            get: {
                body: {};
                params: {};
                query: {
                    horizonDays?: number | undefined;
                };
                headers: {};
                response: {
                    200: import("@/server/nutrition/nutrition.type").NutritionDueRow[];
                    401: {
                        readonly message: "غير مصرح";
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
                };
            };
        };
    };
} & {
    nutrition: {
        "weight-history": {
            ":patientId": {
                get: {
                    body: {};
                    params: {
                        patientId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: ({
                            at: Date;
                            weightKg: number;
                            bodyConditionScore: number | null;
                            source: "recheck";
                        } | {
                            at: Date;
                            weightKg: number;
                            bodyConditionScore: number | null;
                            source: "vitals";
                        })[];
                        401: {
                            readonly message: "غير مصرح";
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
                    };
                };
            };
        };
    };
} & {
    nutrition: {
        calculate: {
            post: {
                body: {
                    species?: "DOG" | "CAT" | "HORSE" | "CATTLE" | "SHEEP" | "GOAT" | "CAMEL" | "POULTRY" | "RABBIT" | "SWINE" | "FISH" | "BEE" | null | undefined;
                    patientId?: string | null | undefined;
                    bodyConditionScore?: number | null | undefined;
                    idealWeightKg?: number | null | undefined;
                    isNeutered?: boolean | undefined;
                    targetWeeklyRatePercent?: number | null | undefined;
                    mealsPerDay?: number | undefined;
                    manualDerFactor?: number | null | undefined;
                    foods?: {
                        notes?: string | null | undefined;
                        householdUnit?: "GRAM" | "CUP" | "CAN" | "SCOOP" | "PIECE" | undefined;
                        householdUnitGrams?: number | null | undefined;
                        dietFoodId?: string | null | undefined;
                        formSnapshot?: "SUPPLEMENT" | "DRY" | "WET" | "RAW" | "HOME_COOKED" | "TREAT" | undefined;
                        energySharePercent?: number | undefined;
                        isTreat?: boolean | undefined;
                        nameSnapshot: string;
                        energyDensityKcalPerKgSnapshot: number;
                    }[] | undefined;
                    activity: "INACTIVE" | "LOW" | "HIGH" | "MODERATE" | "WORK_LIGHT" | "WORK_MODERATE" | "WORK_HEAVY";
                    goal: "WEIGHT_LOSS" | "RECOVERY" | "MAINTENANCE" | "WEIGHT_GAIN" | "GROWTH" | "GESTATION" | "LACTATION";
                    currentWeightKg: number;
                    lifeStage: "SENIOR" | "GROWTH_UNDER_4M" | "GROWTH_OVER_4M" | "ADULT";
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        warnings: string[];
                        suggestedIdealWeightKg: number | null;
                        idealWeightKg: number | null;
                        estimatedBodyFatPercent: number | null;
                        percentOverIdeal: number | null;
                        mealsPerDay: number;
                        items: {
                            nameSnapshot: string;
                            dietFoodId: string | null;
                            isTreat: boolean;
                            energySharePercent: number;
                            kcalPerDay: number;
                            householdUnit: "GRAM" | "CUP" | "CAN" | "SCOOP" | "PIECE";
                            amount: import("@/server/nutrition/nutrition-energy").FoodAmount | null;
                        }[];
                        totalSharePercent: number;
                        treatKcal: number;
                        calculationWeightKg: number;
                        calculationWeightBasis: "current" | "ideal";
                        rerKcal: number;
                        derFactor: number;
                        derFactorSource: "auto" | "manual";
                        derFactorBand: import("@/server/nutrition/nutrition-energy").DerFactorBand;
                        derFactorRationale: string;
                        requiresManualFactor: boolean;
                        derKcal: number;
                        treatKcalAllowance: number;
                        baseDietKcal: number;
                        weightProgram: import("@/server/nutrition/nutrition-energy").WeightProgram | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
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
                };
            };
        };
    };
} & {
    nutrition: {
        foods: {
            get: {
                body: {};
                params: {};
                query: {
                    species?: "DOG" | "CAT" | "HORSE" | "CATTLE" | "SHEEP" | "GOAT" | "CAMEL" | "POULTRY" | "RABBIT" | "SWINE" | "FISH" | "BEE" | undefined;
                    patientId?: string | undefined;
                    kind?: "SUPPLEMENT" | "MAINTENANCE" | "TREAT" | "THERAPEUTIC" | undefined;
                    q?: string | undefined;
                    form?: "SUPPLEMENT" | "DRY" | "WET" | "RAW" | "HOME_COOKED" | "TREAT" | undefined;
                    activeOnly?: boolean | undefined;
                };
                headers: {};
                response: {
                    200: {
                        inventoryItem: {
                            name: string;
                            id: string;
                            code: string;
                            stock: number;
                            price: import("@prisma/client-runtime-utils").Decimal;
                        } | null;
                        name: string;
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        code: string;
                        notes: string | null;
                        active: boolean;
                        editsCount: number;
                        species: CatalogSpecies[];
                        kind: import("@/generated/prisma/enums").DietFoodKind;
                        inventoryItemId: string | null;
                        nameEn: string | null;
                        indications: string[];
                        phosphorusPercentDm: import("@prisma/client-runtime-utils").Decimal | null;
                        fiberPercentDm: import("@prisma/client-runtime-utils").Decimal | null;
                        sodiumPercentDm: import("@prisma/client-runtime-utils").Decimal | null;
                        proteinPercentDm: import("@prisma/client-runtime-utils").Decimal | null;
                        brand: string | null;
                        form: import("@/generated/prisma/enums").DietFoodForm;
                        metabolizableEnergyKcalPerKg: import("@prisma/client-runtime-utils").Decimal;
                        householdUnit: import("@/generated/prisma/enums").DietMeasureUnit;
                        householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
                        fatPercentDm: import("@prisma/client-runtime-utils").Decimal | null;
                        moisturePercent: import("@prisma/client-runtime-utils").Decimal | null;
                        lifeStages: import("@/generated/prisma/enums").NutritionLifeStage[];
                    }[];
                    401: {
                        readonly message: "غير مصرح";
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
                };
            };
        };
    };
} & {
    nutrition: {
        foods: {
            post: {
                body: {
                    notes?: string | null | undefined;
                    active?: boolean | undefined;
                    species?: ("DOG" | "CAT" | "HORSE" | "CATTLE" | "SHEEP" | "GOAT" | "CAMEL" | "POULTRY" | "RABBIT" | "SWINE" | "FISH" | "BEE")[] | undefined;
                    kind?: "SUPPLEMENT" | "MAINTENANCE" | "TREAT" | "THERAPEUTIC" | undefined;
                    inventoryItemId?: string | null | undefined;
                    nameEn?: string | null | undefined;
                    indications?: string[] | undefined;
                    phosphorusPercentDm?: number | null | undefined;
                    fiberPercentDm?: number | null | undefined;
                    sodiumPercentDm?: number | null | undefined;
                    proteinPercentDm?: number | null | undefined;
                    brand?: string | null | undefined;
                    form?: "SUPPLEMENT" | "DRY" | "WET" | "RAW" | "HOME_COOKED" | "TREAT" | undefined;
                    householdUnit?: "GRAM" | "CUP" | "CAN" | "SCOOP" | "PIECE" | undefined;
                    householdUnitGrams?: number | null | undefined;
                    fatPercentDm?: number | null | undefined;
                    moisturePercent?: number | null | undefined;
                    lifeStages?: ("SENIOR" | "GROWTH_UNDER_4M" | "GROWTH_OVER_4M" | "ADULT")[] | undefined;
                    name: string;
                    metabolizableEnergyKcalPerKg: number;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        inventoryItem: {
                            name: string;
                            id: string;
                            code: string;
                            stock: number;
                            price: import("@prisma/client-runtime-utils").Decimal;
                        } | null;
                        name: string;
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        code: string;
                        notes: string | null;
                        active: boolean;
                        editsCount: number;
                        species: CatalogSpecies[];
                        kind: import("@/generated/prisma/enums").DietFoodKind;
                        inventoryItemId: string | null;
                        nameEn: string | null;
                        indications: string[];
                        phosphorusPercentDm: import("@prisma/client-runtime-utils").Decimal | null;
                        fiberPercentDm: import("@prisma/client-runtime-utils").Decimal | null;
                        sodiumPercentDm: import("@prisma/client-runtime-utils").Decimal | null;
                        proteinPercentDm: import("@prisma/client-runtime-utils").Decimal | null;
                        brand: string | null;
                        form: import("@/generated/prisma/enums").DietFoodForm;
                        metabolizableEnergyKcalPerKg: import("@prisma/client-runtime-utils").Decimal;
                        householdUnit: import("@/generated/prisma/enums").DietMeasureUnit;
                        householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
                        fatPercentDm: import("@prisma/client-runtime-utils").Decimal | null;
                        moisturePercent: import("@prisma/client-runtime-utils").Decimal | null;
                        lifeStages: import("@/generated/prisma/enums").NutritionLifeStage[];
                    };
                    401: {
                        readonly message: "غير مصرح";
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
                };
            };
        };
    };
} & {
    nutrition: {
        foods: {
            ":id": {
                put: {
                    body: {
                        notes?: string | null | undefined;
                        active?: boolean | undefined;
                        species?: ("DOG" | "CAT" | "HORSE" | "CATTLE" | "SHEEP" | "GOAT" | "CAMEL" | "POULTRY" | "RABBIT" | "SWINE" | "FISH" | "BEE")[] | undefined;
                        kind?: "SUPPLEMENT" | "MAINTENANCE" | "TREAT" | "THERAPEUTIC" | undefined;
                        inventoryItemId?: string | null | undefined;
                        nameEn?: string | null | undefined;
                        indications?: string[] | undefined;
                        phosphorusPercentDm?: number | null | undefined;
                        fiberPercentDm?: number | null | undefined;
                        sodiumPercentDm?: number | null | undefined;
                        proteinPercentDm?: number | null | undefined;
                        brand?: string | null | undefined;
                        form?: "SUPPLEMENT" | "DRY" | "WET" | "RAW" | "HOME_COOKED" | "TREAT" | undefined;
                        householdUnit?: "GRAM" | "CUP" | "CAN" | "SCOOP" | "PIECE" | undefined;
                        householdUnitGrams?: number | null | undefined;
                        fatPercentDm?: number | null | undefined;
                        moisturePercent?: number | null | undefined;
                        lifeStages?: ("SENIOR" | "GROWTH_UNDER_4M" | "GROWTH_OVER_4M" | "ADULT")[] | undefined;
                        name: string;
                        metabolizableEnergyKcalPerKg: number;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            inventoryItem: {
                                name: string;
                                id: string;
                                code: string;
                                stock: number;
                                price: import("@prisma/client-runtime-utils").Decimal;
                            } | null;
                            name: string;
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            notes: string | null;
                            active: boolean;
                            editsCount: number;
                            species: CatalogSpecies[];
                            kind: import("@/generated/prisma/enums").DietFoodKind;
                            inventoryItemId: string | null;
                            nameEn: string | null;
                            indications: string[];
                            phosphorusPercentDm: import("@prisma/client-runtime-utils").Decimal | null;
                            fiberPercentDm: import("@prisma/client-runtime-utils").Decimal | null;
                            sodiumPercentDm: import("@prisma/client-runtime-utils").Decimal | null;
                            proteinPercentDm: import("@prisma/client-runtime-utils").Decimal | null;
                            brand: string | null;
                            form: import("@/generated/prisma/enums").DietFoodForm;
                            metabolizableEnergyKcalPerKg: import("@prisma/client-runtime-utils").Decimal;
                            householdUnit: import("@/generated/prisma/enums").DietMeasureUnit;
                            householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
                            fatPercentDm: import("@prisma/client-runtime-utils").Decimal | null;
                            moisturePercent: import("@prisma/client-runtime-utils").Decimal | null;
                            lifeStages: import("@/generated/prisma/enums").NutritionLifeStage[];
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الغذاء غير موجود";
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
                    };
                };
            };
        };
    };
} & {
    nutrition: {
        foods: {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الغذاء غير موجود";
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
                    };
                };
            };
        };
    };
} & {
    nutrition: {
        plans: {
            get: {
                body: {};
                params: {};
                query: {
                    take?: number | undefined;
                    status?: "ACTIVE" | "DRAFT" | "COMPLETED" | "DISCONTINUED" | undefined;
                    patientId?: string | undefined;
                    q?: string | undefined;
                    goal?: "WEIGHT_LOSS" | "RECOVERY" | "MAINTENANCE" | "WEIGHT_GAIN" | "GROWTH" | "GESTATION" | "LACTATION" | undefined;
                };
                headers: {};
                response: {
                    200: {
                        patient: {
                            animalType: {
                                id: string;
                                arName: string;
                                enName: string;
                                species: CatalogSpecies | null;
                            };
                            animalStrain: {
                                id: string;
                                arName: string;
                            } | null;
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            } | null;
                            name: string;
                            id: string;
                            code: string;
                            gender: import("@/generated/prisma/enums").Gender;
                            birthDate: Date | null;
                            weight: number | null;
                        };
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        _count: {
                            items: number;
                            rechecks: number;
                        };
                        code: string;
                        status: import("@/generated/prisma/enums").NutritionPlanStatus;
                        startedAt: Date | null;
                        activity: import("@/generated/prisma/enums").NutritionActivity;
                        completedAt: Date | null;
                        bodyConditionScore: number | null;
                        discontinuedAt: Date | null;
                        assessedAt: Date;
                        prescriber: {
                            name: string;
                            id: string;
                        } | null;
                        muscleConditionScore: import("@/generated/prisma/enums").MuscleConditionScore | null;
                        nextRecheckAt: Date | null;
                        goal: import("@/generated/prisma/enums").NutritionGoal;
                        currentWeightKg: import("@prisma/client-runtime-utils").Decimal;
                        idealWeightKg: import("@prisma/client-runtime-utils").Decimal | null;
                        lifeStage: import("@/generated/prisma/enums").NutritionLifeStage;
                        isNeutered: boolean;
                        derKcal: import("@prisma/client-runtime-utils").Decimal;
                        rerKcal: import("@prisma/client-runtime-utils").Decimal;
                        derFactor: import("@prisma/client-runtime-utils").Decimal;
                        targetWeeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
                        estimatedWeeks: number | null;
                        recheckIntervalDays: number;
                        draftedByAi: boolean;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
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
                };
            };
        };
    };
} & {
    nutrition: {
        plans: {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                    enName: string;
                                    species: CatalogSpecies | null;
                                };
                                animalStrain: {
                                    id: string;
                                    arName: string;
                                } | null;
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                                gender: import("@/generated/prisma/enums").Gender;
                                birthDate: Date | null;
                                weight: number | null;
                            };
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            _count: {
                                items: number;
                                rechecks: number;
                            };
                            code: string;
                            clinicalNotes: string | null;
                            status: import("@/generated/prisma/enums").NutritionPlanStatus;
                            editsCount: number;
                            items: {
                                id: string;
                                order: number;
                                notes: string | null;
                                nameSnapshot: string;
                                householdUnit: import("@/generated/prisma/enums").DietMeasureUnit;
                                householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
                                dietFoodId: string | null;
                                formSnapshot: import("@/generated/prisma/enums").DietFoodForm;
                                energyDensityKcalPerKgSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                energySharePercent: import("@prisma/client-runtime-utils").Decimal;
                                kcalPerDay: import("@prisma/client-runtime-utils").Decimal;
                                gramsPerDay: import("@prisma/client-runtime-utils").Decimal;
                                householdUnitsPerDay: import("@prisma/client-runtime-utils").Decimal | null;
                                isTreat: boolean;
                                food: {
                                    name: string;
                                    id: string;
                                    code: string;
                                    active: boolean;
                                    brand: string | null;
                                } | null;
                            }[];
                            appointmentId: string | null;
                            startedAt: Date | null;
                            activity: import("@/generated/prisma/enums").NutritionActivity;
                            completedAt: Date | null;
                            bodyConditionScore: number | null;
                            discontinuedAt: Date | null;
                            assessedAt: Date;
                            prescriberId: string | null;
                            prescriber: {
                                name: string;
                                id: string;
                            } | null;
                            muscleConditionScore: import("@/generated/prisma/enums").MuscleConditionScore | null;
                            nextRecheckAt: Date | null;
                            goal: import("@/generated/prisma/enums").NutritionGoal;
                            currentWeightKg: import("@prisma/client-runtime-utils").Decimal;
                            idealWeightKg: import("@prisma/client-runtime-utils").Decimal | null;
                            lifeStage: import("@/generated/prisma/enums").NutritionLifeStage;
                            isNeutered: boolean;
                            derKcal: import("@prisma/client-runtime-utils").Decimal;
                            rerKcal: import("@prisma/client-runtime-utils").Decimal;
                            derFactor: import("@prisma/client-runtime-utils").Decimal;
                            targetWeeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
                            estimatedWeeks: number | null;
                            recheckIntervalDays: number;
                            draftedByAi: boolean;
                            idealWeightSource: string | null;
                            riskFactors: string[];
                            medicalConditions: string[];
                            feedingMethod: import("@/generated/prisma/enums").FeedingMethod;
                            mealsPerDay: number;
                            currentDietSummary: string | null;
                            treatsSummary: string | null;
                            tableFoodSummary: string | null;
                            supplementsSummary: string | null;
                            medicationFoodSummary: string | null;
                            waterSource: string | null;
                            environmentNotes: string | null;
                            currentTreatCaloriePercent: import("@prisma/client-runtime-utils").Decimal | null;
                            calculationWeightKg: import("@prisma/client-runtime-utils").Decimal;
                            derFactorSource: string;
                            treatKcalAllowance: import("@prisma/client-runtime-utils").Decimal;
                            feedingInstructions: string | null;
                            transitionDays: number | null;
                            discontinueReason: string | null;
                            rechecks: {
                                id: string;
                                createdAt: Date;
                                notes: string | null;
                                bodyConditionScore: number | null;
                                performedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                weightKg: import("@prisma/client-runtime-utils").Decimal;
                                recheckedAt: Date;
                                muscleConditionScore: import("@/generated/prisma/enums").MuscleConditionScore | null;
                                weightChangeKg: import("@prisma/client-runtime-utils").Decimal | null;
                                weeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
                                outcome: import("@/generated/prisma/enums").NutritionRecheckOutcome | null;
                                ownerAdherence: number | null;
                                adjustmentPercent: import("@prisma/client-runtime-utils").Decimal | null;
                                newDerKcal: import("@prisma/client-runtime-utils").Decimal | null;
                                adjustmentReason: string | null;
                                nextRecheckAt: Date | null;
                            }[];
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الخطة غير موجودة";
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
                    };
                };
            };
        };
    };
} & {
    nutrition: {
        plans: {
            post: {
                body: {
                    clinicalNotes?: string | null | undefined;
                    items?: {
                        notes?: string | null | undefined;
                        householdUnit?: "GRAM" | "CUP" | "CAN" | "SCOOP" | "PIECE" | undefined;
                        householdUnitGrams?: number | null | undefined;
                        dietFoodId?: string | null | undefined;
                        formSnapshot?: "SUPPLEMENT" | "DRY" | "WET" | "RAW" | "HOME_COOKED" | "TREAT" | undefined;
                        energySharePercent?: number | undefined;
                        isTreat?: boolean | undefined;
                        nameSnapshot: string;
                        energyDensityKcalPerKgSnapshot: number;
                    }[] | undefined;
                    appointmentId?: string | null | undefined;
                    bodyConditionScore?: number | null | undefined;
                    prescriberId?: string | null | undefined;
                    muscleConditionScore?: "NORMAL" | "MILD_LOSS" | "MODERATE_LOSS" | "SEVERE_LOSS" | null | undefined;
                    idealWeightKg?: number | null | undefined;
                    isNeutered?: boolean | undefined;
                    targetWeeklyRatePercent?: number | null | undefined;
                    recheckIntervalDays?: number | undefined;
                    idealWeightSource?: string | null | undefined;
                    riskFactors?: string[] | undefined;
                    medicalConditions?: string[] | undefined;
                    feedingMethod?: "MEAL_FED" | "FREE_CHOICE" | "COMBINATION" | undefined;
                    mealsPerDay?: number | undefined;
                    currentDietSummary?: string | null | undefined;
                    treatsSummary?: string | null | undefined;
                    tableFoodSummary?: string | null | undefined;
                    supplementsSummary?: string | null | undefined;
                    medicationFoodSummary?: string | null | undefined;
                    waterSource?: string | null | undefined;
                    environmentNotes?: string | null | undefined;
                    currentTreatCaloriePercent?: number | null | undefined;
                    feedingInstructions?: string | null | undefined;
                    transitionDays?: number | null | undefined;
                    manualDerFactor?: number | null | undefined;
                    patientId: string;
                    activity: "INACTIVE" | "LOW" | "HIGH" | "MODERATE" | "WORK_LIGHT" | "WORK_MODERATE" | "WORK_HEAVY";
                    goal: "WEIGHT_LOSS" | "RECOVERY" | "MAINTENANCE" | "WEIGHT_GAIN" | "GROWTH" | "GESTATION" | "LACTATION";
                    currentWeightKg: number;
                    lifeStage: "SENIOR" | "GROWTH_UNDER_4M" | "GROWTH_OVER_4M" | "ADULT";
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        patient: {
                            animalType: {
                                id: string;
                                arName: string;
                                enName: string;
                                species: CatalogSpecies | null;
                            };
                            animalStrain: {
                                id: string;
                                arName: string;
                            } | null;
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            } | null;
                            name: string;
                            id: string;
                            code: string;
                            gender: import("@/generated/prisma/enums").Gender;
                            birthDate: Date | null;
                            weight: number | null;
                        };
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        _count: {
                            items: number;
                            rechecks: number;
                        };
                        code: string;
                        clinicalNotes: string | null;
                        status: import("@/generated/prisma/enums").NutritionPlanStatus;
                        editsCount: number;
                        items: {
                            id: string;
                            order: number;
                            notes: string | null;
                            nameSnapshot: string;
                            householdUnit: import("@/generated/prisma/enums").DietMeasureUnit;
                            householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
                            dietFoodId: string | null;
                            formSnapshot: import("@/generated/prisma/enums").DietFoodForm;
                            energyDensityKcalPerKgSnapshot: import("@prisma/client-runtime-utils").Decimal;
                            energySharePercent: import("@prisma/client-runtime-utils").Decimal;
                            kcalPerDay: import("@prisma/client-runtime-utils").Decimal;
                            gramsPerDay: import("@prisma/client-runtime-utils").Decimal;
                            householdUnitsPerDay: import("@prisma/client-runtime-utils").Decimal | null;
                            isTreat: boolean;
                            food: {
                                name: string;
                                id: string;
                                code: string;
                                active: boolean;
                                brand: string | null;
                            } | null;
                        }[];
                        appointmentId: string | null;
                        startedAt: Date | null;
                        activity: import("@/generated/prisma/enums").NutritionActivity;
                        completedAt: Date | null;
                        bodyConditionScore: number | null;
                        discontinuedAt: Date | null;
                        assessedAt: Date;
                        prescriberId: string | null;
                        prescriber: {
                            name: string;
                            id: string;
                        } | null;
                        muscleConditionScore: import("@/generated/prisma/enums").MuscleConditionScore | null;
                        nextRecheckAt: Date | null;
                        goal: import("@/generated/prisma/enums").NutritionGoal;
                        currentWeightKg: import("@prisma/client-runtime-utils").Decimal;
                        idealWeightKg: import("@prisma/client-runtime-utils").Decimal | null;
                        lifeStage: import("@/generated/prisma/enums").NutritionLifeStage;
                        isNeutered: boolean;
                        derKcal: import("@prisma/client-runtime-utils").Decimal;
                        rerKcal: import("@prisma/client-runtime-utils").Decimal;
                        derFactor: import("@prisma/client-runtime-utils").Decimal;
                        targetWeeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
                        estimatedWeeks: number | null;
                        recheckIntervalDays: number;
                        draftedByAi: boolean;
                        idealWeightSource: string | null;
                        riskFactors: string[];
                        medicalConditions: string[];
                        feedingMethod: import("@/generated/prisma/enums").FeedingMethod;
                        mealsPerDay: number;
                        currentDietSummary: string | null;
                        treatsSummary: string | null;
                        tableFoodSummary: string | null;
                        supplementsSummary: string | null;
                        medicationFoodSummary: string | null;
                        waterSource: string | null;
                        environmentNotes: string | null;
                        currentTreatCaloriePercent: import("@prisma/client-runtime-utils").Decimal | null;
                        calculationWeightKg: import("@prisma/client-runtime-utils").Decimal;
                        derFactorSource: string;
                        treatKcalAllowance: import("@prisma/client-runtime-utils").Decimal;
                        feedingInstructions: string | null;
                        transitionDays: number | null;
                        discontinueReason: string | null;
                        rechecks: {
                            id: string;
                            createdAt: Date;
                            notes: string | null;
                            bodyConditionScore: number | null;
                            performedBy: {
                                name: string;
                                id: string;
                            } | null;
                            weightKg: import("@prisma/client-runtime-utils").Decimal;
                            recheckedAt: Date;
                            muscleConditionScore: import("@/generated/prisma/enums").MuscleConditionScore | null;
                            weightChangeKg: import("@prisma/client-runtime-utils").Decimal | null;
                            weeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
                            outcome: import("@/generated/prisma/enums").NutritionRecheckOutcome | null;
                            ownerAdherence: number | null;
                            adjustmentPercent: import("@prisma/client-runtime-utils").Decimal | null;
                            newDerKcal: import("@prisma/client-runtime-utils").Decimal | null;
                            adjustmentReason: string | null;
                            nextRecheckAt: Date | null;
                        }[];
                    };
                    400: {
                        readonly message: string;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: "الطفل غير موجود";
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
                };
            };
        };
    };
} & {
    nutrition: {
        plans: {
            ":id": {
                put: {
                    body: {
                        clinicalNotes?: string | null | undefined;
                        items?: {
                            notes?: string | null | undefined;
                            householdUnit?: "GRAM" | "CUP" | "CAN" | "SCOOP" | "PIECE" | undefined;
                            householdUnitGrams?: number | null | undefined;
                            dietFoodId?: string | null | undefined;
                            formSnapshot?: "SUPPLEMENT" | "DRY" | "WET" | "RAW" | "HOME_COOKED" | "TREAT" | undefined;
                            energySharePercent?: number | undefined;
                            isTreat?: boolean | undefined;
                            nameSnapshot: string;
                            energyDensityKcalPerKgSnapshot: number;
                        }[] | undefined;
                        appointmentId?: string | null | undefined;
                        bodyConditionScore?: number | null | undefined;
                        prescriberId?: string | null | undefined;
                        muscleConditionScore?: "NORMAL" | "MILD_LOSS" | "MODERATE_LOSS" | "SEVERE_LOSS" | null | undefined;
                        idealWeightKg?: number | null | undefined;
                        isNeutered?: boolean | undefined;
                        targetWeeklyRatePercent?: number | null | undefined;
                        recheckIntervalDays?: number | undefined;
                        idealWeightSource?: string | null | undefined;
                        riskFactors?: string[] | undefined;
                        medicalConditions?: string[] | undefined;
                        feedingMethod?: "MEAL_FED" | "FREE_CHOICE" | "COMBINATION" | undefined;
                        mealsPerDay?: number | undefined;
                        currentDietSummary?: string | null | undefined;
                        treatsSummary?: string | null | undefined;
                        tableFoodSummary?: string | null | undefined;
                        supplementsSummary?: string | null | undefined;
                        medicationFoodSummary?: string | null | undefined;
                        waterSource?: string | null | undefined;
                        environmentNotes?: string | null | undefined;
                        currentTreatCaloriePercent?: number | null | undefined;
                        feedingInstructions?: string | null | undefined;
                        transitionDays?: number | null | undefined;
                        manualDerFactor?: number | null | undefined;
                        patientId: string;
                        activity: "INACTIVE" | "LOW" | "HIGH" | "MODERATE" | "WORK_LIGHT" | "WORK_MODERATE" | "WORK_HEAVY";
                        goal: "WEIGHT_LOSS" | "RECOVERY" | "MAINTENANCE" | "WEIGHT_GAIN" | "GROWTH" | "GESTATION" | "LACTATION";
                        currentWeightKg: number;
                        lifeStage: "SENIOR" | "GROWTH_UNDER_4M" | "GROWTH_OVER_4M" | "ADULT";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                    enName: string;
                                    species: CatalogSpecies | null;
                                };
                                animalStrain: {
                                    id: string;
                                    arName: string;
                                } | null;
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                                gender: import("@/generated/prisma/enums").Gender;
                                birthDate: Date | null;
                                weight: number | null;
                            };
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            _count: {
                                items: number;
                                rechecks: number;
                            };
                            code: string;
                            clinicalNotes: string | null;
                            status: import("@/generated/prisma/enums").NutritionPlanStatus;
                            editsCount: number;
                            items: {
                                id: string;
                                order: number;
                                notes: string | null;
                                nameSnapshot: string;
                                householdUnit: import("@/generated/prisma/enums").DietMeasureUnit;
                                householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
                                dietFoodId: string | null;
                                formSnapshot: import("@/generated/prisma/enums").DietFoodForm;
                                energyDensityKcalPerKgSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                energySharePercent: import("@prisma/client-runtime-utils").Decimal;
                                kcalPerDay: import("@prisma/client-runtime-utils").Decimal;
                                gramsPerDay: import("@prisma/client-runtime-utils").Decimal;
                                householdUnitsPerDay: import("@prisma/client-runtime-utils").Decimal | null;
                                isTreat: boolean;
                                food: {
                                    name: string;
                                    id: string;
                                    code: string;
                                    active: boolean;
                                    brand: string | null;
                                } | null;
                            }[];
                            appointmentId: string | null;
                            startedAt: Date | null;
                            activity: import("@/generated/prisma/enums").NutritionActivity;
                            completedAt: Date | null;
                            bodyConditionScore: number | null;
                            discontinuedAt: Date | null;
                            assessedAt: Date;
                            prescriberId: string | null;
                            prescriber: {
                                name: string;
                                id: string;
                            } | null;
                            muscleConditionScore: import("@/generated/prisma/enums").MuscleConditionScore | null;
                            nextRecheckAt: Date | null;
                            goal: import("@/generated/prisma/enums").NutritionGoal;
                            currentWeightKg: import("@prisma/client-runtime-utils").Decimal;
                            idealWeightKg: import("@prisma/client-runtime-utils").Decimal | null;
                            lifeStage: import("@/generated/prisma/enums").NutritionLifeStage;
                            isNeutered: boolean;
                            derKcal: import("@prisma/client-runtime-utils").Decimal;
                            rerKcal: import("@prisma/client-runtime-utils").Decimal;
                            derFactor: import("@prisma/client-runtime-utils").Decimal;
                            targetWeeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
                            estimatedWeeks: number | null;
                            recheckIntervalDays: number;
                            draftedByAi: boolean;
                            idealWeightSource: string | null;
                            riskFactors: string[];
                            medicalConditions: string[];
                            feedingMethod: import("@/generated/prisma/enums").FeedingMethod;
                            mealsPerDay: number;
                            currentDietSummary: string | null;
                            treatsSummary: string | null;
                            tableFoodSummary: string | null;
                            supplementsSummary: string | null;
                            medicationFoodSummary: string | null;
                            waterSource: string | null;
                            environmentNotes: string | null;
                            currentTreatCaloriePercent: import("@prisma/client-runtime-utils").Decimal | null;
                            calculationWeightKg: import("@prisma/client-runtime-utils").Decimal;
                            derFactorSource: string;
                            treatKcalAllowance: import("@prisma/client-runtime-utils").Decimal;
                            feedingInstructions: string | null;
                            transitionDays: number | null;
                            discontinueReason: string | null;
                            rechecks: {
                                id: string;
                                createdAt: Date;
                                notes: string | null;
                                bodyConditionScore: number | null;
                                performedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                weightKg: import("@prisma/client-runtime-utils").Decimal;
                                recheckedAt: Date;
                                muscleConditionScore: import("@/generated/prisma/enums").MuscleConditionScore | null;
                                weightChangeKg: import("@prisma/client-runtime-utils").Decimal | null;
                                weeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
                                outcome: import("@/generated/prisma/enums").NutritionRecheckOutcome | null;
                                ownerAdherence: number | null;
                                adjustmentPercent: import("@prisma/client-runtime-utils").Decimal | null;
                                newDerKcal: import("@prisma/client-runtime-utils").Decimal | null;
                                adjustmentReason: string | null;
                                nextRecheckAt: Date | null;
                            }[];
                        };
                        400: {
                            readonly message: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الخطة غير موجودة";
                        } | {
                            readonly message: "الطفل غير موجود";
                        };
                        409: {
                            readonly message: "الخطة السارية لا تُحرَّر — سجّل مراجعة أو أنشئ خطة جديدة";
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
                    };
                };
            };
        };
    };
} & {
    nutrition: {
        plans: {
            ":id": {
                activate: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                        enName: string;
                                        species: CatalogSpecies | null;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    owner: {
                                        name: string;
                                        id: string;
                                        phone: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    birthDate: Date | null;
                                    weight: number | null;
                                };
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                _count: {
                                    items: number;
                                    rechecks: number;
                                };
                                code: string;
                                clinicalNotes: string | null;
                                status: import("@/generated/prisma/enums").NutritionPlanStatus;
                                editsCount: number;
                                items: {
                                    id: string;
                                    order: number;
                                    notes: string | null;
                                    nameSnapshot: string;
                                    householdUnit: import("@/generated/prisma/enums").DietMeasureUnit;
                                    householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
                                    dietFoodId: string | null;
                                    formSnapshot: import("@/generated/prisma/enums").DietFoodForm;
                                    energyDensityKcalPerKgSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    energySharePercent: import("@prisma/client-runtime-utils").Decimal;
                                    kcalPerDay: import("@prisma/client-runtime-utils").Decimal;
                                    gramsPerDay: import("@prisma/client-runtime-utils").Decimal;
                                    householdUnitsPerDay: import("@prisma/client-runtime-utils").Decimal | null;
                                    isTreat: boolean;
                                    food: {
                                        name: string;
                                        id: string;
                                        code: string;
                                        active: boolean;
                                        brand: string | null;
                                    } | null;
                                }[];
                                appointmentId: string | null;
                                startedAt: Date | null;
                                activity: import("@/generated/prisma/enums").NutritionActivity;
                                completedAt: Date | null;
                                bodyConditionScore: number | null;
                                discontinuedAt: Date | null;
                                assessedAt: Date;
                                prescriberId: string | null;
                                prescriber: {
                                    name: string;
                                    id: string;
                                } | null;
                                muscleConditionScore: import("@/generated/prisma/enums").MuscleConditionScore | null;
                                nextRecheckAt: Date | null;
                                goal: import("@/generated/prisma/enums").NutritionGoal;
                                currentWeightKg: import("@prisma/client-runtime-utils").Decimal;
                                idealWeightKg: import("@prisma/client-runtime-utils").Decimal | null;
                                lifeStage: import("@/generated/prisma/enums").NutritionLifeStage;
                                isNeutered: boolean;
                                derKcal: import("@prisma/client-runtime-utils").Decimal;
                                rerKcal: import("@prisma/client-runtime-utils").Decimal;
                                derFactor: import("@prisma/client-runtime-utils").Decimal;
                                targetWeeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
                                estimatedWeeks: number | null;
                                recheckIntervalDays: number;
                                draftedByAi: boolean;
                                idealWeightSource: string | null;
                                riskFactors: string[];
                                medicalConditions: string[];
                                feedingMethod: import("@/generated/prisma/enums").FeedingMethod;
                                mealsPerDay: number;
                                currentDietSummary: string | null;
                                treatsSummary: string | null;
                                tableFoodSummary: string | null;
                                supplementsSummary: string | null;
                                medicationFoodSummary: string | null;
                                waterSource: string | null;
                                environmentNotes: string | null;
                                currentTreatCaloriePercent: import("@prisma/client-runtime-utils").Decimal | null;
                                calculationWeightKg: import("@prisma/client-runtime-utils").Decimal;
                                derFactorSource: string;
                                treatKcalAllowance: import("@prisma/client-runtime-utils").Decimal;
                                feedingInstructions: string | null;
                                transitionDays: number | null;
                                discontinueReason: string | null;
                                rechecks: {
                                    id: string;
                                    createdAt: Date;
                                    notes: string | null;
                                    bodyConditionScore: number | null;
                                    performedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    weightKg: import("@prisma/client-runtime-utils").Decimal;
                                    recheckedAt: Date;
                                    muscleConditionScore: import("@/generated/prisma/enums").MuscleConditionScore | null;
                                    weightChangeKg: import("@prisma/client-runtime-utils").Decimal | null;
                                    weeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
                                    outcome: import("@/generated/prisma/enums").NutritionRecheckOutcome | null;
                                    ownerAdherence: number | null;
                                    adjustmentPercent: import("@prisma/client-runtime-utils").Decimal | null;
                                    newDerKcal: import("@prisma/client-runtime-utils").Decimal | null;
                                    adjustmentReason: string | null;
                                    nextRecheckAt: Date | null;
                                }[];
                            };
                            400: {
                                readonly message: "لا يمكن تفعيل خطة بلا أغذية موصوفة";
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "الخطة غير موجودة";
                            };
                            409: {
                                readonly message: "لا تُفعَّل إلا المسودّات";
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
                        };
                    };
                };
            };
        };
    };
} & {
    nutrition: {
        plans: {
            ":id": {
                complete: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                        enName: string;
                                        species: CatalogSpecies | null;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    owner: {
                                        name: string;
                                        id: string;
                                        phone: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    birthDate: Date | null;
                                    weight: number | null;
                                };
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                _count: {
                                    items: number;
                                    rechecks: number;
                                };
                                code: string;
                                clinicalNotes: string | null;
                                status: import("@/generated/prisma/enums").NutritionPlanStatus;
                                editsCount: number;
                                items: {
                                    id: string;
                                    order: number;
                                    notes: string | null;
                                    nameSnapshot: string;
                                    householdUnit: import("@/generated/prisma/enums").DietMeasureUnit;
                                    householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
                                    dietFoodId: string | null;
                                    formSnapshot: import("@/generated/prisma/enums").DietFoodForm;
                                    energyDensityKcalPerKgSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    energySharePercent: import("@prisma/client-runtime-utils").Decimal;
                                    kcalPerDay: import("@prisma/client-runtime-utils").Decimal;
                                    gramsPerDay: import("@prisma/client-runtime-utils").Decimal;
                                    householdUnitsPerDay: import("@prisma/client-runtime-utils").Decimal | null;
                                    isTreat: boolean;
                                    food: {
                                        name: string;
                                        id: string;
                                        code: string;
                                        active: boolean;
                                        brand: string | null;
                                    } | null;
                                }[];
                                appointmentId: string | null;
                                startedAt: Date | null;
                                activity: import("@/generated/prisma/enums").NutritionActivity;
                                completedAt: Date | null;
                                bodyConditionScore: number | null;
                                discontinuedAt: Date | null;
                                assessedAt: Date;
                                prescriberId: string | null;
                                prescriber: {
                                    name: string;
                                    id: string;
                                } | null;
                                muscleConditionScore: import("@/generated/prisma/enums").MuscleConditionScore | null;
                                nextRecheckAt: Date | null;
                                goal: import("@/generated/prisma/enums").NutritionGoal;
                                currentWeightKg: import("@prisma/client-runtime-utils").Decimal;
                                idealWeightKg: import("@prisma/client-runtime-utils").Decimal | null;
                                lifeStage: import("@/generated/prisma/enums").NutritionLifeStage;
                                isNeutered: boolean;
                                derKcal: import("@prisma/client-runtime-utils").Decimal;
                                rerKcal: import("@prisma/client-runtime-utils").Decimal;
                                derFactor: import("@prisma/client-runtime-utils").Decimal;
                                targetWeeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
                                estimatedWeeks: number | null;
                                recheckIntervalDays: number;
                                draftedByAi: boolean;
                                idealWeightSource: string | null;
                                riskFactors: string[];
                                medicalConditions: string[];
                                feedingMethod: import("@/generated/prisma/enums").FeedingMethod;
                                mealsPerDay: number;
                                currentDietSummary: string | null;
                                treatsSummary: string | null;
                                tableFoodSummary: string | null;
                                supplementsSummary: string | null;
                                medicationFoodSummary: string | null;
                                waterSource: string | null;
                                environmentNotes: string | null;
                                currentTreatCaloriePercent: import("@prisma/client-runtime-utils").Decimal | null;
                                calculationWeightKg: import("@prisma/client-runtime-utils").Decimal;
                                derFactorSource: string;
                                treatKcalAllowance: import("@prisma/client-runtime-utils").Decimal;
                                feedingInstructions: string | null;
                                transitionDays: number | null;
                                discontinueReason: string | null;
                                rechecks: {
                                    id: string;
                                    createdAt: Date;
                                    notes: string | null;
                                    bodyConditionScore: number | null;
                                    performedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    weightKg: import("@prisma/client-runtime-utils").Decimal;
                                    recheckedAt: Date;
                                    muscleConditionScore: import("@/generated/prisma/enums").MuscleConditionScore | null;
                                    weightChangeKg: import("@prisma/client-runtime-utils").Decimal | null;
                                    weeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
                                    outcome: import("@/generated/prisma/enums").NutritionRecheckOutcome | null;
                                    ownerAdherence: number | null;
                                    adjustmentPercent: import("@prisma/client-runtime-utils").Decimal | null;
                                    newDerKcal: import("@prisma/client-runtime-utils").Decimal | null;
                                    adjustmentReason: string | null;
                                    nextRecheckAt: Date | null;
                                }[];
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "الخطة غير موجودة";
                            };
                            409: {
                                readonly message: "لا تكتمل إلا الخطط السارية";
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
                        };
                    };
                };
            };
        };
    };
} & {
    nutrition: {
        plans: {
            ":id": {
                discontinue: {
                    post: {
                        body: {
                            reason: string;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                        enName: string;
                                        species: CatalogSpecies | null;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    owner: {
                                        name: string;
                                        id: string;
                                        phone: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    birthDate: Date | null;
                                    weight: number | null;
                                };
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                _count: {
                                    items: number;
                                    rechecks: number;
                                };
                                code: string;
                                clinicalNotes: string | null;
                                status: import("@/generated/prisma/enums").NutritionPlanStatus;
                                editsCount: number;
                                items: {
                                    id: string;
                                    order: number;
                                    notes: string | null;
                                    nameSnapshot: string;
                                    householdUnit: import("@/generated/prisma/enums").DietMeasureUnit;
                                    householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
                                    dietFoodId: string | null;
                                    formSnapshot: import("@/generated/prisma/enums").DietFoodForm;
                                    energyDensityKcalPerKgSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    energySharePercent: import("@prisma/client-runtime-utils").Decimal;
                                    kcalPerDay: import("@prisma/client-runtime-utils").Decimal;
                                    gramsPerDay: import("@prisma/client-runtime-utils").Decimal;
                                    householdUnitsPerDay: import("@prisma/client-runtime-utils").Decimal | null;
                                    isTreat: boolean;
                                    food: {
                                        name: string;
                                        id: string;
                                        code: string;
                                        active: boolean;
                                        brand: string | null;
                                    } | null;
                                }[];
                                appointmentId: string | null;
                                startedAt: Date | null;
                                activity: import("@/generated/prisma/enums").NutritionActivity;
                                completedAt: Date | null;
                                bodyConditionScore: number | null;
                                discontinuedAt: Date | null;
                                assessedAt: Date;
                                prescriberId: string | null;
                                prescriber: {
                                    name: string;
                                    id: string;
                                } | null;
                                muscleConditionScore: import("@/generated/prisma/enums").MuscleConditionScore | null;
                                nextRecheckAt: Date | null;
                                goal: import("@/generated/prisma/enums").NutritionGoal;
                                currentWeightKg: import("@prisma/client-runtime-utils").Decimal;
                                idealWeightKg: import("@prisma/client-runtime-utils").Decimal | null;
                                lifeStage: import("@/generated/prisma/enums").NutritionLifeStage;
                                isNeutered: boolean;
                                derKcal: import("@prisma/client-runtime-utils").Decimal;
                                rerKcal: import("@prisma/client-runtime-utils").Decimal;
                                derFactor: import("@prisma/client-runtime-utils").Decimal;
                                targetWeeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
                                estimatedWeeks: number | null;
                                recheckIntervalDays: number;
                                draftedByAi: boolean;
                                idealWeightSource: string | null;
                                riskFactors: string[];
                                medicalConditions: string[];
                                feedingMethod: import("@/generated/prisma/enums").FeedingMethod;
                                mealsPerDay: number;
                                currentDietSummary: string | null;
                                treatsSummary: string | null;
                                tableFoodSummary: string | null;
                                supplementsSummary: string | null;
                                medicationFoodSummary: string | null;
                                waterSource: string | null;
                                environmentNotes: string | null;
                                currentTreatCaloriePercent: import("@prisma/client-runtime-utils").Decimal | null;
                                calculationWeightKg: import("@prisma/client-runtime-utils").Decimal;
                                derFactorSource: string;
                                treatKcalAllowance: import("@prisma/client-runtime-utils").Decimal;
                                feedingInstructions: string | null;
                                transitionDays: number | null;
                                discontinueReason: string | null;
                                rechecks: {
                                    id: string;
                                    createdAt: Date;
                                    notes: string | null;
                                    bodyConditionScore: number | null;
                                    performedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    weightKg: import("@prisma/client-runtime-utils").Decimal;
                                    recheckedAt: Date;
                                    muscleConditionScore: import("@/generated/prisma/enums").MuscleConditionScore | null;
                                    weightChangeKg: import("@prisma/client-runtime-utils").Decimal | null;
                                    weeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
                                    outcome: import("@/generated/prisma/enums").NutritionRecheckOutcome | null;
                                    ownerAdherence: number | null;
                                    adjustmentPercent: import("@prisma/client-runtime-utils").Decimal | null;
                                    newDerKcal: import("@prisma/client-runtime-utils").Decimal | null;
                                    adjustmentReason: string | null;
                                    nextRecheckAt: Date | null;
                                }[];
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "الخطة غير موجودة";
                            };
                            409: {
                                readonly message: "الخطة منتهية بالفعل";
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
                        };
                    };
                };
            };
        };
    };
} & {
    nutrition: {
        plans: {
            ":id": {
                rechecks: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                createdAt: Date;
                                notes: string | null;
                                bodyConditionScore: number | null;
                                performedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                weightKg: import("@prisma/client-runtime-utils").Decimal;
                                recheckedAt: Date;
                                muscleConditionScore: import("@/generated/prisma/enums").MuscleConditionScore | null;
                                weightChangeKg: import("@prisma/client-runtime-utils").Decimal | null;
                                weeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
                                outcome: import("@/generated/prisma/enums").NutritionRecheckOutcome | null;
                                ownerAdherence: number | null;
                                adjustmentPercent: import("@prisma/client-runtime-utils").Decimal | null;
                                newDerKcal: import("@prisma/client-runtime-utils").Decimal | null;
                                adjustmentReason: string | null;
                                nextRecheckAt: Date | null;
                            }[];
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "الخطة غير موجودة";
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
                        };
                    };
                };
            };
        };
    };
} & {
    nutrition: {
        plans: {
            ":id": {
                rechecks: {
                    post: {
                        body: {
                            notes?: string | null | undefined;
                            bodyConditionScore?: number | null | undefined;
                            performedById?: string | null | undefined;
                            recheckedAt?: string | undefined;
                            muscleConditionScore?: "NORMAL" | "MILD_LOSS" | "MODERATE_LOSS" | "SEVERE_LOSS" | null | undefined;
                            ownerAdherence?: number | null | undefined;
                            adjustmentPercent?: number | null | undefined;
                            adjustmentReason?: string | null | undefined;
                            applyAdjustment?: boolean | undefined;
                            weightKg: number;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                recheck: {
                                    id: string;
                                    createdAt: Date;
                                    notes: string | null;
                                    bodyConditionScore: number | null;
                                    performedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    weightKg: import("@prisma/client-runtime-utils").Decimal;
                                    recheckedAt: Date;
                                    muscleConditionScore: import("@/generated/prisma/enums").MuscleConditionScore | null;
                                    weightChangeKg: import("@prisma/client-runtime-utils").Decimal | null;
                                    weeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
                                    outcome: import("@/generated/prisma/enums").NutritionRecheckOutcome | null;
                                    ownerAdherence: number | null;
                                    adjustmentPercent: import("@prisma/client-runtime-utils").Decimal | null;
                                    newDerKcal: import("@prisma/client-runtime-utils").Decimal | null;
                                    adjustmentReason: string | null;
                                    nextRecheckAt: Date | null;
                                };
                                assessment: import("@/server/nutrition/nutrition-energy").RecheckAssessment;
                                appliedPercent: number;
                                newDerKcal: number;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "الخطة غير موجودة";
                            };
                            409: {
                                readonly message: "المراجعات تُسجَّل على الخطط السارية فقط";
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
                        };
                    };
                };
            };
        };
    };
} & {
    nutrition: {
        "draft-field": {
            post: {
                body: {
                    items?: {
                        notes?: string | null | undefined;
                        householdUnit?: "GRAM" | "CUP" | "CAN" | "SCOOP" | "PIECE" | undefined;
                        householdUnitGrams?: number | null | undefined;
                        dietFoodId?: string | null | undefined;
                        formSnapshot?: "SUPPLEMENT" | "DRY" | "WET" | "RAW" | "HOME_COOKED" | "TREAT" | undefined;
                        energySharePercent?: number | undefined;
                        isTreat?: boolean | undefined;
                        nameSnapshot: string;
                        energyDensityKcalPerKgSnapshot: number;
                    }[] | undefined;
                    patientId?: string | null | undefined;
                    bodyConditionScore?: number | null | undefined;
                    muscleConditionScore?: "NORMAL" | "MILD_LOSS" | "MODERATE_LOSS" | "SEVERE_LOSS" | null | undefined;
                    idealWeightKg?: number | null | undefined;
                    isNeutered?: boolean | undefined;
                    targetWeeklyRatePercent?: number | null | undefined;
                    recheckIntervalDays?: number | undefined;
                    riskFactors?: string[] | undefined;
                    medicalConditions?: string[] | undefined;
                    feedingMethod?: "MEAL_FED" | "FREE_CHOICE" | "COMBINATION" | undefined;
                    mealsPerDay?: number | undefined;
                    currentDietSummary?: string | null | undefined;
                    treatsSummary?: string | null | undefined;
                    transitionDays?: number | null | undefined;
                    manualDerFactor?: number | null | undefined;
                    hint?: string | null | undefined;
                    activity: "INACTIVE" | "LOW" | "HIGH" | "MODERATE" | "WORK_LIGHT" | "WORK_MODERATE" | "WORK_HEAVY";
                    kind: "clinicalNotes" | "instructions";
                    goal: "WEIGHT_LOSS" | "RECOVERY" | "MAINTENANCE" | "WEIGHT_GAIN" | "GROWTH" | "GESTATION" | "LACTATION";
                    currentWeightKg: number;
                    lifeStage: "SENIOR" | "GROWTH_UNDER_4M" | "GROWTH_OVER_4M" | "ADULT";
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        text: string;
                    };
                    401: {
                        readonly message: "غير مصرح";
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
                    503: {
                        readonly message: "تعذّر توليد المسودّة — حاول مجددًا";
                    };
                };
            };
        };
    };
} & {
    nutrition: {
        plans: {
            ":id": {
                "draft-instructions": {
                    post: {
                        body: {
                            hint?: string | null | undefined;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                text: string;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "الخطة غير موجودة";
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
                            503: {
                                readonly message: "تعذّر توليد المسودّة — حاول مجددًا";
                            };
                        };
                    };
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
