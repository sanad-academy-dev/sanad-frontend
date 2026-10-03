import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { AppointmentResponse } from "@/server/appointments/appointments.type";

export const useAppointment = (id: string | null) => {
	const { data, isLoading } = useQuery<AppointmentResponse>({
		queryKey: ["appointment", id],
		queryFn: async () => {
			if (!id) throw new Error("no id");
			const res = await api.appointments({ id }).get();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر جلب الزيارة");
			}
			return res.data as AppointmentResponse;
		},
		enabled: !!id,
		staleTime: 30 * 1000,
	});

	return { appointment: data, isLoading };
};
