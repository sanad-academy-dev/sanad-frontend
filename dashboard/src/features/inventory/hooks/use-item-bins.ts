import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { StockBinResponse } from "@/server/stock/stock.type";

/** أرصدة منتج محدّد عبر كل المستودعات — معطّل حتى يتوفّر itemId */
export const useItemBins = (itemId?: string) => {
	const { data, isLoading } = useQuery<StockBinResponse[]>({
		queryKey: ["item-bins", itemId ?? "none"],
		enabled: !!itemId,
		queryFn: async () => {
			const res = await api.stock.bins.get({ query: { itemId: itemId ?? "" } });
			if (res.error) throw new Error("فشل جلب أرصدة المنتج");
			return res.data as StockBinResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { bins: Array.isArray(data) ? data : [], isLoading };
};
