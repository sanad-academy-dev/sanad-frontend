import { createFileRoute } from "@tanstack/react-router";
import { BranchRadiologyIntegrationsPage } from "@/features/settings/branches/components/branch-details/branch-radiology-integrations-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/radiology/integrations",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchRadiologyIntegrationsPage branchId={branchId} />;
}
