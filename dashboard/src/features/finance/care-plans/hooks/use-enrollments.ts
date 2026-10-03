import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { CarePlanEnrollmentListItemResponse } from "@/server/care-plans/care-plans.type";

export const useEnrollments = () => {
	const { data, isLoading, refetch } = useQuery<CarePlanEnrollmentListItemResponse[]>({
		queryKey: ["care-plan-enrollments"],
		queryFn: async () => {
			const res = await api["care-plans"].enrollments.get();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر جلب الاشتراكات");
			}
			return (res.data as CarePlanEnrollmentListItemResponse[]) ?? [];
		},
		staleTime: 30 * 1000,
	});

	return { enrollments: data ?? [], isLoading, refetch };
};
