import type { ServiceCategoryResponse, ServiceItemResponse, ServiceSubcategoryResponse } from "@/server/services/services.type";
export declare const servicesDao: {
    getTree(clinicId: string): Promise<ServiceCategoryResponse[]>;
    createItem(clinicId: string, input: {
        subcategoryId: string;
        name: string;
        price?: number | null;
        duration?: number | null;
        isActive?: boolean;
    }): Promise<ServiceItemResponse>;
    createSubcategory(clinicId: string, input: {
        categoryId: string;
        name: string;
    }): Promise<ServiceSubcategoryResponse>;
    createCategory(clinicId: string, input: {
        name: string;
    }): Promise<ServiceCategoryResponse>;
    updateItemConfig(serviceId: string, clinicId: string, input: {
        price?: number | null;
        duration?: number | null;
        isActive?: boolean;
    }): Promise<void>;
    setItemActive(serviceId: string, clinicId: string, isActive: boolean): Promise<void>;
};
