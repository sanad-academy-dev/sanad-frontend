import { Prisma } from "@/generated/prisma/client";
import { type CreateStaffInput, type StaffResponse, type UpdateStaffDaoInput } from "@/server/staff/staff.type";
export declare const staffDao: {
    list(clinicId: string): Promise<StaffResponse[]>;
    findById(id: string, clinicId: string): Promise<StaffResponse | null>;
    create(input: CreateStaffInput): Promise<StaffResponse>;
    update(id: string, clinicId: string, data: UpdateStaffDaoInput): Promise<StaffResponse | null>;
    softDelete(id: string, clinicId: string): Promise<boolean>;
    activateByUserId(staffId: string, userId: string): Promise<void>;
    createForOwner(args: {
        tx: Prisma.TransactionClient;
        user: {
            id: string;
            name: string;
            email: string;
            phone?: string | null;
        };
        clinicId: string;
        roleId: string;
        branchId: string;
    }): Promise<void>;
};
