import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { StaffResponse } from "@/server/staff/staff.type";

const EMPTY_STAFF: StaffResponse[] = [];

export const useStaff = () => {
	const { data, isLoading } = useQuery<StaffResponse[]>({
		queryKey: ["staff"],
		queryFn: async () => {
			const res = await api.staff.get();
			if (res.error) throw new Error("فشل تحميل الموظفين");
			return res.data as StaffResponse[];
		},
		staleTime: 1000 * 60 * 5,
	});

	return { staff: data ?? EMPTY_STAFF, isLoading };
};
