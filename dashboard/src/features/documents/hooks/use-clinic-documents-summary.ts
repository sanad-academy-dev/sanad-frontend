import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ClinicDocumentSummary } from "@/server/clinic-documents/clinic-documents.type";

export const clinicDocumentsSummaryQueryKey = ["clinic-documents", "summary"] as const;

export const useClinicDocumentsSummary = () => {
	const { data, isLoading } = useQuery<ClinicDocumentSummary>({
		queryKey: clinicDocumentsSummaryQueryKey,
		queryFn: async () => {
			const res = await api["clinic-documents"].summary.get();
			if (res.error) throw new Error("فشل تحميل ملخّص المستندات");
			return res.data as ClinicDocumentSummary;
		},
		staleTime: 1000 * 60 * 5,
	});

	return { summary: data, isLoading };
};
