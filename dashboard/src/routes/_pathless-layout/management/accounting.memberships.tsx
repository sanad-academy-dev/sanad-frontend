import { createFileRoute } from "@tanstack/react-router";

import {
	isMembershipTab,
	MembershipsPage,
	type MembershipTab,
} from "@/features/accounting/memberships/components/memberships-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/memberships")({
	component: RouteComponent,
	/**
	 * [CRM-P2] `enrollOwnerId`/`enrollPlanId` are the §7.3 deep link: the CRM win flow sends
	 * the operator here with the enroll sheet PRE-FILLED. Prefill only — the sheet still
	 * has to be submitted, because enrollment keeps its own transaction and refusals and
	 * must never happen as a side-effect of following a link.
	 */
	validateSearch: (
		search: Record<string, unknown>,
	): { tab: MembershipTab; enrollOwnerId?: string; enrollPlanId?: string } => ({
		// members first — the daily screen; plans are set up once and revisited rarely
		tab: isMembershipTab(search.tab) ? search.tab : "members",
		enrollOwnerId: typeof search.enrollOwnerId === "string" ? search.enrollOwnerId : undefined,
		enrollPlanId: typeof search.enrollPlanId === "string" ? search.enrollPlanId : undefined,
	}),
});

function RouteComponent() {
	const { tab, enrollOwnerId, enrollPlanId } = Route.useSearch();
	return (
		<MembershipsPage
			tab={tab}
			enrollOwnerId={enrollOwnerId}
			enrollPlanId={enrollPlanId}
		/>
	);
}
