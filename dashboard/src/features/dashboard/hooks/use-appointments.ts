import { useQuery } from "@tanstack/react-query";

import {
	type DashboardDateRange,
	resolveRange,
} from "@/features/dashboard/components/dashboard-date-range-filter";
import { api } from "@/lib/api";
import type { DashboardAppointmentResponse } from "@/server/appointments/appointments.type";

export const useAppointments = (range?: DashboardDateRange) => {
	const resolved = range ? resolveRange(range) : null;
	const query = resolved
		? { from: resolved.from.toISOString(), to: resolved.to.toISOString() }
		: undefined;

	const { data, isLoading, isError } = useQuery<DashboardAppointmentResponse[]>({
		queryKey: ["appointments", "dashboard", query?.from ?? null, query?.to ?? null],
		queryFn: async () => {
			const res = await api.appointments.dashboard.get(query ? { query } : undefined);
			if (res.error) throw new Error("Failed to fetch appointments");
			return (res.data as DashboardAppointmentResponse[]) ?? [];
		},
		staleTime: 1000 * 60 * 2,
	});

	return { appointments: data ?? [], isLoading, isError };
};
