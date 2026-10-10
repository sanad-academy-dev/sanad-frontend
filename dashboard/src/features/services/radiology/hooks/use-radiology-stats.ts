import { useQuery } from "@tanstack/react-query";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { api } from "@/lib/api";

type RadiologyStats = {
	total: number;
	queue: number;
	scheduled: number;
	preparation: number;
	imaging: number;
	reporting: number;
	underReview: number;
	completed: number;
	urgent: number;
	criticalFindings: number;
};

const EMPTY: RadiologyStats = {
	total: 0,
	queue: 0,
	scheduled: 0,
	preparation: 0,
	imaging: 0,
	reporting: 0,
	underReview: 0,
	completed: 0,
	urgent: 0,
	criticalFindings: 0,
};

export const useRadiologyStats = () => {
	const { data, isLoading } = useQuery<RadiologyStats>({
		queryKey: ["radiology", "stats"],
		queryFn: async () => {
			const res = await api.radiology.stats.get();
			if (res.error) throw new Error("فشل جلب إحصاءات الأشعة");
			return res.data as RadiologyStats;
		},
	});

	const stats = data ?? EMPTY;

	const statItems: StatItem[] = [
		{
			title: "إجمالي الفحوصات",
			value: stats.total,
			tooltip: "العدد الكلي لطلبات الأشعة المسجلة",
		},
		{ title: "في التصوير", value: stats.imaging, tooltip: "الفحوصات الجارية في غرف التصوير" },
		{
			title: "قيد التقرير والمراجعة",
			value: stats.reporting + stats.underReview,
			tooltip: "الفحوصات بانتظار كتابة التقرير أو اعتماده",
		},
		{ title: "عاجلة", value: stats.urgent, tooltip: "الفحوصات العاجلة غير المكتملة" },
		{ title: "مكتملة", value: stats.completed, tooltip: "الفحوصات التي اعتُمدت تقاريرها" },
	];

	return { stats, statItems, isLoading };
};
