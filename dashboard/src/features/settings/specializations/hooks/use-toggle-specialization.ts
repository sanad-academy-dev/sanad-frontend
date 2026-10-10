import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useToggleSpecialization = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
			const res = await api.specializations({ id }).toggle.patch({ isActive });
			if (res.error) throw new Error(isActive ? "فشل تفعيل التخصص" : "فشل تعطيل التخصص");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["specializations", "tree"] });
		},
	});

	const toggleSpecialization = (id: string, isActive: boolean) =>
		toast.promise(mutation.mutateAsync({ id, isActive }), {
			loading: isActive ? "جارٍ تفعيل التخصص..." : "جارٍ تعطيل التخصص...",
			success: isActive ? "تم تفعيل التخصص" : "تم تعطيل التخصص",
			error: (err: Error) => err.message || "فشل تحديث حالة التخصص",
		});

	return { toggleSpecialization, isPending: mutation.isPending };
};
