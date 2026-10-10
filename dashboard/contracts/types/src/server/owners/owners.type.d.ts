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
    notes: z.ZodOptional<z.ZodString>;
    active: z.ZodBoolean;
    patientIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type CreateOwnerFormInput = z.infer<typeof createOwnerSchema>;
export type CreateOwnerInput = Pick<Prisma.OwnerUncheckedCreateInput, "clinicId" | "name" | "phone" | "email" | "gender" | "ownerType" | "relationship" | "country" | "city" | "address" | "notes" | "active"> & {
    patientIds?: string[];
};
export type UpdateOwnerInput = Partial<Pick<Prisma.OwnerUncheckedCreateInput, "name" | "phone" | "gender" | "ownerType" | "relationship" | "country" | "city" | "address" | "notes" | "active">> & {
    patientIds?: string[];
};
export type DisableOwnerInput = {
    newOwnerId?: string;
};
export type DeleteOwnerInput = {
    newOwnerId?: string;
};
export type OwnerResponse = Prisma.OwnerGetPayload<{
    select: {
        id: true;
        code: true;
        name: true;
        phone: true;
        email: true;
        gender: true;
        ownerType: true;
        relationship: true;
        country: true;
        city: true;
        address: true;
        notes: true;
        active: true;
        editsCount: true;
        createdAt: true;
        updatedAt: true;
        patients: {
            select: {
                id: true;
                animalType: {
                    select: {
                        arName: true;
                        enName: true;
                    };
                };
            };
        };
    };
}>;
