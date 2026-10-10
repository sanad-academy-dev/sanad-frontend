import type {
	AppointmentCardData,
	AppointmentColumnId,
} from "@/features/appointments/types/appointment.types";
import type { AppointmentStatus } from "@/generated/prisma/enums";
import type {
	AppointmentKanbanResponse,
	DashboardAppointmentResponse,
} from "@/server/appointments/appointments.type";

export const STATUS_TO_COLUMN: Record<AppointmentStatus, AppointmentColumnId> = {
	SCHEDULED: "scheduled",
	WAITING: "queue",
	CHECK_IN: "check-in",
	IN_SERVICE: "in-service",
	HOSPITALIZED: "hospitalization",
	AWAITING_PAYMENT: "awaiting-payment",
	DONE: "done",
	CANCELLED: "cancelled",
};

export const COLUMN_TO_STATUS: Record<AppointmentColumnId, AppointmentStatus> = {
	scheduled: "SCHEDULED",
	queue: "WAITING",
	"check-in": "CHECK_IN",
	"in-service": "IN_SERVICE",
	hospitalization: "HOSPITALIZED",
	"awaiting-payment": "AWAITING_PAYMENT",
	done: "DONE",
	cancelled: "CANCELLED",
};

const isSameDay = (a: Date, b: Date) =>
	a.getFullYear() === b.getFullYear() &&
	a.getMonth() === b.getMonth() &&
	a.getDate() === b.getDate();

const formatTime = (date: Date): string => {
	const hour24 = date.getHours();
	const mm = date.getMinutes().toString().padStart(2, "0");
	const isPm = hour24 >= 12;
	const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
	return `${hour12}:${mm} ${isPm ? "م" : "ص"}`;
};

const dateLabel = (date: Date): string => {
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	if (isSameDay(date, today)) return "اليوم";
	if (isSameDay(date, tomorrow)) return "غدًا";
	if (isSameDay(date, yesterday)) return "أمس";
	return date.toLocaleDateString("ar-EG", { day: "2-digit", month: "2-digit" });
};

const initials = (name: string): string => {
	const parts = name.trim().split(/\s+/).slice(0, 2);
	return parts.map((p) => p[0] ?? "").join("");
};

export const mapAppointmentToCard = (a: AppointmentKanbanResponse): AppointmentCardData => {
	const startsAt = new Date(a.startsAt);
	const serviceName = a.services[0]?.service.name ?? "زيارة";
	const doctorFullName = `${a.staff.prefix ?? ""}${a.staff.name}`.trim();
	const lastStatusChangeAt = a.activity[0]?.createdAt ?? a.updatedAt;

	return {
		id: a.id,
		column: STATUS_TO_COLUMN[a.status],
		queueStatus: a.queueStatus,
		name: a.patient.name,
		code: a.code,
		type: serviceName,
		reason: a.reason?.trim() || serviceName,
		dateLabel: dateLabel(startsAt),
		time: formatTime(startsAt),
		duration: `${a.durationMinutes} دقيقة`,
		patientName: a.patient.name,
		patientInitials: initials(a.patient.name),
		ownerName: a.owner.name,
		ownerId: a.owner.id,
		doctorName: doctorFullName,
		doctorInitials: initials(a.staff.name),
		commentsCount: a._count.activity,
		examCompleted: !!a.clinicalExam?.completedAt,
		enteredCurrentStatusAt: new Date(lastStatusChangeAt),
		startsAt,
		isEmergency: a.isEmergency,
		priority: a.priority,
		branchId: a.branchId,
	};
};

// يبني بطاقة الزيارة انطلاقًا من استجابة لوحة التحكم (حقول أقل من الكانبان).
// اللوحة تُعيد جلب التفاصيل الكاملة عبر المعرّف، فتكفي الحقول الظاهرة في الترويسة.
export const mapDashboardAppointmentToCard = (
	a: DashboardAppointmentResponse,
): AppointmentCardData => {
	const startsAt = new Date(a.startsAt);
	const serviceName = a.services[0]?.service.name ?? "زيارة";
	const doctorFullName = `${a.staff.prefix ?? ""}${a.staff.name}`.trim();

	return {
		id: a.id,
		column: STATUS_TO_COLUMN[a.status],
		queueStatus: a.queueStatus,
		name: a.patient.name,
		code: a.code,
		type: serviceName,
		reason: a.reason?.trim() || serviceName,
		dateLabel: dateLabel(startsAt),
		time: formatTime(startsAt),
		duration: `${a.durationMinutes} دقيقة`,
		patientName: a.patient.name,
		patientInitials: initials(a.patient.name),
		ownerName: a.owner.name,
		ownerId: a.owner.id,
		doctorName: doctorFullName,
		doctorInitials: initials(a.staff.name),
		commentsCount: 0,
		examCompleted: false,
		enteredCurrentStatusAt: startsAt,
		startsAt,
		isEmergency: a.isEmergency,
		priority: null,
		branchId: "",
	};
};
