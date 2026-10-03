import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type {
	AttemptResultResponse,
	PlayerAttemptResponse,
} from "@/server/quiz-attempts/quiz-attempts.type";

const msg = (error: unknown, fallback: string) =>
	(error as { value?: { message?: string } })?.value?.message || fallback;

// خطأ يحمل رمز حالة HTTP (لتمييز «استنفدت المحاولات» عن غيره في المشغّل)
class AttemptError extends Error {
	status: number;
	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}

export const useQuizPlayer = () => {
	const qc = useQueryClient();

	const start = useMutation({
		mutationFn: async (quizId: string) => {
			const { data, error } = await api["quiz-attempts"]["start-by-quiz"].post({ quizId });
			if (error) throw new AttemptError(msg(error, "تعذّر بدء الاختبار"), error.status ?? 500);
			return data as PlayerAttemptResponse;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["quiz-assignments"] }),
	});

	const submit = useMutation({
		mutationFn: async ({
			attemptId,
			answers,
		}: {
			attemptId: string;
			answers: {
				questionId: string;
				selectedOptions?: number[];
				answerText?: string;
			}[];
		}) => {
			const { data, error } = await api["quiz-attempts"]({ id: attemptId }).submit.post({
				answers,
			});
			if (error)
				throw new AttemptError(msg(error, "تعذّر تسليم الاختبار"), error.status ?? 500);
			return data as AttemptResultResponse;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["quiz-assignments"] });
			qc.invalidateQueries({ queryKey: ["training", "quizzes"] });
		},
	});

	return { start, submit };
};

// أفضل نتيجة للمتصل على اختبار (لعرض النتيجة عند استنفاد المحاولات)
export const useMyQuizResult = (quizId: string | null, enabled: boolean) => {
	const { data, isLoading } = useQuery<AttemptResultResponse | null>({
		queryKey: ["quiz-attempts", "my-result", quizId],
		enabled: enabled && !!quizId,
		queryFn: async () => {
			const { data, error } = await api["quiz-attempts"]["my-result"].get({
				query: { quizId: quizId as string },
			});
			if (error) {
				if (error.status === 404) return null;
				throw new Error(msg(error, "تعذّر تحميل النتيجة"));
			}
			return data as AttemptResultResponse;
		},
	});
	return { result: data ?? null, isLoading };
};

export { AttemptError };
