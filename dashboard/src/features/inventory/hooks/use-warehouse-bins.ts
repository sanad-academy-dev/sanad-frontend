import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { StockBinResponse } from "@/server/stock/stock.type";

// مرجع ثابت لتفادي إعادة إنشاء مصفوفة جديدة كل render (يكسر حلقات useEffect)
const EMPTY: StockBinResponse[] = [];

/** أرصدة مستودع محدّد (للجرد) — معطّل حتى يُختار مستودع */
export const useWarehouseBins = (warehouseId?: string) => {
	const { data, isLoading } = useQuery<StockBinResponse[]>({
		queryKey: ["warehouse-bins", warehouseId ?? "none"],
		enabled: !!warehouseId,
		queryFn: async () => {
			const res = await api.stock.bins.get({ query: { warehouseId: warehouseId ?? "" } });
			if (res.error) throw new Error("فشل جلب أرصدة المستودع");
			return res.data as StockBinResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { bins: Array.isArray(data) ? data : EMPTY, isLoading };
};
