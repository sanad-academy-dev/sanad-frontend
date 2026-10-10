import { IconArrowsExchange } from "@tabler/icons-react";

import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BaseDashboardCard } from "@/features/dashboard/components/base-dashboard-card";
import { useCriticalAlerts } from "@/features/dashboard/hooks/use-critical-alerts";
import type { DashboardCardProps } from "@/features/dashboard/types/dashboard-card.types";
import { getAnimalIcon } from "@/features/services/owners/utils/animal-icon";
import { useI18n } from "@/hooks/use-i18n";
import { getDateFormatter } from "@/lib/locale-format";

export function CriticalAlertsCard({ expanded, onToggleExpanded }: DashboardCardProps) {
	const { lang, t } = useI18n();
	const { alerts, isLoading, isError } = useCriticalAlerts();

	const timeFormatter = getDateFormatter(lang, {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<BaseDashboardCard
			cardId="card-7"
			expanded={expanded}
			onToggleExpanded={onToggleExpanded}
		>
			<CardContent className="pt-0 flex-1 overflow-y-auto px-3">
				{isLoading ? (
					<div className="flex flex-col gap-1.5">
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={i}
								className="flex items-center justify-between gap-3 border rounded-sm px-2 py-2"
							>
								<div className="flex items-center gap-2 flex-1">
									<Skeleton className="size-6 rounded-sm shrink-0" />
									<div className="flex flex-col gap-1 flex-1">
										<Skeleton className="h-3 w-24" />
										<Skeleton className="h-2.5 w-40" />
									</div>
								</div>
								<Skeleton className="h-6 w-20 rounded-sm" />
							</div>
						))}
					</div>
				) : isError ? (
					<div className="border rounded-md p-2.5 flex flex-col gap-1">
						<span className="font-bold text-xs">
							{t("dashboard.cards.criticalAlerts.errorTitle")}
						</span>
						<span className="text-xs text-muted-foreground">
							{t("common.states.checkConnection")}
						</span>
					</div>
				) : alerts.length === 0 ? (
					<div className="border rounded-md p-2.5 flex flex-col gap-1">
						<span className="font-bold text-xs">
							{t("dashboard.cards.criticalAlerts.emptyTitle")}
						</span>
						<span className="text-xs text-muted-foreground">
							{t("dashboard.cards.criticalAlerts.emptyDescription")}
						</span>
					</div>
				) : (
					<div className="flex flex-col gap-1.5">
						{alerts.map((alert) => {
							const AnimalIcon = getAnimalIcon(alert.patient?.animalType?.enName ?? null);

							return (
								<div
									key={alert.id}
									className="border rounded-sm px-2 py-2 flex items-center justify-between gap-2"
								>
									{/* Right: icon + patient name + alert text */}
									<div className="flex items-center gap-2 min-w-0">
										<div className="size-6 shrink-0 bg-muted/60 rounded-sm flex items-center justify-center">
											<AnimalIcon className="size-3.5 text-muted-foreground" />
										</div>
										<div className="flex flex-col gap-1 min-w-0 text-start">
											<p className="text-xs font-medium leading-none truncate">
												{alert.patient?.name ?? "—"}
											</p>
											<p className="text-[11px] text-red-600 leading-none truncate">
												{alert.reason
													? `${alert.reason} • ${timeFormatter.format(new Date(alert.startsAt))}`
													: timeFormatter.format(new Date(alert.startsAt))}
											</p>
										</div>
									</div>

									{/* Left: action button */}
									<button
										type="button"
										className="flex items-center gap-1 border rounded-sm px-1.5 py-0.5 text-[10px] font-medium hover:bg-accent transition-colors shrink-0"
									>
										<IconArrowsExchange
											className="size-3"
											stroke={1.5}
										/>
										{t("dashboard.cards.criticalAlerts.hospitalize")}
									</button>
								</div>
							);
						})}
					</div>
				)}
			</CardContent>
		</BaseDashboardCard>
	);
}
