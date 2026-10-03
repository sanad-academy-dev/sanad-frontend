import { createFileRoute } from "@tanstack/react-router";
import { BranchTasksPage } from "@/features/settings/branches/components/branch-details/branch-tasks-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/tasks",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchTasksPage branchId={branchId} />;
}
