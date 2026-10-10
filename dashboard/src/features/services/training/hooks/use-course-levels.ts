import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { LevelResponse } from "@/server/training/training.type";

// عمليات المستويات (طبقة التجميع فوق الوحدات) — تُبطل كاش الدورة لإعادة جلب الشجرة
export const useCourseLevels = (courseId: string | null) => {
	const qc = useQueryClient();
	const invalidate = () => {
		if (courseId) qc.invalidateQueries({ queryKey: ["training", "course", courseId] });
	};

	const addLevel = useMutation({
		mutationFn: async (name: string) => {
			if (!courseId) throw new Error("لم يتم إنشاء الدورة بعد");
			const { data, error } = await api.training.levels.post({ courseId, name });
			if (error) throw new Error("تعذّر إضافة المستوى");
			return data as LevelResponse;
		},
		onSuccess: invalidate,
	});

	const renameLevel = useMutation({
		mutationFn: async ({ id, name }: { id: string; name: string }) => {
			const { data, error } = await api.training.levels({ id }).patch({ name });
			if (error) throw new Error("تعذّر تعديل اسم المستوى");
			return data;
		},
		onSuccess: invalidate,
	});

	const removeLevel = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.training.levels({ id }).delete();
			if (error && error.status !== 404) throw new Error("تعذّر حذف المستوى");
		},
		onSuccess: invalidate,
	});

	return {
		addLevel: (name: string) =>
			toast.promise(addLevel.mutateAsync(name), {
				loading: "جارٍ إضافة المستوى...",
				success: "تمت إضافة المستوى",
				error: (e: Error) => e.message,
			}),
		renameLevel: (id: string, name: string) => renameLevel.mutateAsync({ id, name }),
		removeLevel: (id: string) => removeLevel.mutateAsync(id),
		isAddingLevel: addLevel.isPending,
	};
};
