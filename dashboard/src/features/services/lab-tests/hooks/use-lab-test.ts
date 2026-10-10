import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { LabTestOrderResponse } from "@/server/lab-tests/lab-tests.type";

export const useLabTest = (id: string | null) => {
	const { data, isLoading } = useQuery<LabTestOrderResponse>({
		queryKey: ["lab-test", id],
		enabled: !!id,
		queryFn: async () => {
			const res = await api["lab-tests"]({ id: id as string }).get();
			if (res.error) throw new Error("فشل جلب التحليل");
			return res.data as LabTestOrderResponse;
		},
	});

	return { labTest: data ?? null, isLoading };
};
