import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { CreateAnimalStrainFormInput } from "@/server/animal-strains/animal-strains.type";

export const useCreateAnimalStrain = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: CreateAnimalStrainFormInput) => {
			const { animalTypeId, ...rest } = data;
			// biome-ignore lint/suspicious/noExplicitAny: Eden Treaty uses function-call syntax for dynamic path segments — no typed alternative
			const res = await (api["animal-types"] as any)({ animalTypeId }).strains.post({
				...rest,
				avgWeightMin: rest.avgWeightMin ?? undefined,
				avgWeightMax: rest.avgWeightMax ?? undefined,
				avgAgeMin: rest.avgAgeMin ?? undefined,
				avgAgeMax: rest.avgAgeMax ?? undefined,
				originCountry: rest.originCountry ?? undefined,
				hairType: rest.hairType ?? undefined,
				activityLevel: rest.activityLevel ?? undefined,
				groomingNeeds: rest.groomingNeeds ?? undefined,
				commonDiseases: rest.commonDiseases?.length ? rest.commonDiseases : undefined,
			});
			if (res.error) throw new Error("فشل إضافة السلالة");
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["animal-strains"] });
		},
	});

	const createStrain = (data: CreateAnimalStrainFormInput) =>
		toast.promise(mutateAsync(data), {
			loading: "جارٍ إضافة السلالة...",
			success: "تمت إضافة السلالة بنجاح",
			error: (err: Error) => err.message || "فشل إضافة السلالة",
		});

	return { createStrain, isPending };
};
