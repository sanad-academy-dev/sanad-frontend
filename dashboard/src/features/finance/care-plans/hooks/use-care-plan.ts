import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { CarePlanDetailResponse } from "@/server/care-plans/care-plans.type";

export const useCarePlan = (id: string | undefined) => {
	const { data, isLoading, isFetching } = useQuery<CarePlanDetailResponse>({
		queryKey: ["care-plans", id],
		enabled: !!id,
		queryFn: async () => {
			const res = await api["care-plans"]({ id: id as string }).get();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر جلب بيانات الخطة");
			}
			return res.data as CarePlanDetailResponse;
		},
		staleTime: 0,
	});

	return { plan: data, isLoading, isFetching };
};
