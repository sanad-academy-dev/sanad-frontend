import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { SpecializationCategoryResponse } from "@/server/specializations/specializations.type";

export type CreateSpecializationCategoryInput = {
	name: string;
	description?: string;
};

export const useCreateSpecializationCategory = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (
			input: CreateSpecializationCategoryInput,
		): Promise<SpecializationCategoryResponse> => {
			const res = await api["specialization-categories"].post(input);
			if (res.error) throw new Error("فشل إضافة التصنيف");
			return res.data as SpecializationCategoryResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["specializations", "tree"] });
		},
	});

	const createCategory = (
		input: CreateSpecializationCategoryInput,
		options?: { onSuccess?: () => void },
	) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ إضافة التصنيف...",
			success: () => {
				options?.onSuccess?.();
				return "تمت إضافة التصنيف بنجاح";
			},
			error: (err: Error) => err.message || "فشل إضافة التصنيف",
		});

	return { createCategory, isPending: mutation.isPending };
};
