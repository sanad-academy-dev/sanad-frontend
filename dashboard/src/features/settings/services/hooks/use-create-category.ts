import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { ServiceCategoryResponse } from "@/server/services/services.type";

export type CreateCategoryInput = { name: string };

export const useCreateCategory = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: CreateCategoryInput): Promise<ServiceCategoryResponse> => {
			const res = await api.categories.post(input);
			if (res.error) throw new Error("فشل إضافة التصنيف");
			return res.data as ServiceCategoryResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["services", "tree"] });
		},
	});

	const createCategory = (input: CreateCategoryInput, options?: { onSuccess?: () => void }) =>
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
