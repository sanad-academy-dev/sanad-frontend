import { createFileRoute } from "@tanstack/react-router";

import { AnnouncementsHeader } from "@/features/services/staff/components/announcements/announcements-header";
import { AnnouncementsView } from "@/features/services/staff/components/announcements/announcements-view";

export const Route = createFileRoute("/_pathless-layout/announcements")({
	component: AnnouncementsRouteComponent,
});

function AnnouncementsRouteComponent() {
	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<AnnouncementsHeader />
			<AnnouncementsView />
		</div>
	);
}
