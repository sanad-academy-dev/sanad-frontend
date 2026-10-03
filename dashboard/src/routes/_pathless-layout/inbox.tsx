import { createFileRoute } from "@tanstack/react-router";
import { InboxPage } from "@/features/inbox/components/inbox-page";

export const Route = createFileRoute("/_pathless-layout/inbox")({
	component: RouteComponent,
});

function RouteComponent() {
	return <InboxPage />;
}
