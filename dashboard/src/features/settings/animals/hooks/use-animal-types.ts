import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AnimalTypeResponse } from "@/server/animal-types/animal-types.type";

export const useAnimalTypes = () => {
	const { data, isLoading } = useQuery<AnimalTypeResponse[]>({
		queryKey: ["animal-types"],
		queryFn: async () => {
			const res = await api["animal-types"].get();
			if (res.error) throw new Error("فشل جلب أنواع الأطفال");
			return res.data as AnimalTypeResponse[];
		},
	});
	return { animalTypes: data ?? [], isLoading };
};
