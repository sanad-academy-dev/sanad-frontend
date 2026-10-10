import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { AiCoursePreview, AiGenerateOptions } from "@/server/training/training.type";

// رسالة خطأ من استجابة treaty (error.value قد يحمل { message })
const errMsg = (value: unknown, fallback: string) =>
	(typeof value === "object" && value && "message" in value
		? String((value as { message: unknown }).message)
		: null) || fallback;

// عمليات منشئ الدورة بالذكاء الاصطناعي: أسئلة توضيحية → توليد معاينة → حفظ كمسودّة
export const useAiCourse = () => {
	const questions = useMutation({
		mutationFn: async (brief: string) => {
			const { data, error } = await api.training.ai.questions.post({ brief });
			if (error) throw new Error(errMsg(error.value, "تعذّر توليد الأسئلة"));
			return data.questions;
		},
	});

	const generate = useMutation({
		mutationFn: async (input: { brief: string; options: AiGenerateOptions }) => {
			const { data, error } = await api.training.ai.generate.post(input);
			if (error) throw new Error(errMsg(error.value, "تعذّر توليد الدورة"));
			return data as AiCoursePreview;
		},
	});

	const save = useMutation({
		mutationFn: async (course: AiCoursePreview) => {
			const { data, error } = await api.training.ai.save.post({ course });
			if (error) throw new Error(errMsg(error.value, "تعذّر حفظ الدورة"));
			return data as { id: string };
		},
	});

	return {
		askQuestions: questions.mutateAsync,
		isAsking: questions.isPending,
		generate: generate.mutateAsync,
		isGenerating: generate.isPending,
		save: save.mutateAsync,
		isSaving: save.isPending,
	};
};
