import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { RadiologyStudyDetailResponse } from "@/server/radiology/radiology.type";

/** دراسة واحدة بسياق فحصها — يقرؤها عارض الصور المستقل */
export const useStudyDetail = (studyId: string | null) => {
	const { data, isLoading, isError } = useQuery<RadiologyStudyDetailResponse>({
		queryKey: ["radiology-study", studyId],
		enabled: !!studyId,
		queryFn: async () => {
			const res = await api.radiology.studies({ studyId: studyId as string }).get();
			if (res.error) throw new Error("فشل جلب الدراسة");
			return res.data as RadiologyStudyDetailResponse;
		},
		staleTime: 60_000,
	});

	return { study: data ?? null, isLoading, isError };
};
