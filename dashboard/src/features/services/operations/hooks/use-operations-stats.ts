import { useQuery } from "@tanstack/react-query";

import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { api } from "@/lib/api";
import type { OperationsStatsResponse } from "@/server/operations/operations.type";

const EMPTY_STATS: OperationsStatsResponse = {
	total: 0,
	byStatus: {},
	urgent: 0,
	unscheduled: 0,
};

export const useOperationsStats = () => {
	const { data, isLoading } = useQuery<OperationsStatsResponse>({
		queryKey: ["operations", "stats"],
		queryFn: async () => {
			const res = await api.operations.stats.get();
			if (res.error) throw new Error("فشل جلب إحصاءات العمليات");
			return res.data as OperationsStatsResponse;
		},
		refetchInterval: 30_000,
	});

	const stats = data ?? EMPTY_STATS;
	const statItems: StatItem[] = [
		{
			title: "إجمالي العمليات",
			value: stats.total,
			tooltip: "العدد الكلي لحالات العمليات المسجلة",
		},
		{
			title: "مجدولة",
			value: stats.byStatus.SCHEDULED ?? 0,
			tooltip: "عمليات لم تبدأ بعد",
		},
		{
			title: "جارية",
			value: stats.byStatus.SURGERY ?? 0,
			tooltip: "عمليات داخل قاعة العمليات الآن",
		},
		{
			title: "الإفاقة",
			value: stats.byStatus.RECOVERY ?? 0,
			tooltip: "حالات تحت المراقبة بعد العملية",
		},
		{
			title: "عاجلة",
			value: stats.urgent,
			tooltip: "الحالات النشطة الفورية والعاجلة (تصنيف NCEPOD)",
		},
		{
			title: "بلا موعد",
			value: stats.unscheduled,
			tooltip: "حالات نشطة لم يُحدَّد لها موعد بعد",
		},
	];

	return { statItems, stats, isLoading };
};
