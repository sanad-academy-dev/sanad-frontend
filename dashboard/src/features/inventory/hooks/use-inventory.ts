import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { InventoryResponse } from "@/server/inventory/inventory.type";

// مرجع ثابت — تمرير مصفوفة جديدة كل render إلى useReactTable يسبّب حلقة autoReset
const EMPTY: InventoryResponse[] = [];

export const useInventory = () => {
	const { data, isLoading } = useQuery<InventoryResponse[]>({
		queryKey: ["inventory"],
		queryFn: async () => {
			const res = await api.inventory.get();
			if (res.error) throw new Error("فشل جلب المنتجات");
			return res.data as InventoryResponse[];
		},
		staleTime: 1000 * 60 * 5,
	});
	return { inventory: Array.isArray(data) ? data : EMPTY, isLoading };
};
