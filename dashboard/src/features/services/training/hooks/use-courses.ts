import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CourseDetailResponse,
	CourseListItemResponse,
	CourseStatsResponse,
	CreateCourseFormInput,
	UpdateCourseInput,
} from "@/server/training/training.type";

const COURSES_KEY = ["training", "courses"] as const;
const STATS_KEY = ["training", "courses", "stats"] as const;
const courseKey = (id: string) => ["training", "course", id] as const;

export const useCourses = () => {
	const { data, isLoading } = useQuery<CourseListItemResponse[]>({
		queryKey: COURSES_KEY,
		queryFn: async () => {
			const { data, error } = await api.training.courses.get();
			if (error) throw new Error("تعذّر تحميل الدورات");
			return data as CourseListItemResponse[];
		},
	});

	return { courses: data ?? [], isLoading };
};

export const useCourseStats = () => {
	const { data, isLoading } = useQuery<CourseStatsResponse>({
		queryKey: STATS_KEY,
		queryFn: async () => {
			const { data, error } = await api.training.courses.stats.get();
			if (error) throw new Error("تعذّر تحميل إحصائيات الدورات");
			return data;
		},
	});

	return { stats: data, isLoading };
};

export const useCourse = (id: string | null) => {
	const { data, isLoading } = useQuery<CourseDetailResponse>({
		queryKey: courseKey(id ?? ""),
		enabled: !!id,
		queryFn: async () => {
			const { data, error } = await api.training.courses({ id: id as string }).get();
			if (error) throw new Error("تعذّر تحميل الدورة");
			return data as CourseDetailResponse;
		},
	});

	return { course: data, isLoading };
};

// حمولة الإنشاء: يقبل مسار المعالج (targetRoleId) ومسار اللوحة الجانبية الأصلي (department نص حر).
// الخادم يقبل الحقلين اختياريين، لذا نجعل targetRoleId اختياريًا هنا لدعم التدفّقين.
type CreateCoursePayload = Omit<CreateCourseFormInput, "targetRoleId"> & {
	targetRoleId?: string;
	coverKey?: string | null;
};

export const useCreateCourse = () => {
	const qc = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (values: CreateCoursePayload) => {
			const { data, error } = await api.training.courses.post(values);
			if (error) throw new Error("تعذّر إنشاء الدورة");
			return data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: COURSES_KEY });
			qc.invalidateQueries({ queryKey: STATS_KEY });
		},
	});

	// يعيد الدورة المُنشأة ليستخدمها المستدعي، مع إظهار التوست في نفس الوقت
	const createCourse = (values: CreateCoursePayload) => {
		const promise = mutation.mutateAsync(values);
		toast.promise(promise, {
			loading: "جارٍ إنشاء الدورة...",
			success: "تم إنشاء الدورة التدريبية",
			error: (e: Error) => e.message || "تعذّر إنشاء الدورة",
		});
		return promise;
	};

	return { createCourse, isPending: mutation.isPending };
};

// حذف دورة — يُبطل كاش القائمة والإحصائيات
export const useDeleteCourse = () => {
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.training.courses({ id }).delete();
			if (error && error.status !== 404) throw new Error("تعذّر حذف الدورة");
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: COURSES_KEY });
			qc.invalidateQueries({ queryKey: STATS_KEY });
		},
	});
	const deleteCourse = (id: string) =>
		toast.promise(mutation.mutateAsync(id), {
			loading: "جارٍ حذف الدورة...",
			success: "تم حذف الدورة",
			error: (e: Error) => e.message,
		});
	return { deleteCourse, isDeleting: mutation.isPending };
};

