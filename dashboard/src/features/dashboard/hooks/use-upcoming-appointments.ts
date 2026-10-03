import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { DashboardUpcomingAppointment } from "@/server/dashboard/dashboard.type";

export const useUpcomingAppointments = () => {
	const { data, isLoading, isError } = useQuery<DashboardUpcomingAppointment[]>({
		queryKey: ["dashboard", "upcoming"],
		queryFn: async () => {
			const res = await api.dashboard.upcoming.get();
			if (res.error) throw new Error("Failed to fetch upcoming appointments");
			return (res.data as DashboardUpcomingAppointment[]) ?? [];
		},
		staleTime: 1000 * 60 * 2,
	});

	return { appointments: data ?? [], isLoading, isError };
};
