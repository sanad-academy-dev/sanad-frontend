import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useDeletePatient = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api.patients({ id }).delete();
			if (res.error) throw new Error("فشل حذف الطفل");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["patients"] });
		},
	});

	const deletePatient = (id: string) =>
		toast.promise(mutation.mutateAsync(id), {
			loading: "جارٍ حذف الطفل...",
			success: "تم حذف الطفل بنجاح",
			error: (err: Error) => err.message || "فشل حذف الطفل",
		});

	return { deletePatient, isPending: mutation.isPending };
};
