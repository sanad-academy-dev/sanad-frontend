import type { Prisma } from "@/generated/prisma/client";
import type { CatalogSpecies, DietFoodForm, DietMeasureUnit, FeedingMethod, MuscleConditionScore, NutritionActivity, NutritionGoal, NutritionLifeStage, NutritionPlanStatus } from "@/generated/prisma/enums";
import { type NutritionDueRow, type NutritionStats } from "@/server/nutrition/nutrition.type";
/** بند غذاء كما يصل من العميل — بلا كميّات، فالخادم يشتقّها */
export type PlanItemInput = {
    dietFoodId?: string | null;
    nameSnapshot: string;
    formSnapshot?: DietFoodForm;
    energyDensityKcalPerKgSnapshot: number;
    energySharePercent?: number;
    householdUnit?: DietMeasureUnit;
    householdUnitGrams?: number | null;
    isTreat?: boolean;
    notes?: string | null;
};
export type PlanInput = {
    patientId: string;
    appointmentId?: string | null;
    prescriberId?: string | null;
    goal: NutritionGoal;
    currentWeightKg: number;
    bodyConditionScore?: number | null;
    muscleConditionScore?: MuscleConditionScore | null;
    idealWeightKg?: number | null;
    idealWeightSource?: string | null;
    lifeStage: NutritionLifeStage;
    activity: NutritionActivity;
    isNeutered?: boolean;
    riskFactors?: string[];
    medicalConditions?: string[];
    feedingMethod?: FeedingMethod;
    mealsPerDay?: number;
    currentDietSummary?: string | null;
    treatsSummary?: string | null;
    tableFoodSummary?: string | null;
    supplementsSummary?: string | null;
    medicationFoodSummary?: string | null;
    waterSource?: string | null;
    environmentNotes?: string | null;
    currentTreatCaloriePercent?: number | null;
    manualDerFactor?: number | null;
    targetWeeklyRatePercent?: number | null;
    recheckIntervalDays?: number;
    items?: PlanItemInput[];
    feedingInstructions?: string | null;
    clinicalNotes?: string | null;
    transitionDays?: number | null;
};
/** الحقول اللازمة للحساب — يقرؤها المتحكّم قبل الإنشاء ليعرف نوع الطفل */
export declare const patientForNutrition: (clinicId: string, patientId: string) => Prisma.Prisma__PatientClient<{
    animalType: {
        id: string;
        arName: string;
        species: CatalogSpecies | null;
    };
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
} | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
    omit: Prisma.GlobalOmitConfig | undefined;
}>;
export declare const nutritionDao: {
    /**
     * يزرع كتالوج الأغذية الافتراضي في الأكاديمية — نمط `ensureSystemTemplates` في
     * وحدة الموافقات: الزرع **ترقية** لا إدراج لمرّة واحدة، فالأكاديمية القائمة تستقبل
     * ما يُضاف للكتالوج لاحقًا. يُستدعى قبل كل قراءة للقائمة.
     *
     * ما يملكه المستخدم لا يُلمس: `active` وكثافة الطاقة والسعر تبقى كما ضبطها —
     * المدرّب قد يصحّح الكثافة من ملصق المنتج الفعلي، ودهسها بقيمة الكتالوج كل
     * قراءة يجعل تصحيحه بلا معنى. لذلك `update` هنا فارغ عمدًا.
     */
    ensureSeedFoods: (clinicId: string) => Promise<number>;
    listFoods: (clinicId: string, filters?: {
        q?: string;
        species?: CatalogSpecies;
        kind?: Prisma.DietFoodWhereInput["kind"];
        form?: Prisma.DietFoodWhereInput["form"];
        activeOnly?: boolean;
    }) => Prisma.PrismaPromise<{
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
        form: DietFoodForm;
        metabolizableEnergyKcalPerKg: import("@prisma/client-runtime-utils").Decimal;
        householdUnit: DietMeasureUnit;
        householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
        fatPercentDm: import("@prisma/client-runtime-utils").Decimal | null;
        moisturePercent: import("@prisma/client-runtime-utils").Decimal | null;
        lifeStages: NutritionLifeStage[];
    }[]>;
    getFood: (clinicId: string, id: string) => Prisma.Prisma__DietFoodClient<{
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
        form: DietFoodForm;
        metabolizableEnergyKcalPerKg: import("@prisma/client-runtime-utils").Decimal;
        householdUnit: DietMeasureUnit;
        householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
        fatPercentDm: import("@prisma/client-runtime-utils").Decimal | null;
        moisturePercent: import("@prisma/client-runtime-utils").Decimal | null;
        lifeStages: NutritionLifeStage[];
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    createFood: (clinicId: string, input: Omit<Prisma.DietFoodUncheckedCreateInput, "id" | "code" | "clinicId">) => Promise<{
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
        form: DietFoodForm;
        metabolizableEnergyKcalPerKg: import("@prisma/client-runtime-utils").Decimal;
        householdUnit: DietMeasureUnit;
        householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
        fatPercentDm: import("@prisma/client-runtime-utils").Decimal | null;
        moisturePercent: import("@prisma/client-runtime-utils").Decimal | null;
        lifeStages: NutritionLifeStage[];
    }>;
    updateFood: (clinicId: string, id: string, input: Omit<Prisma.DietFoodUncheckedUpdateInput, "id" | "code" | "clinicId">) => Prisma.Prisma__DietFoodClient<{
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
        form: DietFoodForm;
        metabolizableEnergyKcalPerKg: import("@prisma/client-runtime-utils").Decimal;
        householdUnit: DietMeasureUnit;
        householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
        fatPercentDm: import("@prisma/client-runtime-utils").Decimal | null;
        moisturePercent: import("@prisma/client-runtime-utils").Decimal | null;
        lifeStages: NutritionLifeStage[];
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    /** حذف ناعم — الخطط القائمة تشير إليه، والحذف الصلب يفقدها مرجعها */
    deleteFood: (clinicId: string, id: string) => Prisma.Prisma__DietFoodClient<{
        id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    listPlans: (clinicId: string, filters?: {
        patientId?: string;
        status?: NutritionPlanStatus;
        goal?: NutritionGoal;
        q?: string;
        take?: number;
    }) => Prisma.PrismaPromise<{
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
        status: NutritionPlanStatus;
        startedAt: Date | null;
        activity: NutritionActivity;
        completedAt: Date | null;
        bodyConditionScore: number | null;
        discontinuedAt: Date | null;
        assessedAt: Date;
        prescriber: {
            name: string;
            id: string;
        } | null;
        muscleConditionScore: MuscleConditionScore | null;
        nextRecheckAt: Date | null;
        goal: NutritionGoal;
        currentWeightKg: import("@prisma/client-runtime-utils").Decimal;
        idealWeightKg: import("@prisma/client-runtime-utils").Decimal | null;
        lifeStage: NutritionLifeStage;
        isNeutered: boolean;
        derKcal: import("@prisma/client-runtime-utils").Decimal;
        rerKcal: import("@prisma/client-runtime-utils").Decimal;
        derFactor: import("@prisma/client-runtime-utils").Decimal;
        targetWeeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
        estimatedWeeks: number | null;
        recheckIntervalDays: number;
        draftedByAi: boolean;
    }[]>;
    getPlan: (clinicId: string, id: string) => Prisma.Prisma__NutritionPlanClient<{
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
        status: NutritionPlanStatus;
        editsCount: number;
        items: {
            id: string;
            order: number;
            notes: string | null;
            nameSnapshot: string;
            householdUnit: DietMeasureUnit;
            householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
            dietFoodId: string | null;
            formSnapshot: DietFoodForm;
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
        activity: NutritionActivity;
        completedAt: Date | null;
        bodyConditionScore: number | null;
        discontinuedAt: Date | null;
        assessedAt: Date;
        prescriberId: string | null;
        prescriber: {
            name: string;
            id: string;
        } | null;
        muscleConditionScore: MuscleConditionScore | null;
        nextRecheckAt: Date | null;
        goal: NutritionGoal;
        currentWeightKg: import("@prisma/client-runtime-utils").Decimal;
        idealWeightKg: import("@prisma/client-runtime-utils").Decimal | null;
        lifeStage: NutritionLifeStage;
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
        feedingMethod: FeedingMethod;
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
            muscleConditionScore: MuscleConditionScore | null;
            weightChangeKg: import("@prisma/client-runtime-utils").Decimal | null;
            weeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
            outcome: import("@/generated/prisma/enums").NutritionRecheckOutcome | null;
            ownerAdherence: number | null;
            adjustmentPercent: import("@prisma/client-runtime-utils").Decimal | null;
            newDerKcal: import("@prisma/client-runtime-utils").Decimal | null;
            adjustmentReason: string | null;
            nextRecheckAt: Date | null;
        }[];
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    createPlan: (clinicId: string, input: PlanInput, species: CatalogSpecies | null) => Promise<{
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
        status: NutritionPlanStatus;
        editsCount: number;
        items: {
            id: string;
            order: number;
            notes: string | null;
            nameSnapshot: string;
            householdUnit: DietMeasureUnit;
            householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
            dietFoodId: string | null;
            formSnapshot: DietFoodForm;
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
        activity: NutritionActivity;
        completedAt: Date | null;
        bodyConditionScore: number | null;
        discontinuedAt: Date | null;
        assessedAt: Date;
        prescriberId: string | null;
        prescriber: {
            name: string;
            id: string;
        } | null;
        muscleConditionScore: MuscleConditionScore | null;
        nextRecheckAt: Date | null;
        goal: NutritionGoal;
        currentWeightKg: import("@prisma/client-runtime-utils").Decimal;
        idealWeightKg: import("@prisma/client-runtime-utils").Decimal | null;
        lifeStage: NutritionLifeStage;
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
        feedingMethod: FeedingMethod;
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
            muscleConditionScore: MuscleConditionScore | null;
            weightChangeKg: import("@prisma/client-runtime-utils").Decimal | null;
            weeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
            outcome: import("@/generated/prisma/enums").NutritionRecheckOutcome | null;
            ownerAdherence: number | null;
            adjustmentPercent: import("@prisma/client-runtime-utils").Decimal | null;
            newDerKcal: import("@prisma/client-runtime-utils").Decimal | null;
            adjustmentReason: string | null;
            nextRecheckAt: Date | null;
        }[];
    }>;
    /**
     * تحرير كامل للمسودّة — البنود تُستبدل لا تُدمج: الحساب أُعيد بالكامل، ودمج
     * بنود محسوبة على سعرات قديمة مع أخرى جديدة يُنتج خطة لا تجمع إلى ١٠٠٪.
     */
    updatePlan: (clinicId: string, id: string, input: PlanInput, species: CatalogSpecies | null) => Promise<{
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
        status: NutritionPlanStatus;
        editsCount: number;
        items: {
            id: string;
            order: number;
            notes: string | null;
            nameSnapshot: string;
            householdUnit: DietMeasureUnit;
            householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
            dietFoodId: string | null;
            formSnapshot: DietFoodForm;
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
        activity: NutritionActivity;
        completedAt: Date | null;
        bodyConditionScore: number | null;
        discontinuedAt: Date | null;
        assessedAt: Date;
        prescriberId: string | null;
        prescriber: {
            name: string;
            id: string;
        } | null;
        muscleConditionScore: MuscleConditionScore | null;
        nextRecheckAt: Date | null;
        goal: NutritionGoal;
        currentWeightKg: import("@prisma/client-runtime-utils").Decimal;
        idealWeightKg: import("@prisma/client-runtime-utils").Decimal | null;
        lifeStage: NutritionLifeStage;
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
        feedingMethod: FeedingMethod;
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
            muscleConditionScore: MuscleConditionScore | null;
            weightChangeKg: import("@prisma/client-runtime-utils").Decimal | null;
            weeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
            outcome: import("@/generated/prisma/enums").NutritionRecheckOutcome | null;
            ownerAdherence: number | null;
            adjustmentPercent: import("@prisma/client-runtime-utils").Decimal | null;
            newDerKcal: import("@prisma/client-runtime-utils").Decimal | null;
            adjustmentReason: string | null;
            nextRecheckAt: Date | null;
        }[];
    }>;
    /** التفعيل يثبّت تاريخ البدء ويجدول أول مراجعة — بلا موعد لا متابعة */
    activatePlan: (clinicId: string, id: string, recheckIntervalDays: number) => Prisma.Prisma__NutritionPlanClient<{
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
        status: NutritionPlanStatus;
        editsCount: number;
        items: {
            id: string;
            order: number;
            notes: string | null;
            nameSnapshot: string;
            householdUnit: DietMeasureUnit;
            householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
            dietFoodId: string | null;
            formSnapshot: DietFoodForm;
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
        activity: NutritionActivity;
        completedAt: Date | null;
        bodyConditionScore: number | null;
        discontinuedAt: Date | null;
        assessedAt: Date;
        prescriberId: string | null;
        prescriber: {
            name: string;
            id: string;
        } | null;
        muscleConditionScore: MuscleConditionScore | null;
        nextRecheckAt: Date | null;
        goal: NutritionGoal;
        currentWeightKg: import("@prisma/client-runtime-utils").Decimal;
        idealWeightKg: import("@prisma/client-runtime-utils").Decimal | null;
        lifeStage: NutritionLifeStage;
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
        feedingMethod: FeedingMethod;
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
            muscleConditionScore: MuscleConditionScore | null;
            weightChangeKg: import("@prisma/client-runtime-utils").Decimal | null;
            weeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
            outcome: import("@/generated/prisma/enums").NutritionRecheckOutcome | null;
            ownerAdherence: number | null;
            adjustmentPercent: import("@prisma/client-runtime-utils").Decimal | null;
            newDerKcal: import("@prisma/client-runtime-utils").Decimal | null;
            adjustmentReason: string | null;
            nextRecheckAt: Date | null;
        }[];
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    completePlan: (clinicId: string, id: string) => Prisma.Prisma__NutritionPlanClient<{
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
        status: NutritionPlanStatus;
        editsCount: number;
        items: {
            id: string;
            order: number;
            notes: string | null;
            nameSnapshot: string;
            householdUnit: DietMeasureUnit;
            householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
            dietFoodId: string | null;
            formSnapshot: DietFoodForm;
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
        activity: NutritionActivity;
        completedAt: Date | null;
        bodyConditionScore: number | null;
        discontinuedAt: Date | null;
        assessedAt: Date;
        prescriberId: string | null;
        prescriber: {
            name: string;
            id: string;
        } | null;
        muscleConditionScore: MuscleConditionScore | null;
        nextRecheckAt: Date | null;
        goal: NutritionGoal;
        currentWeightKg: import("@prisma/client-runtime-utils").Decimal;
        idealWeightKg: import("@prisma/client-runtime-utils").Decimal | null;
        lifeStage: NutritionLifeStage;
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
        feedingMethod: FeedingMethod;
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
            muscleConditionScore: MuscleConditionScore | null;
            weightChangeKg: import("@prisma/client-runtime-utils").Decimal | null;
            weeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
            outcome: import("@/generated/prisma/enums").NutritionRecheckOutcome | null;
            ownerAdherence: number | null;
            adjustmentPercent: import("@prisma/client-runtime-utils").Decimal | null;
            newDerKcal: import("@prisma/client-runtime-utils").Decimal | null;
            adjustmentReason: string | null;
            nextRecheckAt: Date | null;
        }[];
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    discontinuePlan: (clinicId: string, id: string, reason: string) => Prisma.Prisma__NutritionPlanClient<{
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
        status: NutritionPlanStatus;
        editsCount: number;
        items: {
            id: string;
            order: number;
            notes: string | null;
            nameSnapshot: string;
            householdUnit: DietMeasureUnit;
            householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
            dietFoodId: string | null;
            formSnapshot: DietFoodForm;
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
        activity: NutritionActivity;
        completedAt: Date | null;
        bodyConditionScore: number | null;
        discontinuedAt: Date | null;
        assessedAt: Date;
        prescriberId: string | null;
        prescriber: {
            name: string;
            id: string;
        } | null;
        muscleConditionScore: MuscleConditionScore | null;
        nextRecheckAt: Date | null;
        goal: NutritionGoal;
        currentWeightKg: import("@prisma/client-runtime-utils").Decimal;
        idealWeightKg: import("@prisma/client-runtime-utils").Decimal | null;
        lifeStage: NutritionLifeStage;
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
        feedingMethod: FeedingMethod;
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
            muscleConditionScore: MuscleConditionScore | null;
            weightChangeKg: import("@prisma/client-runtime-utils").Decimal | null;
            weeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
            outcome: import("@/generated/prisma/enums").NutritionRecheckOutcome | null;
            ownerAdherence: number | null;
            adjustmentPercent: import("@prisma/client-runtime-utils").Decimal | null;
            newDerKcal: import("@prisma/client-runtime-utils").Decimal | null;
            adjustmentReason: string | null;
            nextRecheckAt: Date | null;
        }[];
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    setInstructions: (clinicId: string, id: string, text: string, byAi: boolean) => Prisma.Prisma__NutritionPlanClient<{
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
        status: NutritionPlanStatus;
        editsCount: number;
        items: {
            id: string;
            order: number;
            notes: string | null;
            nameSnapshot: string;
            householdUnit: DietMeasureUnit;
            householdUnitGrams: import("@prisma/client-runtime-utils").Decimal | null;
            dietFoodId: string | null;
            formSnapshot: DietFoodForm;
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
        activity: NutritionActivity;
        completedAt: Date | null;
        bodyConditionScore: number | null;
        discontinuedAt: Date | null;
        assessedAt: Date;
        prescriberId: string | null;
        prescriber: {
            name: string;
            id: string;
        } | null;
        muscleConditionScore: MuscleConditionScore | null;
        nextRecheckAt: Date | null;
        goal: NutritionGoal;
        currentWeightKg: import("@prisma/client-runtime-utils").Decimal;
        idealWeightKg: import("@prisma/client-runtime-utils").Decimal | null;
        lifeStage: NutritionLifeStage;
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
        feedingMethod: FeedingMethod;
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
            muscleConditionScore: MuscleConditionScore | null;
            weightChangeKg: import("@prisma/client-runtime-utils").Decimal | null;
            weeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
            outcome: import("@/generated/prisma/enums").NutritionRecheckOutcome | null;
            ownerAdherence: number | null;
            adjustmentPercent: import("@prisma/client-runtime-utils").Decimal | null;
            newDerKcal: import("@prisma/client-runtime-utils").Decimal | null;
            adjustmentReason: string | null;
            nextRecheckAt: Date | null;
        }[];
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    /**
     * تسجيل مراجعة. معاملة واحدة لأن المراجعة والسعرات الجديدة وكميّات الأغذية
     * وموعد المراجعة التالية شيء واحد: خطة نصف مُعدَّلة تُطعم الطفل خطأً.
     */
    createRecheck: (clinicId: string, planId: string, input: {
        weightKg: number;
        recheckedAt?: Date;
        bodyConditionScore?: number | null;
        muscleConditionScore?: MuscleConditionScore | null;
        ownerAdherence?: number | null;
        performedById?: string | null;
        adjustmentPercent?: number | null;
        applyAdjustment?: boolean;
        adjustmentReason?: string | null;
        notes?: string | null;
    }, species: CatalogSpecies | null) => Promise<{
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
            muscleConditionScore: MuscleConditionScore | null;
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
    } | null>;
    listRechecks: (clinicId: string, planId: string) => Prisma.PrismaPromise<{
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
        muscleConditionScore: MuscleConditionScore | null;
        weightChangeKg: import("@prisma/client-runtime-utils").Decimal | null;
        weeklyRatePercent: import("@prisma/client-runtime-utils").Decimal | null;
        outcome: import("@/generated/prisma/enums").NutritionRecheckOutcome | null;
        ownerAdherence: number | null;
        adjustmentPercent: import("@prisma/client-runtime-utils").Decimal | null;
        newDerKcal: import("@prisma/client-runtime-utils").Decimal | null;
        adjustmentReason: string | null;
        nextRecheckAt: Date | null;
    }[]>;
    /**
     * الخطط التي حان موعد مراجعتها. المتأخّرة تُدرج دائمًا مهما بلغ تأخّرها —
     * وهي أهمّ ما في الشاشة: خطة لم تُراجع منذ شهرين ليست «قديمة» بل مهجورة.
     */
    listDue: (clinicId: string, horizonDays?: number) => Promise<NutritionDueRow[]>;
    stats: (clinicId: string) => Promise<NutritionStats>;
    /**
     * منحنى الوزن: قياسات المراجعات مدموجة مع سجلّ العلامات الحيوية. المصدران
     * معًا لا أحدهما — الطفل يُوزن في زيارات لا تخصّ التغذية، وإسقاطها يُظهر
     * مسارًا أنعم من الواقع.
     */
    weightHistory: (clinicId: string, patientId: string) => Promise<({
        at: Date;
        weightKg: number;
        bodyConditionScore: number | null;
        source: "recheck";
    } | {
        at: Date;
        weightKg: number;
        bodyConditionScore: number | null;
        source: "vitals";
    })[]>;
};
