import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type { TrackClassificationItem } from "../types/tracks.types";

export function computeTracksStats(items: TrackClassificationItem[]): StatItem[] {
	const totalItems = items.length;
	const activeItems = items.filter((s) => s.isActive).length;
	const inactiveItems = totalItems - activeItems;
	const totalTracks = items.reduce((acc, s) => acc + s.tracksCount, 0);
	const totalUsage = items.reduce((acc, s) => acc + s.usageCount, 0);

	return [
		{
			title: "إجمالي المسارات",
			value: totalItems,
			tooltip: "إجمالي تصنيفات المسارات التدريبية والتعليمية المسجلة في النظام",
		},
		{
			title: "نشط",
			value: activeItems,
			tooltip: "تصنيفات المسارات المفعلة والمتاحة للاستخدام",
		},
		{
			title: "معطل",
			value: inactiveItems,
			tooltip: "تصنيفات المسارات المعطلة مؤقتاً",
		},
		{
			title: "البرامج المرتبطة",
			value: totalTracks,
			tooltip: "عدد المسارات والبرامج التدريبية المسجلة تحت هذه التصنيفات",
		},
		{
			title: "إجمالي الطلاب",
			value: totalUsage,
			tooltip: "إجمالي الطلاب والمتدربين المسجلين في مسارات هذه التصنيفات",
		},
	];
}

