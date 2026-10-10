import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { DiscountResponse } from "@/server/discounts/discounts.type";

export const useDiscounts = () => {
	const { data, isLoading, refetch } = useQuery<DiscountResponse[]>({
		queryKey: ["discounts"],
		queryFn: async () => {
			const res = await api.discounts.get();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر جلب الخصومات");
			}
			return (res.data as DiscountResponse[]) ?? [];
		},
		staleTime: 30 * 1000,
	});

	return { discounts: data ?? [], isLoading, refetch };
};
