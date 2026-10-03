import {
	ALL_RBAC_PERMISSIONS,
	GROUP_LABELS,
	type PermissionScope,
	RBAC_GROUPS,
	type RbacGroup,
	type RbacPermissionEntry,
} from "@sanad/contracts/runtime/lib/rbac/rbac-registry";
import {
	ACTIONS_BY_KIND as ACCOUNTING_ACTIONS_BY_KIND,
	ACCOUNTING_DOCTYPES,
	ACCOUNTING_ROLE_LABELS,
	ALL_ACCOUNTING_ROLES,
	accountingPermission,
} from "@/server/accounting/permissions/accounting-permissions";

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

const GENERAL: CataloguePermission[] = ALL_RBAC_PERMISSIONS.map((entry) => ({
	...entry,
	isAccounting: false,
}));

const ACCOUNTING_ACTION_LABEL_AR: Record<string, string> = {
	read: "عرض",
	write: "تعديل",
	submit: "ترحيل",
	cancel: "إلغاء",
};

const ACCOUNTING_ACTION_LABEL_EN: Record<string, string> = {
	read: "View",
	write: "Edit",
	submit: "Submit",
	cancel: "Cancel",
};

/**
 * Accounting doctypes → catalogue entries. Actions come from the doctype's `kind`, exactly
 * as the accounting guard computes them, so the two can never disagree about which actions
 * a doctype exposes.
 */
const ACCOUNTING_DOCTYPE_ENTRIES: CataloguePermission[] = ACCOUNTING_DOCTYPES.flatMap(
	(doctype) =>
		ACCOUNTING_ACTIONS_BY_KIND[doctype.kind].map((action) => ({
			key: accountingPermission(doctype.key, action),
			resource: `accounting.${doctype.key}`,
			action,
			group: "accounting" as RbacGroup,
			labelAr: `${ACCOUNTING_ACTION_LABEL_AR[action]} ${doctype.labelAr}`,
			labelEn: `${ACCOUNTING_ACTION_LABEL_EN[action]} ${doctype.labelEn}`,
			// الدفاتر مقيَّدة بالأكاديمية لا بالفرع (العقد C5) — النطاقات الأضيق بلا معنى هنا
			scopes: [] as readonly PermissionScope[],
			isAccounting: true,
		})),
);

/**
 * The four ERPNext-style special roles (frozen-accounts modifier, credit controller,
 * over-billing, repost). They are capabilities, not doctype actions, so they are carried
 * as single-segment entries under a synthetic resource rather than being forced into the
 * `{resource}.{action}` mould.
 */
const ACCOUNTING_ROLE_ENTRIES: CataloguePermission[] = ALL_ACCOUNTING_ROLES.map((role) => ({
	key: role,
	resource: "accounting.role",
	action: role.split(".").pop() ?? role,
	group: "accounting" as RbacGroup,
	labelAr: ACCOUNTING_ROLE_LABELS[role].ar,
	labelEn: ACCOUNTING_ROLE_LABELS[role].en,
	scopes: [] as readonly PermissionScope[],
	isAccounting: true,
}));

/** Every grantable permission in the application. The `permission` table mirrors this. */
export const ALL_CATALOGUE_PERMISSIONS: CataloguePermission[] = [
	...GENERAL,
	...ACCOUNTING_DOCTYPE_ENTRIES,
	...ACCOUNTING_ROLE_ENTRIES,
];

export const ALL_CATALOGUE_KEYS: string[] = ALL_CATALOGUE_PERMISSIONS.map((p) => p.key);

const BY_KEY = new Map<string, CataloguePermission>(
	ALL_CATALOGUE_PERMISSIONS.map((permission) => [permission.key, permission]),
);

export function findCataloguePermission(key: string): CataloguePermission | undefined {
	return BY_KEY.get(key);
}

/**
 * Is `{resource}.{action}` a real permission? Works for both grammars because it composes
 * the key the same way the catalogue did. Used by the guard, which must reject an unknown
 * pair loudly rather than denying it silently.
 */
export function catalogueHasPermission(resource: string, action: string): boolean {
	return BY_KEY.has(`${resource}.${action}`);
}

/** Catalogue grouped for the roles editor's sections. */
export function permissionsByGroup(): Map<RbacGroup, CataloguePermission[]> {
	const grouped = new Map<RbacGroup, CataloguePermission[]>();
	for (const permission of ALL_CATALOGUE_PERMISSIONS) {
		const bucket = grouped.get(permission.group);
		if (bucket) bucket.push(permission);
		else grouped.set(permission.group, [permission]);
	}
	return grouped;
}

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
export function buildCatalogueGroups(): CatalogueGroup[] {
	const groups: CatalogueGroup[] = [];

	for (const [group, permissions] of permissionsByGroup()) {
		const byResource = new Map<string, CataloguePermission[]>();
		for (const permission of permissions) {
			const bucket = byResource.get(permission.resource);
			if (bucket) bucket.push(permission);
			else byResource.set(permission.resource, [permission]);
		}

		groups.push({
			id: group,
			labelAr: GROUP_LABELS[group].ar,
			labelEn: GROUP_LABELS[group].en,
			resources: [...byResource].map(([key, list]) => ({
				key,
				// the resource's own name, not the per-permission label ("عرض الأطفال" → "الأطفال")
				labelAr: resourceLabel(list, "ar"),
				labelEn: resourceLabel(list, "en"),
				scopes: list[0]?.scopes ?? [],
				permissions: list,
			})),
		});
	}

	return groups.sort((a, b) => RBAC_GROUPS.indexOf(a.id) - RBAC_GROUPS.indexOf(b.id));
}

/**
 * Recover the resource's display name from its permission labels. Labels are built as
 * `"{action} {resource}"`, so the resource name is what remains after the action word —
 * derived rather than stored a second time, so a renamed resource cannot disagree with
 * itself.
 */
function resourceLabel(list: CataloguePermission[], lang: "ar" | "en"): string {
	const read = list.find((p) => p.action === "read") ?? list[0];
	if (!read) return "";
	const label = lang === "ar" ? read.labelAr : read.labelEn;
	const parts = label.split(" ");
	return parts.length > 1 ? parts.slice(1).join(" ") : label;
}
