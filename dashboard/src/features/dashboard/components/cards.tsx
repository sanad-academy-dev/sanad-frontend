import type { CSSProperties } from "react";
import { DashboardCard } from "@/features/dashboard/components/dashboard-card";
import {
	deriveChartColors,
	useDashboardPreferences,
} from "@/features/dashboard/stores/dashboard.store";

export function Cards() {
	const { cards, chartHue, toggleCardExpanded } = useDashboardPreferences();
	const sorted = [...cards].sort((a, b) => a.order - b.order).filter((card) => !card.hidden);
	const [chart1, chart2, chart3, chart4, chart5] = deriveChartColors(chartHue);
	const chartTheme = {
		"--chart-1": chart1,
		"--chart-2": chart2,
		"--chart-3": chart3,
		"--chart-4": chart4,
		"--chart-5": chart5,
	} as CSSProperties;

	return (
		<div
			className="grid auto-rows-fr grid-cols-2 gap-x-3 gap-y-4"
			style={chartTheme}
		>
			{sorted.map((card) => (
				<DashboardCard
					key={card.id}
					id={card.id}
					expanded={card.expanded}
					onToggleExpanded={() => toggleCardExpanded(card.id)}
				/>
			))}
		</div>
	);
}
