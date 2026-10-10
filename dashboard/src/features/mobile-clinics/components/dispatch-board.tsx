import {
	IconChevronDown,
	IconChevronUp,
	IconClock,
	IconInbox,
	IconMapPin,
	IconTruck,
	IconX,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { DISPATCH_STAGE_META } from "@/features/mobile-clinics/data/stage-meta";
import {
	toDayKey,
	useDispatchBoard,
	useDispatchMutations,
} from "@/features/mobile-clinics/hooks/use-dispatch-board";
import { useMobileUnits } from "@/features/mobile-clinics/hooks/use-mobile-units";
import type { MobileDispatchStage } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import {
	ALLOWED_STAGE_TRANSITIONS,
	DISPATCH_STAGE_LABELS,
} from "@sanad/contracts/runtime/server/mobile-clinics/mobile-visits/mobile-visit.workflow";
import type { MobileVisitResponse } from "@/server/mobile-clinics/mobile-visits/mobile-visits.type";

const timeFmt = new Intl.DateTimeFormat("ar-EG", { timeStyle: "short" });

function VisitCard({
	visit,
	index,
	total,
	units,
	onAssign,
	onUnassign,
	onStage,
	onMove,
}: {
	visit: MobileVisitResponse;
	index?: number;
	total?: number;
	units: { id: string; name: string; active: boolean }[];
	onAssign: (unitId: string) => void;
	onUnassign: () => void;
	onStage: (stage: MobileDispatchStage) => void;
	onMove?: (direction: -1 | 1) => void;
}) {
	const meta = DISPATCH_STAGE_META[visit.dispatchStage];
	const Icon = meta.icon;
	const next = ALLOWED_STAGE_TRANSITIONS[visit.dispatchStage];

	return (
		<div className="flex flex-col gap-1.5 rounded-[4px] border bg-card p-2.5">
			<div className="flex items-start gap-2">
				<span className={cn("mt-0.5 shrink-0", meta.color)}>
					<Icon className="size-4" />
				</span>
				<div className="flex min-w-0 flex-1 flex-col">
					<span className="truncate text-sm font-medium">
						{visit.appointment.patient?.name ?? "—"}
					</span>
					<span className="flex items-center gap-1.5 truncate text-[11px] text-muted-foreground">
						<span className="truncate">{visit.appointment.owner?.name ?? "—"}</span>
						{visit.appointment.owner?.phone && (
							<>
								<span className="shrink-0 text-muted-foreground/50">|</span>
								{/* الرقم جزيرة LTR: لاتينيٌّ داخل فقرة عربية فينعكس بلا هذا */}
								<span
									dir="ltr"
									className="shrink-0 tabular-nums"
								>
									{visit.appointment.owner.phone}
								</span>
							</>
						)}
					</span>
				</div>
				<span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
					{timeFmt.format(new Date(visit.appointment.startsAt))}
				</span>
			</div>

			<div className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
				<IconMapPin className="mt-0.5 size-3 shrink-0" />
				<span className="line-clamp-2">
					{visit.serviceAddress.line1}
					{visit.serviceAddress.landmark ? ` — ${visit.serviceAddress.landmark}` : ""}
				</span>
			</div>

			{visit.windowStart && visit.windowEnd && (
				<span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
					<IconClock className="size-3" />
					نافذة الوصول {timeFmt.format(new Date(visit.windowStart))} –{" "}
					{timeFmt.format(new Date(visit.windowEnd))}
				</span>
			)}

			<div className="flex items-center gap-1 border-t pt-1.5">
				<span
					className={cn(
						"shrink-0 rounded-[4px] border px-1.5 py-0.5 text-[10px] font-medium",
						meta.color,
					)}
				>
					{meta.label}
				</span>
				<div className="flex-1" />

				{onMove && typeof index === "number" && typeof total === "number" && (
					<>
						<Button
							variant="ghost"
							size="icon"
							className="size-6"
							disabled={index === 0}
							onClick={() => onMove(-1)}
							aria-label="أعلى"
						>
							<IconChevronUp className="size-3.5" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="size-6"
							disabled={index === total - 1}
							onClick={() => onMove(1)}
							aria-label="أسفل"
						>
							<IconChevronDown className="size-3.5" />
						</Button>
					</>
				)}

				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="h-6 px-2 text-[11px]"
						>
							إجراء
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						{visit.mobileUnitId ? (
							<DropdownMenuItem
								className="gap-2"
								onClick={onUnassign}
							>
								<IconX className="size-4" />
								إلغاء الإسناد
							</DropdownMenuItem>
						) : (
							units
								.filter((unit) => unit.active)
								.map((unit) => (
									<DropdownMenuItem
										key={unit.id}
										className="gap-2"
										onClick={() => onAssign(unit.id)}
									>
										<IconTruck className="size-4" />
										أسنِد إلى {unit.name}
									</DropdownMenuItem>
								))
						)}

						{next.length > 0 && <DropdownMenuSeparator />}
						{next.map((stage) => (
							<DropdownMenuItem
								key={stage}
								onClick={() => onStage(stage)}
							>
								{DISPATCH_STAGE_LABELS[stage]}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}

/**
 * [MC5.2] لوحة الإرسال — عمود لكل مركبة، ومجموعة غير المسنَدة على الجانب.
 *
 * الترتيب بأزرار سهمين لا بالسحب والإفلات: السحب يحتاج مكتبة جديدة (قاعدة رقم ١ في
 * CLAUDE.md تمنعها بلا قرار وليّ أمر)، والأسهم تعمل باللمس وبقارئ الشاشة وفي RTL بلا حيل.
 */
export function DispatchBoard() {
	const [date, setDate] = useState(() => toDayKey(new Date()));
	const { visits, isLoading } = useDispatchBoard(date);
	const { units } = useMobileUnits({ scope: "all" });
	const { assign, unassign, changeStage, reorder } = useDispatchMutations(date);

	const unitOptions = useMemo(
		() => units.map((u) => ({ id: u.id, name: u.name, active: u.active })),
		[units],
	);

	const unassigned = useMemo(() => visits.filter((v) => !v.mobileUnitId), [visits]);
	const byUnit = useMemo(() => {
		const map = new Map<string, MobileVisitResponse[]>();
		for (const visit of visits) {
			if (!visit.mobileUnitId) continue;
			const list = map.get(visit.mobileUnitId) ?? [];
			list.push(visit);
			map.set(visit.mobileUnitId, list);
		}
		return map;
	}, [visits]);

	const move = (unitId: string, list: MobileVisitResponse[], index: number, delta: -1 | 1) => {
		const next = [...list];
		const target = index + delta;
		if (target < 0 || target >= next.length) return;
		[next[index], next[target]] = [next[target], next[index]];
		reorder(
			unitId,
			next.map((v) => v.id),
		);
	};

	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="flex items-center gap-2 border-b px-4 py-2">
				<span className="text-xs text-muted-foreground">اليوم</span>
				{/* جزيرة LTR: حقل التاريخ الأصلي يعرض YYYY-MM-DD */}
				<Input
					type="date"
					dir="ltr"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					className="h-7 w-[150px] text-start text-xs"
				/>
				<div className="flex-1" />
				<span className="text-xs text-muted-foreground tabular-nums">
					{visits.length} زيارة · {unassigned.length} غير مسنَدة
				</span>
			</div>

			<div className="flex min-h-0 flex-1 gap-3 overflow-x-auto p-3">
				{/* غير المسنَدة أولًا — في RTL أوّل عنصر هو الأيمن، وهو موضع البداية الطبيعي */}
				<section className="flex w-[300px] shrink-0 flex-col rounded-[4px] border bg-muted/20">
					<header className="flex items-center gap-2 border-b px-3 py-2">
						<IconInbox className="size-4 text-muted-foreground" />
						<span className="text-xs font-semibold">غير مسنَدة</span>
						<span className="text-[11px] text-muted-foreground tabular-nums">
							({unassigned.length})
						</span>
					</header>
					<div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
						{unassigned.length === 0 ? (
							<span className="py-6 text-center text-xs text-muted-foreground">
								لا توجد زيارات بانتظار الإسناد.
							</span>
						) : (
							unassigned.map((visit) => (
								<VisitCard
									key={visit.id}
									visit={visit}
									units={unitOptions}
									onAssign={(unitId) => assign(visit.id, unitId)}
									onUnassign={() => unassign(visit.id)}
									onStage={(stage) => changeStage(visit.id, stage)}
								/>
							))
						)}
					</div>
				</section>

				{unitOptions
					.filter((unit) => unit.active)
					.map((unit) => {
						const list = byUnit.get(unit.id) ?? [];
						return (
							<section
								key={unit.id}
								className="flex w-[300px] shrink-0 flex-col rounded-[4px] border"
							>
								<header className="flex items-center gap-2 border-b px-3 py-2">
									<IconTruck className="size-4 text-muted-foreground" />
									<span className="min-w-0 flex-1 truncate text-xs font-semibold">
										{unit.name}
									</span>
									<span className="text-[11px] text-muted-foreground tabular-nums">
										({list.length})
									</span>
								</header>
								<div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
									{list.length === 0 ? (
										<span className="py-6 text-center text-xs text-muted-foreground">
											لا محطّات لهذه المركبة اليوم.
										</span>
									) : (
										list.map((visit, index) => (
											<VisitCard
												key={visit.id}
												visit={visit}
												index={index}
												total={list.length}
												units={unitOptions}
												onAssign={(unitId) => assign(visit.id, unitId)}
												onUnassign={() => unassign(visit.id)}
												onStage={(stage) => changeStage(visit.id, stage)}
												onMove={(delta) => move(unit.id, list, index, delta)}
											/>
										))
									)}
								</div>
							</section>
						);
					})}
			</div>
		</div>
	);
}
