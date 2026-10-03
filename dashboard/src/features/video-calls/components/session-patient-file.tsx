import {
	IconClock,
	IconCopy,
	IconDoor,
	IconMessage,
	IconPlus,
	IconUser,
} from "@tabler/icons-react";
import { format, isToday } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ReferAppointmentDialog } from "@/features/appointments/components/refer-appointment-dialog";
import { LOCATION_OPTIONS } from "@/features/appointments/data/location-options";
import { STATUS_META } from "@/features/appointments/data/status-meta";
import type { AppointmentResponse } from "@/server/appointments/appointments.type";
import { REPEAT_UNIT_LABELS } from "@sanad/contracts/runtime/server/appointments/appointments.type";

const Initials = ({ name, className }: { name: string; className?: string }) => (
	<div
		className={
			className ??
			"flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white"
		}
	>
		{name
			.split(" ")
			.slice(0, 2)
			.map((w) => w[0])
			.join("")
			.toUpperCase()}
	</div>
);

// تبويب "ملف الطفل" في صفحة الجلسة — تفاصيل الزيارة ووليّ الأمر والمدرّب من بيانات الزيارة
export const SessionPatientFile = ({ appointment }: { appointment: AppointmentResponse }) => {
	const location =
		LOCATION_OPTIONS.find((o) => o.value === appointment.location) ?? LOCATION_OPTIONS[0];
	const LocationIcon = location.icon;
	const statusMeta = STATUS_META[appointment.status];
	const StatusIcon = statusMeta.icon;
	const startsAt = new Date(appointment.startsAt);

	const copyPhone = async () => {
		await navigator.clipboard.writeText(appointment.owner.phone);
		toast.success("تم النسخ");
	};

	return (
		// اللوحة مصممة بتدفق LTR داخل صفحة RTL — dir يمنع انعكاس الصفوف
		<div
			dir="rtl"
			className="flex flex-col gap-6"
		>
			<div className="flex flex-col gap-3">
				<p className="text-sm font-semibold">التفاصيل</p>

				<div className="flex items-center gap-1.5">
					<LocationIcon className="size-4 text-muted-foreground" />
					<span className="text-sm">{location.label}</span>
				</div>

				<div className="flex items-center gap-1.5">
					<IconDoor className="size-4 text-muted-foreground" />
					<span className="text-sm">{appointment.room?.name ?? "بدون قاعة"}</span>
				</div>

				<div className="flex items-center gap-1.5">
					<IconClock className="size-4 text-muted-foreground" />
					<span className="text-sm">
						{isToday(startsAt) ? "اليوم" : format(startsAt, "d/M/yyyy")}
					</span>
				</div>

				{appointment.repeatUnit && (
					<div className="flex items-center gap-1.5">
						<IconClock className="size-4 text-muted-foreground" />
						<span className="text-sm">{REPEAT_UNIT_LABELS[appointment.repeatUnit]}</span>
					</div>
				)}

				<div className="flex items-center gap-1.5">
					<IconClock className="size-4 text-muted-foreground" />
					<span className="text-sm">{appointment.durationMinutes} دقيقة</span>
				</div>

				<div className={`flex items-center gap-1.5 ${statusMeta.color}`}>
					<StatusIcon className="size-4 shrink-0" />
					<span className="text-sm font-medium">{statusMeta.label}</span>
				</div>
			</div>

			{/* وليّ الأمر */}
			<div className="flex flex-col gap-3">
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-1.5">
						<Initials name={appointment.owner.name} />
						<span className="text-sm font-medium">{appointment.owner.name}</span>
					</div>
					<Button
						asChild
						size="xs"
						variant="outline"
						className="h-7 text-xs"
					>
						<a href={`sms:${appointment.owner.phone}`}>
							<IconMessage className="size-3" />
							إرسال رسالة
						</a>
					</Button>
				</div>
				<div className="flex items-center justify-between gap-2">
					<span
						className="text-sm tabular-nums"
						dir="ltr"
					>
						{appointment.owner.phone}
					</span>
					<Button
						size="xs"
						variant="outline"
						className="h-7 text-xs"
						onClick={() => void copyPhone()}
					>
						<IconCopy className="size-3" />
						نسخ
					</Button>
				</div>
			</div>

			{/* المدرّب */}
			<div className="flex flex-col gap-3">
				<p className="text-sm font-semibold">المدرّب</p>
				<div className="flex items-center gap-1.5">
					<Initials
						name={appointment.staff.name}
						className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white"
					/>
					<span className="text-sm font-medium">{appointment.staff.name}</span>
				</div>
			</div>

			{/* إحالة */}
			<div className="flex flex-col gap-3">
				<p className="text-sm font-semibold">إحالة</p>
				<ReferAppointmentDialog
					appointmentId={appointment.id}
					appointmentCode={appointment.code}
					patientName={appointment.patient.name}
					currentStaffId={appointment.staffId}
					trigger={
						<Button
							variant="outline"
							size="sm"
							className="h-8 w-fit gap-1.5"
						>
							<IconPlus className="size-3.5" />
							إحالة الطفل
						</Button>
					}
				/>
			</div>

			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-1.5">
					<IconUser className="size-4 text-muted-foreground" />
					<span className="text-sm font-medium">وقت التسجيل للزيارة</span>
				</div>
				<span
					className="text-sm tabular-nums"
					dir="ltr"
				>
					{format(new Date(appointment.createdAt), "d/MM/yyyy")}
				</span>
			</div>
		</div>
	);
};
