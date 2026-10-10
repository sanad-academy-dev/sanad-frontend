import type { CreateRoomInput, UpdateRoomInput } from "@/server/rooms/rooms.type";
export declare const roomsDao: {
    listByBranch(branchId: string): Promise<{
        type: import("@/server/rooms/rooms.type").RoomType;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        active: boolean;
        managerId: string | null;
        manager: {
            name: string;
            id: string;
            phone: string | null;
            image: string | null;
        } | null;
        capacity: number;
        availableDevices: string[];
        abilities: string[];
    }[]>;
    listByClinic(clinicId: string): Promise<{
        type: import("@/server/rooms/rooms.type").RoomType;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        notes: string | null;
        active: boolean;
        managerId: string | null;
        manager: {
            name: string;
            id: string;
            phone: string | null;
            image: string | null;
        } | null;
        capacity: number;
        availableDevices: string[];
        abilities: string[];
    }[]>;
    findById(id: string, branchId: string): Promise<{
        type: import("@/server/rooms/rooms.type").RoomType;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        active: boolean;
        managerId: string | null;
        manager: {
            name: string;
            id: string;
            phone: string | null;
            image: string | null;
        } | null;
        capacity: number;
        availableDevices: string[];
        abilities: string[];
    } | null>;
    create(data: CreateRoomInput): Promise<{
        type: import("@/server/rooms/rooms.type").RoomType;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        active: boolean;
        managerId: string | null;
        manager: {
            name: string;
            id: string;
            phone: string | null;
            image: string | null;
        } | null;
        capacity: number;
        availableDevices: string[];
        abilities: string[];
    }>;
    update(id: string, branchId: string, data: UpdateRoomInput): Promise<{
        type: import("@/server/rooms/rooms.type").RoomType;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        active: boolean;
        managerId: string | null;
        manager: {
            name: string;
            id: string;
            phone: string | null;
            image: string | null;
        } | null;
        capacity: number;
        availableDevices: string[];
        abilities: string[];
    } | null>;
    softDelete(id: string, branchId: string): Promise<{
        type: import("@/server/rooms/rooms.type").RoomType;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        active: boolean;
        managerId: string | null;
        manager: {
            name: string;
            id: string;
            phone: string | null;
            image: string | null;
        } | null;
        capacity: number;
        availableDevices: string[];
        abilities: string[];
    } | null>;
};
