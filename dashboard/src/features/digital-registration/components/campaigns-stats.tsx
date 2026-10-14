import { useMemo } from "react";
import { Stats } from "@/components/common/stats";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { useCampaignsSummary } from "../hooks/use-digital-registration";

export function CampaignsStats() {
	const { data: summary, isLoading } = useCampaignsSummary();

	const stats = useMemo<StatItem[]>(() => {
		return [
			{
				title: "الحملات النشطة",
				value: isLoading ? "-" : (summary?.activeCampaigns ?? 0),
				tooltip: "إجمالي الحملات النشطة حالياً",
			},
			{
				title: "إجمالي الطلبات",
				value: isLoading ? "-" : (summary?.totalRequests ?? 0),
				tooltip: "إجمالي عدد الطلبات المستقبلة",
			},
			{
				title: "مقبول",
				value: isLoading ? "-" : (summary?.accepted ?? 0),
				tooltip: "عدد الطلبات المقبولة",
			},
			{
				title: "قيد المراجعة",
				value: isLoading ? "-" : (summary?.pending ?? 0),
				tooltip: "عدد الطلبات قيد المراجعة",
			},
		];
	}, [summary, isLoading]);

	return <Stats className="px-4 py-4 grid-cols-4 border-b" stats={stats} />;
}
