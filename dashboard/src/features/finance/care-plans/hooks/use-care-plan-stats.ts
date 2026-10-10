import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { CarePlanStatsResponse } from "@/server/care-plans/care-plans.type";

export const useCarePlanStats = () => {
	const { data, isLoading } = useQuery<CarePlanStatsResponse>({
		queryKey: ["care-plans", "stats"],
		queryFn: async () => {
			const res = await api["care-plans"].stats.get();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر جلب الإحصائيات");
			}
			return res.data as CarePlanStatsResponse;
		},
		staleTime: 60 * 1000,
	});

	return { stats: data ?? null, isLoading };
};
