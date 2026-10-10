import { createFileRoute } from "@tanstack/react-router";

import { PaymentTermsPage } from "@/features/accounting/payment-terms/components/payment-terms-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/payment-terms")({
	component: PaymentTermsPage,
});
