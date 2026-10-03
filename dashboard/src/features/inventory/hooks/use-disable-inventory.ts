import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useDisableInventory = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id }: { id: string }) => {
			const res = await api.inventory({ id }).disable.post();
			if (res.error) throw new Error("فشل تعطيل المنتج");
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inventory"] });
			queryClient.invalidateQueries({ queryKey: ["stock-overview"] });
		},
	});

	const disableInventory = (id: string) =>
		toast.promise(mutation.mutateAsync({ id }), {
			loading: "جارٍ تعطيل المنتج...",
			success: "تم تعطيل المنتج بنجاح",
			error: (err: Error) => err.message || "فشل تعطيل المنتج",
		});

	return { disableInventory, isPending: mutation.isPending };
};
