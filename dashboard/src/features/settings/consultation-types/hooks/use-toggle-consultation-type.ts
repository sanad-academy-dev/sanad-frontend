import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useToggleConsultationType = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
			const res = await api["consultation-types"]({ id }).patch({ active });
			if (res.error) throw new Error(active ? "فشل تفعيل نوع الكشف" : "فشل تعطيل نوع الكشف");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["consultation-types"] });
		},
	});

	const toggleConsultationType = (id: string, active: boolean) =>
		toast.promise(mutation.mutateAsync({ id, active }), {
			loading: active ? "جارٍ تفعيل نوع الكشف..." : "جارٍ تعطيل نوع الكشف...",
			success: active ? "تم تفعيل نوع الكشف" : "تم تعطيل نوع الكشف",
			error: (err: Error) => err.message || "فشل تحديث حالة نوع الكشف",
		});

	return { toggleConsultationType, isPending: mutation.isPending };
};
