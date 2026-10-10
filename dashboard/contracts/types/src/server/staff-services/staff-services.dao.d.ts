import { type StaffServiceResponse } from "@/server/staff-services/staff-services.type";
export declare const staffServicesDao: {
    list(staffId: string, clinicId: string): Promise<StaffServiceResponse[] | null>;
    add(staffId: string, clinicId: string, serviceId: string): Promise<StaffServiceResponse | null | "invalid_service" | "duplicate">;
    update(staffId: string, clinicId: string, id: string, isActive: boolean): Promise<StaffServiceResponse | null>;
    remove(staffId: string, clinicId: string, id: string): Promise<boolean | null>;
};
