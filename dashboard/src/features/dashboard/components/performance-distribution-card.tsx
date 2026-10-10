"use client";

import {
	IconArrowsDiagonal,
	IconArrowsDiagonalMinimize2,
	IconDots,
	IconEyeOff,
} from "@tabler/icons-react";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPieDonut } from "@/components/ui/chart-pie-donut";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCardLabels } from "@/features/dashboard/data/card-labels";
import { usePerformanceDistribution } from "@/features/dashboard/hooks/use-performance-distribution";
import type { PerformanceDistributionPanelProps } from "@/features/dashboard/types/dashboard.types";
import type { DashboardCardProps } from "@/features/dashboard/types/dashboard-card.types";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

function PerformanceDistributionPanel({
	data,
	expanded,
	isArabic,
	centerLabel,
}: PerformanceDistributionPanelProps) {
	return (
		<div
			className={cn(
				"flex flex-col gap-6",
				expanded
					? isArabic
						? "xl:flex-row"
						: "xl:flex-row-reverse"
					: isArabic
						? "md:flex-row"
						: "md:flex-row-reverse",
				"md:items-center",
			)}
		>
			<div className="flex justify-center md:w-[220px] md:shrink-0">
				<div className="w-full p-3">
					<ChartPieDonut
						data={data}
						centerValue="100%"
						centerLabel={centerLabel}
						className={expanded ? "h-64 max-w-none" : "h-56 max-w-none"}
					/>
				</div>
			</div>

			<div className={cn("flex-1 space-y-4", isArabic ? "text-end" : "text-start")}>
				{data.map((item) => (
					<div
						key={item.key}
						className="space-y-2"
					>
						<div className="flex items-center justify-between gap-3">
							<div className="flex items-center gap-2">
								<span
									className="size-2.5 rounded-full"
									style={{ backgroundColor: item.fill }}
								/>
								<span className="font-medium text-foreground">{item.label}</span>
							</div>
							<span className="text-sm font-semibold tabular-nums text-muted-foreground">
								{item.value}%
							</span>
						</div>

						<div className="h-2.5 overflow-hidden rounded-full bg-muted/70">
							<div
								className="h-full rounded-full transition-[width]"
								style={{
									width: `${item.value}%`,
									backgroundColor: item.fill,
								}}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export function PerformanceDistributionCard({
	expanded,
	onToggleExpanded,
}: DashboardCardProps) {
	const { isRtl: isArabic, t } = useI18n();
	const cardLabels = getCardLabels(t);
	const { data: distributionData } = usePerformanceDistribution();

	return (
		<Tabs
			defaultValue="patients"
			className={cn("w-full", expanded && "col-span-2")}
		>
			<Card className="justify-between pt-0! h-full">
				<CardHeader className="gap-3 border-b pb-0! h-12! items-center flex">
					<div
						className={cn(
							"flex flex-wrap items-center gap-2 sm:gap-3",
							isArabic ? "justify-end text-end" : "justify-start",
						)}
					>
						<TabsList className="h-auto gap-1 rounded-full bg-transparent p-0">
							<TabsTrigger
								value="patients"
								className="rounded-[4px] h-4! text-[9px]! border-0 bg-transparent px-1.5 text-xs font-medium text-muted-foreground shadow-none hover:bg-muted/50 hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none"
							>
								{t("dashboard.cards.performanceDistribution.patients")}
							</TabsTrigger>
							<TabsTrigger
								value="services"
								className="rounded-[4px] border-0 h-4! text-[9px]! bg-transparent px-1.5 text-xs font-medium text-muted-foreground shadow-none hover:bg-muted/50 hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none"
							>
								{t("dashboard.cards.performanceDistribution.services")}
							</TabsTrigger>
						</TabsList>

						<CardTitle className="text-sm">{cardLabels["card-3"]}</CardTitle>
					</div>

					<CardAction
						className={cn("self-center", isArabic && "col-start-1 justify-self-start")}
					>
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
										isArabic ? "flex-row-reverse text-end" : "flex-row text-start",
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
										isArabic ? "flex-row-reverse text-end" : "flex-row text-start",
									)}
									onSelect={() => {
										if (!expanded) onToggleExpanded();
									}}
								>
									<IconArrowsDiagonal
										className="size-4"
										stroke={1.5}
									/>
									<span>{t("common.actions.fullWidth")}</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									className={cn(
										"text-xs text-destructive focus:text-destructive focus:bg-destructive/10",
										isArabic ? "flex-row-reverse text-end" : "flex-row text-start",
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
					</CardAction>
				</CardHeader>

				<CardContent className="flex flex-1 flex-col justify-center pt-0">
					<TabsContent
						value="patients"
						className="mt-0"
					>
						<PerformanceDistributionPanel
							data={distributionData.patients}
							expanded={expanded}
							isArabic={isArabic}
							centerLabel={t("dashboard.cards.performanceDistribution.total")}
						/>
					</TabsContent>
					<TabsContent
						value="services"
						className="mt-0"
					>
						<PerformanceDistributionPanel
							data={distributionData.services}
							expanded={expanded}
							isArabic={isArabic}
							centerLabel={t("dashboard.cards.performanceDistribution.total")}
						/>
					</TabsContent>
				</CardContent>
			</Card>
		</Tabs>
	);
}
