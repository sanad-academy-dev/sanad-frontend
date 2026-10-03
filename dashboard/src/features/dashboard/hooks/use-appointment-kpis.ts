import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { DashboardAppointmentKpisResponse } from "@/server/dashboard/dashboard.type";

export const useAppointmentKpis = () => {
	const { data, isLoading, isError } = useQuery<DashboardAppointmentKpisResponse>({
		queryKey: ["dashboard", "appointment-kpis"],
		queryFn: async () => {
			const res = await api.dashboard["appointment-kpis"].get();
			if (res.error) throw new Error("Failed to fetch appointment KPIs");
			return res.data as DashboardAppointmentKpisResponse;
		},
		staleTime: 1000 * 60 * 2,
	});

	return { kpis: data, isLoading, isError };
};
