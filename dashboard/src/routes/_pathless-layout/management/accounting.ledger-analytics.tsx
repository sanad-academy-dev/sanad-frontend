import { createFileRoute } from "@tanstack/react-router";

import { LedgerAnalyticsPage } from "@/features/accounting/reports/components/ledger-analytics-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/accounting/ledger-analytics",
)({
	component: LedgerAnalyticsPage,
});
