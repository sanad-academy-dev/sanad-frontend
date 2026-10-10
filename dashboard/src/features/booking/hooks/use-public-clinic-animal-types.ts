import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { PublicAnimalType } from "@/server/public/public.type";

export const usePublicClinicAnimalTypes = (slug: string) => {
	const { data, isLoading, error } = useQuery<PublicAnimalType[]>({
		queryKey: ["public", "clinic", slug, "animal-types"],
		queryFn: async () => {
			const res = await api.public.clinic({ slug })["animal-types"].get();
			if (res.error) throw new Error("فشل جلب أنواع الأطفال");
			return res.data as PublicAnimalType[];
		},
		retry: false,
		staleTime: 1000 * 60 * 5,
		enabled: Boolean(slug),
	});

	return { animalTypes: data ?? [], isLoading, error };
};
