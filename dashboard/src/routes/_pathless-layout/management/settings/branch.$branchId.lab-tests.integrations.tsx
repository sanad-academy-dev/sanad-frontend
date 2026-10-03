import { createFileRoute } from "@tanstack/react-router";
import { BranchLabIntegrationsPage } from "@/features/settings/branches/components/branch-details/branch-lab-integrations-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/lab-tests/integrations",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchLabIntegrationsPage branchId={branchId} />;
}
