import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	EligibleQuizLearnerResponse,
	QuizAssignmentResponse,
} from "@/server/quiz-assignments/quiz-assignments.type";

const eligibleKey = (quizId: string) => ["quiz-assignments", "eligible", quizId] as const;
const rosterKey = (quizId: string) => ["quiz-assignments", "roster", quizId] as const;

// نافذة تعيين اختيارية تُرفق بكل تعيين يُنشأ (تُقرأ من خطوة التعيين)
export type QuizAssignWindow = { startDate?: string; dueDate?: string };

export const useEligibleQuizLearners = (quizId: string | null) => {
	const { data, isLoading } = useQuery<EligibleQuizLearnerResponse[]>({
		queryKey: eligibleKey(quizId ?? ""),
		enabled: !!quizId,
		queryFn: async () => {
			const { data, error } = await api["quiz-assignments"].eligible.get({
				query: { quizId: quizId as string },
			});
			if (error) throw new Error("تعذّر تحميل الموظفين");
			return data as EligibleQuizLearnerResponse[];
		},
	});
	return { learners: data ?? [], isLoading };
};

export const useQuizRoster = (quizId: string | null) => {
	const { data, isLoading } = useQuery<QuizAssignmentResponse[]>({
		queryKey: rosterKey(quizId ?? ""),
		enabled: !!quizId,
		queryFn: async () => {
			const { data, error } = await api["quiz-assignments"].get({
				query: { quizId: quizId as string },
			});
			if (error) throw new Error("تعذّر تحميل الموظفين المُعيَّنين");
			return data as QuizAssignmentResponse[];
		},
	});
	return { roster: data ?? [], isLoading };
};

// عمليات التعيين — تحديث متفائل للوحة المعيَّنين مع تراجع عند الفشل
export const useQuizAssignmentActions = (quizId: string | null) => {
	const qc = useQueryClient();
	const rKey = rosterKey(quizId ?? "");
	const invalidate = () => {
		if (!quizId) return;
		qc.invalidateQueries({ queryKey: rKey });
		qc.invalidateQueries({ queryKey: eligibleKey(quizId) });
		qc.invalidateQueries({ queryKey: ["training", "quizzes"] });
	};

	const assign = useMutation({
		mutationFn: async ({
			staff,
			window,
		}: {
			staff: EligibleQuizLearnerResponse;
			window?: QuizAssignWindow;
		}) => {
			if (!quizId) throw new Error("لم يتم إنشاء الاختبار بعد");
			const { error } = await api["quiz-assignments"].post({
				quizId,
				staffIds: [staff.id],
				...(window?.startDate ? { startDate: window.startDate } : {}),
				...(window?.dueDate ? { dueDate: window.dueDate } : {}),
			});
			if (error) throw new Error("تعذّر تعيين الموظف");
		},
		onMutate: async ({ staff }) => {
			await qc.cancelQueries({ queryKey: rKey });
			const previous = qc.getQueryData<QuizAssignmentResponse[]>(rKey);
			const optimistic = {
				id: `temp-${staff.id}`,
				staffId: staff.id,
				staff,
				_count: { attempts: 0 },
			} as unknown as QuizAssignmentResponse;
			qc.setQueryData<QuizAssignmentResponse[]>(rKey, [...(previous ?? []), optimistic]);
			return { previous };
		},
		onError: (e: Error, _v, ctx) => {
			if (ctx?.previous) qc.setQueryData(rKey, ctx.previous);
			toast.error(e.message);
		},
		onSettled: invalidate,
	});

	const unassign = useMutation({
		mutationFn: async (assignmentId: string) => {
			const { error } = await api["quiz-assignments"]({ id: assignmentId }).delete();
			if (error && error.status !== 404) throw new Error("تعذّر إلغاء التعيين");
		},
		onMutate: async (assignmentId) => {
			await qc.cancelQueries({ queryKey: rKey });
			const previous = qc.getQueryData<QuizAssignmentResponse[]>(rKey);
			qc.setQueryData<QuizAssignmentResponse[]>(
				rKey,
				(previous ?? []).filter((a) => a.id !== assignmentId),
			);
			return { previous };
		},
		onError: (e: Error, _id, ctx) => {
			if (ctx?.previous) qc.setQueryData(rKey, ctx.previous);
			toast.error(e.message);
		},
		onSettled: invalidate,
	});

	const enrollAll = useMutation({
		mutationFn: async () => {
			if (!quizId) throw new Error("لم يتم إنشاء الاختبار بعد");
			const { error } = await api["quiz-assignments"]["enroll-all"].post({ quizId });
			if (error) throw new Error("تعذّر تسجيل الجميع");
		},
		onSettled: invalidate,
	});

	return {
		assign: (staff: EligibleQuizLearnerResponse, window?: QuizAssignWindow) =>
			assign.mutate({ staff, window }),
		unassign: unassign.mutate,
		enrollAll: () =>
			toast.promise(enrollAll.mutateAsync(), {
				loading: "جارٍ تسجيل الجميع...",
				success: "تم تسجيل جميع الموظفين",
				error: (e: Error) => e.message,
			}),
		isBusy: assign.isPending || unassign.isPending || enrollAll.isPending,
	};
};
