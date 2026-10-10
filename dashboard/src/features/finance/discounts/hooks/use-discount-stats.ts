import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { DiscountStatsResponse } from "@/server/discounts/discounts.type";

export const useDiscountStats = () => {
	const { data, isLoading } = useQuery<DiscountStatsResponse>({
		queryKey: ["discounts", "stats"],
		queryFn: async () => {
			const res = await api.discounts.stats.get();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر جلب الإحصائيات");
			}
			return res.data as DiscountStatsResponse;
		},
		staleTime: 60 * 1000,
	});

	return { stats: data ?? null, isLoading };
};
