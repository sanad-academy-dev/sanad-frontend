import { type PermissionScope, type RbacGroup, type RbacPermissionEntry } from "@/lib/rbac/rbac-registry";
/**
 * [RBAC P2] The ONE catalogue — the general resource registry plus the accounting matrix,
 * merged into a single list of grantable permissions.
 *
 * Why merge rather than replace: the accounting module's 38 controllers already gate on
 * `accounting.{doctype}.{action}`, verified by a live HTTP 403 matrix and a static
 * coherence test. Rewriting those slugs would throw away working, tested enforcement to
 * win a cosmetic consistency. So accounting keeps its three-segment grammar and is
 * *adopted* into the catalogue: `resource` is the compound `accounting.{doctype}`, and the
 * final segment is the action. Everything downstream — the `permission` table, the roles
 * editor, the guard — sees one uniform list.
 *
 * This is what closes audit defect 3: accounting appeared in the roles editor **zero**
 * times, so its ~110 slugs could only ever be held by an admin.
 *
 * Pure module: string constants and derivations only, safe for the client bundle.
 */
export type CataloguePermission = RbacPermissionEntry & {
    /** `true` for the accounting matrix's compound-resource slugs */
    isAccounting: boolean;
};
/** Every grantable permission in the application. The `permission` table mirrors this. */
export declare const ALL_CATALOGUE_PERMISSIONS: CataloguePermission[];
export declare const ALL_CATALOGUE_KEYS: string[];
export declare function findCataloguePermission(key: string): CataloguePermission | undefined;
/**
 * Is `{resource}.{action}` a real permission? Works for both grammars because it composes
 * the key the same way the catalogue did. Used by the guard, which must reject an unknown
 * pair loudly rather than denying it silently.
 */
export declare function catalogueHasPermission(resource: string, action: string): boolean;
/** Catalogue grouped for the roles editor's sections. */
export declare function permissionsByGroup(): Map<RbacGroup, CataloguePermission[]>;
export type CatalogueResource = {
    key: string;
    labelAr: string;
    labelEn: string;
    scopes: readonly PermissionScope[];
    permissions: CataloguePermission[];
};
export type CatalogueGroup = {
    id: RbacGroup;
    labelAr: string;
    labelEn: string;
    resources: CatalogueResource[];
};
/**
 * The catalogue shaped for the roles editor: groups → resources → permissions.
 *
 * Built here, in the PURE module, so the server endpoint and the client screen render from
 * one function rather than two hand-kept copies. The previous editor's section list was a
 * hardcoded array living beside the catalogue instead of being derived from it, which is
 * how it drifted into shipping four `comingSoon` sections whose permissions were already
 * enforced, and zero accounting sections at all.
 */
export declare function buildCatalogueGroups(): CatalogueGroup[];
