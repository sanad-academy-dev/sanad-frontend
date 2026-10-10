import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { CarePlanEnrollmentListItemResponse } from "@/server/care-plans/care-plans.type";

export const useEnrollment = (id: string | undefined) => {
	const { data, isLoading, isFetching } = useQuery<CarePlanEnrollmentListItemResponse>({
		queryKey: ["care-plan-enrollments", id],
		enabled: !!id,
		queryFn: async () => {
			const res = await api["care-plans"].enrollments({ id: id as string }).get();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر جلب الاشتراك");
			}
			return res.data as CarePlanEnrollmentListItemResponse;
		},
		staleTime: 0,
	});

	return { enrollment: data, isLoading, isFetching };
};
