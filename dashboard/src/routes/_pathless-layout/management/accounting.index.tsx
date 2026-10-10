import { createFileRoute, redirect } from "@tanstack/react-router";

import { ACCOUNTING_HOME_URL } from "@/features/finance/navigation/finance-nav";

/** `/management/accounting` is a section, not a page — land on its first destination. */
export const Route = createFileRoute("/_pathless-layout/management/accounting/")({
	beforeLoad: () => {
		throw redirect({ to: ACCOUNTING_HOME_URL });
	},
});
