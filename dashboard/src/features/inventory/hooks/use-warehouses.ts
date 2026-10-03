import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { WarehouseResponse } from "@/server/stock/stock.type";

// مرجع ثابت لتفادي إنشاء مصفوفة جديدة كل render (يكسر churn/حلقات useEffect)
const EMPTY: WarehouseResponse[] = [];

export const useWarehouses = () => {
	const { data, isLoading } = useQuery<WarehouseResponse[]>({
		queryKey: ["warehouses"],
		queryFn: async () => {
			const res = await api.stock.warehouses.get();
			if (res.error) throw new Error("فشل جلب المستودعات");
			return res.data as WarehouseResponse[];
		},
		staleTime: 1000 * 60 * 5,
	});
	return { warehouses: Array.isArray(data) ? data : EMPTY, isLoading };
};
