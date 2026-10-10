import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useDeleteOwner = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id, newOwnerId }: { id: string; newOwnerId?: string }) => {
			const res = await api.owners({ id }).delete({ newOwnerId });
			if (res.error) throw new Error("فشل حذف وليّ الأمر");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["owners"] });
		},
	});

	const deleteOwner = (id: string, newOwnerId?: string) =>
		toast.promise(mutation.mutateAsync({ id, newOwnerId }), {
			loading: "جارٍ حذف وليّ الأمر...",
			success: "تم حذف وليّ الأمر بنجاح",
			error: (err: Error) => err.message || "فشل حذف وليّ الأمر",
		});

	return { deleteOwner, isPending: mutation.isPending };
};
