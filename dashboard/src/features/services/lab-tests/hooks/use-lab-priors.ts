import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { LabPriorResultResponse } from "@/server/lab-tests/lab-tests.type";

// نتائج سابقة لنفس الطفل ونفس التحليل — يقيّدها الخادم بالدورة نفسها،
// فلا تُقارَن صورة دم كاملة بسكر الدم.

export const useLabPriors = (itemId: string | null, enabled = true) => {
	const { data, isLoading } = useQuery({
		queryKey: ["lab-priors", itemId],
		enabled: enabled && !!itemId,
		staleTime: 1000 * 60,
		queryFn: async (): Promise<LabPriorResultResponse[]> => {
			const res = await api["lab-tests"].items({ itemId: itemId as string }).priors.get();
			if (res.error) throw new Error("تعذّر تحميل النتائج السابقة");
			return res.data;
		},
	});

	return { priors: data ?? [], isLoading };
};
