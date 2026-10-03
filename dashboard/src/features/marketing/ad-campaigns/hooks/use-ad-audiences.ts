import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { AdObjective } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type {
	AdAudienceResponse,
	CreateAdAudienceFormInput,
} from "@/server/ad-audiences/ad-audiences.type";

export type SuggestedAudienceView = {
	name: string;
	ageMin: number;
	ageMax: number;
	locations: string[];
	languages: string[];
	interests: string[];
	rationale: string;
};

const errorMessage = (error: { value?: unknown } | null, fallback: string) => {
	const value = error?.value as { message?: string } | undefined;
	return value?.message ?? fallback;
};

export const useAdAudiences = (enabled = true) => {
	const { data, isLoading } = useQuery<AdAudienceResponse[]>({
		queryKey: ["ad-audiences"],
		enabled,
		queryFn: async () => {
			const res = await api["ad-audiences"].get();
			if (res.error) throw new Error("فشل تحميل الجماهير");
			return res.data as AdAudienceResponse[];
		},
		staleTime: 1000 * 60 * 5,
	});

	return { audiences: data ?? [], isLoading };
};

export const useSuggestAudiences = () => {
	const mutation = useMutation({
		mutationFn: async (input: { objective: AdObjective; count?: number }) => {
			const res = await api["ad-audiences"].suggest.post(input);
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر توليد اقتراحات الجمهور"));
			return (res.data as { audiences: SuggestedAudienceView[] }).audiences;
		},
	});

	return {
		suggest: mutation.mutateAsync,
		isPending: mutation.isPending,
		error: mutation.error as Error | null,
	};
};

export const useCreateAdAudience = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (
			input: CreateAdAudienceFormInput & {
				isAiSuggested?: boolean;
				aiRationale?: string | null;
			},
		) => {
			const res = await api["ad-audiences"].post(input);
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر حفظ الجمهور"));
			return res.data as AdAudienceResponse;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["ad-audiences"] });
		},
	});

	// نُعيد الوعد لا مقبض الإشعار: المعالج يحتاج معرّف الجمهور ليربطه بالحملة فورًا
	const createAudience = (
		input: CreateAdAudienceFormInput & {
			isAiSuggested?: boolean;
			aiRationale?: string | null;
		},
	) => {
		const promise = mutation.mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ حفظ الجمهور...",
			success: "تم حفظ الجمهور",
			error: (err: Error) => err.message || "فشل حفظ الجمهور",
		});
		return promise;
	};

	return { createAudience, isPending: mutation.isPending };
};
