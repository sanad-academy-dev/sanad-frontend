import { createFileRoute, redirect } from "@tanstack/react-router";

import { ACCOUNTING_SETTINGS_URL } from "@/features/finance/navigation/finance-nav";

/**
 * [NAV-4] Moved into the «المالية» workspace (`/management/accounting/settings`) so it stops
 * swapping the shell for the settings sub-sidebar. Kept as a redirect so existing links and
 * bookmarks still resolve.
 */
export const Route = createFileRoute("/_pathless-layout/management/settings/accounts")({
	beforeLoad: () => {
		throw redirect({ to: ACCOUNTING_SETTINGS_URL });
	},
});
