import { createFileRoute } from "@tanstack/react-router";
import { BranchStaffPage } from "@/features/settings/branches/components/branch-details/branch-staff-page";

// «settings_» (بشرطة سفلية) يبقي المسار /management/settings/… لكن خارج تخطيط
// الإعدادات — جدول الموظفين يُعرض بعرض كامل دون شريط الإعدادات الجانبي
export const Route = createFileRoute(
	"/_pathless-layout/management/settings_/branch/$branchId/staff",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchStaffPage branchId={branchId} />;
}
