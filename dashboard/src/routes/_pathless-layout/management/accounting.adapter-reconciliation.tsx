import { createFileRoute } from "@tanstack/react-router";

import { AdapterReconciliationPage } from "@/features/accounting/reports/components/adapter-reconciliation-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/accounting/adapter-reconciliation",
)({
	component: AdapterReconciliationPage,
});
