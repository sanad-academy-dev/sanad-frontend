import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { InvoiceListItemResponse } from "@/server/invoices/invoices.type";

export const useInvoices = () => {
	const { data, isLoading, refetch } = useQuery<InvoiceListItemResponse[]>({
		queryKey: ["invoices"],
		queryFn: async () => {
			const res = await api.invoices.get();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر جلب الفواتير");
			}
			return (res.data as InvoiceListItemResponse[]) ?? [];
		},
		staleTime: 30 * 1000,
	});

	return { invoices: data ?? [], isLoading, refetch };
};
