import { useQuery } from "@tanstack/react-query";
import { useOwners } from "@/features/services/owners/hooks/use-owners";
import { api } from "@/lib/api";
import type { OwnerResponse } from "@/server/owners/owners.type";

export const useOwner = (ownerId?: string) => {
	const { owners } = useOwners();
	const cached = owners.find((o) => o.id === ownerId);

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["owners", ownerId],
		queryFn: async () => {
			if (!ownerId) throw new Error("معرّف وليّ الأمر مطلوب");
			const res = await api.owners({ id: ownerId }).get();
			if (res.error) throw new Error("فشل تحميل بيانات وليّ الأمر");
			return res.data as OwnerResponse;
		},
		enabled: !!ownerId,
		placeholderData: () => cached,
		staleTime: 1000 * 30,
	});

	return {
		owner: data ?? cached ?? null,
		isLoading: isLoading && !cached && !data,
		error,
		refetch,
	};
	
};
