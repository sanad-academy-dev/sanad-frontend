import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { ServiceSubcategoryResponse } from "@/server/services/services.type";

export type CreateSubcategoryInput = {
	categoryId: string;
	name: string;
};

export const useCreateSubcategory = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: CreateSubcategoryInput): Promise<ServiceSubcategoryResponse> => {
			const res = await api.subcategories.post(input);
			if (res.error) throw new Error("فشل إضافة المجموعة الفرعية");
			return res.data as ServiceSubcategoryResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["services", "tree"] });
		},
	});

	const createSubcategory = (
		input: CreateSubcategoryInput,
		options?: { onSuccess?: () => void },
	) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ إضافة المجموعة الفرعية...",
			success: () => {
				options?.onSuccess?.();
				return "تمت إضافة المجموعة الفرعية بنجاح";
			},
			error: (err: Error) => err.message || "فشل إضافة المجموعة الفرعية",
		});

	return { createSubcategory, isPending: mutation.isPending };
};
