import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
export declare const roleSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly name: true;
    readonly description: true;
    readonly isSuperAdmin: true;
    readonly isSystem: true;
    readonly createdAt: true;
    readonly grants: {
        readonly select: {
            readonly scope: true;
            readonly permission: {
                readonly select: {
                    readonly key: true;
                };
            };
        };
    };
    readonly _count: {
        readonly select: {
            readonly assignments: true;
        };
    };
};
type RoleRaw = Prisma.StaffRoleGetPayload<{
    select: typeof roleSelect;
}>;
/**
 * The client shape. `grants` is flattened to `key → scope` because that is how the editor
 * reasons about it — a list of join rows would push the mapping into every component.
 */
export type RoleResponse = Omit<RoleRaw, "grants" | "_count"> & {
    grants: Record<string, string>;
    staffCount: number;
};
export declare const createRoleSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateRoleFormInput = z.infer<typeof createRoleSchema>;
export declare const updateRoleSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateRoleFormInput = z.infer<typeof updateRoleSchema>;
/**
 * A grant is validated against the catalogue on write. The legacy array never was, which
 * is why it accumulated 36 slugs naming permissions that no longer exist.
 */
export declare const grantSchema: z.ZodObject<{
    key: z.ZodEnum<{
        [x: string]: string;
    }>;
    scope: z.ZodEnum<{
        ALL: "ALL";
        BRANCH: "BRANCH";
        OWN: "OWN";
    }>;
}, z.core.$strip>;
export declare const setGrantsSchema: z.ZodObject<{
    grants: z.ZodArray<z.ZodObject<{
        key: z.ZodEnum<{
            [x: string]: string;
        }>;
        scope: z.ZodEnum<{
            ALL: "ALL";
            BRANCH: "BRANCH";
            OWN: "OWN";
        }>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SetGrantsFormInput = z.infer<typeof setGrantsSchema>;
export type CreateRoleInput = Pick<Prisma.StaffRoleUncheckedCreateInput, "clinicId" | "name" | "description">;
export {};
