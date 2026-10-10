import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ProductActivityEntry } from "@/server/inventory/inventory.type";

/** سجل نشاط منتج محدّد — مُشتقّ من حركات المخزون وأوامر الشراء وأحداث المنتج */
export const useItemActivity = (itemId?: string, opts?: { enabled?: boolean }) => {
	const { data, isLoading } = useQuery<ProductActivityEntry[]>({
		queryKey: ["item-activity", itemId ?? "none"],
		enabled: (opts?.enabled ?? true) && !!itemId,
		queryFn: async () => {
			const res = await api.inventory.activity.get({ query: { itemId: itemId ?? "" } });
			if (res.error) throw new Error("فشل جلب سجل النشاط");
			return res.data as ProductActivityEntry[];
		},
		staleTime: 1000 * 30,
	});
	return { activity: Array.isArray(data) ? data : [], isLoading };
};
