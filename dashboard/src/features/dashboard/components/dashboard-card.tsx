import { AppointmentKpisCard } from "@/features/dashboard/components/appointment-kpis-card";
import { AppointmentVolumeCard } from "@/features/dashboard/components/appointment-volume-card";
import { AppointmentsCard } from "@/features/dashboard/components/appointments-card";
import { ClinicCasesCard } from "@/features/dashboard/components/clinic-cases-card";
import { CriticalAlertsCard } from "@/features/dashboard/components/critical-alerts-card";
import { InventoryAlertsCard } from "@/features/dashboard/components/inventory-alerts-card";
import { NotesCard } from "@/features/dashboard/components/notes-card";
import { PerformanceDistributionCard } from "@/features/dashboard/components/performance-distribution-card";
import { RevenueCard } from "@/features/dashboard/components/revenue-card";
import { StaffWorkloadCard } from "@/features/dashboard/components/staff-workload-card";
import { TasksCard } from "@/features/dashboard/components/tasks-card";
import { VaccinationDueCard } from "@/features/dashboard/components/vaccination-due-card";
import type { DashboardCardSwitcherProps } from "@/features/dashboard/types/dashboard.types";

export function DashboardCard({ id, expanded, onToggleExpanded }: DashboardCardSwitcherProps) {
	switch (id) {
		case "card-1":
			return (
				<RevenueCard
					expanded={expanded}
					onToggleExpanded={onToggleExpanded}
				/>
			);
		case "card-2":
			return (
				<ClinicCasesCard
					expanded={expanded}
					onToggleExpanded={onToggleExpanded}
				/>
			);
		case "card-3":
			return (
				<PerformanceDistributionCard
					expanded={expanded}
					onToggleExpanded={onToggleExpanded}
				/>
			);
		case "card-4":
			return (
				<NotesCard
					expanded={expanded}
					onToggleExpanded={onToggleExpanded}
				/>
			);
		case "card-5":
			return (
				<AppointmentsCard
					expanded={expanded}
					onToggleExpanded={onToggleExpanded}
				/>
			);
		case "card-6":
			return (
				<TasksCard
					expanded={expanded}
					onToggleExpanded={onToggleExpanded}
				/>
			);
		case "card-7":
			return (
				<CriticalAlertsCard
					expanded={expanded}
					onToggleExpanded={onToggleExpanded}
				/>
			);
		case "card-8":
			return (
				<InventoryAlertsCard
					expanded={expanded}
					onToggleExpanded={onToggleExpanded}
				/>
			);
		case "card-9":
			return (
				<AppointmentVolumeCard
					expanded={expanded}
					onToggleExpanded={onToggleExpanded}
				/>
			);
		case "card-11":
			return (
				<StaffWorkloadCard
					expanded={expanded}
					onToggleExpanded={onToggleExpanded}
				/>
			);
		case "card-13":
			return (
				<VaccinationDueCard
					expanded={expanded}
					onToggleExpanded={onToggleExpanded}
				/>
			);
		case "card-12":
			return (
				<AppointmentKpisCard
					expanded={expanded}
					onToggleExpanded={onToggleExpanded}
				/>
			);
	}
}
