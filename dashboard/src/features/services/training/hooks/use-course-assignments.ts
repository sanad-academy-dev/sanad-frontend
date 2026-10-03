import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	AssignmentResponse,
	AutoAssignRuleFormInput,
	AutoAssignRuleResponse,
	EligibleLearnerResponse,
} from "@/server/course-assignments/course-assignments.type";

const eligibleKey = (courseId: string, branchId?: string) =>
	["course-assignments", "eligible", courseId, branchId ?? "all"] as const;
const rosterKey = (courseId: string) => ["course-assignments", "roster", courseId] as const;
const rulesKey = (courseId: string) => ["course-assignments", "rules", courseId] as const;

// شبكة اختيار المتدربين — كل طاقم الأكاديمية النشط
export const useEligibleLearners = (courseId: string | null, branchId?: string) => {
	const { data, isLoading } = useQuery<EligibleLearnerResponse[]>({
		queryKey: eligibleKey(courseId ?? "", branchId),
		enabled: !!courseId,
		queryFn: async () => {
			const { data, error } = await api["course-assignments"].eligible.get({
				query: { courseId: courseId as string, ...(branchId ? { branchId } : {}) },
			});
			if (error) throw new Error("تعذّر تحميل الموظفين");
			return data as EligibleLearnerResponse[];
		},
	});
	return { learners: data ?? [], isLoading };
};

// قائمة المتدربين المُعيَّنين حاليًا (المصدر الموثوق للتحديد + لوحة المعيَّنين)
export const useCourseRoster = (courseId: string | null) => {
	const { data, isLoading } = useQuery<AssignmentResponse[]>({
		queryKey: rosterKey(courseId ?? ""),
		enabled: !!courseId,
		queryFn: async () => {
			const { data, error } = await api["course-assignments"].get({
				query: { courseId: courseId as string },
			});
			if (error) throw new Error("تعذّر تحميل المتدربين");
			return data as AssignmentResponse[];
		},
	});
	return { roster: data ?? [], isLoading };
};

