import { IconClock, IconPlus } from "@tabler/icons-react";
import { useState } from "react";

import { CalendarBackdrop } from "@/components/common/calendar-backdrop";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AddAppointmentModal } from "@/features/appointments/components/add-appointment-modal";
import { AppointmentSheet } from "@/features/appointments/components/appointment-sheet";
import { useSelectedAppointmentStore } from "@/features/appointments/stores/selected-appointment.store";
import { mapDashboardAppointmentToCard } from "@/features/appointments/utils/map-appointment-card";
import { BaseDashboardCard } from "@/features/dashboard/components/base-dashboard-card";
import {
	type DashboardDateRange,
	DashboardDateRangeFilter,
} from "@/features/dashboard/components/dashboard-date-range-filter";
import { useAppointments } from "@/features/dashboard/hooks/use-appointments";
import type { DashboardCardProps } from "@/features/dashboard/types/dashboard-card.types";
import { getAnimalIcon } from "@/features/services/owners/utils/animal-icon";
import type { AppointmentStatus } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import { getDateFormatter } from "@/lib/locale-format";
import { cn } from "@/lib/utils";
import type { DashboardAppointmentResponse } from "@/server/appointments/appointments.type";

type FilterTab = "all" | "queue" | "late" | "done";

const FILTER_TABS: FilterTab[] = ["all", "queue", "late", "done"];

// نمط شارات الحالة مأخوذ من بطاقة "الجلسات القادمة" (شارات مستديرة ملوّنة)
const STATUS_CLASS_NAMES: Record<AppointmentStatus, string> = {
	SCHEDULED: "bg-primary/10 text-primary",
	WAITING: "bg-muted/60 text-muted-foreground",
	CHECK_IN: "bg-muted/60 text-muted-foreground",
	IN_SERVICE: "bg-orange-500/10 text-orange-500",
	HOSPITALIZED: "bg-red-500/10 text-red-500",
	AWAITING_PAYMENT: "bg-amber-500/10 text-amber-600",
	DONE: "bg-green-500/10 text-green-600",
	CANCELLED: "bg-destructive/10 text-destructive",
};

function isLate(appt: DashboardAppointmentResponse): boolean {
	return appt.status === "SCHEDULED" && new Date(appt.startsAt) < new Date();
}

function isQueue(appt: DashboardAppointmentResponse): boolean {
	return appt.status === "WAITING" || appt.status === "CHECK_IN";
}

function matchesFilter(appt: DashboardAppointmentResponse, filter: FilterTab): boolean {
	if (filter === "all") return true;
	if (filter === "queue") return isQueue(appt);
	if (filter === "late") return isLate(appt);
	if (filter === "done") return appt.status === "DONE";
	return true;
}

