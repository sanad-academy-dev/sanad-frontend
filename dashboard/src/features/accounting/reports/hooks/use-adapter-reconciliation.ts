import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type {
	AdapterKey,
	AdapterReconciliationReport,
} from "@/server/accounting/adapters/adapter.type";

/** [P12A.2e] hook for «تقرير المطابقة (المحولات)» — the §C3 parallel-run zero-diff report. */

export const useAdapterReconciliation = (params: {
	adapterKey: AdapterKey | null;
	fromDate: string;
	toDate: string;
}) => {
	const enabled = !!params.adapterKey && !!params.fromDate && !!params.toDate;
	const { data, isLoading } = useQuery<AdapterReconciliationReport>({
		queryKey: ["accounting", "reports", "adapter-reconciliation", params],
		enabled,
		queryFn: async () => {
			const { data, error } = await api.accounting
				.adapters({ key: params.adapterKey as AdapterKey })
				.reconciliation.get({
					query: { fromDate: params.fromDate, toDate: params.toDate },
				});
			if (error) {
				throw new Error(
					(error as { value?: { message?: string } })?.value?.message ??
						"تعذّر تحميل تقرير المطابقة",
				);
			}
			return data as AdapterReconciliationReport;
		},
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading: enabled && isLoading };
};