// عمليات التعيين — تحديث متفائل للوحة المعيَّنين مع تراجع عند الفشل
export const useAssignmentActions = (courseId: string | null) => {
	const qc = useQueryClient();
	const rKey = rosterKey(courseId ?? "");
	const invalidate = () => {
		if (!courseId) return;
		qc.invalidateQueries({ queryKey: rKey });
		// بادئة تُبطل كل تباينات الفرع لقائمة المؤهلين
		qc.invalidateQueries({ queryKey: ["course-assignments", "eligible", courseId] });
		qc.invalidateQueries({ queryKey: ["training", "courses"] });
	};

	const assign = useMutation({
		mutationFn: async (staff: EligibleLearnerResponse) => {
			if (!courseId) throw new Error("لم يتم إنشاء الدورة بعد");
			const { data, error } = await api["course-assignments"].post({
				courseId,
				staffIds: [staff.id],
			});
			if (error) throw new Error("تعذّر تعيين المتدرّب");
			return data;
		},
		onMutate: async (staff) => {
			await qc.cancelQueries({ queryKey: rKey });
			const previous = qc.getQueryData<AssignmentResponse[]>(rKey);
			// إضافة سطر مؤقّت للوحة حتى يعود الخادم بالتعيين الحقيقي
			const optimistic = {
				id: `temp-${staff.id}`,
				staffId: staff.id,
				staff,
			} as unknown as AssignmentResponse;
			qc.setQueryData<AssignmentResponse[]>(rKey, [...(previous ?? []), optimistic]);
			return { previous };
		},
		onError: (e: Error, _s, ctx) => {
			if (ctx?.previous) qc.setQueryData(rKey, ctx.previous);
			toast.error(e.message);
		},
		onSettled: invalidate,
	});

	const unassign = useMutation({
		mutationFn: async (assignmentId: string) => {
			const { error } = await api["course-assignments"]({ id: assignmentId }).delete();
			if (error && error.status !== 404) throw new Error("تعذّر إلغاء التعيين");
		},
		onMutate: async (assignmentId) => {
			await qc.cancelQueries({ queryKey: rKey });
			const previous = qc.getQueryData<AssignmentResponse[]>(rKey);
			qc.setQueryData<AssignmentResponse[]>(
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

	const start = useMutation({
		mutationFn: async (assignmentId: string) => {
			const { error } = await api["course-assignments"]({ id: assignmentId }).start.post();
			if (error) throw new Error("تعذّر بدء الدورة");
		},
		onSettled: invalidate,
	});

	const enrollAll = useMutation({
		mutationFn: async () => {
			if (!courseId) throw new Error("لم يتم إنشاء الدورة بعد");
			const { error } = await api["course-assignments"]["enroll-all"].post({ courseId });
			if (error) throw new Error("تعذّر تسجيل الجميع");
		},
		onSettled: invalidate,
	});

	// تعيين دفعة من الموظفين (staffIds) في طلب واحد — يُستخدم لزر «تعيين» بعد الاختيار المرحلي
	const assignMany = useMutation({
		mutationFn: async (staffIds: string[]) => {
			if (!courseId) throw new Error("لم يتم إنشاء الدورة بعد");
			if (staffIds.length === 0) return;
			const { error } = await api["course-assignments"].post({ courseId, staffIds });
			if (error) throw new Error("تعذّر تعيين الموظفين");
		},
		onSettled: invalidate,
	});

	// تحديد سريع: تعيين جميع موظفي قسم محدّد
	const enrollByRole = useMutation({
		mutationFn: async (roleId: string) => {
			if (!courseId) throw new Error("لم يتم إنشاء الدورة بعد");
			const { error } = await api["course-assignments"]["enroll-by-role"].post({
				courseId,
				roleId,
			});
			if (error) throw new Error("تعذّر تعيين القسم");
		},
		onSettled: invalidate,
	});

	return {
		assign: assign.mutate,
		assignMany: assignMany.mutateAsync,
		isAssigning: assignMany.isPending,
		unassign: unassign.mutate,
		isUnassigning: unassign.isPending,
		start: (assignmentId: string) =>
			toast.promise(start.mutateAsync(assignmentId), {
				loading: "جارٍ بدء الدورة...",
				success: "تم بدء الدورة",
				error: (e: Error) => e.message,
			}),
		isStarting: start.isPending,
		enrollAll: () =>
			toast.promise(enrollAll.mutateAsync(), {
				loading: "جارٍ تسجيل الجميع...",
				success: "تم تسجيل جميع الموظفين",
				error: (e: Error) => e.message,
			}),
		enrollByRole: (roleId: string) =>
			toast.promise(enrollByRole.mutateAsync(roleId), {
				loading: "جارٍ تعيين القسم...",
				success: "تم تعيين موظفي القسم",
				error: (e: Error) => e.message,
			}),
		isBusy:
			assign.isPending || unassign.isPending || enrollAll.isPending || enrollByRole.isPending,
	};
};

// قواعد التعيين التلقائي — قراءة + حفظ (استبدال كامل)
export const useAutoAssignRules = (courseId: string | null) => {
	const qc = useQueryClient();
	const { data, isLoading } = useQuery<AutoAssignRuleResponse[]>({
		queryKey: rulesKey(courseId ?? ""),
		enabled: !!courseId,
		queryFn: async () => {
			const { data, error } = await api["course-assignments"].rules.get({
				query: { courseId: courseId as string },
			});
			if (error) throw new Error("تعذّر تحميل القواعد");
			return data as AutoAssignRuleResponse[];
		},
	});

	const save = useMutation({
		mutationFn: async (rules: AutoAssignRuleFormInput[]) => {
			if (!courseId) throw new Error("لم يتم إنشاء الدورة بعد");
			const { data, error } = await api["course-assignments"].rules.put({ courseId, rules });
			if (error) throw new Error("تعذّر حفظ القواعد");
			return data;
		},
		onSuccess: () => {
			if (courseId) qc.invalidateQueries({ queryKey: rulesKey(courseId) });
		},
	});

	return {
		rules: data ?? [],
		isLoading,
		saveRules: (rules: AutoAssignRuleFormInput[]) =>
			toast.promise(save.mutateAsync(rules), {
				loading: "جارٍ حفظ القواعد...",
				success: "تم حفظ قواعد التعيين التلقائي",
				error: (e: Error) => e.message,
			}),
		isSaving: save.isPending,
	};
};

// ===== مشغّل الدورة (تقدّم الدروس) =====

const lessonProgressKey = (assignmentId: string) =>
	["course-assignments", "lesson-progress", assignmentId] as const;

// معرّفات الدروس المكتملة لتعيين — لحلقات تقدّم الوحدات والتنقّل في المشغّل
export const useLessonProgress = (assignmentId: string | null) => {
	const { data, isLoading } = useQuery<{ lessonId: string }[]>({
		queryKey: lessonProgressKey(assignmentId ?? ""),
		enabled: !!assignmentId,
		queryFn: async () => {
			const { data, error } = await api["course-assignments"]({
				id: assignmentId as string,
			})["lesson-progress"].get();
			if (error) throw new Error("تعذّر تحميل تقدّم الدروس");
			return data as { lessonId: string }[];
		},
	});
	return {
		completedLessonIds: new Set((data ?? []).map((d) => d.lessonId)),
		isLoading,
	};
};

// تحديد درس كمكتمل — يُبطل تقدّم الدروس وقائمة التعيينات (لتحديث الحالة/النسبة)
export const useMarkLesson = (courseId: string | null) => {
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: async ({
			assignmentId,
			lessonId,
		}: {
			assignmentId: string;
			lessonId: string;
		}) => {
			const { error } = await api["course-assignments"]({ id: assignmentId })[
				"lesson-progress"
			].post({ lessonId });
			if (error) throw new Error("تعذّر حفظ تقدّم الدرس");
		},
		onSuccess: (_d, { assignmentId }) => {
			qc.invalidateQueries({ queryKey: lessonProgressKey(assignmentId) });
			if (courseId) {
				qc.invalidateQueries({ queryKey: ["course-assignments", "roster", courseId] });
			}
			qc.invalidateQueries({ queryKey: ["training", "courses"] });
		},
	});
	return { markLesson: mutation.mutateAsync, isMarking: mutation.isPending };
};
