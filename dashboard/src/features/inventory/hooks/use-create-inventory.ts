import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CreateInventoryFormInput,
	InventoryResponse,
} from "@/server/inventory/inventory.type";

export const useCreateInventory = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: CreateInventoryFormInput): Promise<InventoryResponse> => {
			const res = await api.inventory.post({
				name: data.name,
				category: data.category,
				supplier: data.supplier || undefined,
				sku: data.sku || undefined,
				barcode: data.barcode || undefined,
				stock: data.stock,
				reorderPoint: data.reorderPoint,
				maxQuantity: data.maxQuantity ?? undefined,
				unitCost: data.unitCost ?? undefined,
				price: data.price,
				productionDate: data.productionDate || undefined,
				expiryDate: data.expiryDate || undefined,
				location: data.location || undefined,
				notes: data.notes || undefined,
				active: data.active,
				warehouseId: data.warehouseId || undefined,
			});
			if (res.error) {
				const msg = (res.error.value as { message?: string })?.message || "فشل إضافة المنتج";
				throw new Error(msg);
			}
			return res.data as InventoryResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inventory"] });
			queryClient.invalidateQueries({ queryKey: ["stock-overview"] });
		},
	});

	const createInventory = (data: CreateInventoryFormInput): Promise<InventoryResponse> => {
		const promise = mutateAsync(data);
		toast.promise(promise, {
			loading: "جارٍ إضافة المنتج...",
			success: "تمت إضافة المنتج بنجاح",
			error: (err: Error) => err.message || "فشل إضافة المنتج",
		});
		return promise;
	};

	return { createInventory, isPending };
};
