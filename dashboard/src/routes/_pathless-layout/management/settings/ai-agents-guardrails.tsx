import { createFileRoute } from "@tanstack/react-router";

import { GuardrailsView } from "@/features/settings/agents/components/guardrails-view";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/ai-agents-guardrails",
)({
	component: GuardrailsView,
});
