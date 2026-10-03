import { useAppointmentsList } from "@/features/appointments/hooks/use-appointments-list";
import { getInboxInsight } from "@/features/inbox/utils/inbox-insight";
import { AppointmentStatus } from "@/generated/prisma/enums";

// رؤية الذروة لشريط الوارد — قواعد ثابتة على زيارات اليوم المجدولة (بدون AI حقيقي)
export const useInboxInsight = () => {
	const { appointments } = useAppointmentsList("day");
	const scheduledToday = appointments.filter(
		(a) => a.status === AppointmentStatus.SCHEDULED,
	).length;

	return { insight: getInboxInsight(new Date(), scheduledToday) };
};
