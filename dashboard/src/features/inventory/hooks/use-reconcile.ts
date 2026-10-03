import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { ReconcileFormInput } from "@/server/stock/stock.type";

type ReconcileResult = { success: boolean; code: string; adjustments: number };

export const useReconcile = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: ReconcileFormInput): Promise<ReconcileResult> => {
			const res = await api.stock.reconcile.post(data);
			if (res.error) {
				const msg = (res.error.value as { message?: string })?.message || "فشل تنفيذ الجرد";
				throw new Error(msg);
			}
			return res.data as ReconcileResult;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inventory"] });
			queryClient.invalidateQueries({ queryKey: ["stock-overview"] });
			queryClient.invalidateQueries({ queryKey: ["stock-ledger"] });
			queryClient.invalidateQueries({ queryKey: ["warehouse-bins"] });
			queryClient.invalidateQueries({ queryKey: ["stock-valuation"] });
		},
	});

	const reconcile = (data: ReconcileFormInput) => {
		const p = mutateAsync(data);
		toast.promise(p, {
			loading: "جارٍ تنفيذ الجرد...",
			success: (r) =>
				r.adjustments > 0
					? `تمت التسوية (${r.code}) — ${r.adjustments} تعديل`
					: "لا توجد فروقات — المخزون مطابق",
			error: (e: Error) => e.message || "فشل تنفيذ الجرد",
		});
		return p;
	};

	return { reconcile, isPending };
};
