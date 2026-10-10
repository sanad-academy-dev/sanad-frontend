import { createFileRoute } from "@tanstack/react-router";

import { ChartOfAccountsPage } from "@/features/accounting/chart-of-accounts/components/chart-of-accounts-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/accounts")({
	component: ChartOfAccountsPage,
});
