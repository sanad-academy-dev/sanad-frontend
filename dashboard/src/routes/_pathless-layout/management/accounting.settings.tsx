import { createFileRoute } from "@tanstack/react-router";

import { AccountsSettingsPage } from "@/features/accounting/settings/components/accounts-settings-page";

/**
 * [NAV-4] «إعدادات المحاسبة» lives INSIDE the «المالية» workspace.
 *
 * It used to sit at `/management/settings/accounts`, a child of the settings layout route —
 * so opening it swapped the whole shell for the settings sub-sidebar and threw the user out
 * of the finance area. File-based routing cannot opt one child out of its parent layout, so
 * the screen moved here instead; the old path now redirects.
 */
export const Route = createFileRoute("/_pathless-layout/management/accounting/settings")({
	component: AccountsSettingsPage,
});
