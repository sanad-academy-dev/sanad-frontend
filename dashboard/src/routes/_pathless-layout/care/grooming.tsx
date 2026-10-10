import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Stats } from "@/components/common/stats";
import { CreateGroomingSessionDialog } from "@/features/care/grooming/components/create-grooming-session-dialog";
import { GroomingBoard } from "@/features/care/grooming/components/grooming-board";
import { GroomingDueTable } from "@/features/care/grooming/components/grooming-due-table";
import {
	GROOMING_TABS,
	GroomingHeader,
	type GroomingTab,
} from "@/features/care/grooming/components/grooming-header";
import { GroomingSessionSheet } from "@/features/care/grooming/components/grooming-session-sheet";
import { GroomingSessionsTable } from "@/features/care/grooming/components/grooming-sessions-table";
import { GroomingToolbar } from "@/features/care/grooming/components/grooming-toolbar";
import {
	useGroomingBoard,
	useGroomingStats,
} from "@/features/care/grooming/hooks/use-grooming";
import {
	GROOMING_PERIODS,
	GROOMING_VIEWS,
	type GroomingPeriod,
	type GroomingView,
} from "@sanad/contracts/runtime/server/grooming/grooming.type";

type GroomingSearch = {
	tab: GroomingTab;
	period: GroomingPeriod;
	view: GroomingView;
	q: string;
};

export const Route = createFileRoute("/_pathless-layout/care/grooming")({
	// حالة الشاشة تعيش في الرابط: تُشارَك وتُعاد بحالتها بعد التحديث
	validateSearch: (search): GroomingSearch => {
		const raw = search as Record<string, string | undefined>;
		const tab = GROOMING_TABS.some((t) => t.value === raw.tab)
			? (raw.tab as GroomingTab)
			: "board";
		const period = GROOMING_PERIODS.includes(raw.period as GroomingPeriod)
			? (raw.period as GroomingPeriod)
			: "today";
		const view = GROOMING_VIEWS.includes(raw.view as GroomingView)
			? (raw.view as GroomingView)
			: "all";
		return { tab, period, view, q: String(raw.q ?? "").slice(0, 120) };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { tab, period, view, q } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const [openSessionId, setOpenSessionId] = useState<string | null>(null);
	const [sheetTab, setSheetTab] = useState<string | undefined>(undefined);

	const openSession = (id: string, tab?: string) => {
		setSheetTab(tab);
		setOpenSessionId(id);
	};
	const [createOpen, setCreateOpen] = useState(false);

	const { cards, isLoading } = useGroomingBoard({ period, view, q });
	const { statItems } = useGroomingStats();

	const setSearch = (patch: Partial<GroomingSearch>) => {
		void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<GroomingHeader
				active={tab}
				onChange={(next) => setSearch({ tab: next })}
			/>

			<Stats
				className="px-4"
				stats={statItems}
			/>

			{tab === "board" ? (
				<>
					{/* نفس شريط أدوات تبويب الجلسات — اللوحة تُرشَّح بنفس المعايير
					    (`useGroomingBoard({ period, view, q })`) فلا معنى لأن تُغيَّر من تبويب آخر */}
					<GroomingToolbar
						className="border-t"
						search={q}
						onSearchChange={(value) => setSearch({ q: value })}
						period={period}
						onPeriodChange={(value) => setSearch({ period: value })}
						view={view}
						onViewChange={(value) => setSearch({ view: value })}
						onCreate={() => setCreateOpen(true)}
					/>
					<GroomingBoard
						cards={cards}
						onSelect={openSession}
					/>
				</>
			) : tab === "sessions" ? (
				<GroomingSessionsTable
					cards={cards}
					isLoading={isLoading}
					search={q}
					onSearchChange={(value) => setSearch({ q: value })}
					period={period}
					onPeriodChange={(value) => setSearch({ period: value })}
					view={view}
					onViewChange={(value) => setSearch({ view: value })}
					onOpen={(id) => openSession(id)}
					onCreate={() => setCreateOpen(true)}
				/>
			) : (
				<GroomingDueTable />
			)}

			<GroomingSessionSheet
				sessionId={openSessionId}
				initialTab={sheetTab}
				onClose={() => setOpenSessionId(null)}
			/>
			<CreateGroomingSessionDialog
				open={createOpen}
				onOpenChange={setCreateOpen}
			/>
		</div>
	);
}
