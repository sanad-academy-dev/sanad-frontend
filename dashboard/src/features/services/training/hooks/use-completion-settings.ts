import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { CompletionSettingsInput } from "@/server/training/training.type";

// حفظ إعدادات الإكمال (الخطوة 4) — PUT /training/courses/:id/completion. يُبطل كاش الدورة.
export const useCompletionSettings = (courseId: string | null) => {
	const qc = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (payload: CompletionSettingsInput) => {
			if (!courseId) throw new Error("لم يتم إنشاء الدورة بعد");
			const { data, error } = await api.training
				.courses({ id: courseId })
				.completion.put(payload as Record<string, unknown>);
			if (error) throw new Error("تعذّر حفظ إعدادات الإكمال");
			return data;
		},
		onSuccess: () => {
			if (courseId) qc.invalidateQueries({ queryKey: ["training", "course", courseId] });
		},
	});

	return { saveCompletion: mutation.mutate, isSaving: mutation.isPending };
};
