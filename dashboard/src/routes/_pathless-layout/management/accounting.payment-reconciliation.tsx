import { createFileRoute } from "@tanstack/react-router";

import { PaymentReconciliationPage } from "@/features/accounting/payment-entries/components/payment-reconciliation-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/accounting/payment-reconciliation",
)({
	component: PaymentReconciliationPage,
});
