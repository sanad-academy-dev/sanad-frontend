import { createFileRoute } from "@tanstack/react-router";
import { BranchRadiologyMachinesPage } from "@/features/settings/branches/components/branch-details/branch-radiology-machines-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/radiology/machines",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchRadiologyMachinesPage branchId={branchId} />;
}
