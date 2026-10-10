import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { SpecializationSubcategoryResponse } from "@/server/specializations/specializations.type";

export type CreateSpecializationSubcategoryInput = {
	categoryId: string;
	name: string;
	description?: string;
};

export const useCreateSpecializationSubcategory = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (
			input: CreateSpecializationSubcategoryInput,
		): Promise<SpecializationSubcategoryResponse> => {
			const res = await api["specialization-subcategories"].post(input);
			if (res.error) throw new Error("فشل إضافة التخصص الفرعي");
			return res.data as SpecializationSubcategoryResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["specializations", "tree"] });
		},
	});

	const createSubcategory = (
		input: CreateSpecializationSubcategoryInput,
		options?: { onSuccess?: () => void },
	) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ إضافة التخصص الفرعي...",
			success: () => {
				options?.onSuccess?.();
				return "تمت إضافة التخصص الفرعي بنجاح";
			},
			error: (err: Error) => err.message || "فشل إضافة التخصص الفرعي",
		});

	return { createSubcategory, isPending: mutation.isPending };
};
