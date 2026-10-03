import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const useToggleBranchStatus = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
			const res = await api.branches({ id }).patch({ active });
			if (res.error) throw new Error("فشل تحديث حالة الفرع");
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["branches"] });
		},
	});

	const toggleStatus = (id: string, active: boolean) =>
		toast.promise(mutation.mutateAsync({ id, active }), {
			loading: "جارٍ تحديث الحالة...",
			success: active ? "تم تفعيل الفرع" : "تم تعطيل الفرع",
			error: (err: Error) => err.message || "فشل تحديث الحالة",
		});

	return { toggleStatus, isPending: mutation.isPending };
};
