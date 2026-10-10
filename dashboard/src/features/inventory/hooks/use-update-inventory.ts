import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { UpdateInventoryInput } from "@/server/inventory/inventory.type";

export const useUpdateInventory = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id, data }: { id: string; data: UpdateInventoryInput }) => {
			const res = await api.inventory({ id }).patch(data);
			if (res.error) {
				const msg = (res.error.value as { message?: string })?.message ?? "فشل تحديث المنتج";
				throw new Error(msg);
			}
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inventory"] });
			queryClient.invalidateQueries({ queryKey: ["stock-overview"] });
		},
	});

	const updateInventory = (id: string, data: UpdateInventoryInput) =>
		toast.promise(mutation.mutateAsync({ id, data }), {
			loading: "جارٍ تحديث المنتج...",
			success: (item) => {
				const name = (item as { name?: string } | null)?.name;
				return name ? `تم حفظ التغييرات منتج (${name}) بنجاح` : "تم حفظ التغييرات بنجاح";
			},
			error: (err: Error) => err.message || "فشل تحديث المنتج",
		});

	return { updateInventory, isPending: mutation.isPending };
};
