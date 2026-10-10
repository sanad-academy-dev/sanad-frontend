import { type InsuranceProductFormInput, type InsuranceProductResponse } from "@/server/accounting/insurance/insurance-product.type";
export declare const insuranceProductDao: {
    list(clinicId: string, insurerId?: string): Promise<InsuranceProductResponse[]>;
    find(clinicId: string, id: string): Promise<InsuranceProductResponse | null>;
    create(clinicId: string, input: InsuranceProductFormInput): Promise<InsuranceProductResponse>;
    /** replace-all coverage rows with idx re-sequencing (the MI-P1 benefit-rows pattern) */
    update(clinicId: string, id: string, input: InsuranceProductFormInput): Promise<InsuranceProductResponse>;
    /** التعطيل يمنع بيع بوالص جديدة عليه؛ البوالص القائمة لا تتأثر (نمط خطط العضويات) */
    setActive(clinicId: string, id: string, active: boolean): Promise<InsuranceProductResponse>;
};
