import { createFileRoute } from "@tanstack/react-router";
import { BranchServicesPage } from "@/features/settings/branches/components/branch-details/branch-services-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/services",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchServicesPage branchId={branchId} />;
}
