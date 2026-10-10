import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { ServiceItemResponse } from "@/server/services/services.type";

export type CreateServiceItemInput = {
	subcategoryId: string;
	name: string;
	price?: number | null;
	duration?: number | null;
	isActive?: boolean;
};

export const useCreateServiceItem = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: CreateServiceItemInput): Promise<ServiceItemResponse> => {
			const res = await api.services.post(input);
			if (res.error) throw new Error("فشل إضافة الدورة");
			return res.data as ServiceItemResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["services", "tree"] });
		},
	});

	const createServiceItem = (
		input: CreateServiceItemInput,
		options?: { onSuccess?: () => void },
	) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ إضافة الدورة...",
			success: () => {
				options?.onSuccess?.();
				return "تمت إضافة الدورة بنجاح";
			},
			error: (err: Error) => err.message || "فشل إضافة الدورة",
		});

	return { createServiceItem, isPending: mutation.isPending };
};
