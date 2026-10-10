import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { InvoiceResponse } from "@/server/invoices/invoices.type";

export const usePayInvoice = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			invoiceId,
			amountPaid,
			insurance,
		}: {
			invoiceId: string;
			amountPaid: number;
			insurance?: { apply: boolean; excludedLineRefs: string[] };
		}) => {
			const res = await api.invoices({ id: invoiceId }).pay.post({
				paymentMethod: "CASH",
				amountPaid,
				insurance,
			});
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر دفع الفاتورة");
			}
			return res.data as InvoiceResponse;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["invoices"] });
			// الدفع الكامل يخصم المخزون — حدّث أرصدة المخزون والجلسات المرتبطة
			void queryClient.invalidateQueries({ queryKey: ["inventory"] });
			void queryClient.invalidateQueries({ queryKey: ["appointments"] });
		},
	});

	const pay = (
		invoiceId: string,
		amountPaid: number,
		insurance?: { apply: boolean; excludedLineRefs: string[] },
	): Promise<InvoiceResponse> => {
		const promise = mutation.mutateAsync({ invoiceId, amountPaid, insurance });
		toast.promise(promise, {
			loading: "جارٍ الدفع...",
			success: "تم الدفع بنجاح",
			error: (err: Error) => err.message || "فشل الدفع",
		});
		return promise;
	};

	return { pay, isPaying: mutation.isPending };
};
