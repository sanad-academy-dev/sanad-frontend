import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { SpecializationCategoryResponse } from "@/server/specializations/specializations.type";

export const useSpecializationsTree = () => {
	const { data, isLoading } = useQuery<SpecializationCategoryResponse[]>({
		queryKey: ["specializations", "tree"],
		queryFn: async () => {
			const res = await api.specializations.get();
			if (res.error) throw new Error("فشل جلب قائمة التخصصات");
			return res.data as SpecializationCategoryResponse[];
		},
	});

	return { tree: data ?? [], isLoading };
};