export function AppointmentsCard({ expanded, onToggleExpanded }: DashboardCardProps) {
	const { lang, t } = useI18n();
	const [dateRange, setDateRange] = useState<DashboardDateRange>({
		mode: "day",
		date: new Date(),
	});
	const { appointments, isLoading, isError } = useAppointments(dateRange);
	const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

	// فتح لوحة الزيارة عند النقر على صف — نفس متجر الكانبان في صفحة الجلسات
	const selectedCard = useSelectedAppointmentStore((s) => s.selected);
	const selectCard = useSelectedAppointmentStore((s) => s.select);
	const closeSelected = useSelectedAppointmentStore((s) => s.close);

	const timeFormatter = getDateFormatter(lang, { hour: "2-digit", minute: "2-digit" });
	const dayFormatter = getDateFormatter(lang, { day: "2-digit" });
	const weekdayFormatter = getDateFormatter(lang, { weekday: "short" });

	const filtered = appointments.filter((a) => matchesFilter(a, activeFilter));

	// رأس البطاقة: تبويبات التصفية من "جلساتي"
	const tabs = (
		<div className="flex items-center gap-0.5">
			{FILTER_TABS.map((tab) => (
				<button
					key={tab}
					type="button"
					onClick={() => setActiveFilter(tab)}
					className={cn(
						"rounded-sm px-1.5 py-0.5 text-[10px] font-medium transition-colors",
						activeFilter === tab
							? "bg-foreground/8 text-foreground"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					{t(`dashboard.cards.appointments.filters.${tab}`)}
				</button>
			))}
		</div>
	);

	return (
		<>
			<BaseDashboardCard
				cardId="card-5"
				expanded={expanded}
				onToggleExpanded={onToggleExpanded}
				className="justify-start"
				tabs={tabs}
				headerAction={
					<div className="flex items-center gap-0.5">
						<AddAppointmentModal
							trigger={
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="size-8"
									aria-label={t("dashboard.cards.appointments.addNew")}
								>
									<IconPlus className="size-4" />
								</Button>
							}
						/>
						<DashboardDateRangeFilter
							value={dateRange}
							onChange={setDateRange}
						/>
					</div>
				}
			>
				<CardContent className="max-h-70 flex-1 overflow-y-auto px-3 pt-0">
					{isLoading ? (
						<div className="flex flex-col gap-1.5">
							{Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className="flex items-center gap-3 rounded-sm border px-2 py-2"
								>
									<Skeleton className="size-9 shrink-0 rounded-sm" />
									<div className="flex flex-1 flex-col gap-1">
										<Skeleton className="h-3 w-28" />
										<Skeleton className="h-2.5 w-20" />
									</div>
									<Skeleton className="h-5 w-16 rounded-full" />
								</div>
							))}
						</div>
					) : isError ? (
						<div className="flex flex-col gap-1 rounded-md border p-2.5">
							<span className="text-xs font-bold">
								{t("dashboard.cards.appointments.errorTitle")}
							</span>
							<span className="text-xs text-muted-foreground">
								{t("common.states.checkConnection")}
							</span>
						</div>
					) : filtered.length === 0 ? (
						<div className="flex items-center justify-between rounded-md border p-2.5">
							<p className="flex flex-col gap-1">
								<span className="font-bold">
									{t("dashboard.cards.appointments.emptyTitle")}
								</span>
								<span className="text-sm text-muted-foreground">
									{t("dashboard.cards.appointments.emptyDescription")}
								</span>
							</p>
							<AddAppointmentModal
								trigger={
									<Button>
										<IconPlus className="size-4" />
										<span>{t("dashboard.cards.appointments.addNew")}</span>
									</Button>
								}
							/>
						</div>
					) : (
						<div className="flex flex-col gap-1.5">
							{filtered.map((appt) => {
								const start = new Date(appt.startsAt);
								const end = new Date(start.getTime() + appt.durationMinutes * 60 * 1000);
								const serviceName = appt.services[0]?.service.name;
								const AnimalIcon = getAnimalIcon(appt.patient?.animalType?.enName ?? null);
								const late = isLate(appt);
								const statusLabel = late
									? t("dashboard.cards.appointments.status.late")
									: t(`dashboard.cards.appointments.status.${appt.status}`);
								const statusClass = late
									? "bg-red-500/10 text-red-500"
									: STATUS_CLASS_NAMES[appt.status];

								return (
									<button
										key={appt.id}
										type="button"
										onClick={() => selectCard(mapDashboardAppointmentToCard(appt))}
										className="flex w-full items-center gap-2.5 rounded-sm border px-2 py-1 text-start transition-colors hover:bg-accent"
									>
										{/* Date block — calendar icon background with the day overlaid */}
										<div className="relative flex size-14 shrink-0 flex-col items-center justify-center leading-none">
											<CalendarBackdrop className="absolute inset-0 text-muted-foreground/40" />
											<span className="relative mt-2.5 text-[15px] font-bold tabular-nums text-foreground">
												{dayFormatter.format(start)}
											</span>
											<span className="relative text-[9px] uppercase text-muted-foreground">
												{weekdayFormatter.format(start)}
											</span>
										</div>

										{/* Patient · owner · service (top) + time (bottom, starts from the right) */}
										<div className="flex min-w-0 flex-1 flex-col gap-1 text-start">
											<p className="flex items-center gap-1.5 truncate text-xs font-medium leading-none">
												<AnimalIcon className="size-3 shrink-0 text-muted-foreground" />
												<span className="truncate">
													{[appt.patient?.name, appt.owner?.name, serviceName]
														.filter(Boolean)
														.join(" · ") || "—"}
												</span>
											</p>
											<p className="flex items-center gap-1 text-[11px] leading-none text-muted-foreground tabular-nums">
												<IconClock
													className="size-3 shrink-0"
													stroke={1.5}
												/>
												<span dir="ltr">
													{timeFormatter.format(start)} → {timeFormatter.format(end)}
												</span>
												<span>
													({appt.durationMinutes}
													{t("dashboard.cards.upcomingAppointments.minShort")})
												</span>
											</p>
										</div>

										{/* Status */}
										<span
											className={cn(
												"inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
												statusClass,
											)}
										>
											{statusLabel}
										</span>
									</button>
								);
							})}
						</div>
					)}
				</CardContent>
			</BaseDashboardCard>

			<AppointmentSheet
				card={selectedCard}
				open={!!selectedCard}
				onClose={closeSelected}
			/>
		</>
	);
}
