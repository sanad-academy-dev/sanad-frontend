import { createFileRoute } from "@tanstack/react-router";
import { BranchGroomingPage } from "@/features/settings/branches/components/branch-details/branch-grooming-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/grooming/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchGroomingPage branchId={branchId} />;
}
