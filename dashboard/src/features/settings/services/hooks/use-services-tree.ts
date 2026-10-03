import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ServiceCategoryResponse } from "@/server/services/services.type";

export const useServicesTree = () => {
	const { data, isLoading } = useQuery<ServiceCategoryResponse[]>({
		queryKey: ["services", "tree"],
		queryFn: async () => {
			const res = await api.services.get();
			if (res.error) throw new Error("فشل جلب قائمة الدورات");
			return res.data;
		},
	});

	return { tree: data ?? [], isLoading };
};
