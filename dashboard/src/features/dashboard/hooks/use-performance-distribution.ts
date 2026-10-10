import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { DashboardDistributionResponse } from "@/server/dashboard/dashboard.type";

const EMPTY: DashboardDistributionResponse = { patients: [], services: [] };

export const usePerformanceDistribution = () => {
	const { data, isLoading, isError } = useQuery<DashboardDistributionResponse>({
		queryKey: ["dashboard", "distribution"],
		queryFn: async () => {
			const res = await api.dashboard.distribution.get();
			if (res.error) throw new Error("Failed to fetch performance distribution");
			return (res.data as DashboardDistributionResponse) ?? EMPTY;
		},
		staleTime: 1000 * 60 * 5,
	});

	return { data: data ?? EMPTY, isLoading, isError };
};
