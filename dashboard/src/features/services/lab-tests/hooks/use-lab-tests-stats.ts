import { useQuery } from "@tanstack/react-query";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { api } from "@/lib/api";

type LabTestsStats = {
	total: number;
	queue: number;
	scheduled: number;
	inLab: number;
	underReview: number;
	completed: number;
	urgent: number;
};

const EMPTY: LabTestsStats = {
	total: 0,
	queue: 0,
	scheduled: 0,
	inLab: 0,
	underReview: 0,
	completed: 0,
	urgent: 0,
};

export const useLabTestsStats = () => {
	const { data, isLoading } = useQuery<LabTestsStats>({
		queryKey: ["lab-tests", "stats"],
		queryFn: async () => {
			const res = await api["lab-tests"].stats.get();
			if (res.error) throw new Error("فشل جلب إحصاءات التحاليل");
			return res.data as LabTestsStats;
		},
	});

	const stats = data ?? EMPTY;

	const statItems: StatItem[] = [
		{
			title: "إجمالي التحاليل",
			value: stats.total,
			tooltip: "العدد الكلي للتحاليل المسجلة",
		},
		{ title: "في المختبر", value: stats.inLab, tooltip: "التحاليل الجارية داخل المختبر" },
		{
			title: "قيد المراجعة",
			value: stats.underReview,
			tooltip: "التحاليل بانتظار اعتماد المشرف",
		},
		{ title: "عاجلة", value: stats.urgent, tooltip: "التحاليل العاجلة غير المكتملة" },
		{ title: "مكتملة", value: stats.completed, tooltip: "التحاليل التي اعتُمدت نتائجها" },
	];

	return { stats, statItems, isLoading };
};
