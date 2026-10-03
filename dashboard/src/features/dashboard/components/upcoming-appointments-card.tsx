import { IconChevronLeft, IconClock } from "@tabler/icons-react";
import type { SVGProps } from "react";

import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BaseDashboardCard } from "@/features/dashboard/components/base-dashboard-card";
import { useUpcomingAppointments } from "@/features/dashboard/hooks/use-upcoming-appointments";
import type { DashboardCardProps } from "@/features/dashboard/types/dashboard-card.types";
import { getAnimalIcon } from "@/features/services/owners/utils/animal-icon";
import type { AppointmentStatus } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import { getDateFormatter } from "@/lib/locale-format";
import { cn } from "@/lib/utils";

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

export function UpcomingAppointmentsCard({ expanded, onToggleExpanded }: DashboardCardProps) {
	const { lang, t } = useI18n();
	const { appointments, isLoading, isError } = useUpcomingAppointments();

	const timeFormatter = getDateFormatter(lang, { hour: "2-digit", minute: "2-digit" });
	const dayFormatter = getDateFormatter(lang, { day: "2-digit" });
	const weekdayFormatter = getDateFormatter(lang, { weekday: "short" });

	return (
		<BaseDashboardCard
			cardId="card-10"
			expanded={expanded}
			onToggleExpanded={onToggleExpanded}
		>
			<CardContent className="pt-0 flex-1 overflow-y-auto px-3">
				{isLoading ? (
					<div className="flex flex-col gap-1.5">
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className="flex items-center gap-3 border rounded-sm px-2 py-2"
							>
								<Skeleton className="size-9 rounded-sm shrink-0" />
								<div className="flex flex-col gap-1 flex-1">
									<Skeleton className="h-3 w-28" />
									<Skeleton className="h-2.5 w-20" />
								</div>
								<Skeleton className="h-5 w-16 rounded-full" />
							</div>
						))}
					</div>
				) : isError ? (
					<div className="border rounded-md p-2.5 flex flex-col gap-1">
						<span className="font-bold text-xs">
							{t("dashboard.cards.upcomingAppointments.errorTitle")}
						</span>
						<span className="text-xs text-muted-foreground">
							{t("common.states.checkConnection")}
						</span>
					</div>
				) : appointments.length === 0 ? (
					<div className="border rounded-md p-2.5 flex flex-col gap-1">
						<span className="font-bold text-xs">
							{t("dashboard.cards.upcomingAppointments.emptyTitle")}
						</span>
						<span className="text-xs text-muted-foreground">
							{t("dashboard.cards.upcomingAppointments.emptyDescription")}
						</span>
					</div>
				) : (
					<div className="flex flex-col gap-1.5">
						{appointments.map((appt) => {
							const start = new Date(appt.startsAt);
							const end = new Date(start.getTime() + appt.durationMinutes * 60 * 1000);
							const serviceName = appt.services[0]?.service.name;
							const AnimalIcon = getAnimalIcon(appt.patient?.animalType?.enName ?? null);

							return (
								<div
									key={appt.id}
									className="border rounded-sm px-2 py-1 flex items-center gap-2.5"
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

									{/* Time + service */}
									<div className="flex flex-col gap-1 min-w-0 flex-1 text-start">
										<p className="flex items-center gap-1 text-xs font-medium leading-none tabular-nums">
											<IconClock
												className="size-3 text-muted-foreground shrink-0"
												stroke={1.5}
											/>
											<span dir="ltr">
												{timeFormatter.format(start)} → {timeFormatter.format(end)}
											</span>
											<span className="text-muted-foreground font-normal">
												({appt.durationMinutes}
												{t("dashboard.cards.upcomingAppointments.minShort")})
											</span>
										</p>
										<p className="flex items-center gap-1.5 text-[11px] text-muted-foreground leading-none truncate">
											<AnimalIcon className="size-3 shrink-0" />
											<span className="truncate">
												{[appt.patient?.name, serviceName].filter(Boolean).join(" · ") || "—"}
											</span>
										</p>
									</div>

									{/* Status */}
									<span
										className={cn(
											"inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0",
											STATUS_CLASS_NAMES[appt.status],
										)}
									>
										{t(`dashboard.cards.appointments.status.${appt.status}`)}
									</span>
								</div>
							);
						})}

						<button
							type="button"
							className="mt-1 flex items-center gap-1 self-start text-xs font-medium text-primary hover:underline"
						>
							{t("dashboard.cards.upcomingAppointments.viewMore")}
							<IconChevronLeft
								className="size-3.5 rtl:rotate-180"
								stroke={1.5}
							/>
						</button>
					</div>
				)}
			</CardContent>
		</BaseDashboardCard>
	);
}

// أيقونة تقويم فارغ تُستخدم كخلفية لكتلة التاريخ — تستخدم currentColor لتتبع الثيم.
function CalendarBackdrop(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			{...props}
		>
			<path
				d="M6.94028 2C7.35614 2 7.69326 2.32421 7.69326 2.72414V4.18487C8.36117 4.17241 9.10983 4.17241 9.95219 4.17241H13.9681C14.8104 4.17241 15.5591 4.17241 16.227 4.18487V2.72414C16.227 2.32421 16.5641 2 16.98 2C17.3958 2 17.733 2.32421 17.733 2.72414V4.24894C19.178 4.36022 20.1267 4.63333 20.8236 5.30359C21.5206 5.97385 21.8046 6.88616 21.9203 8.27586L22 9H2.92456H2V8.27586C2.11571 6.88616 2.3997 5.97385 3.09665 5.30359C3.79361 4.63333 4.74226 4.36022 6.1873 4.24894V2.72414C6.1873 2.32421 6.52442 2 6.94028 2Z"
				fill="currentColor"
			/>
			<path
				opacity="0.5"
				d="M21.9995 14.0001V12.0001C21.9995 11.161 21.9963 9.66527 21.9834 9H2.00917C1.99626 9.66527 1.99953 11.161 1.99953 12.0001V14.0001C1.99953 17.7713 1.99953 19.6569 3.1711 20.8285C4.34267 22.0001 6.22829 22.0001 9.99953 22.0001H13.9995C17.7708 22.0001 19.6564 22.0001 20.828 20.8285C21.9995 19.6569 21.9995 17.7713 21.9995 14.0001Z"
				fill="currentColor"
			/>
		</svg>
	);
}
