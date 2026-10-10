import { createFileRoute } from "@tanstack/react-router";
import { SopLibraryPage } from "@/features/settings/sops/components/sop-library-page";

// المسار خارج تخطيط الإعدادات الضيّق (settings_) — جدول المكتبة يحتاج العرض الكامل
export const Route = createFileRoute(
	"/_pathless-layout/management/settings_/branch/$branchId/sops",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <SopLibraryPage branchId={branchId} />;
}
