import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { ALL_CATALOGUE_KEYS } from "@sanad/contracts/runtime/lib/rbac/rbac-catalogue";
import { PERMISSION_SCOPES } from "@sanad/contracts/runtime/lib/rbac/rbac-registry";

export const roleSelect = {
	id: true,
	clinicId: true,
	name: true,
	description: true,
	isSuperAdmin: true,
	isSystem: true,
	createdAt: true,
	grants: {
		select: {
			scope: true,
			permission: { select: { key: true } },
		},
	},
	_count: { select: { assignments: true } },
} as const;

type RoleRaw = Prisma.StaffRoleGetPayload<{ select: typeof roleSelect }>;

/**
 * The client shape. `grants` is flattened to `key → scope` because that is how the editor
 * reasons about it — a list of join rows would push the mapping into every component.
 */
export type RoleResponse = Omit<RoleRaw, "grants" | "_count"> & {
	grants: Record<string, string>;
	staffCount: number;
};

export const createRoleSchema = z.object({
	name: z.string({ error: "اسم الدور مطلوب" }).min(1, "اسم الدور مطلوب"),
	description: z.string().optional(),
});

export type CreateRoleFormInput = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = createRoleSchema;
export type UpdateRoleFormInput = z.infer<typeof updateRoleSchema>;

/**
 * A grant is validated against the catalogue on write. The legacy array never was, which
 * is why it accumulated 36 slugs naming permissions that no longer exist.
 */
export const grantSchema = z.object({
	key: z.enum(ALL_CATALOGUE_KEYS as [string, ...string[]]),
	scope: z.enum(PERMISSION_SCOPES),
});

export const setGrantsSchema = z.object({
	grants: z.array(grantSchema),
});

export type SetGrantsFormInput = z.infer<typeof setGrantsSchema>;

export type CreateRoleInput = Pick<
	Prisma.StaffRoleUncheckedCreateInput,
	"clinicId" | "name" | "description"
>;
