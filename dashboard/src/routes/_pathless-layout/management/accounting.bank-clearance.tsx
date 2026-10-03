import { createFileRoute } from "@tanstack/react-router";

import { BankClearancePage } from "@/features/accounting/bank/components/bank-clearance-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/bank-clearance")(
	{
		component: BankClearancePage,
	},
);
