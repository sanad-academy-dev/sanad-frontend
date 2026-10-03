import { createFileRoute } from "@tanstack/react-router";

import {
	InsurancePage,
	type InsuranceTab,
	isInsuranceTab,
} from "@/features/accounting/insurance/components/insurance-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/insurance")({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>): { tab: InsuranceTab } => ({
		// policies first — the counter's daily question is «هل هذا الطفل مؤمَّن؟»
		tab: isInsuranceTab(search.tab) ? search.tab : "policies",
	}),
});

function RouteComponent() {
	const { tab } = Route.useSearch();
	return <InsurancePage tab={tab} />;
}
