import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { SupplierResponse } from "@/server/suppliers/suppliers.type";

// مرجع ثابت — تمرير مصفوفة جديدة كل render إلى useReactTable يسبّب حلقة autoReset
const EMPTY: SupplierResponse[] = [];

export const useSuppliers = () => {
	const { data, isLoading } = useQuery<SupplierResponse[]>({
		queryKey: ["suppliers"],
		queryFn: async () => {
			const res = await api.suppliers.get();
			if (res.error) throw new Error("فشل جلب الموردين");
			return res.data as SupplierResponse[];
		},
		staleTime: 1000 * 60 * 5,
	});
	return { suppliers: Array.isArray(data) ? data : EMPTY, isLoading };
};
