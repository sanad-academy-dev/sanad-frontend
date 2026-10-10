import { createFileRoute } from "@tanstack/react-router";

import { PaymentEntriesPage } from "@/features/accounting/payment-entries/components/payment-entries-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/accounting/payment-entries",
)({
	component: PaymentEntriesPage,
});
