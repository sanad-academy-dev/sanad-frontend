import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
export declare const createStaffRoleSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export type CreateStaffRoleFormInput = z.infer<typeof createStaffRoleSchema>;
export declare const updateStaffRolePermissionsSchema: z.ZodObject<{
    permissions: z.ZodArray<z.ZodEnum<{
        [x: string]: string;
    }>>;
}, z.core.$strip>;
export type UpdateStaffRolePermissionsFormInput = z.infer<typeof updateStaffRolePermissionsSchema>;
export type CreateStaffRoleInput = Pick<Prisma.StaffRoleUncheckedCreateInput, "clinicId" | "name">;
export type UpdateStaffRoleInput = Pick<Prisma.StaffRoleUncheckedCreateInput, "name">;
export type UpdateStaffRolePermissionsInput = {
    permissions: string[];
};
export declare const staffRoleSelect: {
    readonly id: true;
    readonly name: true;
    readonly clinicId: true;
    readonly permissions: true;
    readonly createdAt: true;
    readonly _count: {
        readonly select: {
            readonly staff: true;
        };
    };
};
type StaffRoleRaw = Prisma.StaffRoleGetPayload<{
    select: typeof staffRoleSelect;
}>;
export type StaffRoleResponse = Omit<StaffRoleRaw, "_count"> & {
    staffCount: number;
};
export {};
