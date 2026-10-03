import { IconChevronDown } from "@tabler/icons-react";
import { useLocation, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FinanceNavItem } from "@/features/finance/navigation/finance-nav";
import {
	activeGroupKeyOf,
	isItemActive,
	splitOverflow,
	visibleGroupsFor,
} from "@/features/finance/navigation/finance-workspace";
import { useFinanceWorkspaceStore } from "@/features/finance/navigation/finance-workspace.store";
import { useI18n } from "@/hooks/use-i18n";
import { usePermissions } from "@/hooks/use-permissions";
import { cn } from "@/lib/utils";
import { accountingPermission } from "@sanad/contracts/accounting/permissions";

/**
 * [NAV-3] The «المالية» workspace header — ONE row: the active group's screen tabs, in the
 * app's original finance pill treatment (`finance-header.tsx`), portaled into
 * `#page-header-slot` beside the breadcrumb.
 *
 * **The sidebar owns the groups; this header owns only the tabs** (contract §10). NAV-2's
 * Level-1 segmented control is SUPERSEDED and deleted: two levels of chrome in the header
 * crowded the bar and left the workspace map invisible from the sidebar.
 *
 * At most {@link MAX_VISIBLE_TABS} tabs render; the rest collapse into a «المزيد ▾» pill
 * that adopts the active treatment (and names the tab) when the active tab lives inside it.
 *
 * URLs are unchanged: the header only NAVIGATES; active states derive from the route, so
 * deep links light up the right tab with no extra state. The persisted workspace store
 * still records the last destination per group — the SIDEBAR now consumes it for landing.
 */

/* ── presentational view (mockable — the RTL screenshot pass renders this directly) ───── */

export type WorkspaceHeaderTab = {
	key: string;
	label: string;
	active: boolean;
	onSelect: () => void;
};

export type WorkspaceHeaderViewProps = {
	dir: "rtl" | "ltr";
	/** the active group's tabs, pre-split by `splitOverflow` */
	tabs: WorkspaceHeaderTab[];
	overflow: WorkspaceHeaderTab[];
	moreLabel: string;
};

/** The exact legacy pill classes (`finance-header.tsx`) — the tab row IS that pattern. */
const pillClass = (active: boolean) =>
	cn(
		"flex h-[25px] items-center justify-center rounded-[4px] px-[14px] text-[11px] font-medium leading-[16px]",
		active ? "border-[0.75px] border-[#E5E7EB] bg-[#F9FAFB] text-[#1F2937]" : "text-[#6B7280]",
	);

export function FinanceWorkspaceHeaderView({
	dir,
	tabs,
	overflow,
	moreLabel,
}: WorkspaceHeaderViewProps) {
	const activeOverflow = overflow.find((tab) => tab.active);

	return (
		<div
			className="flex items-center gap-[12px]"
			dir={dir}
		>
			<span className="h-[18px] w-px bg-[#E5E7EB]" />

			{/* the ONE row: legacy pill tabs, capped + «المزيد» overflow */}
			{tabs.length > 0 && (
				<nav className="flex items-center gap-[3.49px]">
					{tabs.map((tab) => (
						<button
							key={tab.key}
							type="button"
							onClick={tab.onSelect}
							className={pillClass(tab.active)}
						>
							{tab.label}
						</button>
					))}
					{overflow.length > 0 && (
						<DropdownMenu dir={dir}>
							<DropdownMenuTrigger asChild>
								<button
									type="button"
									className={cn(pillClass(!!activeOverflow), "gap-1")}
								>
									{activeOverflow ? `${moreLabel}: ${activeOverflow.label}` : moreLabel}
									<IconChevronDown className="size-3" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								{overflow.map((tab) => (
									<DropdownMenuItem
										key={tab.key}
										onSelect={tab.onSelect}
										className={cn("text-[11px]", tab.active && "bg-[#F9FAFB] font-semibold")}
									>
										{tab.label}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</nav>
			)}
		</div>
	);
}

/* ── connected header (portals the view into the page header slot) ────────────────────── */

export function FinanceWorkspaceHeader() {
	const { t, isRtl } = useI18n();
	const { pathname } = useLocation();
	const search = useSearch({ strict: false }) as { tab?: string };
	const navigate = useNavigate();
	const { hasPermission, canView } = usePermissions();
	const [slot, setSlot] = useState<HTMLElement | null>(null);

	const remember = useFinanceWorkspaceStore((s) => s.remember);

	useEffect(() => {
		setSlot(document.getElementById("page-header-slot"));
	}, []);

	// same gates as before — accounting items on doctype read, legacy on canView,
	// and [LY-P0]'s direct front-office permission on hasPermission
	const isVisible = (item: FinanceNavItem) => {
		if (item.gate.kind === "accounting")
			return hasPermission(accountingPermission(item.gate.doctype, "read"));
		if (item.gate.kind === "permission") return hasPermission(item.gate.permission);
		return canView(item.gate.resource);
	};

	const groups = visibleGroupsFor(isVisible);
	const activeKey = activeGroupKeyOf(pathname, search.tab);

	// landing memory: record where the user is while inside the workspace
	useEffect(() => {
		if (!activeKey) return;
		remember(activeKey, {
			url: pathname,
			search: search.tab ? { tab: search.tab } : undefined,
		});
	}, [activeKey, pathname, search.tab, remember]);

	if (!slot) return null;

	const activeGroup = groups.find((group) => group.key === activeKey);
	const { visible, overflow } = splitOverflow(activeGroup?.items ?? []);

	const goTo = (item: FinanceNavItem) =>
		navigate({ to: item.url, search: item.search as never });

	const toTab = (item: FinanceNavItem): WorkspaceHeaderTab => ({
		key: item.titleKey,
		label: t(item.titleKey),
		active: isItemActive(item, pathname, search.tab),
		onSelect: () => goTo(item),
	});

	return createPortal(
		<FinanceWorkspaceHeaderView
			dir={isRtl ? "rtl" : "ltr"}
			tabs={visible.map(toTab)}
			overflow={overflow.map(toTab)}
			moreLabel={t("finance.nav.more")}
		/>,
		slot,
	);
}
