import type { Prisma } from "@/generated/prisma/client";
declare const specializationBaseSelect: {
    readonly id: true;
    readonly name: true;
    readonly description: true;
    readonly order: true;
    readonly isDefault: true;
    readonly isActive: true;
    readonly clinicId: true;
    readonly createdAt: true;
};
type SpecializationBase = Prisma.SpecializationGetPayload<{
    select: typeof specializationBaseSelect;
}>;
export type SpecializationSubcategoryResponse = SpecializationBase & {
    level: "SUBCATEGORY";
    usageCount: number;
};
export type SpecializationCategoryResponse = SpecializationBase & {
    level: "CATEGORY";
    usageCount: number;
    children: SpecializationSubcategoryResponse[];
};
export {};
