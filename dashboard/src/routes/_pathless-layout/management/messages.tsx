import { createFileRoute } from "@tanstack/react-router";

import { MessagesPage } from "@/features/messages/components/messages-page";

export const Route = createFileRoute("/_pathless-layout/management/messages")({
	// openConversation: فتح محادثة بعينها قادمًا من إشعار الوارد أو توست «رسالة جديدة»
	validateSearch: (search): { openConversation?: string } => {
		const raw = (search as { openConversation?: string }).openConversation;
		return { openConversation: typeof raw === "string" && raw ? raw : undefined };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { openConversation } = Route.useSearch();
	return <MessagesPage openConversationId={openConversation ?? null} />;
}
