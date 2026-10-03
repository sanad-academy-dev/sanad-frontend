import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type {
	AdCampaignFilters,
	AdCampaignListItem,
	AdCampaignSummary,
} from "@/server/ad-campaigns/ad-campaigns.type";

export const adCampaignsQueryKey = (filters: AdCampaignFilters) =>
	["ad-campaigns", filters] as const;

export const useAdCampaigns = (filters: AdCampaignFilters = {}) => {
	const { data, isLoading, error, refetch } = useQuery<AdCampaignListItem[]>({
		queryKey: adCampaignsQueryKey(filters),
		queryFn: async () => {
			const res = await api["ad-campaigns"].get({ query: filters });
			if (res.error) throw new Error("فشل تحميل الحملات الاعلانية");
			return res.data as AdCampaignListItem[];
		},
		staleTime: 1000 * 60 * 5,
	});

	return { campaigns: data ?? [], isLoading, error, refetch };
};

export const useAdCampaignsSummary = () => {
	const { data, isLoading } = useQuery<AdCampaignSummary>({
		queryKey: ["ad-campaigns", "summary"],
		queryFn: async () => {
			const res = await api["ad-campaigns"].summary.get();
			if (res.error) throw new Error("فشل تحميل ملخّص الحملات");
			return res.data as AdCampaignSummary;
		},
		staleTime: 1000 * 60 * 5,
	});

	return { summary: data, isLoading };
};
