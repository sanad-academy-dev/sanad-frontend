import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { DietFoodForm, DietFoodKind, DietMeasureUnit, FeedingMethod, MuscleConditionScore, NutritionActivity, NutritionGoal, NutritionLifeStage, type NutritionPlanStatus, type NutritionRecheckOutcome } from "@/generated/prisma/enums";
declare const dietFoodSelect: {
    readonly id: true;
    readonly code: true;
    readonly name: true;
    readonly nameEn: true;
    readonly brand: true;
    readonly form: true;
    readonly kind: true;
    readonly metabolizableEnergyKcalPerKg: true;
    readonly householdUnit: true;
    readonly householdUnitGrams: true;
    readonly proteinPercentDm: true;
    readonly fatPercentDm: true;
    readonly fiberPercentDm: true;
    readonly moisturePercent: true;
    readonly sodiumPercentDm: true;
    readonly phosphorusPercentDm: true;
    readonly species: true;
    readonly indications: true;
    readonly lifeStages: true;
    readonly inventoryItemId: true;
    readonly notes: true;
    readonly active: true;
    readonly editsCount: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly inventoryItem: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly code: true;
            readonly stock: true;
            readonly price: true;
        };
    };
};
export type DietFoodResponse = Prisma.DietFoodGetPayload<{
    select: typeof dietFoodSelect;
}>;
export declare const dietFoodSelectShape: {
    readonly id: true;
    readonly code: true;
    readonly name: true;
    readonly nameEn: true;
    readonly brand: true;
    readonly form: true;
    readonly kind: true;
    readonly metabolizableEnergyKcalPerKg: true;
    readonly householdUnit: true;
    readonly householdUnitGrams: true;
    readonly proteinPercentDm: true;
    readonly fatPercentDm: true;
    readonly fiberPercentDm: true;
    readonly moisturePercent: true;
    readonly sodiumPercentDm: true;
    readonly phosphorusPercentDm: true;
    readonly species: true;
    readonly indications: true;
    readonly lifeStages: true;
    readonly inventoryItemId: true;
    readonly notes: true;
    readonly active: true;
    readonly editsCount: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly inventoryItem: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly code: true;
            readonly stock: true;
            readonly price: true;
        };
    };
};
declare const planItemSelect: {
    readonly id: true;
    readonly order: true;
    readonly dietFoodId: true;
    readonly nameSnapshot: true;
    readonly formSnapshot: true;
    readonly energyDensityKcalPerKgSnapshot: true;
    readonly energySharePercent: true;
    readonly kcalPerDay: true;
    readonly gramsPerDay: true;
    readonly householdUnit: true;
    readonly householdUnitGrams: true;
    readonly householdUnitsPerDay: true;
    readonly isTreat: true;
    readonly notes: true;
    readonly food: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
            readonly brand: true;
            readonly active: true;
        };
    };
};
export type NutritionPlanItemResponse = Prisma.NutritionPlanItemGetPayload<{
    select: typeof planItemSelect;
}>;
declare const recheckSelect: {
    readonly id: true;
    readonly recheckedAt: true;
    readonly weightKg: true;
    readonly bodyConditionScore: true;
    readonly muscleConditionScore: true;
    readonly weightChangeKg: true;
    readonly weeklyRatePercent: true;
    readonly outcome: true;
    readonly ownerAdherence: true;
    readonly adjustmentPercent: true;
    readonly newDerKcal: true;
    readonly adjustmentReason: true;
    readonly notes: true;
    readonly nextRecheckAt: true;
    readonly createdAt: true;
    readonly performedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type NutritionRecheckResponse = Prisma.NutritionRecheckGetPayload<{
    select: typeof recheckSelect;
}>;
export declare const nutritionRecheckSelectShape: {
    readonly id: true;
    readonly recheckedAt: true;
    readonly weightKg: true;
    readonly bodyConditionScore: true;
    readonly muscleConditionScore: true;
    readonly weightChangeKg: true;
    readonly weeklyRatePercent: true;
    readonly outcome: true;
    readonly ownerAdherence: true;
    readonly adjustmentPercent: true;
    readonly newDerKcal: true;
    readonly adjustmentReason: true;
    readonly notes: true;
    readonly nextRecheckAt: true;
    readonly createdAt: true;
    readonly performedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
declare const planListSelect: {
    readonly id: true;
    readonly code: true;
    readonly status: true;
    readonly goal: true;
    readonly assessedAt: true;
    readonly currentWeightKg: true;
    readonly idealWeightKg: true;
    readonly bodyConditionScore: true;
    readonly muscleConditionScore: true;
    readonly lifeStage: true;
    readonly activity: true;
    readonly isNeutered: true;
    readonly derKcal: true;
    readonly rerKcal: true;
    readonly derFactor: true;
    readonly targetWeeklyRatePercent: true;
    readonly estimatedWeeks: true;
    readonly recheckIntervalDays: true;
    readonly nextRecheckAt: true;
    readonly startedAt: true;
    readonly completedAt: true;
    readonly discontinuedAt: true;
    readonly draftedByAi: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
            readonly gender: true;
            readonly birthDate: true;
            readonly weight: true;
            readonly animalType: {
                readonly select: {
                    readonly id: true;
                    readonly arName: true;
                    readonly enName: true;
                    readonly species: true;
                };
            };
            readonly animalStrain: {
                readonly select: {
                    readonly id: true;
                    readonly arName: true;
                };
            };
            readonly owner: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                    readonly phone: true;
                };
            };
        };
    };
    readonly prescriber: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly _count: {
        readonly select: {
            readonly rechecks: true;
            readonly items: true;
        };
    };
};
export type NutritionPlanListResponse = Prisma.NutritionPlanGetPayload<{
    select: typeof planListSelect;
}>;
export declare const nutritionPlanListSelect: {
    readonly id: true;
    readonly code: true;
    readonly status: true;
    readonly goal: true;
    readonly assessedAt: true;
    readonly currentWeightKg: true;
    readonly idealWeightKg: true;
    readonly bodyConditionScore: true;
    readonly muscleConditionScore: true;
    readonly lifeStage: true;
    readonly activity: true;
    readonly isNeutered: true;
    readonly derKcal: true;
    readonly rerKcal: true;
    readonly derFactor: true;
    readonly targetWeeklyRatePercent: true;
    readonly estimatedWeeks: true;
    readonly recheckIntervalDays: true;
    readonly nextRecheckAt: true;
    readonly startedAt: true;
    readonly completedAt: true;
    readonly discontinuedAt: true;
    readonly draftedByAi: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
            readonly gender: true;
            readonly birthDate: true;
            readonly weight: true;
            readonly animalType: {
                readonly select: {
                    readonly id: true;
                    readonly arName: true;
                    readonly enName: true;
                    readonly species: true;
                };
            };
            readonly animalStrain: {
                readonly select: {
                    readonly id: true;
                    readonly arName: true;
                };
            };
            readonly owner: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                    readonly phone: true;
                };
            };
        };
    };
    readonly prescriber: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly _count: {
        readonly select: {
            readonly rechecks: true;
            readonly items: true;
        };
    };
};
declare const planDetailSelect: {
    readonly appointmentId: true;
    readonly prescriberId: true;
    readonly idealWeightSource: true;
    readonly riskFactors: true;
    readonly medicalConditions: true;
    readonly feedingMethod: true;
    readonly mealsPerDay: true;
    readonly currentDietSummary: true;
    readonly treatsSummary: true;
    readonly tableFoodSummary: true;
    readonly supplementsSummary: true;
    readonly medicationFoodSummary: true;
    readonly waterSource: true;
    readonly environmentNotes: true;
    readonly currentTreatCaloriePercent: true;
    readonly calculationWeightKg: true;
    readonly derFactorSource: true;
    readonly treatKcalAllowance: true;
    readonly feedingInstructions: true;
    readonly clinicalNotes: true;
    readonly transitionDays: true;
    readonly discontinueReason: true;
    readonly editsCount: true;
    readonly items: {
        readonly select: {
            readonly id: true;
            readonly order: true;
            readonly dietFoodId: true;
            readonly nameSnapshot: true;
            readonly formSnapshot: true;
            readonly energyDensityKcalPerKgSnapshot: true;
            readonly energySharePercent: true;
            readonly kcalPerDay: true;
            readonly gramsPerDay: true;
            readonly householdUnit: true;
            readonly householdUnitGrams: true;
            readonly householdUnitsPerDay: true;
            readonly isTreat: true;
            readonly notes: true;
            readonly food: {
                readonly select: {
                    readonly id: true;
                    readonly code: true;
                    readonly name: true;
                    readonly brand: true;
                    readonly active: true;
                };
            };
        };
        readonly orderBy: {
            readonly order: "asc";
        };
    };
    readonly rechecks: {
        readonly select: {
            readonly id: true;
            readonly recheckedAt: true;
            readonly weightKg: true;
            readonly bodyConditionScore: true;
            readonly muscleConditionScore: true;
            readonly weightChangeKg: true;
            readonly weeklyRatePercent: true;
            readonly outcome: true;
            readonly ownerAdherence: true;
            readonly adjustmentPercent: true;
            readonly newDerKcal: true;
            readonly adjustmentReason: true;
            readonly notes: true;
            readonly nextRecheckAt: true;
            readonly createdAt: true;
            readonly performedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
        readonly orderBy: {
            readonly recheckedAt: "desc";
        };
    };
    readonly id: true;
    readonly code: true;
    readonly status: true;
    readonly goal: true;
    readonly assessedAt: true;
    readonly currentWeightKg: true;
    readonly idealWeightKg: true;
    readonly bodyConditionScore: true;
    readonly muscleConditionScore: true;
    readonly lifeStage: true;
    readonly activity: true;
    readonly isNeutered: true;
    readonly derKcal: true;
    readonly rerKcal: true;
    readonly derFactor: true;
    readonly targetWeeklyRatePercent: true;
    readonly estimatedWeeks: true;
    readonly recheckIntervalDays: true;
    readonly nextRecheckAt: true;
    readonly startedAt: true;
    readonly completedAt: true;
    readonly discontinuedAt: true;
    readonly draftedByAi: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
            readonly gender: true;
            readonly birthDate: true;
            readonly weight: true;
            readonly animalType: {
                readonly select: {
                    readonly id: true;
                    readonly arName: true;
                    readonly enName: true;
                    readonly species: true;
                };
            };
            readonly animalStrain: {
                readonly select: {
                    readonly id: true;
                    readonly arName: true;
                };
            };
            readonly owner: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                    readonly phone: true;
                };
            };
        };
    };
    readonly prescriber: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly _count: {
        readonly select: {
            readonly rechecks: true;
            readonly items: true;
        };
    };
};
export type NutritionPlanDetailResponse = Prisma.NutritionPlanGetPayload<{
    select: typeof planDetailSelect;
}>;
export declare const nutritionPlanDetailSelect: {
    readonly appointmentId: true;
    readonly prescriberId: true;
    readonly idealWeightSource: true;
    readonly riskFactors: true;
    readonly medicalConditions: true;
    readonly feedingMethod: true;
    readonly mealsPerDay: true;
    readonly currentDietSummary: true;
    readonly treatsSummary: true;
    readonly tableFoodSummary: true;
    readonly supplementsSummary: true;
    readonly medicationFoodSummary: true;
    readonly waterSource: true;
    readonly environmentNotes: true;
    readonly currentTreatCaloriePercent: true;
    readonly calculationWeightKg: true;
    readonly derFactorSource: true;
    readonly treatKcalAllowance: true;
    readonly feedingInstructions: true;
    readonly clinicalNotes: true;
    readonly transitionDays: true;
    readonly discontinueReason: true;
    readonly editsCount: true;
    readonly items: {
        readonly select: {
            readonly id: true;
            readonly order: true;
            readonly dietFoodId: true;
            readonly nameSnapshot: true;
            readonly formSnapshot: true;
            readonly energyDensityKcalPerKgSnapshot: true;
            readonly energySharePercent: true;
            readonly kcalPerDay: true;
            readonly gramsPerDay: true;
            readonly householdUnit: true;
            readonly householdUnitGrams: true;
            readonly householdUnitsPerDay: true;
            readonly isTreat: true;
            readonly notes: true;
            readonly food: {
                readonly select: {
                    readonly id: true;
                    readonly code: true;
                    readonly name: true;
                    readonly brand: true;
                    readonly active: true;
                };
            };
        };
        readonly orderBy: {
            readonly order: "asc";
        };
    };
    readonly rechecks: {
        readonly select: {
            readonly id: true;
            readonly recheckedAt: true;
            readonly weightKg: true;
            readonly bodyConditionScore: true;
            readonly muscleConditionScore: true;
            readonly weightChangeKg: true;
            readonly weeklyRatePercent: true;
            readonly outcome: true;
            readonly ownerAdherence: true;
            readonly adjustmentPercent: true;
            readonly newDerKcal: true;
            readonly adjustmentReason: true;
            readonly notes: true;
            readonly nextRecheckAt: true;
            readonly createdAt: true;
            readonly performedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
        readonly orderBy: {
            readonly recheckedAt: "desc";
        };
    };
    readonly id: true;
    readonly code: true;
    readonly status: true;
    readonly goal: true;
    readonly assessedAt: true;
    readonly currentWeightKg: true;
    readonly idealWeightKg: true;
    readonly bodyConditionScore: true;
    readonly muscleConditionScore: true;
    readonly lifeStage: true;
    readonly activity: true;
    readonly isNeutered: true;
    readonly derKcal: true;
    readonly rerKcal: true;
    readonly derFactor: true;
    readonly targetWeeklyRatePercent: true;
    readonly estimatedWeeks: true;
    readonly recheckIntervalDays: true;
    readonly nextRecheckAt: true;
    readonly startedAt: true;
    readonly completedAt: true;
    readonly discontinuedAt: true;
    readonly draftedByAi: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
            readonly gender: true;
            readonly birthDate: true;
            readonly weight: true;
            readonly animalType: {
                readonly select: {
                    readonly id: true;
                    readonly arName: true;
                    readonly enName: true;
                    readonly species: true;
                };
            };
            readonly animalStrain: {
                readonly select: {
                    readonly id: true;
                    readonly arName: true;
                };
            };
            readonly owner: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                    readonly phone: true;
                };
            };
        };
    };
    readonly prescriber: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly _count: {
        readonly select: {
            readonly rechecks: true;
            readonly items: true;
        };
    };
};
/** صفّ «مراجعة مستحقّة» — يُبنى في الـDAO لا في Prisma، فلا payload له */
export type NutritionDueRow = {
    planId: string;
    planCode: string;
    patientId: string;
    patientName: string;
    patientCode: string;
    animalTypeName: string;
    ownerId: string | null;
    ownerName: string | null;
    ownerPhone: string | null;
    goal: NutritionGoal;
    nextRecheckAt: Date | null;
    /** سالب = متأخّر */
    daysUntil: number | null;
    currentWeightKg: number;
    idealWeightKg: number | null;
    lastWeightKg: number;
    derKcal: number;
};
export type NutritionStats = {
    activePlans: number;
    dueRechecks: number;
    overdueRechecks: number;
    weightManagementPlans: number;
    goalReachedThisMonth: number;
    dietFoods: number;
};
export declare const dietFoodSchema: z.ZodObject<{
    name: z.ZodString;
    nameEn: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    brand: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    form: z.ZodEnum<{
        readonly DRY: "DRY";
        readonly WET: "WET";
        readonly RAW: "RAW";
        readonly HOME_COOKED: "HOME_COOKED";
        readonly TREAT: "TREAT";
        readonly SUPPLEMENT: "SUPPLEMENT";
    }>;
    kind: z.ZodEnum<{
        readonly MAINTENANCE: "MAINTENANCE";
        readonly THERAPEUTIC: "THERAPEUTIC";
        readonly TREAT: "TREAT";
        readonly SUPPLEMENT: "SUPPLEMENT";
    }>;
    metabolizableEnergyKcalPerKg: z.ZodCoercedNumber<unknown>;
    householdUnit: z.ZodDefault<z.ZodEnum<{
        readonly GRAM: "GRAM";
        readonly CUP: "CUP";
        readonly CAN: "CAN";
        readonly SCOOP: "SCOOP";
        readonly PIECE: "PIECE";
    }>>;
    householdUnitGrams: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    proteinPercentDm: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    fatPercentDm: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    fiberPercentDm: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    moisturePercent: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    sodiumPercentDm: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    phosphorusPercentDm: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    species: z.ZodDefault<z.ZodArray<z.ZodString>>;
    indications: z.ZodDefault<z.ZodArray<z.ZodString>>;
    lifeStages: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        readonly GROWTH_UNDER_4M: "GROWTH_UNDER_4M";
        readonly GROWTH_OVER_4M: "GROWTH_OVER_4M";
        readonly ADULT: "ADULT";
        readonly SENIOR: "SENIOR";
    }>>>;
    inventoryItemId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    active: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type DietFoodFormInput = z.infer<typeof dietFoodSchema>;
