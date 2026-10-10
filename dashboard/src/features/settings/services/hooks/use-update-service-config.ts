import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useUpdateServiceConfig = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			id,
			price,
			duration,
		}: {
			id: string;
			price?: number | null;
			duration?: number | null;
		}) => {
			const res = await api.services({ id }).patch({ price, duration });
			if (res.error) throw new Error("فشل تحديث الدورة");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["services", "tree"] });
		},
	});

	const updateServiceConfig = (
		id: string,
		data: { price?: number | null; duration?: number | null },
	) =>
		toast.promise(mutation.mutateAsync({ id, ...data }), {
			loading: "جارٍ تحديث الدورة...",
			success: "تم تحديث الدورة",
			error: (err: Error) => err.message || "فشل تحديث الدورة",
		});

	return { updateServiceConfig, isPending: mutation.isPending };
};
