import { IconAlertTriangle, IconPlus } from "@tabler/icons-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { LiveBadge } from "@/components/common/live-badge";
import { Stats } from "@/components/common/stats";
import { Button } from "@/components/ui/button";
import { AdmitInpatientDialog } from "@/features/care/inpatients/components/admit-inpatient-dialog";
import type { InpatientCardData } from "@/features/care/inpatients/components/inpatient-card";
import { InpatientSheet } from "@/features/care/inpatients/components/inpatient-sheet";
import { InpatientsBoard } from "@/features/care/inpatients/components/inpatients-board";
import { InpatientsDueTable } from "@/features/care/inpatients/components/inpatients-due-table";
import {
	INPATIENT_TABS,
	InpatientsHeader,
	type InpatientTab,
} from "@/features/care/inpatients/components/inpatients-header";
import { InpatientsToolbar } from "@/features/care/inpatients/components/inpatients-toolbar";
import { WardMap } from "@/features/care/inpatients/components/ward-map";
import {
	useCages,
	useInpatientBoard,
	useInpatientDue,
	useInpatientStats,
} from "@/features/care/inpatients/hooks/use-inpatients";

type InpatientsSearch = {
	tab: InpatientTab;
	view: string;
	kind: string;
	acuity: string;
	q: string;
};

export const Route = createFileRoute("/_pathless-layout/care/inpatients")({
	// حالة الشاشة تعيش في الرابط: تُشارَك وتُعاد بحالتها بعد التحديث
	validateSearch: (search): InpatientsSearch => {
		const raw = search as Record<string, string | undefined>;
		const tab = INPATIENT_TABS.some((t) => t.value === raw.tab)
			? (raw.tab as InpatientTab)
			: "board";
		return {
			tab,
			view: ["active", "discharged", "all"].includes(raw.view ?? "")
				? (raw.view as string)
				: "active",
			kind: raw.kind ?? "ALL",
			acuity: raw.acuity ?? "ALL",
			q: String(raw.q ?? "").slice(0, 120),
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { tab, view, kind, acuity, q } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const [openStayId, setOpenStayId] = useState<string | null>(null);
	// اللسان المقصود عند الفتح — «نفّذ» في قائمة المستحقّ يفتح على لسان الفعل
	const [openTab, setOpenTab] = useState<string | undefined>(undefined);
	const openStay = (id: string, tab?: string) => {
		setOpenTab(tab);
		setOpenStayId(id);
	};
	const [admitOpen, setAdmitOpen] = useState(false);

	const { stays, isLoading, liveState } = useInpatientBoard({
		view,
		q,
		// "ALL" ليست قيمة في التعداد — تُحذف بدل أن تُرسل فتُفرغ اللوحة
		kind: kind === "ALL" ? undefined : kind,
		acuity: acuity === "ALL" ? undefined : acuity,
	});
	const { statItems } = useInpatientStats();
	const { due } = useInpatientDue();
	const { cages } = useCages();

	const setSearch = (patch: Partial<InpatientsSearch>) =>
		navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

	// خريطة العنبر تحتاج درجة حرجية كل إقامة لتلوين الأقفاص
	const acuityByStayId = useMemo(() => {
		const map: Record<string, string> = {};
		for (const stay of stays as unknown as { id: string; acuity: string }[]) {
			map[stay.id] = stay.acuity;
		}
		return map as Record<string, "LOW" | "MEDIUM" | "HIGH" | "CRITICAL">;
	}, [stays]);

	const dueRows = due as unknown as { due: { overdue: unknown[] } }[];
	const overdueCount = dueRows.reduce((sum, s) => sum + (s.due?.overdue.length ?? 0), 0);

	return (
		<div className="flex flex-col">
			<InpatientsHeader
				active={tab}
				onChange={(next) => setSearch({ tab: next })}
			/>

			<div className="p-4 pb-0">
				<Stats stats={statItems} />
			</div>

			{/* شريط الإنذارات — الفائت يُعرض فوق كل شيء لا داخل كرت يُبحث عنه */}
			{overdueCount > 0 && tab !== "due" && (
				<button
					type="button"
					onClick={() => setSearch({ tab: "due" })}
					className="mx-4 mt-3 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-start text-sm"
				>
					<IconAlertTriangle className="size-4 shrink-0 text-destructive" />
					<span>
						<strong className="tabular-nums">{overdueCount}</strong> جرعة أو قياس فات موعده في
						العنبر
					</span>
					<span className="ms-auto text-muted-foreground text-xs">
						{dueRows.length} إقامة تحتاج انتباهًا — اعرضها
					</span>
				</button>
			)}

			<InpatientsToolbar
				className="border-b"
				search={q}
				onSearchChange={(value) => setSearch({ q: value })}
				view={view}
				onViewChange={(value) => setSearch({ view: value })}
				kind={kind}
				onKindChange={(value) => setSearch({ kind: value })}
				acuity={acuity}
				onAcuityChange={(value) => setSearch({ acuity: value })}
				actions={
					<div className="flex items-center gap-2">
						<LiveBadge state={liveState} />
						<Button
							size="sm"
							onClick={() => setAdmitOpen(true)}
						>
							<IconPlus className="size-4" />
							إدخال
						</Button>
					</div>
				}
			/>

			<div className="p-4">
				{tab === "map" ? (
					<WardMap
						cages={cages as never}
						acuityByStayId={acuityByStayId}
						onSelectStay={setOpenStayId}
					/>
				) : tab === "due" ? (
					<InpatientsDueTable
						rows={due as never}
						onOpen={openStay}
					/>
				) : (
					<InpatientsBoard
						stays={stays as unknown as InpatientCardData[]}
						isLoading={isLoading}
						onOpen={setOpenStayId}
					/>
				)}
			</div>

			<InpatientSheet
				stayId={openStayId}
				initialTab={openTab}
				open={Boolean(openStayId)}
				onOpenChange={(open) => {
					if (open) return;
					setOpenStayId(null);
					setOpenTab(undefined);
				}}
			/>
			<AdmitInpatientDialog
				open={admitOpen}
				onOpenChange={setAdmitOpen}
			/>
		</div>
	);
}
