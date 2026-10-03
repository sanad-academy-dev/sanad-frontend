import type { Prisma } from "@/generated/prisma/client";
export declare const staffConsultationTypeSelect: {
    id: true;
    staffId: true;
    consultationTypeId: true;
    isActive: true;
    usageCount: true;
    createdAt: true;
    consultationType: {
        select: {
            id: true;
            name: true;
        };
    };
};
type StaffConsultationTypeBase = Prisma.StaffConsultationTypeGetPayload<{
    select: typeof staffConsultationTypeSelect;
}>;
export type StaffConsultationTypeResponse = Omit<StaffConsultationTypeBase, "consultationType"> & {
    consultationTypeName: string;
    price: number | null;
    clinicActive: boolean;
};
export type AddStaffConsultationTypeInput = {
    consultationTypeId: string;
};
export type UpdateStaffConsultationTypeInput = {
    isActive: boolean;
};
export {};
