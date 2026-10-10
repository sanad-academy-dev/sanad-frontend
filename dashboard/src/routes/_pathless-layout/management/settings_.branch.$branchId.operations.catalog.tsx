import { createFileRoute } from "@tanstack/react-router";
import { BranchOperationsCatalogPage } from "@/features/settings/branches/components/branch-details/branch-operations-catalog-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings_/branch/$branchId/operations/catalog",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchOperationsCatalogPage branchId={branchId} />;
}
