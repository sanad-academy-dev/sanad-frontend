import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { StaffConsultationTypeResponse } from "@/server/staff-consultation-types/staff-consultation-types.type";

export const staffConsultationTypesQueryKey = (staffId: string) =>
	["staff", staffId, "consultation-types"] as const;

export const useStaffConsultationTypes = (staffId: string) => {
	const { data, isLoading } = useQuery<StaffConsultationTypeResponse[]>({
		queryKey: staffConsultationTypesQueryKey(staffId),
		queryFn: async () => {
			const res = await api.staff({ id: staffId })["consultation-types"].get();
			if (res.error) throw new Error("فشل تحميل كشوفات الموظف");
			return res.data as StaffConsultationTypeResponse[];
		},
		enabled: !!staffId,
		staleTime: 1000 * 60 * 5,
	});

	return { consultationTypes: data ?? [], isLoading };
};
