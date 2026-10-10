import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Stats } from "@/components/common/stats";
import { LabTestsAlertsStrip } from "@/features/services/lab-tests/components/lab-tests-alerts-strip";
import { LabTestsBoard } from "@/features/services/lab-tests/components/lab-tests-board";
import { LabTestsHeader } from "@/features/services/lab-tests/components/lab-tests-header";
import { LabTestsToolbar } from "@/features/services/lab-tests/components/lab-tests-toolbar";
import { useLabTestsStats } from "@/features/services/lab-tests/hooks/use-lab-tests-stats";
import type { LabTestsPeriod, LabTestsView } from "@/server/lab-tests/lab-tests.type";

const VALID_PERIODS: LabTestsPeriod[] = ["day", "week", "all"];
const VALID_VIEWS: LabTestsView[] = ["all", "for-me"];

export const Route = createFileRoute("/_pathless-layout/services/lab-tests")({
	validateSearch: (search): { period: LabTestsPeriod; view: LabTestsView } => {
		const raw = (search as { period?: string }).period;
		const period = VALID_PERIODS.includes(raw as LabTestsPeriod)
			? (raw as LabTestsPeriod)
			: "all";
		const rawView = (search as { view?: string }).view;
		const view = VALID_VIEWS.includes(rawView as LabTestsView)
			? (rawView as LabTestsView)
			: "all";
		return { period, view };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { view } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const { statItems } = useLabTestsStats();

	const handleViewChange = (next: LabTestsView) => {
		void navigate({ search: (prev) => ({ ...prev, view: next }), replace: true });
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<LabTestsHeader
				active={view}
				onChange={handleViewChange}
			/>
			<Stats
				className="px-4"
				stats={statItems}
			/>
			<hr className="my-2" />
			<LabTestsToolbar />
			<hr className="my-2" />
			<LabTestsAlertsStrip />
			<hr className="my-2" />
			<LabTestsBoard />
		</div>
	);
}
