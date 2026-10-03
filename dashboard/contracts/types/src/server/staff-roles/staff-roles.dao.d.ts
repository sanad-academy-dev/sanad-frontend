import { type CreateStaffRoleInput, type StaffRoleResponse, type UpdateStaffRoleInput } from "@/server/staff-roles/staff-roles.type";
export declare const staffRolesDao: {
    list(clinicId: string): Promise<StaffRoleResponse[]>;
    findById(id: string, clinicId: string): Promise<StaffRoleResponse | null>;
    create(input: CreateStaffRoleInput): Promise<StaffRoleResponse>;
    update(id: string, clinicId: string, data: UpdateStaffRoleInput): Promise<StaffRoleResponse | null>;
    updatePermissions(id: string, clinicId: string, permissions: string[]): Promise<StaffRoleResponse | null>;
    delete(id: string, clinicId: string): Promise<boolean>;
};
