import { type ConsultationTypeResponse } from "@/server/consultation-types/consultation-types.type";
export declare const consultationTypesDao: {
    list(clinicId: string): Promise<ConsultationTypeResponse[]>;
    create(clinicId: string, input: {
        name: string;
        price?: number | null;
    }): Promise<ConsultationTypeResponse>;
    setActive(id: string, clinicId: string, active: boolean): Promise<void>;
    updateConfig(consultationTypeId: string, clinicId: string, input: {
        price?: number | null;
        examTemplateId?: string | null;
    }): Promise<void>;
};
