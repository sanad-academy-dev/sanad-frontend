import { useQuery } from "@tanstack/react-query";

import type {
	AppointmentsPeriod,
	AppointmentsView,
} from "@/features/appointments/types/appointment.types";
import { api } from "@/lib/api";
import type { AppointmentKanbanResponse } from "@/server/appointments/appointments.type";

const EMPTY: AppointmentKanbanResponse[] = [];

export const useAppointmentsList = (
	period: AppointmentsPeriod,
	view: AppointmentsView = "all",
) => {
	const { data, isLoading } = useQuery<AppointmentKanbanResponse[]>({
		queryKey: ["appointments", "list", period, view],
		queryFn: async () => {
			const res = await api.appointments.list.get({ query: { period, view } });
			if (res.error) throw new Error("فشل جلب الزيارات");
			const value = res.data;
			return Array.isArray(value) ? (value as AppointmentKanbanResponse[]) : [];
		},
		staleTime: 30 * 1000,
	});

	return { appointments: data ?? EMPTY, isLoading };
};
