import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type {
	AiSuggestResponse,
	AttemptResultResponse,
	GradingResponse,
	QuizRosterRowResponse,
} from "@/server/quiz-attempts/quiz-attempts.type";

const msg = (error: unknown, fallback: string) =>
	(error as { value?: { message?: string } })?.value?.message || fallback;

// روستر نتائج المدير على اختبار
export const useQuizManagerRoster = (quizId: string | null, enabled: boolean) => {
	const { data, isLoading } = useQuery<QuizRosterRowResponse[]>({
		queryKey: ["quiz-attempts", "roster", quizId],
		enabled: enabled && !!quizId,
		queryFn: async () => {
			const { data, error } = await api["quiz-attempts"].roster.get({
				query: { quizId: quizId as string },
			});
			if (error) throw new Error(msg(error, "تعذّر تحميل الروستر"));
			return data as QuizRosterRowResponse[];
		},
	});
	return { rows: data ?? [], isLoading };
};

// واجهة تصحيح الأسئلة النصّية لمحاولة
export const useAttemptGrading = (attemptId: string | null) => {
	const { data, isLoading } = useQuery<GradingResponse>({
		queryKey: ["quiz-attempts", "grading", attemptId],
		enabled: !!attemptId,
		queryFn: async () => {
			const { data, error } = await api["quiz-attempts"]({
				id: attemptId as string,
			}).grading.get();
			if (error) throw new Error(msg(error, "تعذّر تحميل التصحيح"));
			return data as GradingResponse;
		},
	});
	return { grading: data, isLoading };
};

// نتيجة محاولة (لعرض النتيجة داخل روستر المدير)
export const useAttemptResult = (attemptId: string | null) => {
	const { data, isLoading } = useQuery<AttemptResultResponse>({
		queryKey: ["quiz-attempts", "result", attemptId],
		enabled: !!attemptId,
		queryFn: async () => {
			const { data, error } = await api["quiz-attempts"]({
				id: attemptId as string,
			}).result.get();
			if (error) throw new Error(msg(error, "تعذّر تحميل النتيجة"));
			return data as AttemptResultResponse;
		},
	});
	return { result: data, isLoading };
};

export const useGradeActions = () => {
	const qc = useQueryClient();

	const grade = useMutation({
		mutationFn: async ({
			attemptId,
			grades,
		}: {
			attemptId: string;
			grades: { questionId: string; awardedPoints: number }[];
		}) => {
			const { data, error } = await api["quiz-attempts"]({ id: attemptId }).grade.post({
				grades,
			});
			if (error) throw new Error(msg(error, "تعذّر اعتماد الدرجات"));
			return data as GradingResponse;
		},
		onSuccess: (_d, { attemptId }) => {
			qc.invalidateQueries({ queryKey: ["quiz-attempts", "grading", attemptId] });
			qc.invalidateQueries({ queryKey: ["quiz-attempts", "roster"] });
			qc.invalidateQueries({ queryKey: ["quiz-assignments"] });
		},
	});

	// اقتراح درجة بالذكاء — دائمًا اقتراح يؤكّده المدير
	const aiSuggest = useMutation({
		mutationFn: async ({
			attemptId,
			questionId,
		}: {
			attemptId: string;
			questionId: string;
		}) => {
			const { data, error } = await api["quiz-attempts"]["ai-suggest"].post({
				attemptId,
				questionId,
			});
			if (error) throw new Error(msg(error, "تعذّر اقتراح الدرجة"));
			return data as AiSuggestResponse;
		},
	});

	return { grade, aiSuggest };
};
