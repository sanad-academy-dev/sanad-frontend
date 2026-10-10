import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { StockMovementFormInput } from "@/server/stock/stock.type";

type MovementResult = { success: boolean; voucherId: string };

const MOVEMENT_LABEL: Record<StockMovementFormInput["type"], string> = {
	RECEIPT: "الاستلام",
	ISSUE: "الصرف",
	TRANSFER: "التحويل",
};

export const useCreateMovement = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: StockMovementFormInput): Promise<MovementResult> => {
			const res =
				data.type === "TRANSFER"
					? await api.stock.transfer.post({
							fromWarehouseId: data.fromWarehouseId ?? "",
							toWarehouseId: data.toWarehouseId ?? "",
							note: data.note || undefined,
							lines: data.lines,
						})
					: await api.stock.movement.post({
							warehouseId: data.warehouseId ?? "",
							type: data.type,
							note: data.note || undefined,
							lines: data.lines,
						});
			if (res.error) {
				const msg = (res.error.value as { message?: string })?.message || "فشل تنفيذ الحركة";
				throw new Error(msg);
			}
			return res.data as MovementResult;
		},
		onSuccess: () => {
			// الأرصدة والكميات الإجمالية وسجل الحركات تغيّرت
			queryClient.invalidateQueries({ queryKey: ["inventory"] });
			queryClient.invalidateQueries({ queryKey: ["stock-overview"] });
			queryClient.invalidateQueries({ queryKey: ["stock-ledger"] });
			queryClient.invalidateQueries({ queryKey: ["warehouses"] });
		},
	});

	const createMovement = (data: StockMovementFormInput): Promise<MovementResult> => {
		const promise = mutateAsync(data);
		const label = MOVEMENT_LABEL[data.type];
		toast.promise(promise, {
			loading: `جارٍ تنفيذ ${label}...`,
			success: (r) => `تم تنفيذ ${label} بنجاح (${r.voucherId})`,
			error: (err: Error) => err.message || "فشل تنفيذ الحركة",
		});
		return promise;
	};

	return { createMovement, isPending };
};
