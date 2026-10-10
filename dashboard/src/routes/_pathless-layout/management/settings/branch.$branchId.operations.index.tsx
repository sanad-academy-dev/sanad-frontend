import { createFileRoute } from "@tanstack/react-router";
import { BranchOperationsPage } from "@/features/settings/branches/components/branch-details/branch-operations-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/operations/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchOperationsPage branchId={branchId} />;
}
