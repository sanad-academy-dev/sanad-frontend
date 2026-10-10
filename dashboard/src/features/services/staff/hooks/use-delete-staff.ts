import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useDeleteStaff = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api.staff({ id }).delete();
			if (res.error) throw new Error("فشل حذف الموظف");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["staff"] });
		},
	});

	const deleteStaff = async (id: string) =>
		toast.promise(mutation.mutateAsync(id), {
			loading: "جارٍ حذف الموظف...",
			success: "تم حذف الموظف بنجاح",
			error: (err: Error) => err.message || "فشل حذف الموظف",
		});

	return {
		deleteStaff,
		isPending: mutation.isPending,
	};
};
