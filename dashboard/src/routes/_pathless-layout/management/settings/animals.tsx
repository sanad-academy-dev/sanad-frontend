import { createFileRoute } from "@tanstack/react-router";
import { Stats } from "@/components/common/stats";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { AnimalsTable } from "@/features/settings/animals/components/animals-table";

export const Route = createFileRoute("/_pathless-layout/management/settings/animals")({
	component: RouteComponent,
});

export const ANIMALS_STATS: StatItem[] = [
	{
		title: "إجمالي السلالات",
		value: 2,
		tooltip: "الأطفال الذين قدموا الطلبات اليوم",
	},
	{
		title: "كلاب",
		value: 2,
		tooltip: "الأطفال الذين قدموا الطلبات اليوم",
	},
	{
		title: "قطط",
		value: 2,
		tooltip: "الأطفال الذين قدموا الطلبات اليوم",
	},
	{
		title: "طيور",
		value: 2,
		tooltip: "الأطفال الذين قدموا الطلبات اليوم",
	},
	{
		title: "اخرى",
		value: 2,
		tooltip: "الأطفال الذين قدموا الطلبات اليوم",
	},
];

function RouteComponent() {
	return (
		<div className="flex flex-1 flex-col">
			<Stats
				className="px-4"
				stats={ANIMALS_STATS}
			/>
			<AnimalsTable />
		</div>
	);
}
