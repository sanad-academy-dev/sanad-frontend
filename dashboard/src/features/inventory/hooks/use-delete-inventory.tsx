import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { InventoryResponse } from "@/server/inventory/inventory.type";

const UNDO_MS = 5000;

export const useDeleteInventory = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api.inventory({ id }).delete();
			if (res.error) throw new Error("فشل حذف المنتج");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inventory"] });
			queryClient.invalidateQueries({ queryKey: ["stock-overview"] });
		},
	});

	// حذف قابل للتراجع: إخفاء فوري + toast بزر "تراجع" لمدة UNDO_MS،
	// ثم حذف فعلي عند انقضاء المدة، أو استعادة عند الضغط على "تراجع".
	const deleteInventory = (product: Pick<InventoryResponse, "id" | "name">) => {
		const prev = queryClient.getQueryData<InventoryResponse[]>(["inventory"]);
		queryClient.setQueryData<InventoryResponse[]>(["inventory"], (old) =>
			(old ?? []).filter((p) => p.id !== product.id),
		);

		let undone = false;
		let toastId: string | number = "";

		const timer = setTimeout(() => {
			if (undone) return;
			toast.dismiss(toastId);
			mutation.mutate(product.id, {
				onError: () => {
					queryClient.invalidateQueries({ queryKey: ["inventory"] });
					queryClient.invalidateQueries({ queryKey: ["stock-overview"] });
					toast.error("فشل حذف المنتج");
				},
			});
		}, UNDO_MS);

		toastId = toast.custom(
			(id) => (
				<div className="flex w-[356px] items-center justify-between gap-[14px] rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2 py-1.5 shadow-[0px_4px_24px_rgba(0,0,0,0.08)]">
					<button
						type="button"
						onClick={() => {
							undone = true;
							clearTimeout(timer);
							queryClient.setQueryData(["inventory"], prev);
							toast.dismiss(id);
						}}
						className="shrink-0 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-2 py-[5px] text-[11px] font-medium text-[#08090A] hover:bg-muted"
					>
						تراجع
					</button>
					<div className="flex items-center gap-1.5">
						<span className="text-[10px] font-semibold text-[#08090A]">
							تم حذف منتج &ldquo;{product.name}&rdquo; من المخزون بنجاح...
						</span>
						<IconTrash className="size-[15px] shrink-0 text-[#DC2626]" />
					</div>
				</div>
			),
			{ duration: UNDO_MS },
		);
	};

	return { deleteInventory, isPending: mutation.isPending };
};
