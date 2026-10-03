import { createFileRoute } from "@tanstack/react-router";
import { BranchLabCatalogPage } from "@/features/settings/branches/components/branch-details/branch-lab-catalog-page";

// جدول كامل العرض — يخرج من تخطيط الإعدادات الضيق مثل صفحتَي القاعات والموظفين
export const Route = createFileRoute(
	"/_pathless-layout/management/settings_/branch/$branchId/lab-tests/catalog",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchLabCatalogPage branchId={branchId} />;
}
