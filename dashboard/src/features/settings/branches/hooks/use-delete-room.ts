import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useDeleteRoom = (branchId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (roomId: string) => {
			const res = await api.branches({ id: branchId }).rooms({ roomId }).delete();
			if (res.error) throw new Error("فشل حذف القاعة");
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rooms", branchId] });
			queryClient.invalidateQueries({ queryKey: ["branches"] });
		},
	});

	const deleteRoom = (roomId: string) => {
		const p = mutation.mutateAsync(roomId);
		toast.promise(p, {
			loading: "جارٍ حذف القاعة...",
			success: "تم حذف القاعة",
			error: (err: Error) => err.message || "فشل حذف القاعة",
		});
		return p;
	};

	return { deleteRoom, isPending: mutation.isPending };
};
