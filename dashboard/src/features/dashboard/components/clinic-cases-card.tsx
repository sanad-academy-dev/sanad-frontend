import { CardContent } from "@/components/ui/card";
import { ChartBarMultiple } from "@/components/ui/chart-bar-multiple";
import { BaseDashboardCard } from "@/features/dashboard/components/base-dashboard-card";
import { useClinicCases } from "@/features/dashboard/hooks/use-clinic-cases";
import type { DashboardCardProps } from "@/features/dashboard/types/dashboard-card.types";

export function ClinicCasesCard({ expanded, onToggleExpanded }: DashboardCardProps) {
	const { data } = useClinicCases();

	return (
		<BaseDashboardCard
			cardId="card-2"
			expanded={expanded}
			onToggleExpanded={onToggleExpanded}
		>
			<CardContent className="flex flex-1 flex-col">
				<ChartBarMultiple
					data={data}
					className="h-full min-h-52 flex-1"
				/>
			</CardContent>
		</BaseDashboardCard>
	);
}
