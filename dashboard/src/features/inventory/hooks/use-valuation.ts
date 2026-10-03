import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ValuationItem, ValuationReport } from "@/server/stock/stock.type";

// مرجع ثابت — تمرير مصفوفة جديدة كل render إلى useReactTable يسبّب حلقة autoReset
const EMPTY: ValuationItem[] = [];

export const useValuation = () => {
	const { data, isLoading } = useQuery<ValuationReport>({
		queryKey: ["stock-valuation"],
		queryFn: async () => {
			const res = await api.stock.valuation.get();
			if (res.error) throw new Error("فشل جلب تقرير القيمة");
			return res.data as ValuationReport;
		},
		staleTime: 1000 * 60,
	});
	return {
		items: data?.items ?? EMPTY,
		totalValue: data?.totalValue ?? 0,
		totalQty: data?.totalQty ?? 0,
		isLoading,
	};
};
