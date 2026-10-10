import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { StaffSchedulingResponse } from "@/server/staff-scheduling/staff-scheduling.type";

export const staffSchedulingQueryKey = (staffId: string) =>
	["staff", staffId, "scheduling"] as const;

export const useStaffScheduling = (staffId: string) => {
	const { data, isLoading } = useQuery<StaffSchedulingResponse>({
		queryKey: staffSchedulingQueryKey(staffId),
		queryFn: async () => {
			const res = await api.staff({ id: staffId }).scheduling.get();
			if (res.error) throw new Error("فشل تحميل بيانات الجدولة");
			return res.data as StaffSchedulingResponse;
		},
		enabled: !!staffId,
		staleTime: 1000 * 60 * 5,
	});

	return { scheduling: data, isLoading };
};
