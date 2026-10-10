import { createFileRoute } from "@tanstack/react-router";
import { BranchPortalPage } from "@/features/settings/branches/components/branch-details/branch-portal-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/parent-app",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchPortalPage branchId={branchId} />;
}
