import { createFileRoute } from "@tanstack/react-router";

import {
	ExtendedPage,
	type ExtendedTab,
	isExtendedTab,
} from "@/features/accounting/extended/components/extended-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/extended")({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>): { tab: ExtendedTab } => ({
		// the till is the tab a clinic opens daily — the rest are monthly at most
		tab: isExtendedTab(search.tab) ? search.tab : "pos-shifts",
	}),
});

function RouteComponent() {
	const { tab } = Route.useSearch();
	return <ExtendedPage tab={tab} />;
}
