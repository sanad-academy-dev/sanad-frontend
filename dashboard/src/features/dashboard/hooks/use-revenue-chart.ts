import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export type MonthlyRevenueDatum = { monthDate: string; revenue: number };

export const useRevenueChart = () => {
	const { data, isLoading, isError } = useQuery<MonthlyRevenueDatum[]>({
		queryKey: ["dashboard", "revenue-monthly"],
		queryFn: async () => {
			const res = await api.invoices["revenue-monthly"].get();
			if (res.error) throw new Error("Failed to fetch monthly revenue");
			return (res.data as MonthlyRevenueDatum[]) ?? [];
		},
		staleTime: 1000 * 60 * 5,
	});

	return { data: data ?? [], isLoading, isError };
};
