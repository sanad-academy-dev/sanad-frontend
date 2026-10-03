import { createFileRoute } from "@tanstack/react-router";
import { BranchGroomingCatalogPage } from "@/features/settings/branches/components/branch-details/branch-grooming-catalog-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings_/branch/$branchId/grooming/catalog",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchGroomingCatalogPage branchId={branchId} />;
}
