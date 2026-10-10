import { createFileRoute } from "@tanstack/react-router";
import { BranchLabTestsPage } from "@/features/settings/branches/components/branch-details/branch-lab-tests-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/lab-tests/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchLabTestsPage branchId={branchId} />;
}
