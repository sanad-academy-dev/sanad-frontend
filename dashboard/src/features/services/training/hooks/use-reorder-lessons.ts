import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type {
	CourseDetailResponse,
	ReorderLessonInput,
} from "@/server/training/training.type";

export function useReorderLessons(courseId: string | null) {
	const queryClient = useQueryClient();
	const queryKey = ["training", "course", courseId ?? ""] as const;

	const mutation = useMutation({
		mutationFn: async (items: ReorderLessonInput[]) => {
			if (!courseId) throw new Error("لم يتم إنشاء الدورة بعد");
			const { data, error } = await api.training
				.courses({ id: courseId })
				.lessons.reorder.patch({ items });
			if (error) throw new Error("تعذّر ترتيب الدروس");
			return data;
		},
		onMutate: async (items) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<CourseDetailResponse>(queryKey);
			if (!previous) return { previous };
			const byLesson = new Map(items.map((item) => [item.lessonId, item]));
			const allLessons = previous.units.flatMap((unit) => unit.lessons);
			const units = previous.units.map((unit) => ({
				...unit,
				lessons: allLessons
					.map((lesson) => {
						const position = byLesson.get(lesson.id);
						return position
							? {
									...lesson,
									unitId: position.unitId,
									order: position.position,
									...(position.contents
										? {
												contents: position.contents,
												type: position.contents[0]?.type ?? "TEXT",
												mediaSource: position.contents[0]?.mediaSource ?? null,
												mediaKey: position.contents[0]?.mediaKey ?? null,
												mediaUrl: position.contents[0]?.mediaUrl ?? null,
												content: position.contents[0]?.content ?? null,
											}
										: {}),
								}
							: lesson;
					})
					.filter((lesson) => lesson.unitId === unit.id)
					.sort((a, b) => a.order - b.order),
			}));
			queryClient.setQueryData<CourseDetailResponse>(queryKey, { ...previous, units });
			return { previous };
		},
		onError: (error: Error, _items, context) => {
			if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
			toast.error(error.message || "تعذّر ترتيب الدروس");
		},
		onSettled: () => {
			if (courseId) queryClient.invalidateQueries({ queryKey });
		},
	});

	return { reorderLessons: mutation.mutateAsync, isReordering: mutation.isPending };
}
