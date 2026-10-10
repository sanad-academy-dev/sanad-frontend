import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { StaffForServicesResponse } from "@/server/appointments/appointments.type";

const EMPTY: StaffForServicesResponse[] = [];

export const useStaffForServices = (serviceIds: string[]) => {
	const key = [...serviceIds].sort().join(",");

	const { data, isLoading } = useQuery<StaffForServicesResponse[]>({
		queryKey: ["appointments", "staff-by-services", key],
		queryFn: async () => {
			if (serviceIds.length === 0) return [];
			const res = await api.appointments["staff-by-services"].get({
				query: { serviceIds: key },
			});
			if (res.error) throw new Error("فشل جلب المدرّبين");
			return res.data as StaffForServicesResponse[];
		},
		enabled: serviceIds.length > 0,
		staleTime: 60 * 1000,
	});

	return { staff: data ?? EMPTY, isLoading };
};
