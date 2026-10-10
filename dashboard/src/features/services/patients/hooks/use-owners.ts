import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { OwnerResponse } from "@/server/owners/owners.type";

export const useOwners = () => {
	const { data, isLoading } = useQuery<OwnerResponse[]>({
		queryKey: ["owners"],
		queryFn: async () => {
			const res = await api.owners.get();
			if (res.error) throw new Error("فشل جلب أولياء الأمور");
			return res.data as OwnerResponse[];
		},
	});
	return { owners: data ?? [], isLoading };
};
