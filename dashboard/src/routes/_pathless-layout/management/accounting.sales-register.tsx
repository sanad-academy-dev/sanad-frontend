import { createFileRoute } from "@tanstack/react-router";

import { SalesRegisterPage } from "@/features/accounting/reports/components/sales-register-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/sales-register")(
	{
		component: SalesRegisterPage,
	},
);