// استنساخ دورة — نسخة مسودّة كاملة؛ يُبطل كاش القائمة والإحصائيات.
// يعرض mutateAsync خامًا ليتولّى المستدعي عرض صفّ التقدّم المضمّن وتوست النجاح مع «تراجع».
export const useDuplicateCourse = () => {
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.training.courses({ id }).duplicate.post();
			if (error) throw new Error("تعذّر استنساخ الدورة");
			return data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: COURSES_KEY });
			qc.invalidateQueries({ queryKey: STATS_KEY });
		},
	});
	return { duplicateCourse: mutation.mutateAsync, isDuplicating: mutation.isPending };
};

// تعطيل دورة — أرشفتها عبر PATCH الحالة؛ يُبطل كاش القائمة والإحصائيات
export const useArchiveCourse = () => {
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.training.courses({ id }).patch({ status: "ARCHIVED" });
			if (error) throw new Error("تعذّر تعطيل الدورة");
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: COURSES_KEY });
			qc.invalidateQueries({ queryKey: STATS_KEY });
		},
	});
	const archiveCourse = (id: string) =>
		toast.promise(mutation.mutateAsync(id), {
			loading: "جارٍ تعطيل الدورة...",
			success: "تم تعطيل الدورة",
			error: (e: Error) => e.message || "تعذّر تعطيل الدورة",
		});
	return { archiveCourse, isArchiving: mutation.isPending };
};

// إلغاء تعطيل دورة — إعادتها إلى «منشورة» عبر PATCH الحالة؛ يُبطل كاش القائمة والإحصائيات
export const useRestoreCourse = () => {
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.training.courses({ id }).patch({ status: "PUBLISHED" });
			if (error) throw new Error("تعذّر إلغاء تعطيل الدورة");
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: COURSES_KEY });
			qc.invalidateQueries({ queryKey: STATS_KEY });
		},
	});
	const restoreCourse = (id: string) =>
		toast.promise(mutation.mutateAsync(id), {
			loading: "جارٍ إلغاء تعطيل الدورة...",
			success: "تم إلغاء تعطيل الدورة",
			error: (e: Error) => e.message || "تعذّر إلغاء تعطيل الدورة",
		});
	return { restoreCourse, isRestoring: mutation.isPending };
};

// تحديث الدورة (حفظ تلقائي لكل خطوة من المعالج) — يُبطل كاش الدورة والقائمة
export const useUpdateCourse = (courseId: string | null) => {
	const qc = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (values: UpdateCourseInput) => {
			if (!courseId) throw new Error("لم يتم إنشاء الدورة بعد");
			const { data, error } = await api.training
				.courses({ id: courseId })
				.patch(values as Record<string, unknown>);
			if (error) throw new Error("تعذّر حفظ التغييرات");
			return data;
		},
		onSuccess: () => {
			if (courseId) qc.invalidateQueries({ queryKey: courseKey(courseId) });
			qc.invalidateQueries({ queryKey: COURSES_KEY });
			qc.invalidateQueries({ queryKey: STATS_KEY });
		},
	});

	return { updateCourse: mutation.mutateAsync, isUpdating: mutation.isPending };
};

// ضبط قائمة مدربي الدورة (استبدال كامل) — يُبطل كاش القائمة لتحديث عمود «المدربين».
// يأخذ courseId صراحةً لأن معرّف الدورة قد يكون طازجًا بعد الإنشاء (حالة الـ state لم تُحدَّث بعد).
export const useSetTrainers = () => {
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: async ({ courseId, staffIds }: { courseId: string; staffIds: string[] }) => {
			const { data, error } = await api.training
				.courses({ id: courseId })
				.trainers.put({ staffIds });
			if (error) throw new Error("تعذّر حفظ المدربين");
			return data;
		},
		onSuccess: (_data, { courseId }) => {
			qc.invalidateQueries({ queryKey: courseKey(courseId) });
			qc.invalidateQueries({ queryKey: COURSES_KEY });
		},
	});
	return {
		setTrainers: (courseId: string, staffIds: string[]) =>
			mutation.mutateAsync({ courseId, staffIds }),
		isSavingTrainers: mutation.isPending,
	};
};
