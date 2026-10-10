import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { EmploymentType, Gender, StaffPrefix, StaffStatus } from "@/generated/prisma/enums";
export { EmploymentType, Gender, StaffPrefix, StaffStatus };
export declare const createStaffSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    roleId: z.ZodString;
    branchId: z.ZodString;
    licenseNumber: z.ZodString;
    employmentType: z.ZodOptional<z.ZodEnum<{
        readonly FULL_TIME: "FULL_TIME";
        readonly PART_TIME: "PART_TIME";
    }>>;
    gender: z.ZodOptional<z.ZodEnum<{
        readonly MALE: "MALE";
        readonly FEMALE: "FEMALE";
        readonly UNKNOWN: "UNKNOWN";
    }>>;
    prefix: z.ZodOptional<z.ZodEnum<{
        readonly MR: "MR";
        readonly MRS: "MRS";
        readonly MS: "MS";
        readonly DR: "DR";
        readonly PROF: "PROF";
    }>>;
    age: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    primarySpecializationId: z.ZodOptional<z.ZodString>;
    secondarySpecializationId: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateStaffFormInput = z.infer<typeof createStaffSchema>;
export type CreateStaffInput = Pick<Prisma.StaffUncheckedCreateInput, "clinicId" | "name" | "email" | "phone" | "roleId" | "branchId" | "licenseNumber" | "employmentType" | "gender" | "prefix" | "age" | "primarySpecializationId" | "secondarySpecializationId" | "country" | "city" | "address" | "notes">;
type UpdateStaffFields = Partial<Pick<Prisma.StaffUncheckedCreateInput, "name" | "roleId" | "branchId" | "licenseNumber" | "employmentType" | "gender" | "prefix" | "age" | "phone" | "primarySpecializationId" | "secondarySpecializationId" | "country" | "city" | "address" | "notes" | "bio" | "educationalQualification" | "nationality" | "active" | "status">>;
export type UpdateStaffInput = UpdateStaffFields & {
    hireDate?: string | null;
};
export type UpdateStaffDaoInput = UpdateStaffFields & Partial<Pick<Prisma.StaffUncheckedCreateInput, "hireDate">>;
export declare const staffSelect: {
    readonly id: true;
    readonly code: true;
    readonly name: true;
    readonly email: true;
    readonly phone: true;
    readonly gender: true;
    readonly prefix: true;
    readonly age: true;
    readonly licenseNumber: true;
    readonly employmentType: true;
    readonly hireDate: true;
    readonly country: true;
    readonly city: true;
    readonly address: true;
    readonly notes: true;
    readonly bio: true;
    readonly educationalQualification: true;
    readonly nationality: true;
    readonly avatar: true;
    readonly status: true;
    readonly active: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly role: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly branch: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly clinic: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly user: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly email: true;
            readonly sessions: {
                readonly orderBy: {
                    readonly createdAt: "desc";
                };
                readonly take: 1;
                readonly select: {
                    readonly createdAt: true;
                };
            };
        };
    };
    readonly primarySpecialization: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly level: true;
        };
    };
    readonly secondarySpecialization: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly level: true;
        };
    };
    readonly invites: {
        readonly select: {
            readonly id: true;
            readonly accepted: true;
            readonly expiresAt: true;
        };
    };
    readonly schedulingSettings: {
        readonly select: {
            readonly shift: true;
            readonly morningStartMinute: true;
            readonly morningEndMinute: true;
            readonly eveningStartMinute: true;
            readonly eveningEndMinute: true;
        };
    };
};
export type StaffResponse = Prisma.StaffGetPayload<{
    select: typeof staffSelect;
}>;
