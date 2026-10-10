import { IconHourglass, IconReceipt } from "@tabler/icons-react";

import { CalendarBackdrop } from "@/components/common/calendar-backdrop";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { minutesToTimeLabel } from "@/features/appointments/utils/time";
import { useEnrollment } from "@/features/finance/care-plans/hooks/use-enrollment";
import { useI18n } from "@/hooks/use-i18n";
import { getDateFormatter } from "@/lib/locale-format";
import { cn } from "@/lib/utils";
import type {
	CarePlanEnrollmentResponse,
	CarePlanEnrollmentVisitStatus,
} from "@/server/care-plans/care-plans.type";

const VISIT_STATUS_META: Record<
	CarePlanEnrollmentVisitStatus,
	{ label: string; className: string }
> = {
	PENDING: { label: "قادم", className: "bg-sky-50 text-sky-600 border-sky-100" },
	COMPLETED: {
		label: "مكتملة",
		className: "bg-emerald-50 text-emerald-700 border-emerald-100",
	},
	SKIPPED: { label: "متخطّاة", className: "bg-amber-50 text-amber-700 border-amber-100" },
};

function initialsOf(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0] ?? "")
		.join("");
}

type EnrollmentVisit = CarePlanEnrollmentResponse["visits"][number];

function EnrollmentVisitRow({ visit, index }: { visit: EnrollmentVisit; index: number }) {
	const { lang } = useI18n();
	const appointment = visit.appointment;
	const scheduled = new Date(appointment?.startsAt ?? visit.scheduledAt);

	const dayFormatter = getDateFormatter(lang, { day: "2-digit" });
	const weekdayFormatter = getDateFormatter(lang, { weekday: "short" });

	const startMinute = scheduled.getHours() * 60 + scheduled.getMinutes();
	const startLabel = minutesToTimeLabel(startMinute, lang);

	const meta = VISIT_STATUS_META[visit.status];
	const initials = appointment?.staff ? initialsOf(appointment.staff.name) : "";

	return (
		<div className="flex items-stretch gap-4">
			{/* كتلة التاريخ — أيقونة تقويم كخلفية مع اليوم واسم اليوم فوقها */}
			<div className="relative flex size-14 shrink-0 flex-col items-center justify-center leading-none">
				<CalendarBackdrop className="absolute inset-0 text-muted-foreground/40" />
				<span className="relative mt-2.5 text-[15px] font-bold tabular-nums text-foreground">
					{dayFormatter.format(scheduled)}
				</span>
				<span className="relative text-[9px] uppercase text-muted-foreground">
					{weekdayFormatter.format(scheduled)}
				</span>
			</div>

			<div className="flex-1 pb-6">
				<div className="rounded-lg border bg-card">
					<div className="flex items-start justify-between gap-3 p-4">
						<div className="min-w-0">
							<h4 className="text-sm font-semibold">
								زيارة #{index + 1} - {visit.serviceName}
							</h4>
							<p className="mt-1 text-xs text-muted-foreground">
								رقم الحجز: {appointment?.code ?? "—"}
							</p>
						</div>
						<Badge
							variant="outline"
							className={cn("gap-1 rounded-full px-2.5 py-1", meta.className)}
						>
							{visit.status === "PENDING" && <IconHourglass className="size-3.5" />}
							<span className="text-xs font-medium">{meta.label}</span>
						</Badge>
					</div>

					<Separator />

					<div className="flex flex-col gap-2 p-4">
						<div className="text-sm">
							<span className="text-muted-foreground">التوقيت: </span>
							<span className="tabular-nums">{startLabel}</span>
						</div>

						{appointment?.staff && (
							<div className="flex items-center gap-2 text-sm">
								<span className="text-muted-foreground">المدرّب:</span>
								<Avatar className="size-5">
									<AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
										{initials}
									</AvatarFallback>
								</Avatar>
								<span className="font-medium">
									{appointment.staff.prefix ? `${appointment.staff.prefix} ` : ""}
									{appointment.staff.name}
								</span>
							</div>
						)}

						{appointment?.invoice && (
							<div className="flex items-center gap-1.5">
								<Badge
									variant="outline"
									className={cn(
										"gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium",
										appointment.invoice.status === "PAID"
											? "bg-emerald-50 text-emerald-700 border-emerald-100"
											: "bg-amber-50 text-amber-700 border-amber-100",
									)}
								>
									<IconReceipt className="size-3" />
									{appointment.invoice.status === "PAID" ? "مدفوعة" : "بانتظار الدفع"}
								</Badge>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export function EnrollmentVisitsTimeline({
	enrollmentId,
	className,
}: {
	enrollmentId: string | null | undefined;
	className?: string;
}) {
	const { enrollment, isLoading } = useEnrollment(enrollmentId ?? undefined);

	return (
		<div
			className={cn("flex flex-col", className)}
			dir="rtl"
		>
			{isLoading && (
				<p className="text-center text-xs text-muted-foreground">جارٍ التحميل...</p>
			)}

			{enrollment?.visits.map((visit, idx) => (
				<EnrollmentVisitRow
					key={visit.id}
					visit={visit}
					index={idx}
				/>
			))}
		</div>
	);
}
