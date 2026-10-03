import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { RadiologyOrderResponse } from "@/server/radiology/radiology.type";

export const useRadiologyOrder = (id: string | null) => {
	const { data, isLoading } = useQuery<RadiologyOrderResponse>({
		queryKey: ["radiology-order", id],
		enabled: !!id,
		queryFn: async () => {
			const res = await api.radiology({ id: id as string }).get();
			if (res.error) throw new Error("فشل جلب طلب الأشعة");
			return res.data as RadiologyOrderResponse;
		},
	});

	return { order: data ?? null, isLoading };
};
