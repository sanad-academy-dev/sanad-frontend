import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ExamTemplateResponse } from "@/server/clinical-notes/clinical-notes.type";

export const EXAM_TEMPLATES_QUERY_KEY = ["exam-templates"] as const;

/**
 * [S3] قوالب الفحص — قوالب الأكاديمية وقوالب النظام معًا.
 *
 * الخادم يعيد الاثنين في قائمة واحدة، ويُميَّز قالب النظام بأن `clinicId === null`.
 * لا يُفصَلان هنا: المدرّب يبحث عن قالب لشكوى، لا عن وليّ أمره.
 */
export const useExamTemplates = () => {
	const { data, isLoading, refetch } = useQuery<ExamTemplateResponse[]>({
		queryKey: EXAM_TEMPLATES_QUERY_KEY,
		queryFn: async () => {
			const res = await api["exam-templates"].get();
			if (res.error) throw new Error("فشل جلب قوالب الفحص");
			return res.data as ExamTemplateResponse[];
		},
		staleTime: 1000 * 60 * 5,
	});

	return { templates: data ?? [], isLoading, refetch };
};
