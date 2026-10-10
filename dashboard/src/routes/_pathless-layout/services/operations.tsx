import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Stats } from "@/components/common/stats";
import { OperationCaseSheet } from "@/features/services/operations/components/operation-case-sheet";
import { OperationsAlertsStrip } from "@/features/services/operations/components/operations-alerts-strip";
import { OperationsBoard } from "@/features/services/operations/components/operations-board";
import { OperationsHeader } from "@/features/services/operations/components/operations-header";
import { OperationsToolbar } from "@/features/services/operations/components/operations-toolbar";
import { useMoveOperation } from "@/features/services/operations/hooks/use-operation-mutations";
import { useOperations } from "@/features/services/operations/hooks/use-operations";
import { useOperationsStats } from "@/features/services/operations/hooks/use-operations-stats";
import {
	OPERATIONS_PERIODS,
	OPERATIONS_VIEWS,
	type OperationsPeriod,
	type OperationsView,
} from "@/features/services/operations/types/operations.types";

export const Route = createFileRoute("/_pathless-layout/services/operations")({
	validateSearch: (search): { period: OperationsPeriod; view: OperationsView } => {
		const raw = (search as { period?: string }).period;
		const period = OPERATIONS_PERIODS.includes(raw as OperationsPeriod)
			? (raw as OperationsPeriod)
			: "all";
		const rawView = (search as { view?: string }).view;
		const view = OPERATIONS_VIEWS.includes(rawView as OperationsView)
			? (rawView as OperationsView)
			: "all";
		return { period, view };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { period, view } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const [q, setQ] = useState("");
	const { cards } = useOperations({ period, view, q });
	const { statItems } = useOperationsStats();
	const { moveOperation } = useMoveOperation();

	const handleViewChange = (next: OperationsView) => {
		void navigate({ search: (prev) => ({ ...prev, view: next }), replace: true });
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<OperationsHeader
				active={view}
				onChange={handleViewChange}
			/>
			<Stats
				className="px-4"
				stats={statItems}
			/>
			<hr className="my-2" />
			<OperationsToolbar
				q={q}
				onSearchChange={setQ}
			/>
			<hr className="my-2" />
			<OperationsAlertsStrip cards={cards} />
			<hr className="my-2" />
			<OperationsBoard
				cards={cards}
				onMove={(id, to) => {
					void moveOperation({ id, to }).catch(() => {});
				}}
			/>
			<OperationCaseSheet />
		</div>
	);
}
