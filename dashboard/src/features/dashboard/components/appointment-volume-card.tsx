import { IconSparkles } from "@tabler/icons-react";
import { useState } from "react";

import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { BaseDashboardCard } from "@/features/dashboard/components/base-dashboard-card";
import {
	type DashboardDateRange,
	DashboardDateRangeFilter,
} from "@/features/dashboard/components/dashboard-date-range-filter";
import { useAppointmentVolume } from "@/features/dashboard/hooks/use-appointment-volume";
import type { DashboardCardProps } from "@/features/dashboard/types/dashboard-card.types";
import { useI18n } from "@/hooks/use-i18n";
import { getDateFormatter } from "@/lib/locale-format";
import { cn } from "@/lib/utils";
import type { DashboardBusyTime } from "@/server/dashboard/dashboard.type";

// نافذة الساعات المعروضة (9 صباحًا → 5 مساءً) لإبقاء الشبكة مقروءة.
const START_HOUR = 9;
const END_HOUR = 17;
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
const DAYS = [0, 1, 2, 3, 4, 5, 6];

// شدّة الخلفية تُشتق من --chart-2 (يتحكم بها ثيم التخصيص) بحسب نسبة العدّ إلى الأقصى.
// نمزج مع --muted بدل استخدام opacity على العنصر كي لا يبهت لون النص أيضًا.
function cellRatio(count: number, max: number) {
	return max === 0 ? 0 : count / max;
}

function cellStyle(count: number, max: number) {
	if (count === 0) return { backgroundColor: "var(--muted)" };
	const ratio = cellRatio(count, max);
	// نسبة تلوين من 18% (منخفض) إلى 100% (أقصى) لإبقاء الخانات المنخفضة مرئية.
	const pct = Math.round((0.18 + ratio * 0.82) * 100);
	return { backgroundColor: `color-mix(in oklab, var(--chart-2) ${pct}%, var(--muted))` };
}

// لون النص معاكس لشدّة الخلفية: أبيض على الخانات الداكنة (العالية)، وأزرق داكن على الفاتحة (المنخفضة).
function cellTextClass(count: number, max: number) {
	return cellRatio(count, max) >= 0.55 ? "text-white" : "text-[var(--chart-5)]";
}

