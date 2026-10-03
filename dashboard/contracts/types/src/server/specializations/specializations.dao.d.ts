import type { SpecializationCategoryResponse, SpecializationSubcategoryResponse } from "@/server/specializations/specializations.type";
export declare const specializationsDao: {
    getTree(clinicId: string): Promise<SpecializationCategoryResponse[]>;
    createCategory(clinicId: string, input: {
        name: string;
        description?: string;
    }): Promise<SpecializationCategoryResponse>;
    createSubcategory(clinicId: string, input: {
        categoryId: string;
        name: string;
        description?: string;
    }): Promise<SpecializationSubcategoryResponse>;
    setActive(id: string, clinicId: string, isActive: boolean): Promise<void>;
    rename(id: string, clinicId: string, name: string): Promise<void>;
    delete(id: string, clinicId: string): Promise<void>;
};
