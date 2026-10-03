import { createFileRoute } from "@tanstack/react-router";

import { PartyTrialBalancePage } from "@/features/accounting/reports/components/party-trial-balance-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/accounting/party-trial-balance",
)({
	component: PartyTrialBalancePage,
});
