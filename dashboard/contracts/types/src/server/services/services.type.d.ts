import type { Prisma } from "@/generated/prisma/client";
declare const serviceBaseSelect: {
    readonly id: true;
    readonly name: true;
    readonly order: true;
    readonly isDefault: true;
    readonly clinicId: true;
};
type ServiceBase = Prisma.ServiceGetPayload<{
    select: typeof serviceBaseSelect;
}>;
export type ServiceItemResponse = ServiceBase & {
    level: "ITEM";
    price: number | null;
    duration: number | null;
    isActive: boolean;
    usageCount: number;
    popularityScore: number;
    createdAt?: Date | string | null;
};
export type ServiceSubcategoryResponse = ServiceBase & {
    level: "SUBCATEGORY";
    children: ServiceItemResponse[];
};
declare const serviceCategorySelect: {
    readonly isLabCategory: true;
    readonly isRadiologyCategory: true;
    readonly isOperationCategory: true;
    readonly isGroomingCategory: true;
    readonly id: true;
    readonly name: true;
    readonly order: true;
    readonly isDefault: true;
    readonly clinicId: true;
};
type ServiceCategoryBase = Prisma.ServiceGetPayload<{
    select: typeof serviceCategorySelect;
}>;
export type ServiceCategoryResponse = ServiceCategoryBase & {
    level: "CATEGORY";
    children: ServiceSubcategoryResponse[];
};
export {};
