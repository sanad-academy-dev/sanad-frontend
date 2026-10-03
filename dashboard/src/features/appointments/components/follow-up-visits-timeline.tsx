import { IconHourglass } from "@tabler/icons-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { STATUS_META } from "@/features/appointments/data/status-meta";
import { useFollowUpAppointments } from "@/features/appointments/hooks/use-follow-up-appointments";
import { minutesToTimeLabel } from "@/features/appointments/utils/time";
import { AppointmentStatus } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import type { FollowUpAppointmentResponse } from "@/server/appointments/appointments.type";

const UPCOMING_STATUSES: AppointmentStatus[] = [
	AppointmentStatus.SCHEDULED,
	AppointmentStatus.WAITING,
];

function initialsOf(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0] ?? "")
		.join("");
}

function FollowUpVisitCard({
	row,
	index,
}: {
	row: FollowUpAppointmentResponse;
	index: number;
}) {
	const { lang } = useI18n();
	const startsAt = new Date(row.startsAt);
	const startMinute = startsAt.getHours() * 60 + startsAt.getMinutes();
	const endMinute = startMinute + row.durationMinutes;
	const startLabel = minutesToTimeLabel(startMinute, lang);
	const endLabel = minutesToTimeLabel(endMinute % (24 * 60), lang);

	const monthLabel = new Intl.DateTimeFormat("ar-SA", { month: "long" }).format(startsAt);
	const dayLabel = new Intl.DateTimeFormat("ar-SA", { day: "2-digit" }).format(startsAt);

	const serviceName = row.services[0]?.service.name ?? row.reason ?? "زيارة";

	const isUpcoming = UPCOMING_STATUSES.includes(row.status) && startsAt.getTime() > Date.now();
	const statusMeta = STATUS_META[row.status];
	const StatusIcon = isUpcoming ? IconHourglass : statusMeta?.icon;
	const statusLabel = isUpcoming ? "قادم" : (statusMeta?.label ?? row.status);
	const statusClass = isUpcoming
		? "bg-sky-50 text-sky-600 border-sky-100"
		: cn("bg-muted/40 border-transparent", statusMeta?.color ?? "text-foreground");

	const initials = initialsOf(row.staff.name);

	return (
		<div className="flex items-stretch gap-4">
			<div className="flex w-12 shrink-0 flex-col items-center pt-1.5">
				<div className="text-xs text-muted-foreground">{monthLabel}</div>
				<div className="text-2xl font-semibold tabular-nums">{dayLabel}</div>
			</div>

			<div className="flex w-2 shrink-0 flex-col items-center">
				<div className="mt-3 size-2 rounded-full bg-muted-foreground/40" />
				<div className="w-px flex-1 bg-border" />
			</div>

			<div className="flex-1 pb-6">
				<div className="rounded-lg border bg-card">
					<div className="flex items-start justify-between gap-3 p-4">
						<div className="min-w-0">
							<h4 className="text-sm font-semibold">
								زيارة #{index + 1} - {serviceName}
							</h4>
							<p className="mt-1 text-xs text-muted-foreground">رقم الحجز: {row.code}</p>
						</div>
						<Badge
							variant="outline"
							className={cn("gap-1 rounded-full px-2.5 py-1", statusClass)}
						>
							{StatusIcon && <StatusIcon className="size-3.5" />}
							<span className="text-xs font-medium">{statusLabel}</span>
						</Badge>
					</div>

					<Separator />

					<div className="flex flex-col gap-2 p-4">
						<div className="text-sm">
							<span className="text-muted-foreground">التوقيت: </span>
							<span className="tabular-nums">
								{startLabel} - {endLabel}
							</span>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<span className="text-muted-foreground">المدرّب:</span>
							<Avatar className="size-5">
								<AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
									{initials}
								</AvatarFallback>
							</Avatar>
							<span className="font-medium">
								{row.staff.prefix ? `${row.staff.prefix} ` : ""}
								{row.staff.name}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function FollowUpVisitsTimeline({
	appointmentId,
	className,
}: {
	appointmentId: string | null;
	className?: string;
}) {
	const { followUps, isLoading } = useFollowUpAppointments(appointmentId);

	return (
		<div
			className={cn("flex flex-col gap-3", className)}
			dir="rtl"
		>
			<p className="font-semibold text-sm">زيارات المتابعة</p>

			{isLoading ? (
				<p className="text-xs text-muted-foreground">جارٍ التحميل...</p>
			) : followUps.length === 0 ? (
				<p className="text-xs text-muted-foreground">لا توجد زيارات متابعة</p>
			) : (
				<div className="flex flex-col">
					{followUps.map((row, idx) => (
						<FollowUpVisitCard
							key={row.id}
							row={row}
							index={idx}
						/>
					))}
				</div>
			)}
		</div>
	);
}
