import { createFileRoute } from "@tanstack/react-router";

import { BranchExamTemplatesPage } from "@/features/settings/branches/components/branch-details/branch-exam-templates-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/exam-templates",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchExamTemplatesPage branchId={branchId} />;
}
