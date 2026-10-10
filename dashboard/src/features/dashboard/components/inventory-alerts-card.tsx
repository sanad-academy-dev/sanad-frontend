import { IconPill, IconPlus, IconRefresh } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";

import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BaseDashboardCard } from "@/features/dashboard/components/base-dashboard-card";
import { useInventoryAlerts } from "@/features/dashboard/hooks/use-inventory-alerts";
import type { DashboardCardProps } from "@/features/dashboard/types/dashboard-card.types";
import { useI18n } from "@/hooks/use-i18n";

const INVENTORY_ROUTE = "/management/inventory";

export function InventoryAlertsCard({ expanded, onToggleExpanded }: DashboardCardProps) {
	const { t } = useI18n();
	const navigate = useNavigate();
	const { alerts, isLoading, isError } = useInventoryAlerts();

	const goToInventory = () => navigate({ to: INVENTORY_ROUTE });

	return (
		<BaseDashboardCard
			cardId="card-8"
			expanded={expanded}
			onToggleExpanded={onToggleExpanded}
			headerAction={
				<button
					type="button"
					onClick={goToInventory}
					className="flex items-center gap-1 text-muted-foreground hover:text-foreground p-1 rounded-sm hover:bg-accent transition-colors"
					aria-label={t("dashboard.cards.inventoryAlerts.addProduct")}
				>
					<IconPlus
						className="size-4"
						stroke={1.5}
					/>
				</button>
			}
		>
			<CardContent className="pt-0 flex-1 overflow-y-auto px-3">
				{isLoading ? (
					<div className="flex flex-col gap-1.5">
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={i}
								className="flex items-center justify-between gap-3 border rounded-sm px-2 py-2"
							>
								<Skeleton className="h-5 w-20 rounded-sm" />
								<div className="flex items-center gap-2">
									<div className="flex flex-col gap-1 items-end">
										<Skeleton className="h-3 w-28" />
										<Skeleton className="h-2.5 w-36" />
									</div>
									<Skeleton className="size-6 rounded-sm shrink-0" />
								</div>
							</div>
						))}
					</div>
				) : isError ? (
					<div className="border rounded-md p-2.5 flex flex-col gap-1">
						<span className="font-bold text-xs">
							{t("dashboard.cards.inventoryAlerts.errorTitle")}
						</span>
						<span className="text-xs text-muted-foreground">
							{t("common.states.checkConnection")}
						</span>
					</div>
				) : alerts.length === 0 ? (
					<div className="border rounded-md p-2.5 flex flex-col gap-1">
						<span className="font-bold text-xs">
							{t("dashboard.cards.inventoryAlerts.emptyTitle")}
						</span>
						<span className="text-xs text-muted-foreground">
							{t("dashboard.cards.inventoryAlerts.emptyDescription")}
						</span>
					</div>
				) : (
					<div className="flex flex-col gap-1.5">
						{alerts.map((alert) => (
							<div
								key={alert.id}
								className="border rounded-sm px-2 py-2 flex items-center justify-between gap-2"
							>
								{/* Left: item name + stock info + icon button */}
								<div className="flex items-center gap-2 min-w-0">
									<button
										type="button"
										onClick={goToInventory}
										aria-label={t("dashboard.cards.inventoryAlerts.openProduct")}
										className="size-6 shrink-0 bg-muted/60 rounded-sm flex items-center justify-center hover:bg-accent transition-colors"
									>
										<IconPill className="size-3.5 text-muted-foreground" />
									</button>

									<div className="flex flex-col gap-1 min-w-0 text-start">
										<p className="text-xs font-medium leading-none truncate">{alert.name}</p>
										<p className="text-[11px] text-red-600 leading-none truncate">
											{t("dashboard.cards.inventoryAlerts.remaining")}: {alert.stock} ·{" "}
											{t("dashboard.cards.inventoryAlerts.reorderPoint")}: {alert.reorderPoint}
										</p>
									</div>
								</div>

								{/* Left: replenishment request button */}
								<button
									type="button"
									onClick={goToInventory}
									className="flex items-center gap-1 border rounded-sm px-1.5 py-0.5 text-[10px] font-medium hover:bg-accent transition-colors shrink-0"
								>
									<IconRefresh
										className="size-3"
										stroke={1.5}
									/>
									{t("dashboard.cards.inventoryAlerts.requestReplenishment")}
								</button>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</BaseDashboardCard>
	);
}
