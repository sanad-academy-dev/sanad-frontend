import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { Gender, OwnerRelationship, OwnerType } from "@/generated/prisma/enums";
export type { Gender, OwnerRelationship, OwnerType };
export declare const createOwnerSchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodString;
    email: z.ZodString;
    gender: z.ZodOptional<z.ZodEnum<{
        readonly MALE: "MALE";
        readonly FEMALE: "FEMALE";
        readonly UNKNOWN: "UNKNOWN";
    }>>;
    ownerType: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        readonly ALL: "ALL";
        readonly VIP: "VIP";
        readonly LOYALTY: "LOYALTY";
        readonly NEW: "NEW";
        readonly CURRENT: "CURRENT";
    }>>>;
    relationship: z.ZodOptional<z.ZodEnum<{
        readonly OWNER: "OWNER";
        readonly GUARDIAN: "GUARDIAN";
        readonly DELEGATE: "DELEGATE";
        readonly EMERGENCY: "EMERGENCY";
    }>>;
    country: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    emergencyContactName: z.ZodOptional<z.ZodString>;
    emergencyContactPhone: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    active: z.ZodBoolean;
    patientIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    patientRelationships: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    patients: z.ZodOptional<z.ZodArray<z.ZodObject<{
        patientId: z.ZodString;
        relationship: z.ZodOptional<z.ZodString>;
    }>>>;
}, z.core.$strip>;
export type CreateOwnerFormInput = z.infer<typeof createOwnerSchema>;
export type CreateOwnerInput = Pick<Prisma.OwnerUncheckedCreateInput, "clinicId" | "name" | "phone" | "email" | "gender" | "ownerType" | "relationship" | "country" | "city" | "address" | "emergencyContactName" | "emergencyContactPhone" | "notes" | "active"> & {
    patientIds?: string[];
    patientRelationships?: Record<string, string>;
    patients?: Array<{ patientId: string; relationship?: string }>;
};
export type UpdateOwnerInput = Partial<Pick<Prisma.OwnerUncheckedCreateInput, "name" | "phone" | "gender" | "ownerType" | "relationship" | "country" | "city" | "address" | "emergencyContactName" | "emergencyContactPhone" | "notes" | "active">> & {
    patientIds?: string[];
    patientRelationships?: Record<string, string>;
    patients?: Array<{ patientId: string; relationship?: string }>;
};
export type DisableOwnerInput = {
    newOwnerId?: string;
};
export type DeleteOwnerInput = {
    newOwnerId?: string;
};
export type OwnerResponse = {
    id: string;
    code: string;
    name: string;
    phone: string;
    email: string | null;
    gender: Gender | null;
    ownerType: OwnerType;
    relationship: OwnerRelationship | null;
    country: string | null;
    city: string | null;
    address: string | null;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
    notes: string | null;
    active: boolean;
    editsCount: number;
    createdAt: Date;
    updatedAt: Date;
    patientRelationships?: Record<string, string>;
    patients: Array<{
        id: string;
        name: string;
        gender: Gender;
        code?: string | null;
        relationship?: string | null;
    }>;
    guardianPatients?: Array<{
        id: string;
        relationship: string | null;
        patient: {
            id: string;
            name: string;
            code: string;
            gender: Gender;
        };
    }>;
};
