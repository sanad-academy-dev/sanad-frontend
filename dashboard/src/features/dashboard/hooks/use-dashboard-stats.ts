import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { DashboardStatsResponse } from "@/server/dashboard/dashboard.type";

export const useDashboardStats = () => {
	const { data, isLoading, isError } = useQuery<DashboardStatsResponse>({
		queryKey: ["dashboard", "stats"],
		queryFn: async () => {
			const res = await api.dashboard.stats.get();
			if (res.error) throw new Error("Failed to fetch dashboard stats");
			return res.data as DashboardStatsResponse;
		},
		staleTime: 1000 * 60 * 2,
	});

	return { stats: data, isLoading, isError };
};
