import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { InvoiceStatsResponse } from "@/server/invoices/invoices.type";

export const useFinanceStats = () => {
	const { data, isLoading } = useQuery<InvoiceStatsResponse>({
		queryKey: ["invoices", "stats"],
		queryFn: async () => {
			const res = await api.invoices.stats.get();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر جلب الإحصائيات");
			}
			return res.data as InvoiceStatsResponse;
		},
		staleTime: 60 * 1000,
	});

	return { stats: data ?? null, isLoading };
};
