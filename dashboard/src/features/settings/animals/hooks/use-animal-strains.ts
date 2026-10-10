import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AnimalStrainWithTypeResponse } from "@/server/animal-strains/animal-strains.type";

export const useAnimalStrains = () => {
	const { data, isLoading } = useQuery<AnimalStrainWithTypeResponse[]>({
		queryKey: ["animal-strains"],
		queryFn: async () => {
			const res = await api["animal-types"].strains.get();
			if (res.error) throw new Error("فشل جلب السلالات");
			return res.data as AnimalStrainWithTypeResponse[];
		},
	});
	return { strains: data ?? [], isLoading };
};
