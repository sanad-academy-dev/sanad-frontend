import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const useDeleteBranch = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api.branches({ id }).delete();
			if (res.error) throw new Error("فشل حذف الفرع");
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["branches"] });
		},
	});

	const deleteBranch = (id: string) =>
		toast.promise(mutation.mutateAsync(id), {
			loading: "جارٍ حذف الفرع...",
			success: "تم حذف الفرع",
			error: (err: Error) => err.message || "فشل حذف الفرع",
		});

	return { deleteBranch, isPending: mutation.isPending };
};
