import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ExpenseStatsResponse } from "@/server/expenses/expenses.type";

export const useExpenseStats = () => {
	const { data, isLoading } = useQuery<ExpenseStatsResponse>({
		queryKey: ["expenses", "stats"],
		queryFn: async () => {
			const res = await api.expenses.stats.get();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر جلب الإحصائيات");
			}
			return res.data as ExpenseStatsResponse;
		},
		staleTime: 60 * 1000,
	});

	return { stats: data ?? null, isLoading };
};
