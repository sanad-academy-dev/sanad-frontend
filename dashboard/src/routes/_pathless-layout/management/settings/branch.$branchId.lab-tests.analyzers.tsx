import { createFileRoute } from "@tanstack/react-router";
import { BranchLabAnalyzersPage } from "@/features/settings/branches/components/branch-details/branch-lab-analyzers-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/lab-tests/analyzers",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchLabAnalyzersPage branchId={branchId} />;
}
