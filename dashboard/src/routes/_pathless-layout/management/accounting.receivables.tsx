import { createFileRoute } from "@tanstack/react-router";

import { ReceivablesPage } from "@/features/accounting/reports/components/receivables-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/receivables")({
	component: ReceivablesPage,
});
