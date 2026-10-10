import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { PurchaseOrderResponse } from "@/server/purchasing/purchasing.type";

// مرجع ثابت — تمرير مصفوفة جديدة كل render إلى useReactTable يسبّب حلقة autoReset
const EMPTY: PurchaseOrderResponse[] = [];

export const usePurchaseOrders = () => {
	const { data, isLoading } = useQuery<PurchaseOrderResponse[]>({
		queryKey: ["purchase-orders"],
		queryFn: async () => {
			const res = await api.purchasing.get();
			if (res.error) throw new Error("فشل جلب أوامر الشراء");
			return res.data as PurchaseOrderResponse[];
		},
		staleTime: 1000 * 60,
	});
	return { purchaseOrders: Array.isArray(data) ? data : EMPTY, isLoading };
};
