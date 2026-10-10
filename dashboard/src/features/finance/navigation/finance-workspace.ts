import {
	FINANCE_HOME_URL,
	FINANCE_NAV_GROUPS,
	type FinanceNavGroup,
	type FinanceNavGroupKey,
	type FinanceNavItem,
} from "@/features/finance/navigation/finance-nav";

/**
 * [NAV-2] Pure logic of the «المالية» workspace header — no React, no router, so the
 * behaviors the checkpoint pinned (active-group resolution, landing, deterministic
 * overflow) are unit-locked in `finance-workspace.test.ts`.
 */

/** Level 2 shows at most this many tabs; the rest collapse into «المزيد». Deterministic —
 * no measurement, no resize flicker (NAV-2 scalability decision). */
export const MAX_VISIBLE_TABS = 6;

/** The legacy hub's default tab when `?tab=` is absent (mirrors `finance.tsx`). */
const LEGACY_DEFAULT_TAB = "invoices";

/** Whether a nav item addresses the current location. `?tab=` disambiguates hub items. */
export function isItemActive(
	item: FinanceNavItem,
	pathname: string,
	tab: string | undefined,
): boolean {
	if (item.url !== pathname) return false;
	if (!item.search?.tab) return true;
	return (tab ?? LEGACY_DEFAULT_TAB) === item.search.tab;
}

/** Which sub-workspace the current route belongs to (null outside the workspace). */
export function activeGroupKeyOf(
	pathname: string,
	tab: string | undefined,
): FinanceNavGroupKey | null {
	for (const group of FINANCE_NAV_GROUPS) {
		if (group.items.some((item) => isItemActive(item, pathname, tab))) return group.key;
	}
	return null;
}

/** Groups reduced to what the user may see; empty groups vanish (State-4 degradation). */
export function visibleGroupsFor(
	isVisible: (item: FinanceNavItem) => boolean,
): FinanceNavGroup[] {
	return FINANCE_NAV_GROUPS.map((group) => ({
		...group,
		items: group.items.filter(isVisible),
	})).filter((group) => group.items.length > 0);
}

export type WorkspaceTarget = { url: string; search?: Record<string, string> };

/**
 * Where switching to a group lands: its remembered destination if it still exists in the
 * (permission-filtered) group, else the group's first permitted tab.
 */
export function landingFor(
	group: FinanceNavGroup,
	remembered: WorkspaceTarget | undefined,
): WorkspaceTarget | null {
	if (remembered) {
		const stillThere = group.items.some(
			(item) =>
				item.url === remembered.url &&
				(!item.search?.tab || item.search.tab === remembered.search?.tab),
		);
		if (stillThere) return remembered;
	}
	const first = group.items[0];
	return first ? { url: first.url, search: first.search } : null;
}

/**
 * Where the main-sidebar «المالية» entry lands: the last-visited destination if it is
 * still permitted, else the first permitted tab of the last (or first) visible group.
 * Falls back to the legacy home when the user can see nothing (the entry is hidden then
 * anyway — this keeps the return total).
 */
export function resolveWorkspaceEntry(
	lastGroupKey: FinanceNavGroupKey | null,
	lastByGroup: Partial<Record<FinanceNavGroupKey, WorkspaceTarget>>,
	isVisible: (item: FinanceNavItem) => boolean,
): WorkspaceTarget {
	const groups = visibleGroupsFor(isVisible);
	if (groups.length === 0) return { url: FINANCE_HOME_URL };
	const group = groups.find((g) => g.key === lastGroupKey) ?? groups[0];
	if (!group) return { url: FINANCE_HOME_URL };
	const remembered = group.key === lastGroupKey ? lastByGroup[group.key] : undefined;
	return landingFor(group, remembered) ?? { url: FINANCE_HOME_URL };
}

export type WorkspaceGroupLink = {
	key: FinanceNavGroupKey;
	/** i18n key — the renderer owns translation, this file stays pure */
	titleKey: string;
	url: string;
	search?: Record<string, string>;
	isActive: boolean;
};

/**
 * [NAV-3] The sidebar sub-menu model: one link per visible group, each pointing at its
 * remembered destination (else its first permitted tab).
 *
 * Returns `null` when fewer than two groups are visible — the renderer then keeps «المالية»
 * a plain link instead of a one-child tree, which is the State-4 degradation: a receptionist
 * sees exactly what they saw before the workspace existed.
 */
export function workspaceGroupLinks(
	isVisible: (item: FinanceNavItem) => boolean,
	lastByGroup: Partial<Record<FinanceNavGroupKey, WorkspaceTarget>>,
	activeKey: FinanceNavGroupKey | null,
): WorkspaceGroupLink[] | null {
	const groups = visibleGroupsFor(isVisible);
	if (groups.length < 2) return null;
	return groups.flatMap((group) => {
		const target = landingFor(group, lastByGroup[group.key]);
		if (!target) return [];
		return [
			{
				key: group.key,
				titleKey: group.titleKey,
				url: target.url,
				search: target.search,
				isActive: group.key === activeKey,
			},
		];
	});
}

/** Deterministic tab-row split: first `max` tabs stay visible, the rest go to «المزيد». */
export function splitOverflow<T>(
	items: T[],
	max: number = MAX_VISIBLE_TABS,
): { visible: T[]; overflow: T[] } {
	if (items.length <= max) return { visible: items, overflow: [] };
	return { visible: items.slice(0, max), overflow: items.slice(max) };
}
