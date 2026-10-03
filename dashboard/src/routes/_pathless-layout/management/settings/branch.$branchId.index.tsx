import { createFileRoute } from "@tanstack/react-router";
import { BranchDetailsPage } from "@/features/settings/branches/components/branch-details/branch-details-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchDetailsPage branchId={branchId} />;
}
