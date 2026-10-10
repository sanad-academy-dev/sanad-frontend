import { createFileRoute } from "@tanstack/react-router";

import { PaymentLedgerPage } from "@/features/accounting/reports/components/payment-ledger-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/payment-ledger")(
	{
		component: PaymentLedgerPage,
	},
);
