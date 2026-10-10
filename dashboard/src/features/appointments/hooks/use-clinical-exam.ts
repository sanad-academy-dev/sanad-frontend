import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ClinicalExamResponse } from "@/server/clinical-exams/clinical-exams.type";

export const useClinicalExam = (appointmentId: string | null) => {
	const { data, isLoading } = useQuery<ClinicalExamResponse | null>({
		queryKey: ["clinical-exam", appointmentId],
		queryFn: async () => {
			if (!appointmentId) throw new Error("no appointment id");
			const res = await api.appointments({ id: appointmentId })["clinical-exam"].get();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر جلب الفحص السريري");
			}
			return res.data;
		},
		enabled: !!appointmentId,
		staleTime: 30 * 1000,
	});

	return { exam: data ?? null, isLoading };
};
