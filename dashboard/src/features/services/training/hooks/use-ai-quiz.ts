import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { AiQuizOptions, AiQuizPreview } from "@/server/quizzes/quizzes.type";

// رسالة خطأ من استجابة treaty (error.value قد يحمل { message })
const errMsg = (value: unknown, fallback: string) =>
	(typeof value === "object" && value && "message" in value
		? String((value as { message: unknown }).message)
		: null) || fallback;

// منشئ الاختبار بالذكاء الاصطناعي — توليد معاينة فقط؛ الإضافة تتم في نموذج اللوحة
export const useAiQuiz = () => {
	const generate = useMutation({
		mutationFn: async (input: { brief: string; options: AiQuizOptions }) => {
			const { data, error } = await api.quizzes.ai.generate.post(input);
			if (error) throw new Error(errMsg(error.value, "تعذّر توليد الاختبار"));
			return data as AiQuizPreview;
		},
	});

	return { generate: generate.mutateAsync, isGenerating: generate.isPending };
};
