import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { PublicClinicService } from "@/server/public/public.type";

export const usePublicClinicServices = (slug: string) => {
	const { data, isLoading, error } = useQuery<PublicClinicService[]>({
		queryKey: ["public", "clinic", slug, "services"],
		queryFn: async () => {
			const res = await api.public.clinic({ slug }).services.get();
			if (res.error) throw new Error("فشل جلب الدورات");
			return res.data as PublicClinicService[];
		},
		retry: false,
		staleTime: 1000 * 60 * 5,
		enabled: Boolean(slug),
	});

	return { services: data ?? [], isLoading, error };
};
