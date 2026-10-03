import { createFileRoute } from "@tanstack/react-router";
import { BranchGeneralPage } from "@/features/settings/branches/components/branch-details/branch-general-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/general",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchGeneralPage branchId={branchId} />;
}
