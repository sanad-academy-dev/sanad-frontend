import { createFileRoute } from "@tanstack/react-router";
import { Stats } from "@/components/common/stats";
import { BranchesTable } from "@/features/settings/branches/components/branches-table";
import { BRANCHES_STATS } from "@/features/settings/branches/data/stats";

export const Route = createFileRoute("/_pathless-layout/management/settings/branches-teams")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-1 flex-col">
			<Stats
				className="px-4"
				stats={BRANCHES_STATS}
			/>
			<BranchesTable />
		</div>
	);
}
