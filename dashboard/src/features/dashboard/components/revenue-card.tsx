import { useMemo } from "react";
import { CardContent } from "@/components/ui/card";
import { ChartAreaDefault } from "@/components/ui/chart-area-default";
import { BaseDashboardCard } from "@/features/dashboard/components/base-dashboard-card";
import { useRevenueChart } from "@/features/dashboard/hooks/use-revenue-chart";
import type { DashboardCardProps } from "@/features/dashboard/types/dashboard-card.types";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import { useI18n } from "@/hooks/use-i18n";
import { formatMonthLabel } from "@/lib/date";

export function RevenueCard({ expanded, onToggleExpanded }: DashboardCardProps) {
	const { lang } = useI18n();
	const { data } = useRevenueChart();
	const { clinicInfo } = useClinicInfo();

	// أسماء الأشهر تُصاغ حسب نوع تقويم الأكاديمية (هجري/ميلادي) — إعداد
	// management/settings/clinic-information ▸ نوع التقويم.
	const chartData = useMemo(
		() =>
			data.map(({ monthDate, revenue }) => ({
				month: formatMonthLabel(monthDate, {
					lang,
					timezone: clinicInfo?.timezone ?? "Asia/Riyadh",
					calendarType: clinicInfo?.calendarType ?? "GREGORIAN",
				}),
				revenue,
			})),
		[data, lang, clinicInfo?.timezone, clinicInfo?.calendarType],
	);

	return (
		<BaseDashboardCard
			cardId="card-1"
			expanded={expanded}
			onToggleExpanded={onToggleExpanded}
		>
			<CardContent className="flex flex-1 flex-col">
				<ChartAreaDefault
					data={chartData}
					className="h-full min-h-52 flex-1"
				/>
			</CardContent>
		</BaseDashboardCard>
	);
}
