import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ExpenseListItemResponse } from "@/server/expenses/expenses.type";

export const useExpenses = (search?: string) => {
	const { data, isLoading, refetch } = useQuery<ExpenseListItemResponse[]>({
		queryKey: ["expenses", { search: search ?? "" }],
		queryFn: async () => {
			const res = await api.expenses.get({ query: search ? { search } : {} });
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر جلب المصروفات");
			}
			return (res.data as ExpenseListItemResponse[]) ?? [];
		},
		staleTime: 30 * 1000,
	});

	return { expenses: data ?? [], isLoading, refetch };
};
