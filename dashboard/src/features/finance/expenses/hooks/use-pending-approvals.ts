import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ExpenseResponse } from "@/server/expenses/expenses.type";

// طلبات الاعتماد المعلّقة للمستخدم الحالي (التي أُرسل إليه طلب مراجعتها وما زالت داخل المسار)
export const usePendingApprovals = () => {
	const { data, isLoading, refetch } = useQuery<ExpenseResponse[]>({
		queryKey: ["expenses", "approvals"],
		queryFn: async () => {
			const res = await api.expenses.approvals.get();
			if (res.error) throw new Error("تعذّر جلب طلبات الاعتماد");
			return res.data as ExpenseResponse[];
		},
		staleTime: 1000 * 30,
	});

	return { approvals: data ?? [], isLoading, refetch };
};
