import { IconPlus } from "@tabler/icons-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { LiveBadge } from "@/components/common/live-badge";
import { Stats } from "@/components/common/stats";
import { Button } from "@/components/ui/button";
import { ArrivalDialog } from "@/features/care/emergency/components/arrival-dialog";
import { ArrivalsTable } from "@/features/care/emergency/components/arrivals-table";
import { DispositionSheet } from "@/features/care/emergency/components/disposition-sheet";
import {
	BreachBanner,
	EmergencyBoard,
} from "@/features/care/emergency/components/emergency-board";
import {
	EMERGENCY_TABS,
	EmergencyHeader,
	type EmergencyTab,
} from "@/features/care/emergency/components/emergency-header";
import {
	EMERGENCY_CATEGORY_FILTER,
	EmergencyToolbar,
} from "@/features/care/emergency/components/emergency-toolbar";
import { TriageSheet } from "@/features/care/emergency/components/triage-sheet";
import {
	useArrivals,
	useEmergencyBoard,
	useEmergencySettings,
	useEmergencyStats,
	useStartTreatment,
	useTransitionArrival,
} from "@/features/care/emergency/hooks/use-emergency";

type EmergencySearch = {
	tab: EmergencyTab;
	q: string;
	category: string;
};

export const Route = createFileRoute("/_pathless-layout/care/emergency")({
	// حالة الشاشة تعيش في الرابط: تُشارَك وتُعاد بحالتها بعد التحديث (نمط لوحة التنويم)
	validateSearch: (search): EmergencySearch => {
		const raw = search as Record<string, string | undefined>;
		const tab = EMERGENCY_TABS.some((t) => t.value === raw.tab)
			? (raw.tab as EmergencyTab)
			: "board";
		return {
			tab,
			q: String(raw.q ?? "").slice(0, 120),
			category: raw.category ?? EMERGENCY_CATEGORY_FILTER,
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { tab, q, category } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const setSearch = (patch: Partial<EmergencySearch>) =>
		navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

	const { settings, isLoading: settingsLoading } = useEmergencySettings();
	const { appointments, breaches, isLoading, liveState } = useEmergencyBoard();
	const { statItems } = useEmergencyStats();
	const { arrivals, isLoading: arrivalsLoading } = useArrivals({
		view: tab === "history" ? "history" : "active",
		q,
	});
	const { transition } = useTransitionArrival();
	const { startTreatment } = useStartTreatment();

	const [arrivalOpen, setArrivalOpen] = useState(false);
	// [E5] هدف القرار — الزيارة وحالتها ولونها، لتعطيل ما لا يجوز قبل بدء الدورة
	const [disposeTarget, setDisposeTarget] = useState<{
		appointmentId: string;
		status: string;
		category: string | null;
		patientId: string | null;
		label?: string;
	} | null>(null);
	const [triageTarget, setTriageTarget] = useState<{
		arrivalId?: string;
		appointmentId?: string;
		label?: string;
		patientId?: string | null;
	} | null>(null);

	// الفلترة على العميل: اللوحة محدودة بمئتَي صفّ، ورحلةُ شبكة لكل حرف تُبطّئ
	// البحث بلا مقابل. والترتيب يبقى كما جاء من الخادم (`compareTriageOrder`).
	const visibleRows = useMemo(() => {
		const needle = q.trim().toLowerCase();
		return appointments.filter((row) => {
			if (category !== EMERGENCY_CATEGORY_FILTER && row.triageCategory !== category)
				return false;
			if (!needle) return true;
			return [row.patient?.name, row.owner?.name, row.reason, row.code]
				.filter(Boolean)
				.some((value) => String(value).toLowerCase().includes(needle));
		});
	}, [appointments, q, category]);

	// الوحدة مطفأة على هذا الفرع: شاشةٌ تشرح كيف تُفعَّل خيرٌ من لوحة فارغة صامتة
	// يظنّها المستخدم عطلًا.
	const isDisabled =
		!settingsLoading && settings != null && !("enabled" in settings && settings.enabled);

	if (isDisabled) {
		return (
			<div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
				<h2 className="font-medium text-lg">وحدة الطوارئ غير مفعّلة على هذا الفرع</h2>
				<p className="max-w-md text-muted-foreground text-sm">
					فعّلها من إعدادات الفرع ← الزيارات والطابور ← الطوارئ والفرز. مع الإطفاء يبقى سلوك
					النظام كما هو تمامًا: «حالة طارئة» مفتاحٌ يدويّ على الزيارة بلا فرز ولا لوحة.
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col">
			<EmergencyHeader
				active={tab}
				onChange={(next) => setSearch({ tab: next })}
			/>

			<div className="p-4 pb-0">
				<Stats stats={statItems} />
			</div>

			{/* شريط الإنذار — المتجاوز يُعرض فوق كل شيء لا داخل كرت يُبحث عنه */}
			{tab !== "history" ? (
				<div className="px-4 pt-3">
					<BreachBanner
						breachedCount={breaches.breached.length}
						imminentCount={breaches.imminent.length}
						onShow={() => setSearch({ tab: "board", category: EMERGENCY_CATEGORY_FILTER })}
					/>
				</div>
			) : null}

			<EmergencyToolbar
				className="border-b"
				search={q}
				onSearchChange={(value) => setSearch({ q: value })}
				category={category}
				onCategoryChange={(value) => setSearch({ category: value })}
				actions={
					<div className="flex items-center gap-2">
						<LiveBadge state={liveState} />
						<Button
							size="sm"
							onClick={() => setArrivalOpen(true)}
						>
							<IconPlus className="size-4" />
							تسجيل وصول
						</Button>
					</div>
				}
			/>

			<div className="p-4">
				{tab === "board" ? (
					<EmergencyBoard
						rows={visibleRows as never}
						arrivals={arrivals as never}
						isLoading={isLoading}
						onReassess={(appointmentId) => {
							const row = appointments.find((a) => a.id === appointmentId);
							setTriageTarget({
								appointmentId,
								label: row?.patient?.name ?? undefined,
								patientId: row?.patient?.id ?? null,
							});
						}}
						onDispose={(appointmentId) => {
							const row = appointments.find((a) => a.id === appointmentId);
							if (!row) return;
							setDisposeTarget({
								appointmentId,
								status: row.status,
								category: row.triageCategory,
								// الإقرارات تُربط بملفّ الطفل — بدونه كانت ورقة القرار تعرض «لا إقرارات»
								patientId: row.patient?.id ?? null,
								label: row.patient?.name ?? undefined,
							});
						}}
						onTriageArrival={(arrival) =>
							setTriageTarget({
								arrivalId: arrival.id,
								label: arrival.patient?.name ?? arrival.provisionalLabel ?? undefined,
								patientId: arrival.patient?.id ?? null,
							})
						}
						onStartTreatment={(id) => void startTreatment(id)}
						onConfirmArrival={(id) => void transition({ id, status: "ARRIVED" })}
					/>
				) : (
					<ArrivalsTable
						rows={arrivals as never}
						isLoading={arrivalsLoading}
						readOnly={tab === "history"}
						onConfirmArrival={(id) => void transition({ id, status: "ARRIVED" })}
						onTriage={(row) =>
							setTriageTarget({
								arrivalId: row.id,
								label: row.patient?.name ?? row.provisionalLabel ?? undefined,
								patientId: row.patient?.id ?? null,
							})
						}
					/>
				)}
			</div>

			<ArrivalDialog
				open={arrivalOpen}
				onOpenChange={setArrivalOpen}
			/>
			<DispositionSheet
				open={disposeTarget !== null}
				onOpenChange={(open) => {
					if (!open) setDisposeTarget(null);
				}}
				appointmentId={disposeTarget?.appointmentId ?? null}
				appointmentStatus={disposeTarget?.status ?? null}
				category={(disposeTarget?.category as never) ?? null}
				patientId={disposeTarget?.patientId ?? null}
				patientLabel={disposeTarget?.label ?? null}
			/>
			<TriageSheet
				open={triageTarget !== null}
				onOpenChange={(open) => {
					if (!open) setTriageTarget(null);
				}}
				arrivalId={triageTarget?.arrivalId ?? null}
				appointmentId={triageTarget?.appointmentId ?? null}
				patientId={triageTarget?.patientId ?? null}
				// [E5.4] بعد التسجيل تتابع الورقة بالطفل الجديد بلا إغلاق ولا إعادة فتح
				onPatientRegistered={(patientId) =>
					setTriageTarget((prev) => (prev ? { ...prev, patientId } : prev))
				}
				patientLabel={triageTarget?.label ?? null}
			/>
		</div>
	);
}
