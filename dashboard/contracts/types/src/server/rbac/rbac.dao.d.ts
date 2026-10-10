import type { PermissionScope } from "@/generated/prisma/enums";
import { type CreateRoleInput, type RoleResponse } from "@/server/rbac/rbac.type";
/** Guard message shared by the three paths that must not strand a clinic. */
export declare const LAST_SUPER_ADMIN_ERROR = "\u0644\u0627 \u064A\u0645\u0643\u0646 \u0625\u0632\u0627\u0644\u0629 \u0622\u062E\u0631 \u062F\u0648\u0631 \u0645\u062F\u064A\u0631 \u0646\u0638\u0627\u0645 \u0641\u064A \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629 \u2014 \u0633\u062A\u0641\u0642\u062F \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629 \u0627\u0644\u0642\u062F\u0631\u0629 \u0639\u0644\u0649 \u0625\u062F\u0627\u0631\u0629 \u0646\u0641\u0633\u0647\u0627 \u0646\u0647\u0627\u0626\u064A\u064B\u0627";
export declare const rbacDao: {
    listRoles(clinicId: string): Promise<RoleResponse[]>;
    createRole(input: CreateRoleInput, actorId: string): Promise<RoleResponse>;
    /**
     * Create a role from a template (`rbac-role-templates.ts`).
     *
     * The result is an ORDINARY role — same table, same grants, fully editable afterwards.
     * A template is a starting point, not a type: nothing downstream can tell a
     * template-created role from a hand-built one, which is what stops "the template" from
     * becoming a second concept to reason about.
     *
     * Grant rows are resolved against the `permission` table, so a template naming a key
     * that was never synced simply contributes nothing rather than failing the whole
     * creation — and the count returned tells the caller what actually landed.
     */
    createRoleFromTemplate(clinicId: string, templateKey: string, actorId: string, nameOverride?: string): Promise<RoleResponse | "unknown-template" | "duplicate-name">;
    updateRole(id: string, clinicId: string, data: {
        name: string;
        description?: string;
    }, actorId: string): Promise<RoleResponse | null>;
    /**
     * Replace a role's grants wholesale.
     *
     * A scope narrower than the resource supports is REJECTED rather than silently widened:
     * the editor must not be able to record a restriction that no DAO can apply. That is the
     * same rule the registry states, enforced at the write boundary.
     */
    setGrants(id: string, clinicId: string, grants: {
        key: string;
        scope: PermissionScope;
    }[], actorId: string): Promise<RoleResponse | null | "super-admin">;
    deleteRole(id: string, clinicId: string, actorId: string): Promise<boolean | "has-staff" | "system" | "last-super-admin">;
    /**
     * Toggle the super-admin flag. Kept separate from `updateRole` on purpose: this is the
     * one write in the module that hands over total authority, and it must be auditable as
     * its own action rather than hidden inside a rename.
     */
    setSuperAdmin(id: string, clinicId: string, isSuperAdmin: boolean, actorId: string): Promise<RoleResponse | null | "last-super-admin">;
};
