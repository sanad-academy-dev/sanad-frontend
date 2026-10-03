import { createFileRoute } from "@tanstack/react-router";
import { Stats } from "@/components/common/stats";
import { Cards } from "@/features/dashboard/components/cards";
import { Header } from "@/features/dashboard/components/header";
import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-stats";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { useI18n } from "@/hooks/use-i18n";

export const Route = createFileRoute("/_pathless-layout/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const { t } = useI18n();
	const { stats } = useDashboardStats();

	const statItems: StatItem[] = [
		{
			title: t("dashboard.stats.clients.title"),
			value: stats?.clientsToday ?? 0,
			tooltip: t("dashboard.stats.clients.tooltip"),
		},
		{
			title: t("dashboard.stats.patients.title"),
			value: stats?.patientsTotal ?? 0,
			tooltip: t("dashboard.stats.patients.tooltip"),
		},
		{
			title: t("dashboard.stats.appointments.title"),
			value: stats?.appointmentsToday ?? 0,
			tooltip: t("dashboard.stats.appointments.tooltip"),
		},
		{
			title: t("dashboard.stats.doctors.title"),
			value: stats?.staffTotal ?? 0,
			tooltip: t("dashboard.stats.doctors.tooltip"),
		},
		{
			title: t("dashboard.stats.services.title"),
			value: stats?.servicesTotal ?? 0,
			tooltip: t("dashboard.stats.services.tooltip"),
		},
	];

	return (
		<div className="flex flex-1 flex-col gap-2 p-4.5">
			<Header />
			<Stats stats={statItems} />
			<Cards />
		</div>
	);
}
