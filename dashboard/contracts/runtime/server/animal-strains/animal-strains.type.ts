import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import type { ActivityLevel, GroomingNeeds, HairType } from "@/generated/prisma/enums";

export type { ActivityLevel, GroomingNeeds, HairType };

export const HAIR_TYPE_LABELS: Record<HairType, { ar: string; en: string }> = {
	LONG_THICK: { ar: "طويل وكثيف", en: "Long & Thick" },
	SHORT_THICK: { ar: "قصير وكثيف", en: "Short & Thick" },
	LIGHT: { ar: "خفيف", en: "Light" },
	MEDIUM: { ar: "متوسط", en: "Medium" },
	DOUBLE_COAT: { ar: "طبقة مزدوجة", en: "Double Coat" },
	NONE: { ar: "بلا شعر", en: "None" },
};

export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, { ar: string; en: string }> = {
	LOW: { ar: "منخفض", en: "Low" },
	MEDIUM: { ar: "متوسط", en: "Medium" },
	HIGH: { ar: "مرتفع", en: "High" },
};

export const GROOMING_NEEDS_LABELS: Record<GroomingNeeds, { ar: string; en: string }> = {
	LOW: { ar: "منخفضة", en: "Low" },
	MEDIUM: { ar: "متوسطة", en: "Medium" },
	HIGH: { ar: "مرتفعة", en: "High" },
};

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
		animalType: { select: { id: true; arName: true; enName: true } };
	};
}>;

// clinicId is String? in the schema (allows global defaults), but clinic-specific creation always requires it
export type CreateAnimalStrainInput = Pick<
	Prisma.AnimalStrainUncheckedCreateInput,
	| "arName"
	| "enName"
	| "animalTypeId"
	| "avgWeightMin"
	| "avgWeightMax"
	| "avgAgeMin"
	| "avgAgeMax"
	| "originCountry"
	| "hairType"
	| "activityLevel"
	| "groomingNeeds"
	| "commonDiseases"
> & { clinicId: string };

export type UpdateAnimalStrainInput = Partial<
	Omit<CreateAnimalStrainInput, "animalTypeId" | "clinicId">
>;

export const createAnimalStrainSchema = z.object({
	arName: z.string({ error: "الاسم بالعربية مطلوب" }).min(1, "الاسم بالعربية مطلوب"),
	enName: z.string({ error: "الاسم بالإنجليزية مطلوب" }).min(1, "الاسم بالإنجليزية مطلوب"),
	animalTypeId: z.string({ error: "التصنيف مطلوب" }).min(1, "التصنيف مطلوب"),
	avgWeightMin: z
		.number({ error: "الحد الأدنى للوزن مطلوب" })
		.int("يجب أن يكون عددًا صحيحًا")
		.min(0, "يجب أن يكون 0 أو أكثر"),
	avgWeightMax: z
		.number({ error: "الحد الأقصى للوزن مطلوب" })
		.int("يجب أن يكون عددًا صحيحًا")
		.min(0, "يجب أن يكون 0 أو أكثر"),
	avgAgeMin: z
		.number({ error: "الحد الأدنى للعمر مطلوب" })
		.int("يجب أن يكون عددًا صحيحًا")
		.min(0, "يجب أن يكون 0 أو أكثر"),
	avgAgeMax: z
		.number({ error: "الحد الأقصى للعمر مطلوب" })
		.int("يجب أن يكون عددًا صحيحًا")
		.min(0, "يجب أن يكون 0 أو أكثر"),
	originCountry: z.string({ error: "بلد المنشأ مطلوب" }).min(1, "بلد المنشأ مطلوب"),
	hairType: z.enum(["LONG_THICK", "SHORT_THICK", "LIGHT", "MEDIUM", "DOUBLE_COAT", "NONE"], {
		error: "نوع الشعر مطلوب",
	}),
	activityLevel: z.enum(["LOW", "MEDIUM", "HIGH"], { error: "مستوى النشاط مطلوب" }),
	groomingNeeds: z.enum(["LOW", "MEDIUM", "HIGH"], { error: "احتياجات العناية مطلوبة" }),
	commonDiseases: z.array(z.string()).optional().default([]),
});

export type CreateAnimalStrainFormInput = z.infer<typeof createAnimalStrainSchema>;
