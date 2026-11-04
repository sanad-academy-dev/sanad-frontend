import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type { AcademicStageItem } from "../types/stages.types";

export function computeStagesStats(stages: AcademicStageItem[]): StatItem[] {
	const totalStages = stages.length;
	const activeStages = stages.filter((s) => s.isActive).length;
	const inactiveStages = totalStages - activeStages;
	const totalClassrooms = stages.reduce((acc, s) => acc + s.classroomsCount, 0);
	const totalUsage = stages.reduce((acc, s) => acc + s.usageCount, 0);

	return [
		{
			title: "إجمالي المراحل",
			value: totalStages,
			tooltip: "إجمالي المراحل الدراسية والمستويات التعليمية المسجلة في النظام",
		},
		{
			title: "نشط",
			value: activeStages,
			tooltip: "المراحل الدراسية المفعلة والمتاحة لربط الفصول",
		},
		{
			title: "معطل",
			value: inactiveStages,
			tooltip: "المراحل الدراسية المعطلة مؤقتاً",
		},
		{
			title: "الفصول المرتبطة",
			value: totalClassrooms,
			tooltip: "عدد الفصول الدراسية المندرجة تحت مختلف المراحل",
		},
		{
			title: "إجمالي الطلاب",
			value: totalUsage,
			tooltip: "إجمالي عدد الطلاب المسجلين في فصول هذه المراحل",
		},
	];
}

