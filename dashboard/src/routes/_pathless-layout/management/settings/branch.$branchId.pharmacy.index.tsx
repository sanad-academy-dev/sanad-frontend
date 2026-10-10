import { createFileRoute } from "@tanstack/react-router";

import { BranchPharmacyPage } from "@/features/settings/branches/components/branch-details/branch-pharmacy-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/pharmacy/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchPharmacyPage branchId={branchId} />;
}