/** بند غذاء داخل الخطة — الكميّات تُحسب في المحرّك، لا يُدخلها المستخدم */
export declare const nutritionPlanItemSchema: z.ZodObject<{
    dietFoodId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    nameSnapshot: z.ZodString;
    formSnapshot: z.ZodDefault<z.ZodEnum<{
        readonly DRY: "DRY";
        readonly WET: "WET";
        readonly RAW: "RAW";
        readonly HOME_COOKED: "HOME_COOKED";
        readonly TREAT: "TREAT";
        readonly SUPPLEMENT: "SUPPLEMENT";
    }>>;
    energyDensityKcalPerKgSnapshot: z.ZodCoercedNumber<unknown>;
    energySharePercent: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    householdUnit: z.ZodDefault<z.ZodEnum<{
        readonly GRAM: "GRAM";
        readonly CUP: "CUP";
        readonly CAN: "CAN";
        readonly SCOOP: "SCOOP";
        readonly PIECE: "PIECE";
    }>>;
    householdUnitGrams: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    isTreat: z.ZodDefault<z.ZodBoolean>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type NutritionPlanItemFormInput = z.infer<typeof nutritionPlanItemSchema>;
export declare const nutritionPlanSchema: z.ZodObject<{
    patientId: z.ZodString;
    appointmentId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    prescriberId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    goal: z.ZodEnum<{
        readonly MAINTENANCE: "MAINTENANCE";
        readonly WEIGHT_LOSS: "WEIGHT_LOSS";
        readonly WEIGHT_GAIN: "WEIGHT_GAIN";
        readonly GROWTH: "GROWTH";
        readonly GESTATION: "GESTATION";
        readonly LACTATION: "LACTATION";
        readonly RECOVERY: "RECOVERY";
    }>;
    currentWeightKg: z.ZodCoercedNumber<unknown>;
    bodyConditionScore: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    muscleConditionScore: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly MILD_LOSS: "MILD_LOSS";
        readonly MODERATE_LOSS: "MODERATE_LOSS";
        readonly SEVERE_LOSS: "SEVERE_LOSS";
    }>>>;
    idealWeightKg: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    idealWeightSource: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
        manual: "manual";
        history: "history";
        bcs: "bcs";
    }>>>;
    lifeStage: z.ZodEnum<{
        readonly GROWTH_UNDER_4M: "GROWTH_UNDER_4M";
        readonly GROWTH_OVER_4M: "GROWTH_OVER_4M";
        readonly ADULT: "ADULT";
        readonly SENIOR: "SENIOR";
    }>;
    activity: z.ZodEnum<{
        readonly INACTIVE: "INACTIVE";
        readonly LOW: "LOW";
        readonly MODERATE: "MODERATE";
        readonly HIGH: "HIGH";
        readonly WORK_LIGHT: "WORK_LIGHT";
        readonly WORK_MODERATE: "WORK_MODERATE";
        readonly WORK_HEAVY: "WORK_HEAVY";
    }>;
    isNeutered: z.ZodDefault<z.ZodBoolean>;
    riskFactors: z.ZodDefault<z.ZodArray<z.ZodString>>;
    medicalConditions: z.ZodDefault<z.ZodArray<z.ZodString>>;
    feedingMethod: z.ZodDefault<z.ZodEnum<{
        readonly MEAL_FED: "MEAL_FED";
        readonly FREE_CHOICE: "FREE_CHOICE";
        readonly COMBINATION: "COMBINATION";
    }>>;
    mealsPerDay: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    currentDietSummary: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    treatsSummary: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    tableFoodSummary: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    supplementsSummary: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    medicationFoodSummary: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    waterSource: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    environmentNotes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    currentTreatCaloriePercent: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    manualDerFactor: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    targetWeeklyRatePercent: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    recheckIntervalDays: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    items: z.ZodDefault<z.ZodArray<z.ZodObject<{
        dietFoodId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        nameSnapshot: z.ZodString;
        formSnapshot: z.ZodDefault<z.ZodEnum<{
            readonly DRY: "DRY";
            readonly WET: "WET";
            readonly RAW: "RAW";
            readonly HOME_COOKED: "HOME_COOKED";
            readonly TREAT: "TREAT";
            readonly SUPPLEMENT: "SUPPLEMENT";
        }>>;
        energyDensityKcalPerKgSnapshot: z.ZodCoercedNumber<unknown>;
        energySharePercent: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        householdUnit: z.ZodDefault<z.ZodEnum<{
            readonly GRAM: "GRAM";
            readonly CUP: "CUP";
            readonly CAN: "CAN";
            readonly SCOOP: "SCOOP";
            readonly PIECE: "PIECE";
        }>>;
        householdUnitGrams: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
        isTreat: z.ZodDefault<z.ZodBoolean>;
        notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>>;
    feedingInstructions: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    clinicalNotes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    transitionDays: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
export type NutritionPlanFormInput = z.infer<typeof nutritionPlanSchema>;
export declare const nutritionRecheckSchema: z.ZodObject<{
    weightKg: z.ZodCoercedNumber<unknown>;
    recheckedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    bodyConditionScore: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    muscleConditionScore: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly MILD_LOSS: "MILD_LOSS";
        readonly MODERATE_LOSS: "MODERATE_LOSS";
        readonly SEVERE_LOSS: "SEVERE_LOSS";
    }>>>;
    ownerAdherence: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    performedById: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    adjustmentPercent: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    applyAdjustment: z.ZodDefault<z.ZodBoolean>;
    adjustmentReason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type NutritionRecheckFormInput = z.infer<typeof nutritionRecheckSchema>;
export declare const PLAN_STATUS_LABELS: Record<NutritionPlanStatus, string>;
export declare const GOAL_LABELS: Record<NutritionGoal, string>;
export declare const LIFE_STAGE_LABELS: Record<NutritionLifeStage, string>;
export declare const ACTIVITY_LABELS: Record<NutritionActivity, string>;
export declare const MCS_LABELS: Record<MuscleConditionScore, string>;
export declare const FEEDING_METHOD_LABELS: Record<FeedingMethod, string>;
export declare const FOOD_FORM_LABELS: Record<DietFoodForm, string>;
export declare const FOOD_KIND_LABELS: Record<DietFoodKind, string>;
export declare const MEASURE_UNIT_LABELS: Record<DietMeasureUnit, string>;
export declare const RECHECK_OUTCOME_LABELS: Record<NutritionRecheckOutcome, string>;
/**
 * عوامل الخطر التي تستدعي تقييمًا غذائيًا موسّعًا (AAHA 2021). تُعرض كقائمة
 * اختيار لأن كتابتها حرّة تجعلها غير قابلة للبحث ولا للإحصاء.
 */
export declare const NUTRITION_RISK_FACTORS: readonly ["تغيّر وزن غير مُفسَّر", "درجة حالة جسم خارج ٤–٥", "فقد في الكتلة العضلية", "غذاء منزلي أو نيء غير متوازن", "أكثر من ١٠٪ من السعرات من المكافآت", "مرض مزمن (كلوي، كبدي، قلبي)", "داء سكري أو اضطراب غدد صمّاء", "حساسية أو عدم تحمّل غذائي", "أمراض الأسنان تعيق المضغ", "قيء أو إسهال متكرّر", "جراحة أو رضّ حديث", "حمل أو رضاعة", "عمر أقل من سنة أو أكبر من سبع سنوات", "يعيش مع أطفال أخرى تتشارك الطعام"];
/** المسودّة وحدها قابلة للتحرير الكامل — السارية تُعدَّل بمراجعة لا بكتابة فوقها */
export declare const isPlanEditable: (status: NutritionPlanStatus) => boolean;
/** المراجعات تُسجَّل على الخطط السارية فقط */
export declare const acceptsRechecks: (status: NutritionPlanStatus) => boolean;
export {};
