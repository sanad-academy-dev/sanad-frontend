import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { StockBatchResponse } from "@/server/stock/stock.type";

// مرجع ثابت — تمرير مصفوفة جديدة كل render إلى useReactTable يسبّب حلقة autoReset
const EMPTY: StockBatchResponse[] = [];

/** دُفعات المخزون؛ مرّر expiringInDays لعرض ما يقارب الانتهاء أو منتهٍ فقط */
export const useBatches = (opts?: {
	itemId?: string;
	expiringInDays?: number;
	enabled?: boolean;
}) => {
	const { data, isLoading } = useQuery<StockBatchResponse[]>({
		queryKey: ["stock-batches", opts?.itemId ?? "all", opts?.expiringInDays ?? "all"],
		enabled: opts?.enabled ?? true,
		queryFn: async () => {
			const res = await api.stock.batches.get({
				query: {
					...(opts?.itemId ? { itemId: opts.itemId } : {}),
					...(opts?.expiringInDays != null
						? { expiringInDays: String(opts.expiringInDays) }
						: {}),
				},
			});
			if (res.error) throw new Error("فشل جلب الدُفعات");
			return res.data as StockBatchResponse[];
		},
		staleTime: 1000 * 60,
	});
	return { batches: Array.isArray(data) ? data : EMPTY, isLoading };
};
