import { type PermissionScope } from "@/lib/rbac/rbac-registry";
/**
 * [RBAC P3] Enforcement for the permission registry.
 *
 * Authority is checked in two places on purpose:
 *  - at the HTTP boundary via the `requirePermission` macro (`rbac.macro.ts`), which
 *    answers 401/403 before a handler runs, and
 *  - inside services that mutate shared state, so *every* caller — HTTP, background job,
 *    posting adapter, the AI agent — passes the same gate. A ledger or a payroll run must
 *    not be one forgotten route away from an unauthorised write.
 *
 * Fail-closed: an actor is never assumed privileged. Non-interactive callers must say so
 * explicitly with {@link SYSTEM_ACTOR}.
 *
 * Kept free of `elysia`/`auth`/`db` imports so services and their unit tests can depend on
 * it without dragging in the HTTP layer; `rbac.macro.ts` owns that wiring and
 * `rbac.resolver.ts` owns the DB reads.
 */
/**
 * An actor's effective grants: permission key → the widest scope they hold for it.
 * Absent key = not granted. Built by `rbac.resolver.ts` as the UNION across every role
 * assigned to the staff member (decision D1, multi-role).
 */
export type RbacGrants = ReadonlyMap<string, PermissionScope>;
export type RbacActor = {
    userId: string | null;
    staffId: string | null;
    /** the actor's branch, for resolving a `BRANCH`-scoped grant */
    branchId: string | null;
    /**
     * Holds a role flagged `isSuperAdmin` — skips EVERY check (decision D4).
     * `SYSTEM` callers set this too; see {@link SYSTEM_ACTOR}.
     */
    isSuperAdmin: boolean;
    grants: RbacGrants;
};
/**
 * The engine's own actor for background jobs, posting adapters, and migrations. It is
 * super-admin because it acts with the system's authority and carries no user grants —
 * the alternative (an empty grant map) would make every job silently fail closed.
 */
export declare const SYSTEM_ACTOR: RbacActor;
/** Authorisation failure — mapped to HTTP 403 in `src/server/app.ts`. */
export declare class RbacPermissionError extends Error {
    readonly permission: string;
    constructor(message: string, permission: string);
}
/**
 * A resource/action pair that does not exist in the registry. This is a PROGRAMMING error,
 * not a permission an operator could ever be granted, so it must not resolve to "denied" —
 * a silent 403 is exactly how the P12A endpoints shipped unreachable for everyone,
 * including admins, for a whole phase.
 */
export declare class RbacRegistryError extends Error {
    constructor(message: string);
}
/**
 * Does this actor hold `{resource}.{action}`, and at what scope?
 * Returns `null` when not granted, otherwise the widest scope held.
 *
 * ORDER IS LOAD-BEARING (CLAUDE.md rule 12 / the P12A post-mortem):
 * the super-admin bypass is evaluated **first**, before the registry's action-support
 * check. Registering a runnable tool under a kind with no `run` action must not be able to
 * lock out an admin — a mis-declared registry entry is a bug to surface loudly, never a
 * denial to serve silently.
 */
export declare function scopeFor(actor: RbacActor, resource: string, action: string): PermissionScope | null;
export declare function can(actor: RbacActor, resource: string, action: string): boolean;
/**
 * Does the actor hold the permission at **at least** the requested breadth? Used where a
 * route inherently needs clinic-wide reach (a cross-branch report), so a `BRANCH` grant
 * must not silently serve a narrower answer than the endpoint promises.
 */
export declare function canAtLeast(actor: RbacActor, resource: string, action: string, minimum: PermissionScope): boolean;
export declare function assertCan(actor: RbacActor, resource: string, action: string, labelAr?: string): PermissionScope;
/**
 * Merge grants from several roles, keeping the **widest** scope per permission. Two roles
 * granting `patients.read` at `BRANCH` and `ALL` yield `ALL`: roles add authority, they
 * never subtract it. There are deliberately no "deny" rules — a deny that silently beats a
 * grant is the single most common way an RBAC model becomes impossible to reason about.
 */
export declare function mergeGrants(sources: readonly (readonly (readonly [string, PermissionScope])[])[]): Map<string, PermissionScope>;