export function AppointmentVolumeCard({ expanded, onToggleExpanded }: DashboardCardProps) {
	const { isRtl, lang, t } = useI18n();
	// كثافة الجلسات تُعرض أسبوعياً افتراضياً (شبكة اليوم×الساعة)
	const [dateRange, setDateRange] = useState<DashboardDateRange>({
		mode: "week",
		date: new Date(),
	});
	const { volume, isLoading, isError } = useAppointmentVolume(dateRange);

	const hourFormatter = getDateFormatter(lang, { hour: "numeric", hour12: true });

	const countAt = (day: number, hour: number) =>
		volume.cells.find((c) => c.day === day && c.hour === hour)?.count ?? 0;

	// نُنسّق "الساعة:اليوم" لتسمية أوقات الذروة.
	const formatSlot = (slot: DashboardBusyTime) => {
		const sample = new Date();
		sample.setHours(slot.hour, 0, 0, 0);
		return `${weekdayLong(slot.day)} · ${hourFormatter.format(sample)}`;
	};

	const weekdayLong = (day: number) => {
		const sample = new Date(2024, 0, 7 + day); // 2024-01-07 هو الأحد
		return getDateFormatter(lang, { weekday: "long" }).format(sample);
	};

	const hourLabel = (hour: number) => {
		const sample = new Date();
		sample.setHours(hour, 0, 0, 0);
		return hourFormatter.format(sample);
	};

	// محور الأيام يعرض الاسم الكامل لليوم (الأحد، الاثنين، …)
	const weekdayLabel = (day: number) => weekdayLong(day);

	return (
		<BaseDashboardCard
			cardId="card-9"
			expanded={expanded}
			onToggleExpanded={onToggleExpanded}
			headerAction={
				<div className="flex items-center gap-1.5">
					<button
						type="button"
						className="flex h-7 items-center gap-1.5 rounded-md bg-primary/10 px-2 text-[11px] font-medium text-primary transition-colors hover:bg-primary/15"
					>
						<IconSparkles
							className="size-3.5"
							stroke={1.5}
						/>
						{t("dashboard.aiShiftDistribution")}
					</button>
					<DashboardDateRangeFilter
						value={dateRange}
						onChange={setDateRange}
					/>
				</div>
			}
		>
			<CardContent className="pt-0 flex-1 overflow-y-auto px-3">
				{isLoading ? (
					<div className="flex flex-col gap-1.5">
						{Array.from({ length: HOURS.length }).map((_, i) => (
							<div
								key={i}
								className="flex items-center gap-1.5"
							>
								<Skeleton className="h-3 w-8 shrink-0" />
								<div className="flex flex-1 gap-1">
									{DAYS.map((d) => (
										<Skeleton
											key={d}
											className="h-5 flex-1 rounded-sm"
										/>
									))}
								</div>
							</div>
						))}
					</div>
				) : isError ? (
					<div className="border rounded-md p-2.5 flex flex-col gap-1">
						<span className="font-bold text-xs">
							{t("dashboard.cards.appointmentVolume.errorTitle")}
						</span>
						<span className="text-xs text-muted-foreground">
							{t("common.states.checkConnection")}
						</span>
					</div>
				) : (
					<TooltipProvider>
						<div className={cn("flex items-stretch gap-4", expanded && "md:gap-8")}>
							{/* Right column (DOM-first under RTL): heatmap grid + weekday axis */}
							<div className="flex-1 min-w-0">
								<div className="flex flex-col gap-1">
									{HOURS.map((hour) => (
										<div
											key={hour}
											className="flex items-center gap-1.5"
										>
											<span className="w-8 shrink-0 text-[10px] text-muted-foreground tabular-nums text-end">
												{hourLabel(hour)}
											</span>
											<div className="flex flex-1 gap-1">
												{DAYS.map((day) => {
													const count = countAt(day, hour);
													return (
														<Tooltip key={day}>
															<TooltipTrigger asChild>
																<div
																	className={cn(
																		"flex h-8 flex-1 items-center justify-center rounded-sm text-[14px] font-medium",
																		cellTextClass(count, volume.max),
																	)}
																	style={cellStyle(count, volume.max)}
																>
																	{count > 0 ? count : ""}
																</div>
															</TooltipTrigger>
															<TooltipContent
																className="flex flex-col items-stretch gap-1 px-2.5 py-1.5 text-start"
																sideOffset={6}
															>
																<span className="flex items-center gap-1.5 text-[11px] font-medium">
																	<span
																		className="size-2 shrink-0 rounded-xs ring-1 ring-background/40"
																		style={cellStyle(count, volume.max)}
																	/>
																	{weekdayLong(day)} · {hourLabel(hour)}
																</span>
																<span className="text-[11px] tabular-nums text-background/70">
																	{t("dashboard.cards.appointmentVolume.appointmentsCount", {
																		count,
																	})}
																</span>
															</TooltipContent>
														</Tooltip>
													);
												})}
											</div>
										</div>
									))}

									{/* Weekday axis */}
									<div className="mt-0.5 flex items-center gap-1.5">
										<span className="w-8 shrink-0" />
										<div className="flex flex-1 gap-1">
											{DAYS.map((day) => (
												<span
													key={day}
													title={weekdayLabel(day)}
													className="flex-1 truncate px-0.5 text-center text-[9px] text-muted-foreground"
												>
													{weekdayLabel(day)}
												</span>
											))}
										</div>
									</div>
								</div>
							</div>

							{/* Left column: busy times on top, heat/color-key line below */}
							<div className="flex shrink-0 flex-col justify-between gap-4 md:w-64 text-start">
								{/* Busy times — 2×2 grid */}
								{volume.busiest.length > 0 && (
									<div className="space-y-2">
										<p className="text-xs font-medium">
											{t("dashboard.cards.appointmentVolume.busyTimes")}
										</p>
										<div className="grid grid-cols-2 gap-x-3 gap-y-2">
											{volume.busiest.map((slot) => (
												<div
													key={`${slot.day}-${slot.hour}`}
													className="space-y-0.5"
												>
													<p className="text-[11px] font-medium leading-none">
														{formatSlot(slot)}
													</p>
													<p className="text-[10px] text-muted-foreground leading-none">
														{t("dashboard.cards.appointmentVolume.appointmentsCount", {
															count: slot.count,
														})}
													</p>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Color key (heat line) */}
								<div className="space-y-1.5">
									<p className="text-xs font-medium">
										{t("dashboard.cards.appointmentVolume.colorKey")}
									</p>
									<div className="flex items-center gap-2">
										<span className="text-[10px] text-muted-foreground">0</span>
										<div
											className="h-1.5 flex-1 rounded-full"
											style={{
												background: `linear-gradient(to ${isRtl ? "left" : "right"}, var(--muted), var(--chart-2))`,
											}}
										/>
										<span className="text-[10px] text-muted-foreground tabular-nums">
											{volume.max}
										</span>
									</div>
								</div>
							</div>
						</div>
					</TooltipProvider>
				)}
			</CardContent>
		</BaseDashboardCard>
	);
}
