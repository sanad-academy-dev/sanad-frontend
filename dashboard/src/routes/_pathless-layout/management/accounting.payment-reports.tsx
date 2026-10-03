import { createFileRoute } from "@tanstack/react-router";

import { PaymentReportsPage } from "@/features/accounting/reports/components/payment-reports-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/accounting/payment-reports",
)({
	component: PaymentReportsPage,
});
