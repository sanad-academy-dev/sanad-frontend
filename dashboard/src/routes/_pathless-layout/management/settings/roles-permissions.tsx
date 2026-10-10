import { createFileRoute } from "@tanstack/react-router";
import { RolesPermissionsPage } from "@/features/settings/roles-permissions/components/roles-permissions-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/roles-permissions",
)({
	component: RolesPermissionsPage,
});
