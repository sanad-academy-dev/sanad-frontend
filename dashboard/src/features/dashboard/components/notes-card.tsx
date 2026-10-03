import { BaseDashboardCard } from "@/features/dashboard/components/base-dashboard-card";
import type { DashboardCardProps } from "@/features/dashboard/types/dashboard-card.types";

export function NotesCard({ expanded, onToggleExpanded }: DashboardCardProps) {
	return (
		<BaseDashboardCard
			cardId="card-4"
			expanded={expanded}
			onToggleExpanded={onToggleExpanded}
		/>
	);
}
