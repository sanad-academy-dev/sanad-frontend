import { createFileRoute } from "@tanstack/react-router";

import { BranchConsultationTypesPage } from "@/features/settings/branches/components/branch-details/branch-consultation-types-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/consultation-types",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchConsultationTypesPage branchId={branchId} />;
}
