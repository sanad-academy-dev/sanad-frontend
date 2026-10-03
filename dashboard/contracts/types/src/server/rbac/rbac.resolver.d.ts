import type { PermissionScope } from "@/lib/rbac/rbac-registry";
import { type RbacActor } from "@/server/rbac/rbac.guard";
/** Test seam — the suites need a clean cache between cases. */
export declare function __clearRbacVersionCache(): void;
export declare function currentRbacVersion(clinicId: string): Promise<number>;
/**
 * Bump a clinic's version, invalidating every cached snapshot in it. Call inside the same
 * transaction as the write that changed authority, so a committed grant can never be
 * followed by a stale read.
 */
export declare function bumpRbacVersion(clinicId: string, tx?: {
    clinic: {
        update: (args: unknown) => Promise<unknown>;
    };
}): Promise<void>;
export type ResolvedActor = RbacActor & {
    rbacVersion: number;
};
/**
 * Build the effective actor for a user in a clinic, straight from the database.
 *
 * Grants are the UNION across every assigned role (decision D1) with the widest scope
 * winning — roles add authority, never subtract it. A role flagged `isSuperAdmin` makes
 * the actor a super admin regardless of what else they hold.
 */
export declare function resolveActor(userId: string, clinicId: string): Promise<ResolvedActor>;
/**
 * What `Session.permissions` stores. The whole actor, not just the grant map: the request
 * path needs `staffId` and `branchId` to resolve a BRANCH/OWN scope, and re-reading them
 * per request would reinstate exactly the join the snapshot exists to avoid.
 */
export type SessionSnapshot = {
    v: 1;
    staffId: string | null;
    branchId: string | null;
    isSuperAdmin: boolean;
    grants: Record<string, PermissionScope>;
};
export declare function serialiseActor(actor: RbacActor): string;
/**
 * Parse a snapshot defensively.
 *
 * Tolerates the LEGACY format — a JSON `string[]` of slugs with no scope — by reading every
 * entry as `ALL`, which is exactly what those grants meant before scopes existed. Sessions
 * created before the migration therefore keep working until their next version bump,
 * instead of every logged-in user silently losing every permission on deploy day.
 *
 * Returns `null` when nothing usable is there, so the caller re-resolves from the DB rather
 * than proceeding with an empty actor. An unparseable snapshot must never read as
 * "no grants" *or* "all grants" — both are wrong answers to "I don't know".
 */
export declare function parseSnapshot(raw: string | null | undefined): SessionSnapshot | null;
export declare function snapshotToActor(userId: string, snapshot: SessionSnapshot): RbacActor;
