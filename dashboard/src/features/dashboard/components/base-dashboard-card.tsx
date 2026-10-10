import {
	IconArrowsDiagonalMinimize2,
	IconArrowsMaximize,
	IconDots,
	IconEyeOff,
} from "@tabler/icons-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCardLabels } from "@/features/dashboard/data/card-labels";
import type { BaseDashboardCardProps } from "@/features/dashboard/types/dashboard.types";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export function BaseDashboardCard({
	cardId,
	expanded,
	onToggleExpanded,
	children,
	headerAction,
	tabs,
	icon,
	className,
}: BaseDashboardCardProps) {
	const { isRtl, t } = useI18n();
	const cardLabels = getCardLabels(t);

	return (
		<div
			data-slot="card"
			data-size="default"
			className={cn(
				"group/card flex h-full min-h-[250px] flex-col justify-between gap-4 overflow-hidden rounded-[4px] bg-card pt-0! pb-3 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
				expanded && "col-span-2",
				className,
			)}
		>
			<div
				data-slot="card-header"
				className={cn(
					"group/card-header @container/card-header flex h-12 max-h-12! shrink-0 items-center justify-between gap-3 rounded-t-xl border-b px-3 pb-0! space-y-0 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
					isRtl ? "flex-row-reverse" : "flex-row",
				)}
			>
				{/* Left side: dropdown + action button + expand toggle */}
				<div className="flex items-center gap-0.5 shrink-0">
					{headerAction}

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="flex items-center gap-1 text-muted-foreground hover:text-foreground p-1 rounded-sm hover:bg-accent transition-colors text-xs"
								aria-label={t("common.actions.moreOptions")}
							>
								<IconDots
									className="size-4"
									stroke={1.5}
								/>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							className="min-w-36"
						>
							<DropdownMenuItem
								className={cn(
									"text-xs",
									isRtl ? "flex-row-reverse text-end" : "flex-row text-start",
								)}
								onSelect={() => {
									if (expanded) onToggleExpanded();
								}}
							>
								<IconArrowsDiagonalMinimize2
									className="size-4"
									stroke={1.5}
								/>
								<span>{t("common.actions.halfWidth")}</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								className={cn(
									"text-xs",
									isRtl ? "flex-row-reverse text-end" : "flex-row text-start",
								)}
								onSelect={() => {
									if (!expanded) onToggleExpanded();
								}}
							>
								<IconArrowsMaximize
									className="size-4"
									stroke={1.5}
								/>
								<span>{t("common.actions.fullWidth")}</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								className={cn(
									"text-xs text-destructive focus:text-destructive focus:bg-destructive/10",
									isRtl ? "flex-row-reverse text-end" : "flex-row text-start",
								)}
							>
								<IconEyeOff
									className="size-4"
									stroke={1.5}
								/>
								<span>{t("common.actions.hide")}</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Right side: title + optional icon + optional tabs */}
				<div className="flex items-center gap-2 min-w-0">
					<div
						data-slot="card-title"
						className="font-heading text-sm leading-snug font-medium shrink-0"
					>
						{cardLabels[cardId]}
					</div>
					{icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
					{tabs && <div className="flex items-center">{tabs}</div>}
				</div>
			</div>

			{children}
		</div>
	);
}
