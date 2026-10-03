import { createFileRoute } from "@tanstack/react-router";

import { BankReportsPage } from "@/features/accounting/reports/components/bank-reports-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/bank-reports")({
	component: BankReportsPage,
});
