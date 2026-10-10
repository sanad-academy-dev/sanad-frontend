import { createFileRoute } from "@tanstack/react-router";
import { BranchLabAiPage } from "@/features/settings/branches/components/branch-details/branch-lab-ai-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/lab-tests/ai",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchLabAiPage branchId={branchId} />;
}
