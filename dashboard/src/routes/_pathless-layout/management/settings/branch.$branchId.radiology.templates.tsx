import { createFileRoute } from "@tanstack/react-router";

import { BranchRadiologyTemplatesPage } from "@/features/settings/branches/components/branch-details/branch-radiology-templates-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/radiology/templates",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchRadiologyTemplatesPage branchId={branchId} />;
}
