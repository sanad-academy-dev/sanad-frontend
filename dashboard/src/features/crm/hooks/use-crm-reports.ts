import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { CrmReportsResponse } from "@/server/crm/crm-reports/crm-reports.type";

/** [CRM-P6] §12 — نداءٌ واحد لكل أرقام الشاشة: لقطةٌ واحدة لا سبع. */
export const useCrmReports = (filters: { from?: string; to?: string; agentId?: string }) => {
	const { data, isLoading } = useQuery<CrmReportsResponse>({
		queryKey: ["crm", "reports", filters],
		queryFn: async () => {
			const { data, error } = await api.crm.reports.get({ query: filters });
			if (error)
				throw new Error(
					(error as { value?: { message?: string } })?.value?.message ?? "تعذّر تحميل التقارير",
				);
			return data as CrmReportsResponse;
		},
	});
	return { reports: data ?? null, isLoading };
};
