import { createFileRoute } from "@tanstack/react-router";
import { BranchRoomsPage } from "@/features/settings/branches/components/branch-details/branch-rooms-page";

// «settings_» (بشرطة سفلية) يبقي المسار /management/settings/… لكن خارج تخطيط
// الإعدادات — جدول القاعات يُعرض بعرض كامل دون شريط الإعدادات الجانبي
export const Route = createFileRoute(
	"/_pathless-layout/management/settings_/branch/$branchId/rooms",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { branchId } = Route.useParams();
	return <BranchRoomsPage branchId={branchId} />;
}
