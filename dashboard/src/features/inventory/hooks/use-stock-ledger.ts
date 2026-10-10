import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { LedgerFilters, StockLedgerResponse } from "@/server/stock/stock.type";

// مرجع ثابت — تمرير مصفوفة جديدة كل render إلى useReactTable يسبّب حلقة autoReset
const EMPTY: StockLedgerResponse[] = [];

/** سجل حركات المخزون مع فلاتر اختيارية (منتج/مستودع/نوع/فترة) */
export const useStockLedger = (filters?: LedgerFilters, opts?: { enabled?: boolean }) => {
	const query: Record<string, string> = {};
	if (filters?.itemId) query.itemId = filters.itemId;
	if (filters?.warehouseId) query.warehouseId = filters.warehouseId;
	if (filters?.voucherType) query.voucherType = filters.voucherType;
	if (filters?.from) query.from = filters.from;
	if (filters?.to) query.to = filters.to;

	const { data, isLoading } = useQuery<StockLedgerResponse[]>({
		queryKey: ["stock-ledger", query],
		enabled: opts?.enabled ?? true,
		queryFn: async () => {
			const res = await api.stock.ledger.get({ query });
			if (res.error) throw new Error("فشل جلب سجل الحركات");
			return res.data as StockLedgerResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { ledger: Array.isArray(data) ? data : EMPTY, isLoading };
};
