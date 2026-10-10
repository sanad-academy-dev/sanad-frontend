import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { StaffServiceResponse } from "@/server/staff-services/staff-services.type";

export const staffServicesQueryKey = (staffId: string) =>
	["staff", staffId, "services"] as const;

export const useStaffServices = (staffId: string) => {
	const { data, isLoading } = useQuery<StaffServiceResponse[]>({
		queryKey: staffServicesQueryKey(staffId),
		queryFn: async () => {
			const res = await api.staff({ id: staffId }).services.get();
			if (res.error) throw new Error("فشل تحميل دورات الموظف");
			return res.data as StaffServiceResponse[];
		},
		enabled: !!staffId,
		staleTime: 1000 * 60 * 5,
	});

	return { services: data ?? [], isLoading };
};
