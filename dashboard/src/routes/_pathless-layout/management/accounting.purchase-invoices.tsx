import { createFileRoute } from "@tanstack/react-router";

import { PurchaseInvoicesPage } from "@/features/accounting/purchase-invoices/components/purchase-invoices-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/accounting/purchase-invoices",
)({
	component: PurchaseInvoicesPage,
});
