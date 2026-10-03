import { createFileRoute } from "@tanstack/react-router";
import { Stats } from "@/components/common/stats";
import { SpecializationsTable } from "@/features/settings/specializations/components/table";
import { SPECIALTIES_STATS } from "@/features/settings/specializations/data/stats";

export const Route = createFileRoute("/_pathless-layout/management/settings/specialties")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-1 flex-col">
			<Stats
				className="px-4"
				stats={SPECIALTIES_STATS}
			/>
			<SpecializationsTable />
		</div>
	);
}
