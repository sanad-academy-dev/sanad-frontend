import { IconChevronDown } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type * as React from "react";
import { useEffect, useState } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

/** A second-level destination under an expandable entry ([NAV-3]). */
export type NavSectionSubItem = {
	title: string;
	url: string;
	search?: Record<string, string>;
	isActive?: boolean;
};

type NavSectionItem = {
	title: string;
	url: string;
	/** optional search params (e.g. the «المالية» entry deep-links a remembered `?tab=`) */
	search?: Record<string, string>;
	icon: React.ReactNode;
	isActive?: boolean;
	badge?: string | number;
	/**
	 * [NAV-3] Expandable entry: when present (2+), the row stops being a link and becomes an
	 * expand toggle whose children are the real destinations — the app's first sidebar
	 * sub-menu. One sub-item is deliberately NOT a sub-menu: the caller collapses it to a
	 * plain link so a narrow user never sees a one-child tree.
	 */
	subItems?: NavSectionSubItem[];
};

type NavSection = {
	title?: string;
	items: NavSectionItem[];
};

/** The one place the sidebar's row token language lives, so parent and child rows match. */
const ITEM_CLASS =
	"h-7 rounded-[4px] px-2.5 text-[11px] font-semibold data-[active=true]:bg-primary/10 data-[active=true]:text-primary hover:data-[active=true]:bg-primary/10";

/**
 * Sub-rows need the size forced. `SidebarMenuSubButton` ships `data-[size=md]:text-sm` and
 * defaults to `size="md"` — a data-attribute variant outranks a plain `text-[11px]`, so the
 * shared class silently lost and children rendered 14px against the parent's 11px.
 */
const SUB_ITEM_CLASS = `${ITEM_CLASS} text-[11px]!`;

/**
 * [NAV-3] An entry that owns a sub-menu. The parent row toggles open/closed and never
 * navigates — its children are the destinations. It auto-opens whenever a child is active
 * (deep link, refresh, or a redirect into the area) and can then still be collapsed by hand.
 *
 * Active treatment is deliberately asymmetric: the active CHILD takes the filled
 * `primary/10` pill, while the parent only tints its text. Filling both would put two solid
 * blocks in one column and read as two separate selections.
 */
function NavSectionExpandableItem({ item }: { item: NavSectionItem }) {
	const hasActiveChild = !!item.subItems?.some((sub) => sub.isActive);
	const [open, setOpen] = useState(hasActiveChild);

	// re-open on navigation INTO the area; leaving it does not force a collapse, so a user
	// who opened the tree keeps it open while working elsewhere
	useEffect(() => {
		if (hasActiveChild) setOpen(true);
	}, [hasActiveChild]);

	return (
		<Collapsible
			asChild
			open={open}
			onOpenChange={setOpen}
		>
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton
						tooltip={item.title}
						className={cn(ITEM_CLASS, hasActiveChild && "text-primary")}
					>
						{item.icon}
						<span>{item.title}</span>
						{/* a down-chevron reads the same in both directions — no rtl flip */}
						<IconChevronDown
							className={cn(
								"ms-auto size-3.5 shrink-0 transition-transform duration-200",
								open && "rotate-180",
							)}
						/>
					</SidebarMenuButton>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<SidebarMenuSub>
						{item.subItems?.map((sub) => (
							<SidebarMenuSubItem key={sub.title}>
								<SidebarMenuSubButton
									asChild
									isActive={sub.isActive}
									className={SUB_ITEM_CLASS}
								>
									<Link
										to={sub.url}
										search={sub.search}
									>
										<span>{sub.title}</span>
									</Link>
								</SidebarMenuSubButton>
							</SidebarMenuSubItem>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	);
}

export function NavSections({
	sections,
	className,
}: {
	sections: NavSection[];
	className?: string;
}) {
	return (
		<div className={cn("flex flex-col", className)}>
			{sections.map((section, sectionIndex) => (
				<SidebarGroup
					key={section.title ?? `section-${sectionIndex}`}
					className="px-3 py-1"
				>
					{section.title ? (
						<SidebarGroupLabel className="mb-2 px-4 text-sm font-semibold text-sidebar-foreground/45">
							{section.title}
						</SidebarGroupLabel>
					) : null}
					<SidebarGroupContent>
						<SidebarMenu className="gap-1">
							{section.items.map((item) =>
								item.subItems ? (
									<NavSectionExpandableItem
										key={item.title}
										item={item}
									/>
								) : (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											tooltip={item.title}
											isActive={item.isActive}
											className={ITEM_CLASS}
										>
											<Link
												to={item.url}
												search={item.search}
											>
												{item.icon}
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>

										{item.badge ? (
											<SidebarMenuBadge className="inset-e-3 size-4! min-w-4! rounded-full bg-primary/10 text-[10px] font-bold text-primary">
												{item.badge}
											</SidebarMenuBadge>
										) : null}
									</SidebarMenuItem>
								),
							)}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			))}
		</div>
	);
}
