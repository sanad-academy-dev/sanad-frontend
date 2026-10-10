import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CourseDetailResponse,
	ReorderContentInput,
} from "@/server/training/training.type";

// إعادة ترتيب بطاقات المحتوى — تحديث متفائل لكاش الدورة مع تراجع عند الفشل (يطابق نمط الريبو).
export const useReorderContents = (courseId: string | null) => {
	const qc = useQueryClient();
	const key = ["training", "course", courseId ?? ""] as const;

	const mutation = useMutation({
		mutationFn: async (items: ReorderContentInput[]) => {
			if (!courseId) throw new Error("لم يتم إنشاء الدورة بعد");
			const { data, error } = await api.training
				.courses({ id: courseId })
				.contents.reorder.patch({ items });
			if (error) throw new Error("تعذّر إعادة الترتيب");
			return data;
		},
		onMutate: async (items) => {
			await qc.cancelQueries({ queryKey: key });
			const previous = qc.getQueryData<CourseDetailResponse>(key);
			if (previous) {
				// خريطة الترتيب الجديد: order عالمي 0-based حسب position + levelId لكل بطاقة
				const sorted = [...items].sort((a, b) => a.position - b.position);
				const orderById = new Map(
					sorted.map((it, index) => [it.unitId, { levelId: it.levelId, order: index }]),
				);
				const units = [...previous.units]
					.map((u) => {
						const next = orderById.get(u.id);
						return next ? { ...u, levelId: next.levelId, order: next.order } : u;
					})
					.sort((a, b) => a.order - b.order);
				qc.setQueryData<CourseDetailResponse>(key, { ...previous, units });
			}
			return { previous };
		},
		onError: (err: Error, _items, ctx) => {
			if (ctx?.previous) qc.setQueryData(key, ctx.previous);
			toast.error(err.message || "تعذّر إعادة الترتيب");
		},
		onSettled: () => {
			if (courseId) qc.invalidateQueries({ queryKey: key });
		},
	});

	return { reorderContents: mutation.mutateAsync, isReordering: mutation.isPending };
};
