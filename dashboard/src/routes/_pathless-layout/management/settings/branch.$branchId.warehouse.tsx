import { createFileRoute } from "@tanstack/react-router";
import { BranchWarehousePage } from "@/features/settings/branches/components/branch-details/branch-warehouse-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/branch/$branchId/warehouse",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchWarehousePage branchId={branchId} />;
}
