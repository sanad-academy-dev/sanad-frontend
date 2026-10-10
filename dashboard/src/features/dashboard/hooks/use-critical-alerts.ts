import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { CriticalAlertResponse } from "@/server/appointments/appointments.type";

export const useCriticalAlerts = () => {
	const { data, isLoading, isError } = useQuery<CriticalAlertResponse[]>({
		queryKey: ["appointments", "critical-alerts"],
		queryFn: async () => {
			const res = await api.appointments["critical-alerts"].get();
			if (res.error) throw new Error("Failed to fetch critical alerts");
			return (res.data as CriticalAlertResponse[]) ?? [];
		},
		staleTime: 1000 * 60 * 2,
	});

	return { alerts: data ?? [], isLoading, isError };
};
