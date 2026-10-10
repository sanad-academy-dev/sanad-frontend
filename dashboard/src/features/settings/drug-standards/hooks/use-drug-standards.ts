import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ClinicDrugStandardResponse } from "@/server/drug-catalog/drug-catalog.type";

export const DRUG_STANDARDS_QUERY_KEY = ["drug-standards"] as const;

export const useDrugStandards = () => {
	const { data, isLoading } = useQuery<ClinicDrugStandardResponse[]>({
		queryKey: DRUG_STANDARDS_QUERY_KEY,
		queryFn: async () => {
			const res = await api["drug-catalog"].standards.get();
			if (res.error) throw new Error("فشل جلب معايير الأدوية");
			return res.data as ClinicDrugStandardResponse[];
		},
		// Reference data behind a migration — it only changes on deploy.
		staleTime: 1000 * 60 * 10,
	});

	return { standards: data ?? [], isLoading };
};
