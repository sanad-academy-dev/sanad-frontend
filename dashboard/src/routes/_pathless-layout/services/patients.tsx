import { createFileRoute, redirect } from "@tanstack/react-router";
import { Stats } from "@/components/common/stats";
import { usePatientStats } from "@/features/services/patients/hooks/use-patient-stats";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import { PatientsTable } from "@/features/services/patients/patients-table";
import { getSession } from "@/functions/get-session";
import { PERMISSIONS } from "@/lib/permissions";

export const Route = createFileRoute("/_pathless-layout/services/patients")({
	component: RouteComponent,
	beforeLoad: async () => {
		const { session } = await getSession();
		if (session?.session?.role === "MEMBER") {
			let perms: string[] = [];
			try {
				perms = JSON.parse(session.session.permissions ?? "[]");
			} catch {
				perms = [];
			}
			const canView =
				perms.includes(PERMISSIONS.PATIENTS_OWNERS_VIEW_LIMITED) ||
				perms.includes(PERMISSIONS.PATIENTS_OWNERS_VIEW_FULL);
			if (!canView) throw redirect({ to: "/dashboard" });
		}
	},
});

function RouteComponent() {
	const { patients } = usePatients();
	const stats = usePatientStats(patients);

	return (
		<div className="flex flex-1 flex-col">
			<Stats
				className="px-4"
				stats={stats}
			/>
			<PatientsTable />
		</div>
	);
}
