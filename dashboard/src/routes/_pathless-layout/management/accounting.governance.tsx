import { createFileRoute } from "@tanstack/react-router";

import {
	GovernancePage,
	type GovernanceTab,
	isGovernanceTab,
} from "@/features/accounting/governance/components/governance-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/governance")({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>): { tab: GovernanceTab } => ({
		tab: isGovernanceTab(search.tab) ? search.tab : "readiness",
	}),
});

function RouteComponent() {
	const { tab } = Route.useSearch();
	return <GovernancePage tab={tab} />;
}
