import { createFileRoute } from "@tanstack/react-router";

import { GeneralAssistantView } from "@/features/settings/agents/components/general-assistant-view";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/ai-agents-general",
)({
	component: GeneralAssistantView,
});
