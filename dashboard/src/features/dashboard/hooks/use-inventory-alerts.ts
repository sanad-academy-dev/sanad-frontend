import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { InventoryAlertResponse } from "@/server/inventory/inventory.type";

export const useInventoryAlerts = () => {
	const { data, isLoading, isError } = useQuery<InventoryAlertResponse[]>({
		queryKey: ["inventory", "low-stock"],
		queryFn: async () => {
			const res = await api.inventory["low-stock"].get();
			if (res.error) throw new Error("Failed to fetch inventory alerts");
			return (res.data as InventoryAlertResponse[]) ?? [];
		},
		staleTime: 1000 * 60 * 5,
	});

	return { alerts: data ?? [], isLoading, isError };
};
