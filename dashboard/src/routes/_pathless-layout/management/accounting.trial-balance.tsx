import { createFileRoute } from "@tanstack/react-router";

import { TrialBalancePage } from "@/features/accounting/reports/components/trial-balance-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/trial-balance")({
	component: TrialBalancePage,
});
