import { createFileRoute } from "@tanstack/react-router";
import { BranchLabQualityPage } from "@/features/settings/branches/components/branch-details/branch-lab-quality-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/lab-tests/quality",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchLabQualityPage branchId={branchId} />;
}
