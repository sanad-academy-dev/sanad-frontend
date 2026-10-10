import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { SaleResponse } from "@/server/sales/sales.type";

// مرجع ثابت — تمرير مصفوفة جديدة كل render إلى useReactTable يسبّب حلقة autoReset
const EMPTY: SaleResponse[] = [];

export const useSales = () => {
	const { data, isLoading } = useQuery<SaleResponse[]>({
		queryKey: ["sales"],
		queryFn: async () => {
			const res = await api.sales.get();
			if (res.error) throw new Error("فشل جلب المبيعات");
			return res.data as SaleResponse[];
		},
		staleTime: 1000 * 60 * 2,
	});
	return { sales: Array.isArray(data) ? data : EMPTY, isLoading };
};
