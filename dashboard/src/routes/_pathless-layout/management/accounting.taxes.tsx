import { createFileRoute } from "@tanstack/react-router";

import {
	isTaxTab,
	TaxesPage,
	type TaxTab,
} from "@/features/accounting/taxes/components/taxes-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/taxes")({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>): { tab: TaxTab } => ({
		tab: isTaxTab(search.tab) ? search.tab : "sales",
	}),
});

function RouteComponent() {
	const { tab } = Route.useSearch();
	return <TaxesPage tab={tab} />;
}
