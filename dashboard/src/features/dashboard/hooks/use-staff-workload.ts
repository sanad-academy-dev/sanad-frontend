import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { DashboardStaffWorkloadDatum } from "@/server/dashboard/dashboard.type";

export const useStaffWorkload = () => {
	const { data, isLoading, isError } = useQuery<DashboardStaffWorkloadDatum[]>({
		queryKey: ["dashboard", "staff-workload"],
		queryFn: async () => {
			const res = await api.dashboard["staff-workload"].get();
			if (res.error) throw new Error("Failed to fetch staff workload");
			return (res.data as DashboardStaffWorkloadDatum[]) ?? [];
		},
		staleTime: 1000 * 60 * 2,
	});

	return { workload: data ?? [], isLoading, isError };
};
