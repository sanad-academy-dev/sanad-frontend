import { z } from "zod";
import type { Prisma, Room } from "@/generated/prisma/client";
import { RoomType } from "@/generated/prisma/enums";
export type { RoomType };
export declare const createRoomSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<{
        readonly EXAMINATION: "EXAMINATION";
        readonly LABORATORY: "LABORATORY";
        readonly WAITING: "WAITING";
        readonly OPERATING: "OPERATING";
        readonly VACCINATION: "VACCINATION";
        readonly ICU: "ICU";
        readonly GROOMING: "GROOMING";
        readonly WARD: "WARD";
        readonly ISOLATION: "ISOLATION";
    }>;
    capacity: z.ZodCoercedNumber<unknown>;
    availableDevices: z.ZodArray<z.ZodString>;
    abilities: z.ZodArray<z.ZodString>;
    managerId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodString>;
    active: z.ZodBoolean;
}, z.core.$strip>;
export type CreateRoomFormInput = z.infer<typeof createRoomSchema>;
export type RoomWriteFields = Omit<Room, "id" | "createdAt" | "updatedAt" | "isDeleted" | "deletedAt">;
export type CreateRoomInput = Pick<RoomWriteFields, "branchId" | "clinicId" | "name" | "type" | "capacity"> & Partial<Pick<RoomWriteFields, "availableDevices" | "abilities" | "managerId" | "notes" | "active">>;
export type UpdateRoomInput = Partial<Omit<RoomWriteFields, "branchId" | "clinicId">>;
export type RoomResponse = Prisma.RoomGetPayload<{
    select: {
        id: true;
        name: true;
        type: true;
        capacity: true;
        managerId: true;
        manager: {
            select: {
                id: true;
                name: true;
                image: true;
                phone: true;
            };
        };
        availableDevices: true;
        abilities: true;
        notes: true;
        active: true;
        createdAt: true;
        updatedAt: true;
    };
}>;
