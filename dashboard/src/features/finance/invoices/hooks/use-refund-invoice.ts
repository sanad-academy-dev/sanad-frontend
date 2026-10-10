import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

/**
 * [P12B.1] ردّ فاتورة مدفوعة. إبطال `["invoices"]` يشمل بطاقة الإحصاءات أيضًا
 * (`["invoices", "stats"]` بادئتها) — والردّ يُخرج المبلغ من الإيراد المُحصَّل، فبقاء
 * البطاقة على رقمها القديم كذبةٌ على الشاشة.
 */
export const useRefundInvoice = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (vars: { invoiceId: string; reason: string }) => {
			const res = await api
				.invoices({ id: vars.invoiceId })
				.refund.put({ reason: vars.reason });
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر استرجاع الفاتورة");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["invoices"] });
		},
	});

	const refundInvoice = (invoiceId: string, reason: string) =>
		toast.promise(mutateAsync({ invoiceId, reason }), {
			loading: "جارٍ استرجاع الفاتورة...",
			success: "تم استرجاع الفاتورة",
			error: (err: Error) => err.message || "فشل استرجاع الفاتورة",
		});

	return { refundInvoice, isPending };
};
