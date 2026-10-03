import { createFileRoute } from "@tanstack/react-router";

import { ModesOfPaymentPage } from "@/features/accounting/modes-of-payment/components/modes-of-payment-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/accounting/modes-of-payment",
)({
	component: ModesOfPaymentPage,
});
