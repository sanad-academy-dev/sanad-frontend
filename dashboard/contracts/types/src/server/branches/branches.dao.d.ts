import type { BranchSettings, CreateBranchInput, UpdateBranchInput } from "@/server/branches/branches.type";
export declare const branchesDao: {
    list(clinicId: string): Promise<({
        _count: {
            rooms: number;
            branchUsers: number;
        };
        warehouses: {
            id: string;
            active: boolean;
        }[];
        manager: {
            name: string;
            id: string;
            email: string;
            phone: string | null;
            image: string | null;
        } | null;
        managers: {
            name: string;
            id: string;
            email: string;
            image: string | null;
        }[];
    } & {
        type: import("@/generated/prisma/client").BranchType;
        name: string;
        address: string | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        city: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        active: boolean;
        isDeleted: boolean;
        deletedAt: Date | null;
        branchCode: string;
        icon: string | null;
        managerId: string | null;
        emergencyNotifications: boolean;
    })[]>;
    findById(id: string, clinicId: string): Promise<({
        _count: {
            rooms: number;
            branchUsers: number;
        };
        warehouses: {
            id: string;
            active: boolean;
        }[];
        manager: {
            name: string;
            id: string;
            email: string;
            phone: string | null;
            image: string | null;
        } | null;
        managers: {
            name: string;
            id: string;
            email: string;
            image: string | null;
        }[];
    } & {
        type: import("@/generated/prisma/client").BranchType;
        name: string;
        address: string | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        city: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        active: boolean;
        isDeleted: boolean;
        deletedAt: Date | null;
        branchCode: string;
        icon: string | null;
        managerId: string | null;
        emergencyNotifications: boolean;
    }) | null>;
    create(data: CreateBranchInput): Promise<{
        _count: {
            rooms: number;
            branchUsers: number;
        };
        warehouses: {
            id: string;
            active: boolean;
        }[];
        manager: {
            name: string;
            id: string;
            email: string;
            phone: string | null;
            image: string | null;
        } | null;
        managers: {
            name: string;
            id: string;
            email: string;
            image: string | null;
        }[];
    } & {
        type: import("@/generated/prisma/client").BranchType;
        name: string;
        address: string | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        city: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        active: boolean;
        isDeleted: boolean;
        deletedAt: Date | null;
        branchCode: string;
        icon: string | null;
        managerId: string | null;
        emergencyNotifications: boolean;
    }>;
    update(id: string, clinicId: string, data: UpdateBranchInput): Promise<({
        _count: {
            rooms: number;
            branchUsers: number;
        };
        warehouses: {
            id: string;
            active: boolean;
        }[];
        manager: {
            name: string;
            id: string;
            email: string;
            phone: string | null;
            image: string | null;
        } | null;
        managers: {
            name: string;
            id: string;
            email: string;
            image: string | null;
        }[];
    } & {
        type: import("@/generated/prisma/client").BranchType;
        name: string;
        address: string | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        city: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        active: boolean;
        isDeleted: boolean;
        deletedAt: Date | null;
        branchCode: string;
        icon: string | null;
        managerId: string | null;
        emergencyNotifications: boolean;
    }) | null>;
    updateSettings(id: string, clinicId: string, settings: BranchSettings): Promise<({
        _count: {
            rooms: number;
            branchUsers: number;
        };
        warehouses: {
            id: string;
            active: boolean;
        }[];
        manager: {
            name: string;
            id: string;
            email: string;
            phone: string | null;
            image: string | null;
        } | null;
        managers: {
            name: string;
            id: string;
            email: string;
            image: string | null;
        }[];
    } & {
        type: import("@/generated/prisma/client").BranchType;
        name: string;
        address: string | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        city: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        active: boolean;
        isDeleted: boolean;
        deletedAt: Date | null;
        branchCode: string;
        icon: string | null;
        managerId: string | null;
        emergencyNotifications: boolean;
    }) | null>;
    setManagers(id: string, clinicId: string, managerIds: string[]): Promise<({
        _count: {
            rooms: number;
            branchUsers: number;
        };
        warehouses: {
            id: string;
            active: boolean;
        }[];
        manager: {
            name: string;
            id: string;
            email: string;
            phone: string | null;
            image: string | null;
        } | null;
        managers: {
            name: string;
            id: string;
            email: string;
            image: string | null;
        }[];
    } & {
        type: import("@/generated/prisma/client").BranchType;
        name: string;
        address: string | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        city: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        active: boolean;
        isDeleted: boolean;
        deletedAt: Date | null;
        branchCode: string;
        icon: string | null;
        managerId: string | null;
        emergencyNotifications: boolean;
    }) | null>;
    setWarehouseEnabled(id: string, clinicId: string, enabled: boolean): Promise<({
        _count: {
            rooms: number;
            branchUsers: number;
        };
        warehouses: {
            id: string;
            active: boolean;
        }[];
        manager: {
            name: string;
            id: string;
            email: string;
            phone: string | null;
            image: string | null;
        } | null;
        managers: {
            name: string;
            id: string;
            email: string;
            image: string | null;
        }[];
    } & {
        type: import("@/generated/prisma/client").BranchType;
        name: string;
        address: string | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        city: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        active: boolean;
        isDeleted: boolean;
        deletedAt: Date | null;
        branchCode: string;
        icon: string | null;
        managerId: string | null;
        emergencyNotifications: boolean;
    }) | null>;
    delete(id: string, clinicId: string): Promise<{
        type: import("@/generated/prisma/client").BranchType;
        name: string;
        address: string | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        city: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        active: boolean;
        isDeleted: boolean;
        deletedAt: Date | null;
        branchCode: string;
        icon: string | null;
        managerId: string | null;
        emergencyNotifications: boolean;
    } | null>;
    listUsers(branchId: string, clinicId: string): Promise<{
        inviteAccepted: boolean;
        user: {
            name: string;
            id: string;
            email: string;
            phone: string | null;
            clinicUsers: {
                role: import("@/generated/prisma/client").Role;
            }[];
            image: string | null;
        };
        id: string;
        clinicId: string;
        createdAt: Date;
        userId: string;
        branchId: string;
    }[]>;
    assignUser(branchId: string, clinicId: string, userId: string): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
            image: string | null;
        };
    } & {
        id: string;
        clinicId: string;
        createdAt: Date;
        userId: string;
        branchId: string;
    }>;
    removeUser(branchId: string, clinicId: string, userId: string): Promise<{
        id: string;
        clinicId: string;
        createdAt: Date;
        userId: string;
        branchId: string;
    } | null>;
    isUserInClinic(userId: string, clinicId: string): Promise<{
        id: string;
        clinicId: string;
        createdAt: Date;
        userId: string;
        role: import("@/generated/prisma/client").Role;
    } | null>;
    getUserBranchInClinic(userId: string, clinicId: string): Promise<{
        id: string;
        clinicId: string;
        createdAt: Date;
        userId: string;
        branchId: string;
    } | null>;
};
