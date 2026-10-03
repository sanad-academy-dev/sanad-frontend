import { createFileRoute } from "@tanstack/react-router";

import { FinancialStatementsPage } from "@/features/accounting/reports/components/financial-statements-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/accounting/financial-statements",
)({
	component: FinancialStatementsPage,
});
