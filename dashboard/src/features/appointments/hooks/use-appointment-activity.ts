import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { AppointmentActivityResponse } from "@/server/appointments/appointments.type";

const EMPTY: AppointmentActivityResponse[] = [];

export const useAppointmentActivity = (appointmentId: string | null) => {
	const { data, isLoading } = useQuery<AppointmentActivityResponse[]>({
		queryKey: ["appointment-activity", appointmentId],
		queryFn: async () => {
			if (!appointmentId) throw new Error("no id");
			const res = await api.appointments({ id: appointmentId }).activity.get();
			if (res.error) throw new Error("تعذّر جلب النشاط");
			return (res.data ?? []) as AppointmentActivityResponse[];
		},
		enabled: !!appointmentId,
	});

	return { activity: data ?? EMPTY, isLoading };
};
