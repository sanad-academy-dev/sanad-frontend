import { useMutation, useQuery } from "@tanstack/react-query";

import type { AdObjective, AdTemplateCategory } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type { AdCopyTemplateResponse } from "@/server/ad-creatives/ad-creatives.type";

export type AdCopySuggestionView = {
	text: string;
	charCount: number;
	wordCount: number;
	toneLabel: string;
};

const errorMessage = (error: { value?: unknown } | null, fallback: string) => {
	const value = error?.value as { message?: string } | undefined;
	return value?.message ?? fallback;
};

export const useAdCopyTemplates = (
	filters: { category?: AdTemplateCategory; search?: string } = {},
	enabled = true,
) => {
	const { data, isLoading } = useQuery<AdCopyTemplateResponse[]>({
		queryKey: ["ad-creatives", "templates", filters],
		enabled,
		queryFn: async () => {
			const res = await api["ad-creatives"].templates.get({ query: filters });
			if (res.error) throw new Error("فشل تحميل القوالب");
			return res.data as AdCopyTemplateResponse[];
		},
		staleTime: 1000 * 60 * 10,
	});

	return { templates: data ?? [], isLoading };
};

export const useAdImageLibrary = (enabled = true) => {
	const { data, isLoading } = useQuery<string[]>({
		queryKey: ["ad-creatives", "library"],
		enabled,
		queryFn: async () => {
			const res = await api["ad-creatives"].library.get();
			if (res.error) throw new Error("فشل تحميل مكتبة الصور");
			return res.data as string[];
		},
		staleTime: 1000 * 60 * 5,
	});

	return { images: data ?? [], isLoading };
};

export type GenerateCopyInput = {
	objective: AdObjective;
	platform: "FACEBOOK" | "INSTAGRAM";
	brief?: string | null;
	seedText?: string | null;
	toneFormal?: number | null;
	toneFriendly?: number | null;
	toneOptimist?: number | null;
	count?: number;
};

export const useGenerateAdCopy = () => {
	const mutation = useMutation({
		mutationFn: async (input: GenerateCopyInput) => {
			const res = await api["ad-creatives"]["generate-copy"].post(input);
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر توليد نصّ الإعلان"));
			return (res.data as { suggestions: AdCopySuggestionView[] }).suggestions;
		},
	});

	return {
		generateCopy: mutation.mutateAsync,
		isPending: mutation.isPending,
		error: mutation.error as Error | null,
		reset: mutation.reset,
	};
};

export const useGenerateAdImage = () => {
	const mutation = useMutation({
		mutationFn: async (input: { prompt: string; style?: string | null }) => {
			const res = await api["ad-creatives"]["generate-image"].post(input);
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر توليد الصورة"));
			return (res.data as { url: string }).url;
		},
	});

	return {
		generateImage: mutation.mutateAsync,
		isPending: mutation.isPending,
		error: mutation.error as Error | null,
		reset: mutation.reset,
	};
};
