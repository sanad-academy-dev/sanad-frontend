import { IconInfoCircle } from "@tabler/icons-react";

import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BaseDashboardCard } from "@/features/dashboard/components/base-dashboard-card";
import { useAppointmentKpis } from "@/features/dashboard/hooks/use-appointment-kpis";
import type { DashboardCardProps } from "@/features/dashboard/types/dashboard-card.types";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import type { DashboardAppointmentKpi } from "@/server/dashboard/dashboard.type";

type KpiKey = "total" | "inProgress" | "completed" | "paid";

const KPI_KEYS: KpiKey[] = ["total", "inProgress", "completed", "paid"];

function KpiTile({ tileKey, kpi }: { tileKey: KpiKey; kpi: DashboardAppointmentKpi }) {
	const { t } = useI18n();
	const positive = (kpi.deltaPct ?? 0) >= 0;

	return (
		<div className="flex flex-col items-center gap-2 px-2 py-12 text-center">
			<p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
				{t(`dashboard.cards.appointmentKpis.${tileKey}.title`)}
				<Tooltip>
					<TooltipTrigger>
						<IconInfoCircle
							className="size-3 text-muted-foreground"
							stroke={1.5}
						/>
					</TooltipTrigger>
					<TooltipContent>
						<p>{t(`dashboard.cards.appointmentKpis.${tileKey}.tooltip`)}</p>
					</TooltipContent>
				</Tooltip>
			</p>

			<p className="text-3xl font-bold tabular-nums leading-none">{kpi.value}</p>

			<p className="flex items-center gap-1.5 text-[11px]">
				{kpi.deltaPct === null ? (
					<span className="text-muted-foreground">
						{t("dashboard.cards.appointmentKpis.noBaseline")}
					</span>
				) : (
					<>
						<span
							className={cn(
								"inline-flex items-center rounded-full px-1.5 py-0.5 font-medium tabular-nums",
								positive ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive",
							)}
							dir="ltr"
						>
							{positive ? "+" : ""}
							{kpi.deltaPct}%
						</span>
						<span className="text-muted-foreground">
							{t("dashboard.cards.appointmentKpis.vsYesterday")}
						</span>
					</>
				)}
			</p>
		</div>
	);
}

export function AppointmentKpisCard({ expanded, onToggleExpanded }: DashboardCardProps) {
	const { t } = useI18n();
	const { kpis, isLoading, isError } = useAppointmentKpis();

	return (
		<BaseDashboardCard
			cardId="card-12"
			expanded={expanded}
			onToggleExpanded={onToggleExpanded}
		>
			<CardContent className="pt-0 flex-1 overflow-y-auto px-3">
				{isLoading ? (
					<div className="grid grid-cols-2 gap-x-4 gap-y-6">
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className="flex flex-col items-center gap-2"
							>
								<Skeleton className="h-3 w-24" />
								<Skeleton className="h-8 w-14" />
								<Skeleton className="h-4 w-20 rounded-full" />
							</div>
						))}
					</div>
				) : isError || !kpis ? (
					<div className="border rounded-md p-2.5 flex flex-col gap-1">
						<span className="font-bold text-xs">
							{t("dashboard.cards.appointmentKpis.errorTitle")}
						</span>
						<span className="text-xs text-muted-foreground">
							{t("common.states.checkConnection")}
						</span>
					</div>
				) : (
					<div className="relative flex h-full items-center">
						<div
							className={cn(
								"grid w-full grid-cols-2 gap-x-4 gap-y-6",
								expanded && "md:grid-cols-4 md:gap-y-0",
							)}
						>
							{KPI_KEYS.map((key) => (
								<KpiTile
									key={key}
									tileKey={key}
									kpi={kpis[key]}
								/>
							))}
						</div>

						{/* خطوط فاصلة مقصوصة من الحواف — متمركزة هندسيًا فلا تتأثر بالاتجاه (RTL/LTR) */}
						{expanded ? (
							<>
								<span className="pointer-events-none absolute inset-y-4 left-1/4 w-px -translate-x-1/2 bg-border" />
								<span className="pointer-events-none absolute inset-y-4 left-1/2 w-px -translate-x-1/2 bg-border" />
								<span className="pointer-events-none absolute inset-y-4 left-3/4 w-px -translate-x-1/2 bg-border" />
							</>
						) : (
							<>
								<span className="pointer-events-none absolute inset-y-3 left-1/2 w-px -translate-x-1/2 bg-border" />
								<span className="pointer-events-none absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-border" />
							</>
						)}
					</div>
				)}
			</CardContent>
		</BaseDashboardCard>
	);
}
