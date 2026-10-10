import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { ConsultationTypeResponse } from "@/server/consultation-types/consultation-types.type";

export const useCreateConsultationType = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: {
			name: string;
			price?: number | null;
		}): Promise<ConsultationTypeResponse> => {
			const res = await api["consultation-types"].post(input);
			if (res.error) throw new Error("فشل إضافة نوع الكشف");
			return res.data as ConsultationTypeResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["consultation-types"] });
		},
	});

	const createConsultationType = (
		input: { name: string; price?: number | null },
		options?: { onSuccess?: () => void },
	) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ إضافة نوع الكشف...",
			success: () => {
				options?.onSuccess?.();
				return "تمت إضافة نوع الكشف بنجاح";
			},
			error: (err: Error) => err.message || "فشل إضافة نوع الكشف",
		});

	return { createConsultationType, isPending: mutation.isPending };
};
