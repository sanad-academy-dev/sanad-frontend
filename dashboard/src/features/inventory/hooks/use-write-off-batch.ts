import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { WriteOffBatchFormInput } from "@/server/stock/stock.type";

export const useWriteOffBatch = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (vars: { batchId: string; data: WriteOffBatchFormInput }) => {
			const res = await api.stock.batches({ id: vars.batchId })["write-off"].post(vars.data);
			if (res.error) {
				const msg = (res.error.value as { message?: string })?.message || "فشل إتلاف الدفعة";
				throw new Error(msg);
			}
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["stock-batches"] });
			queryClient.invalidateQueries({ queryKey: ["inventory"] });
			queryClient.invalidateQueries({ queryKey: ["stock-overview"] });
			queryClient.invalidateQueries({ queryKey: ["stock-ledger"] });
		},
	});

	const writeOffBatch = (batchId: string, data: WriteOffBatchFormInput) => {
		const p = mutateAsync({ batchId, data });
		toast.promise(p, {
			loading: "جارٍ تسجيل الإتلاف...",
			success: "تم إتلاف/صرف الكمية من الدفعة",
			error: (e: Error) => e.message || "فشل إتلاف الدفعة",
		});
		return p;
	};

	return { writeOffBatch, isPending };
};
