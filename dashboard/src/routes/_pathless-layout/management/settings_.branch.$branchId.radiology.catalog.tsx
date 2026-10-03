import { createFileRoute } from "@tanstack/react-router";
import { BranchRadiologyCatalogPage } from "@/features/settings/branches/components/branch-details/branch-radiology-catalog-page";

// المسار خارج تخطيط الإعدادات الضيّق (settings_) — جدول الكتالوج يحتاج العرض الكامل
export const Route = createFileRoute(
	"/_pathless-layout/management/settings_/branch/$branchId/radiology/catalog",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchRadiologyCatalogPage branchId={branchId} />;
}
