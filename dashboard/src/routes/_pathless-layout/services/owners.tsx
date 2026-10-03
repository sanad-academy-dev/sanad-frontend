import { createFileRoute, redirect } from "@tanstack/react-router";
import { Stats } from "@/components/common/stats";
import { OwnersTable } from "@/features/services/owners/components/owners-table";
import { OWNERS_STATS } from "@/features/services/owners/data/stats";
import { getSession } from "@/functions/get-session";
import { PERMISSIONS } from "@/lib/permissions";

export const Route = createFileRoute("/_pathless-layout/services/owners")({
	component: RouteComponent,
	beforeLoad: async () => {
		const { session } = await getSession();
		if (session?.session.role === "MEMBER") {
			const perms: string[] = JSON.parse(session.session.permissions ?? "[]");
			const canView =
				perms.includes(PERMISSIONS.PATIENTS_OWNERS_VIEW_LIMITED) ||
				perms.includes(PERMISSIONS.PATIENTS_OWNERS_VIEW_FULL);
			if (!canView) throw redirect({ to: "/dashboard" });
		}
	},
});

function RouteComponent() {
	return (
		<div className="flex flex-1 flex-col">
			<Stats
				className="px-4"
				stats={OWNERS_STATS}
			/>
			<OwnersTable />
		</div>
	);
}
