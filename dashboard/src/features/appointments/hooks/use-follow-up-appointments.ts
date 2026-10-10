import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { FollowUpAppointmentResponse } from "@/server/appointments/appointments.type";

const EMPTY: FollowUpAppointmentResponse[] = [];

export const useFollowUpAppointments = (appointmentId: string | null) => {
	const { data, isLoading } = useQuery<FollowUpAppointmentResponse[]>({
		queryKey: ["appointments", "follow-ups", appointmentId],
		queryFn: async () => {
			if (!appointmentId) throw new Error("no id");
			const res = await api.appointments({ id: appointmentId })["follow-ups"].get();
			if (res.error) throw new Error("تعذّر جلب زيارات المتابعة");
			return (res.data ?? []) as FollowUpAppointmentResponse[];
		},
		enabled: !!appointmentId,
	});

	return { followUps: data ?? EMPTY, isLoading };
};
