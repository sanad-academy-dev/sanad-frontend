import type { Prisma, Role } from "@/generated/prisma/client";
declare const inviteWithRelationsInclude: {
    clinic: {
        select: {
            id: true;
            name: true;
        };
    };
    invitedBy: {
        select: {
            id: true;
            name: true;
            email: true;
        };
    };
};
export type InviteWithRelations = Prisma.InviteGetPayload<{
    include: typeof inviteWithRelationsInclude;
}>;
export declare const invitesDao: {
    create(clinicId: string, invitedById: string, email: string, role?: Role): Promise<{
        clinic: {
            name: string;
            id: string;
        };
        invitedBy: {
            name: string;
            id: string;
            email: string;
        };
    } & {
        id: string;
        clinicId: string;
        createdAt: Date;
        email: string;
        role: Role;
        staffId: string | null;
        expiresAt: Date;
        token: string;
        accepted: boolean;
        invitedById: string;
    }>;
    findByToken(token: string): Promise<({
        clinic: {
            name: string;
            id: string;
        };
        invitedBy: {
            name: string;
            id: string;
            email: string;
        };
    } & {
        id: string;
        clinicId: string;
        createdAt: Date;
        email: string;
        role: Role;
        staffId: string | null;
        expiresAt: Date;
        token: string;
        accepted: boolean;
        invitedById: string;
    }) | null>;
    listByClinic(clinicId: string): Promise<({
        clinic: {
            name: string;
            id: string;
        };
        invitedBy: {
            name: string;
            id: string;
            email: string;
        };
    } & {
        id: string;
        clinicId: string;
        createdAt: Date;
        email: string;
        role: Role;
        staffId: string | null;
        expiresAt: Date;
        token: string;
        accepted: boolean;
        invitedById: string;
    })[]>;
    accept(token: string, userId: string, sessionId: string): Promise<{
        id: string;
        clinicId: string;
        createdAt: Date;
        email: string;
        role: Role;
        staffId: string | null;
        expiresAt: Date;
        token: string;
        accepted: boolean;
        invitedById: string;
    } | null>;
    revoke(token: string, clinicId: string): Promise<{
        id: string;
        clinicId: string;
        createdAt: Date;
        email: string;
        role: Role;
        staffId: string | null;
        expiresAt: Date;
        token: string;
        accepted: boolean;
        invitedById: string;
    } | null>;
    findPendingByEmail(email: string): Promise<{
        id: string;
        clinicId: string;
        createdAt: Date;
        email: string;
        role: Role;
        staffId: string | null;
        expiresAt: Date;
        token: string;
        accepted: boolean;
        invitedById: string;
    } | null>;
    ensureForStaff(staffId: string, clinicId: string, invitedById: string): Promise<{
        kind: "not-found";
        invite?: undefined;
    } | {
        kind: "already-active";
        invite?: undefined;
    } | {
        kind: "ok";
        invite: {
            clinic: {
                name: string;
                id: string;
            };
            invitedBy: {
                name: string;
                id: string;
                email: string;
            };
        } & {
            id: string;
            clinicId: string;
            createdAt: Date;
            email: string;
            role: Role;
            staffId: string | null;
            expiresAt: Date;
            token: string;
            accepted: boolean;
            invitedById: string;
        };
    }>;
};
export {};
