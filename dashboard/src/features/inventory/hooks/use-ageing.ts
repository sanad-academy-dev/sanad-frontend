import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { StockAgeingItem, StockAgeingReport } from "@/server/stock/stock.type";

// مرجع ثابت — تمرير مصفوفة جديدة كل render إلى useReactTable يسبّب حلقة autoReset
const EMPTY: StockAgeingItem[] = [];

export const useAgeing = (enabled = true) => {
	const { data, isLoading } = useQuery<StockAgeingReport>({
		queryKey: ["stock-ageing"],
		enabled,
		queryFn: async () => {
			const res = await api.stock.ageing.get();
			if (res.error) throw new Error("فشل جلب تقرير الأعمار");
			return res.data as StockAgeingReport;
		},
		staleTime: 1000 * 60,
	});
	return {
		items: data?.items ?? EMPTY,
		totals: data?.totals,
		isLoading,
	};
};
