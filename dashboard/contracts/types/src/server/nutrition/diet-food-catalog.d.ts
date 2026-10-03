import type { CatalogSpecies, DietFoodForm, DietFoodKind, DietMeasureUnit, NutritionLifeStage } from "@/generated/prisma/enums";
export type SeedFood = {
    /** مفتاح ثابت — به يُعرف الصنف عبر الترقيات، ولا يظهر للمستخدم */
    key: string;
    name: string;
    nameEn: string;
    brand?: string;
    form: DietFoodForm;
    kind: DietFoodKind;
    kcalPerKg: number;
    householdUnit: DietMeasureUnit;
    householdUnitGrams: number;
    species: CatalogSpecies[];
    lifeStages: NutritionLifeStage[];
    indications?: string[];
    proteinPercentDm?: number;
    fatPercentDm?: number;
    fiberPercentDm?: number;
    moisturePercent?: number;
    sodiumPercentDm?: number;
    phosphorusPercentDm?: number;
    notes?: string;
};
/** الكتالوج الكامل — مصدر واحد للزرع وللبذرة اليدوية */
export declare const DIET_FOOD_CATALOG: SeedFood[];
