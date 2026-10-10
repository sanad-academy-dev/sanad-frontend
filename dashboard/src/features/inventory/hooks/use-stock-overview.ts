import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { StockOverview } from "@/server/stock/stock.type";

export const useStockOverview = () => {
	const { data, isLoading } = useQuery<StockOverview>({
		queryKey: ["stock-overview"],
		queryFn: async () => {
			const res = await api.stock.overview.get();
			if (res.error) throw new Error("فشل جلب ملخّص المخزون");
			return res.data as StockOverview;
		},
		staleTime: 1000 * 60,
	});
	return { overview: data, isLoading };
};
