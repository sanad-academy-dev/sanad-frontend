import { IconFlag3, IconSparkles } from "@tabler/icons-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { QUEUE_STATUS_META } from "@/features/appointments/data/status-meta";
import { useUpdateAppointmentQueueStatus } from "@/features/appointments/hooks/use-update-appointment-queue-status";
import type { QueueStatus } from "@/generated/prisma/enums";
import type { AppointmentResponse } from "@/server/appointments/appointments.type";

interface VisitSummarySectionProps {
	appointment: AppointmentResponse;
}

const UNSET = "__unset__";

/** الحرفان الأولان من اسم الطفل — بديل الصورة في الأفاتار */
const initialsOf = (name: string) =>
	name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0] ?? "")
		.join("");

export function VisitSummarySection({ appointment }: VisitSummarySectionProps) {
	const { updateQueueStatus, isPending } = useUpdateAppointmentQueueStatus();

	const current = appointment.queueStatus ? QUEUE_STATUS_META[appointment.queueStatus] : null;
	const CurrentIcon = current?.icon ?? null;

	const handleChange = (value: string) => {
		const next = value === UNSET ? null : (value as QueueStatus);
		if (next === appointment.queueStatus) return;
		void updateQueueStatus({ id: appointment.id, queueStatus: next });
	};

	return (
		<section className="flex flex-col gap-3">
			<p className="font-semibold text-base">ملخص الزيارة</p>

			<div className="overflow-hidden rounded-md border bg-card">
				<div className="flex items-center justify-between gap-2 px-3 py-2.5">
					<div className="flex min-w-0 items-center gap-1.5">
						<Avatar size="sm">
							<AvatarFallback className="bg-primary text-[10px] font-semibold text-white">
								{initialsOf(appointment.patient.name)}
							</AvatarFallback>
						</Avatar>
						<span className="truncate text-base font-bold">{appointment.patient.name}</span>
					</div>

					{/* التعديل متاح في أي حالة — وهنا المدخل الوحيد لضبطها قبل تسجيل الدخول */}
					<div className="flex shrink-0 items-center gap-2">
						<IconFlag3 className="size-4 shrink-0 text-muted-foreground" />
						<span className="shrink-0 text-sm text-muted-foreground">تغيير الحالة:</span>
						<Select
							dir="rtl"
							value={appointment.queueStatus ?? UNSET}
							onValueChange={handleChange}
							disabled={isPending}
						>
							<SelectTrigger className="h-7 w-auto gap-2 bg-background">
								{current && CurrentIcon ? (
									<div className={`flex items-center gap-1.5 ${current.color}`}>
										<CurrentIcon className="size-4 shrink-0" />
										<span className="text-sm font-medium">{current.label}</span>
									</div>
								) : (
									<span className="text-sm text-muted-foreground">بدون تحديد...</span>
								)}
							</SelectTrigger>
							<SelectContent
								position="popper"
								className="z-[100]"
							>
								<SelectItem value={UNSET}>
									<span className="text-sm text-muted-foreground">بدون تحديد</span>
								</SelectItem>
								{Object.entries(QUEUE_STATUS_META).map(([value, meta]) => {
									const Icon = meta.icon;
									return (
										<SelectItem
											key={value}
											value={value}
										>
											<div className={`flex items-center gap-1.5 ${meta.color}`}>
												<Icon className="size-4 shrink-0" />
												<span>{meta.label}</span>
											</div>
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="flex items-center gap-1.5 bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700">
					<span>احتمالية الحضور: 92%، يفضل التأكد قبل الزيارة</span>
					<IconSparkles className="size-3.5 shrink-0" />
				</div>
			</div>
		</section>
	);
}
