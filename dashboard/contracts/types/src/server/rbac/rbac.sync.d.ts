/**
 * [RBAC P2 · decision D2] Sync the `permission` table from the code catalogue.
 *
 * The registry is authoritative; the table is a mirror kept for FK integrity (a grant
 * cannot reference a permission that does not exist) and for reporting. So this is a
 * one-way, idempotent upsert — never a merge, and never a read-back into code.
 *
 * Deliberately NOT a one-shot SQL migration: the catalogue grows every time a module
 * ships, and a migration-embedded INSERT list would be a second copy to keep in step —
 * the exact drift that left the roles editor unable to grant a single accounting
 * permission. Run it from the seed and from `db:sync-permissions`.
 *
 * Obsolete rows are reported, not deleted: dropping a permission row cascades to
 * `role_permission` and would silently revoke authority from live roles. Removal is a
 * deliberate act, so it needs a human to look at the list first.
 */
export type PermissionSyncResult = {
    created: number;
    updated: number;
    /** in the DB but no longer in the catalogue — reported for review, never auto-deleted */
    orphaned: string[];
};
export declare function syncPermissionCatalogue(): Promise<PermissionSyncResult>;
/**
 * Backfill `role_permission` from the legacy `StaffRole.permissions` string[].
 *
 * A slug is resolved through {@link LEGACY_SLUG_MAP} first, then by literal key match
 * (which is how the accounting slugs carry over unchanged). Anything still unresolved is
 * skipped and reported: the old array was never validated on write, so it genuinely holds
 * strings that no longer name a permission, and inventing a row for one would resurrect a
 * grant nobody can see in the editor.
 */
export declare function backfillLegacyGrants(clinicId?: string): Promise<{
    rolesProcessed: number;
    grantsCreated: number;
    unknownSlugs: string[];
}>;
