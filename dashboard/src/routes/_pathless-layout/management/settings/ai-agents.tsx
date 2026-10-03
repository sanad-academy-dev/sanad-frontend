import { createFileRoute } from "@tanstack/react-router";

import { AgentSettingsView } from "@/features/settings/agents/components/agent-settings-view";

export const Route = createFileRoute("/_pathless-layout/management/settings/ai-agents")({
	component: AgentSettingsView,
});
