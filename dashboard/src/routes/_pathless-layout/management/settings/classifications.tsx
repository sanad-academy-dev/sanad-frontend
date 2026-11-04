import { createFileRoute } from "@tanstack/react-router";
import { ClassificationsHub } from "@/features/settings/classifications/components/classifications-hub";

export const Route = createFileRoute("/_pathless-layout/management/settings/classifications")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ClassificationsHub />;
}

