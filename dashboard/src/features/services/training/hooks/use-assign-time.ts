import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

type AssignTimePayload = {
	startDate?: string | null;
	dueDate?: string | null;
	timezone?: string | null;
};

// حفظ نافذة التعيين (الخطوة 3ب) — PUT /course-assignments/time. يُبطل كاش الدورة والروستر.
export const useAssignTime = (courseId: string | null) => {
	const qc = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (payload: AssignTimePayload) => {
			if (!courseId) throw new Error("لم يتم إنشاء الدورة بعد");
			const { data, error } = await api["course-assignments"].time.put({
				courseId,
				...payload,
			});
			if (error) throw new Error("تعذّر حفظ وقت التعيين");
			return data;
		},
		onSuccess: () => {
			if (!courseId) return;
			qc.invalidateQueries({ queryKey: ["training", "course", courseId] });
			qc.invalidateQueries({ queryKey: ["course-assignments", "roster", courseId] });
		},
	});

	return { saveTime: mutation.mutate, isSaving: mutation.isPending };
};
