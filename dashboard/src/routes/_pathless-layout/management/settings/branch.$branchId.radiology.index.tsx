import { createFileRoute } from "@tanstack/react-router";
import { BranchRadiologyPage } from "@/features/settings/branches/components/branch-details/branch-radiology-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/radiology/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchRadiologyPage branchId={branchId} />;
}
