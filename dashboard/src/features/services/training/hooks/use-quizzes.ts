import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CreateQuizFormInput,
	QuizListItemResponse,
	QuizResponse,
	QuizStatsResponse,
	UpdateQuizFormInput,
} from "@/server/quizzes/quizzes.type";

const QUIZZES_KEY = ["training", "quizzes"] as const;
const STATS_KEY = ["training", "quizzes", "stats"] as const;
const quizKey = (id: string) => ["training", "quiz", id] as const;

// رسالة الخطأ من جسم استجابة Elysia (message عربي) مع احتياطي
const errMessage = (error: unknown, fallback: string) =>
	(error as { value?: { message?: string } })?.value?.message || fallback;

export const useQuizzes = () => {
	const { data, isLoading } = useQuery<QuizListItemResponse[]>({
		queryKey: QUIZZES_KEY,
		queryFn: async () => {
			const { data, error } = await api.quizzes.get();
			if (error) throw new Error("تعذّر تحميل الاختبارات");
			return data as QuizListItemResponse[];
		},
	});
	return { quizzes: data ?? [], isLoading };
};

export const useQuizStats = () => {
	const { data } = useQuery<QuizStatsResponse>({
		queryKey: STATS_KEY,
		queryFn: async () => {
			const { data, error } = await api.quizzes.stats.get();
			if (error) throw new Error("تعذّر تحميل إحصائيات الاختبارات");
			return data;
		},
	});
	return { stats: data };
};

// تفاصيل اختبار (بالأسئلة) — لترطيب لوحة التعديل
export const useQuiz = (id: string | null) => {
	const { data, isLoading } = useQuery<QuizResponse>({
		queryKey: quizKey(id ?? "new"),
		enabled: !!id,
		queryFn: async () => {
			const { data, error } = await api.quizzes({ id: id as string }).get();
			if (error) throw new Error("تعذّر تحميل الاختبار");
			return data as QuizResponse;
		},
	});
	return { quiz: data, isLoading };
};

export const useCreateQuiz = () => {
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (values: CreateQuizFormInput) => {
			const { data, error } = await api.quizzes.post(values);
			if (error) throw new Error(errMessage(error, "تعذّر إنشاء الاختبار"));
			return data as QuizResponse;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: QUIZZES_KEY });
			qc.invalidateQueries({ queryKey: STATS_KEY });
		},
	});
	const createQuiz = (values: CreateQuizFormInput) => {
		const promise = mutation.mutateAsync(values);
		toast.promise(promise, {
			loading: "جارٍ إنشاء الاختبار...",
			success: "تم إنشاء الاختبار",
			error: (e: Error) => e.message || "تعذّر إنشاء الاختبار",
		});
		return promise;
	};
	return { createQuiz, isPending: mutation.isPending };
};

export const useUpdateQuiz = (id: string | null) => {
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (values: UpdateQuizFormInput) => {
			if (!id) throw new Error("لا يوجد اختبار للتعديل");
			const { data, error } = await api.quizzes({ id }).put(values);
			if (error) throw new Error(errMessage(error, "تعذّر تحديث الاختبار"));
			return data as QuizResponse;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: QUIZZES_KEY });
			qc.invalidateQueries({ queryKey: STATS_KEY });
			if (id) qc.invalidateQueries({ queryKey: quizKey(id) });
		},
	});
	// حفظ صامت (بلا توست) — يُستدعى بين خطوات اللوحة؛ التوست يُدار عند الإجراء النهائي
	const updateQuiz = (values: UpdateQuizFormInput) => mutation.mutateAsync(values);
	return { updateQuiz, isPending: mutation.isPending };
};

export const usePublishQuiz = () => {
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.quizzes({ id }).publish.post();
			if (error) throw new Error(errMessage(error, "تعذّر نشر الاختبار"));
			return data as QuizResponse;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: QUIZZES_KEY });
			qc.invalidateQueries({ queryKey: STATS_KEY });
		},
	});
	return {
		publishQuiz: (id: string) => mutation.mutateAsync(id),
		isPending: mutation.isPending,
	};
};

export const useUnpublishQuiz = () => {
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.quizzes({ id }).unpublish.post();
			if (error) throw new Error(errMessage(error, "تعذّر إلغاء نشر الاختبار"));
			return data as QuizResponse;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: QUIZZES_KEY });
			qc.invalidateQueries({ queryKey: STATS_KEY });
		},
	});
	const unpublishQuiz = (id: string) => {
		const promise = mutation.mutateAsync(id);
		toast.promise(promise, {
			loading: "جارٍ إلغاء النشر...",
			success: "تم إرجاع الاختبار إلى مسودة",
			error: (e: Error) => e.message || "تعذّر إلغاء نشر الاختبار",
		});
		return promise;
	};
	return { unpublishQuiz, isPending: mutation.isPending };
};

export const useDeleteQuiz = () => {
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.quizzes({ id }).delete();
			if (error && error.status !== 404)
				throw new Error(errMessage(error, "تعذّر حذف الاختبار"));
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: QUIZZES_KEY });
			qc.invalidateQueries({ queryKey: STATS_KEY });
		},
	});
	const deleteQuiz = (id: string) => {
		const promise = mutation.mutateAsync(id);
		toast.promise(promise, {
			loading: "جارٍ حذف الاختبار...",
			success: "تم حذف الاختبار",
			error: (e: Error) => e.message || "تعذّر حذف الاختبار",
		});
		return promise;
	};
	return { deleteQuiz, isPending: mutation.isPending };
};
