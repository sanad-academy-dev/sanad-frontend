import { createFileRoute } from "@tanstack/react-router";

import { AgentUsageView } from "@/features/settings/agents/components/agent-usage-view";

export const Route = createFileRoute("/_pathless-layout/management/settings/ai-agents-usage")({
	component: AgentUsageView,
});
