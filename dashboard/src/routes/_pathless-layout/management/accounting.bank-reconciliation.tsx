import { createFileRoute } from "@tanstack/react-router";

import { BankReconciliationPage } from "@/features/accounting/bank/components/bank-reconciliation-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/accounting/bank-reconciliation",
)({
	component: BankReconciliationPage,
});
