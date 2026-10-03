import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { CarePlanListItemResponse } from "@/server/care-plans/care-plans.type";

export const useCarePlans = () => {
	const { data, isLoading, refetch } = useQuery<CarePlanListItemResponse[]>({
		queryKey: ["care-plans"],
		queryFn: async () => {
			const res = await api["care-plans"].get();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر جلب خطط الرعاية");
			}
			return (res.data as CarePlanListItemResponse[]) ?? [];
		},
		staleTime: 30 * 1000,
	});

	return { plans: data ?? [], isLoading, refetch };
};
