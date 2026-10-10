import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useVoidInvoice = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (invoiceId: string) => {
			const res = await api.invoices({ id: invoiceId }).void.put();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر إلغاء الفاتورة");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["invoices"] });
		},
	});

	const voidInvoice = (invoiceId: string) =>
		toast.promise(mutateAsync(invoiceId), {
			loading: "جارٍ إلغاء الفاتورة...",
			success: "تم إلغاء الفاتورة",
			error: (err: Error) => err.message || "فشل إلغاء الفاتورة",
		});

	return { voidInvoice, isPending };
};
