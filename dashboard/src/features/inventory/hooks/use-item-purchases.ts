import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ItemPurchaseOrderResponse } from "@/server/purchasing/purchasing.type";

/** أوامر الشراء الخاصة بمنتج محدّد */
export const useItemPurchases = (itemId?: string, opts?: { enabled?: boolean }) => {
	const { data, isLoading } = useQuery<ItemPurchaseOrderResponse[]>({
		queryKey: ["item-purchases", itemId ?? "none"],
		enabled: (opts?.enabled ?? true) && !!itemId,
		queryFn: async () => {
			const res = await api.purchasing["by-item"].get({ query: { itemId: itemId ?? "" } });
			if (res.error) throw new Error("فشل جلب طلبات الشراء");
			return res.data as ItemPurchaseOrderResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { purchases: Array.isArray(data) ? data : [], isLoading };
};
