import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Stats } from "@/components/common/stats";
import { RadiologyAlertsStrip } from "@/features/services/radiology/components/radiology-alerts-strip";
import { RadiologyBoard } from "@/features/services/radiology/components/radiology-board";
import { RadiologyHeader } from "@/features/services/radiology/components/radiology-header";
import { RadiologyToolbar } from "@/features/services/radiology/components/radiology-toolbar";
import { useRadiologyStats } from "@/features/services/radiology/hooks/use-radiology-stats";
import { RadiologyModality, RadiologyStatus } from "@/generated/prisma/enums";
import type { RadiologyPeriod, RadiologyView } from "@/server/radiology/radiology.type";

const VALID_PERIODS: RadiologyPeriod[] = ["day", "week", "all"];
const VALID_VIEWS: RadiologyView[] = ["all", "for-me"];

export const Route = createFileRoute("/_pathless-layout/services/radiology")({
	validateSearch: (
		search,
	): {
		period: RadiologyPeriod;
		view: RadiologyView;
		q: string;
		modality: string;
		status: string;
	} => {
		const raw = (search as { period?: string }).period;
		const period = VALID_PERIODS.includes(raw as RadiologyPeriod)
			? (raw as RadiologyPeriod)
			: "all";
		const rawView = (search as { view?: string }).view;
		const view = VALID_VIEWS.includes(rawView as RadiologyView)
			? (rawView as RadiologyView)
			: "all";
		// البحث والتصفية يعيشان في الرابط: الصفحة تُشارَك ويُعاد تحميلها بحالتها.
		// التصفية متعدّدة الاختيار، فتُخزَّن قائمةً مفصولة بفواصل.
		const q = String((search as { q?: string }).q ?? "").slice(0, 120);
		const keepValid = (raw: unknown, valid: Record<string, string>) =>
			String(raw ?? "")
				.split(",")
				.filter((value) => value in valid)
				.join(",");
		const modality = keepValid((search as { modality?: string }).modality, RadiologyModality);
		const status = keepValid((search as { status?: string }).status, RadiologyStatus);
		return { period, view, q, modality, status };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { view } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const { statItems } = useRadiologyStats();

	const handleViewChange = (next: RadiologyView) => {
		void navigate({ search: (prev) => ({ ...prev, view: next }), replace: true });
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<RadiologyHeader
				active={view}
				onChange={handleViewChange}
			/>
			<Stats
				className="px-4"
				stats={statItems}
			/>
			<hr className="my-2" />
			<RadiologyToolbar />
			<hr className="my-2" />
			<RadiologyAlertsStrip />
			<hr className="my-2" />
			<RadiologyBoard />
		</div>
	);
}
