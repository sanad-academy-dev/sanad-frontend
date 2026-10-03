import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ItemSupplierResponse } from "@/server/suppliers/suppliers.type";

/** موردو منتج محدّد — مُشتقّون من سجل المشتريات + قائمة منتجات المورد */
export const useItemSuppliers = (itemId?: string, opts?: { enabled?: boolean }) => {
	const { data, isLoading } = useQuery<ItemSupplierResponse[]>({
		queryKey: ["item-suppliers", itemId ?? "none"],
		enabled: (opts?.enabled ?? true) && !!itemId,
		queryFn: async () => {
			const res = await api.suppliers["by-item"].get({ query: { itemId: itemId ?? "" } });
			if (res.error) throw new Error("فشل جلب موردي المنتج");
			return res.data as ItemSupplierResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { suppliers: Array.isArray(data) ? data : [], isLoading };
};
