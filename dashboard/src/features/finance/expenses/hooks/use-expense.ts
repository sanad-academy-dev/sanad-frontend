import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ExpenseResponse } from "@/server/expenses/expenses.type";

// جلب مصروف واحد بالتفصيل (لإعادة فتح شاشة المراجعة)
export const useExpense = (id: string | null) => {
	const { data, isLoading } = useQuery<ExpenseResponse | null>({
		queryKey: ["expenses", "detail", id],
		enabled: !!id,
		queryFn: async () => {
			if (!id) return null;
			const res = await api.expenses({ id }).get();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر جلب المصروف");
			}
			return res.data as ExpenseResponse;
		},
	});

	return { expense: data ?? null, isLoading };
};
