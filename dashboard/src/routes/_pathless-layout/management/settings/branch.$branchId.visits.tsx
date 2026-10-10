import { createFileRoute } from "@tanstack/react-router";
import { BranchVisitsPage } from "@/features/settings/branches/components/branch-details/branch-visits-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/visits",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchVisitsPage branchId={branchId} />;
}
