import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { BranchWithManager } from "@/server/branches/branches.type";

export const useBranchWarehouseState = (branchId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (enabled: boolean): Promise<BranchWithManager> => {
			const res = await api.branches({ id: branchId })["warehouse-state"].patch({ enabled });
			if (res.error) throw new Error("فشل تحديث حالة المستودع");
			return res.data as BranchWithManager;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["branches"] });
			queryClient.invalidateQueries({ queryKey: ["warehouses"] });
		},
	});

	const setWarehouseEnabled = (enabled: boolean) => {
		const p = mutation.mutateAsync(enabled);
		toast.promise(p, {
			loading: enabled ? "جارٍ تفعيل المستودع..." : "جارٍ إيقاف المستودع...",
			success: enabled ? "تم تفعيل المستودع" : "تم إيقاف المستودع",
			error: (err: Error) => err.message || "فشل تحديث حالة المستودع",
		});
		return p;
	};

	return { setWarehouseEnabled, isPending: mutation.isPending };
};
