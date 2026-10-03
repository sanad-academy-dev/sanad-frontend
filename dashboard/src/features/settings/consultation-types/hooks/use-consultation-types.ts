import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ConsultationTypeResponse } from "@/server/consultation-types/consultation-types.type";

export const useConsultationTypes = () => {
	const { data, isLoading } = useQuery<ConsultationTypeResponse[]>({
		queryKey: ["consultation-types"],
		queryFn: async () => {
			const res = await api["consultation-types"].get();
			if (res.error) throw new Error("فشل جلب أنواع الكشف");
			return res.data;
		},
	});

	return { types: data ?? [], isLoading };
};
