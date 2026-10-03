import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import type { ActivityLevel, GroomingNeeds, HairType } from "@/generated/prisma/enums";
export type { ActivityLevel, GroomingNeeds, HairType };
export declare const HAIR_TYPE_LABELS: Record<HairType, {
    ar: string;
    en: string;
}>;
export declare const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, {
    ar: string;
    en: string;
}>;
export declare const GROOMING_NEEDS_LABELS: Record<GroomingNeeds, {
    ar: string;
    en: string;
}>;
export type AnimalStrainResponse = Prisma.AnimalStrainGetPayload<{
    select: {
        id: true;
        arName: true;
        enName: true;
        animalTypeId: true;
        avgWeightMin: true;
        avgWeightMax: true;
        avgAgeMin: true;
        avgAgeMax: true;
        originCountry: true;
        hairType: true;
        activityLevel: true;
        groomingNeeds: true;
        commonDiseases: true;
        isDefault: true;
        clinicId: true;
        createdAt: true;
        updatedAt: true;
    };
}>;
export type AnimalStrainWithTypeResponse = Prisma.AnimalStrainGetPayload<{
    select: {
        id: true;
        arName: true;
        enName: true;
        animalTypeId: true;
        avgWeightMin: true;
        avgWeightMax: true;
        avgAgeMin: true;
        avgAgeMax: true;
        originCountry: true;
        hairType: true;
        activityLevel: true;
        groomingNeeds: true;
        commonDiseases: true;
        isDefault: true;
        clinicId: true;
        createdAt: true;
        updatedAt: true;
        animalType: {
            select: {
                id: true;
                arName: true;
                enName: true;
            };
        };
    };
}>;
export type CreateAnimalStrainInput = Pick<Prisma.AnimalStrainUncheckedCreateInput, "arName" | "enName" | "animalTypeId" | "avgWeightMin" | "avgWeightMax" | "avgAgeMin" | "avgAgeMax" | "originCountry" | "hairType" | "activityLevel" | "groomingNeeds" | "commonDiseases"> & {
    clinicId: string;
};
export type UpdateAnimalStrainInput = Partial<Omit<CreateAnimalStrainInput, "animalTypeId" | "clinicId">>;
export declare const createAnimalStrainSchema: z.ZodObject<{
    arName: z.ZodString;
    enName: z.ZodString;
    animalTypeId: z.ZodString;
    avgWeightMin: z.ZodNumber;
    avgWeightMax: z.ZodNumber;
    avgAgeMin: z.ZodNumber;
    avgAgeMax: z.ZodNumber;
    originCountry: z.ZodString;
    hairType: z.ZodEnum<{
        NONE: "NONE";
        LONG_THICK: "LONG_THICK";
        SHORT_THICK: "SHORT_THICK";
        LIGHT: "LIGHT";
        MEDIUM: "MEDIUM";
        DOUBLE_COAT: "DOUBLE_COAT";
    }>;
    activityLevel: z.ZodEnum<{
        MEDIUM: "MEDIUM";
        LOW: "LOW";
        HIGH: "HIGH";
    }>;
    groomingNeeds: z.ZodEnum<{
        MEDIUM: "MEDIUM";
        LOW: "LOW";
        HIGH: "HIGH";
    }>;
    commonDiseases: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>;
export type CreateAnimalStrainFormInput = z.infer<typeof createAnimalStrainSchema>;
