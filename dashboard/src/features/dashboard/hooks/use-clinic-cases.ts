import { useQuery } from "@tanstack/react-query";

import type { ChartBarMultipleDatum } from "@/components/ui/chart-bar-multiple";
import { api } from "@/lib/api";

export const useClinicCases = () => {
	const { data, isLoading, isError } = useQuery<ChartBarMultipleDatum[]>({
		queryKey: ["dashboard", "weekly-cases"],
		queryFn: async () => {
			const res = await api.dashboard["weekly-cases"].get();
			if (res.error) throw new Error("Failed to fetch weekly cases");
			return (res.data as ChartBarMultipleDatum[]) ?? [];
		},
		staleTime: 1000 * 60 * 5,
	});

	return { data: data ?? [], isLoading, isError };
};
