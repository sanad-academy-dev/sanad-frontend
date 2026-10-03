import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useToggleServiceItem = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
			const res = await api.services({ id }).patch({ isActive });
			console.log("res", res);
			if (res.error) throw new Error(isActive ? "فشل تفعيل الدورة" : "فشل تعطيل الدورة");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["services", "tree"] });
		},
	});

	const toggleServiceItem = (id: string, isActive: boolean) =>
		toast.promise(mutation.mutateAsync({ id, isActive }), {
			loading: isActive ? "جارٍ تفعيل الدورة..." : "جارٍ تعطيل الدورة...",
			success: isActive ? "تم تفعيل الدورة" : "تم تعطيل الدورة",
			error: (err: Error) => err.message || "فشل تحديث حالة الدورة",
		});

	return { toggleServiceItem, isPending: mutation.isPending };
};
