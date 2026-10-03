import { type StaffConsultationTypeResponse } from "@/server/staff-consultation-types/staff-consultation-types.type";
export declare const staffConsultationTypesDao: {
    list(staffId: string, clinicId: string): Promise<StaffConsultationTypeResponse[] | null>;
    add(staffId: string, clinicId: string, consultationTypeId: string): Promise<StaffConsultationTypeResponse | null | "invalid_consultation_type" | "duplicate">;
    update(staffId: string, clinicId: string, id: string, isActive: boolean): Promise<StaffConsultationTypeResponse | null>;
    remove(staffId: string, clinicId: string, id: string): Promise<boolean | null>;
};
