import { createFileRoute } from "@tanstack/react-router";
import { BranchRadiologyAiPage } from "@/features/settings/branches/components/branch-details/branch-radiology-ai-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/radiology/ai",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchRadiologyAiPage branchId={branchId} />;
}
