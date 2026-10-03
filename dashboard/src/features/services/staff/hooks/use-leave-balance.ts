import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

// رصيد إجازات موظف للسنة الحالية (المسموح/المستهلَك/المتبقي)
export const useLeaveBalance = (staffId: string | null, enabled: boolean) => {
	const year = new Date().getFullYear();

	const { data, isLoading } = useQuery({
		queryKey: ["attendance", "leave-balance", staffId, year],
		enabled: enabled && !!staffId,
		queryFn: async () => {
			const res = await api.attendance["leave-balance"].get({
				query: { staffId: staffId as string, year: String(year) },
			});
			if (res.error) throw new Error("فشل جلب رصيد الإجازات");
			return res.data;
		},
		staleTime: 1000 * 60,
	});

	return { balance: data, isLoading };
};
