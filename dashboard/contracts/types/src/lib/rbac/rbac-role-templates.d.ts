import { findCataloguePermission } from "@/lib/rbac/rbac-catalogue";
import type { PermissionScope, RbacGroup } from "@/lib/rbac/rbac-registry";
/**
 * [RBAC P6] Ready-made roles, one or more per module.
 *
 * A blank role and 447 checkboxes is a correct system that nobody can actually use: the
 * person configuring a clinic knows "this is our receptionist", not "this role needs
 * appointments.check_in at BRANCH". Templates encode the job, and stay editable afterwards
 * — applying one writes ordinary grants, it does not create a special kind of role.
 *
 * ── The grant grammar ────────────────────────────────────────────────────────────────
 * `"patients.read"`        → granted at ALL
 * `"appointments.read@BRANCH"` → granted at BRANCH
 * `"attendance.read@OWN"`  → granted at OWN
 *
 * Every key and every scope is validated against the catalogue by
 * `rbac-role-templates.test.ts`. A typo cannot ship: it fails the suite rather than
 * silently producing a role that grants less than its name promises.
 *
 * Pure module — safe for the client bundle, like the rest of `src/lib/rbac`.
 */
export type RoleTemplate = {
    key: string;
    labelAr: string;
    labelEn: string;
    descriptionAr: string;
    /** which module this role belongs to, for grouping in the picker */
    group: RbacGroup;
    grants: readonly string[];
};
export declare const ROLE_TEMPLATES: readonly RoleTemplate[];
export type ResolvedGrant = {
    key: string;
    scope: PermissionScope;
};
/** Parse `"key"` or `"key@SCOPE"` into a grant. */
export declare function parseGrantSpec(spec: string): ResolvedGrant;
/**
 * A template's grants, deduplicated (the BASE block can overlap a role's own list) keeping
 * the widest scope, so a role never ends up narrower than either half promised.
 */
export declare function resolveTemplateGrants(template: RoleTemplate): ResolvedGrant[];
export declare function findRoleTemplate(key: string): RoleTemplate | undefined;
/** Templates that reference a permission — useful for "who can do this?" in the editor. */
export declare function templatesGranting(permissionKey: string): RoleTemplate[];
/** Permissions in the catalogue that no template grants — a coverage signal, not an error. */
export declare function permissionsWithoutTemplate(): string[];
/** Catalogue entry for a template grant, or `undefined` if the key is unknown. */
export declare const lookupGrant: typeof findCataloguePermission;
