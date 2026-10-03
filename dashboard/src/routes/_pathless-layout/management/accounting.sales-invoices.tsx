import { createFileRoute } from "@tanstack/react-router";

import { SalesInvoicesPage } from "@/features/accounting/sales-invoices/components/sales-invoices-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/sales-invoices")(
	{
		component: SalesInvoicesPage,
	},
);
