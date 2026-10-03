import { IconCheck, IconClock, IconPlayerPause, IconX } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { GiveDoseDialog } from "@/features/care/inpatients/components/give-dose-dialog";
import {
	ADMIN_STATUS_META,
	ORDER_KIND_META,
} from "@/features/care/inpatients/data/inpatients-data";
import { useInpatientAdministrations } from "@/features/care/inpatients/hooks/use-inpatients";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

/**
 * ورقة العلاج — الشاشة التي تُملأ على القفص.
 *
 * قرارات التصميم هنا مدفوعة بمكان الاستعمال لا بالجمال: الأزرار كبيرة لأنها
 * تُضغط بإبهامٍ وقفّاز، والصفوف مرتّبة بالوقت لا بالدواء لأن السؤال على القفص
 * «ماذا الآن؟» لا «أين البنسلين؟»، والفائت يُبرز أولًا بلا فلتر يُختار.
 *
 * شريط اليوم (SVG) يعطي ما لا تعطيه القائمة: كثافة الجرعات عبر اليوم في نظرة —
 * أين تتكدّس وأين تخلو، وهو ما يُخطَّط به التسليم بين الورديّات.
 */

const HOUR_MS = 3_600_000;

type Administration = {
	id: string;
	dueAt: string | Date;
	status: string;
	givenAt: string | Date | null;
	doseGivenAmount: string | number | null;
	doseGivenUnit: string | null;
	notesAr: string | null;
	skipReasonAr: string | null;
	performedBy: { id: string; name: string } | null;
	witness: { id: string; name: string } | null;
	order: {
		id: string;
		kind: keyof typeof ORDER_KIND_META;
		nameSnapshot: string;
		doseAmount: string | number | null;
		doseUnit: string | null;
		route: string | null;
		rateMlPerHour: string | number | null;
		instructionsAr: string | null;
		prn: boolean;
		status: string;
	};
};

export function InpatientMarTab({ stayId, readOnly }: { stayId: string; readOnly: boolean }) {
	const { isRtl } = useI18n();
	const [day, setDay] = useState(() => new Date());
	const dayKey = day.toISOString().slice(0, 10);
	const { administrations, isLoading } = useInpatientAdministrations(stayId, dayKey);
	const [active, setActive] = useState<Administration | null>(null);

	const rows = administrations as unknown as Administration[];

	const grouped = useMemo(() => {
		const sorted = [...rows].sort(
			(a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime(),
		);
		const map = new Map<string, Administration[]>();
		for (const row of sorted) {
			const hour = new Date(row.dueAt).getHours();
			const key = `${String(hour).padStart(2, "0")}:00`;
			map.set(key, [...(map.get(key) ?? []), row]);
		}
		return [...map.entries()];
	}, [rows]);

	const isToday = dayKey === new Date().toISOString().slice(0, 10);

	return (
		<div className="space-y-4">
			<header className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setDay(new Date(day.getTime() - 86_400_000))}
					>
						اليوم السابق
					</Button>
					<Button
						variant="outline"
						size="sm"
						disabled={isToday}
						onClick={() => setDay(new Date(day.getTime() + 86_400_000))}
					>
						اليوم التالي
					</Button>
					{!isToday && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setDay(new Date())}
						>
							عودة لليوم
						</Button>
					)}
				</div>
				<span className="text-sm text-muted-foreground">
					{day.toLocaleDateString("ar", { dateStyle: "full" })}
				</span>
			</header>

			<DayRibbon
				rows={rows}
				day={day}
				isRtl={isRtl}
			/>

			{isLoading ? (
				<div className="space-y-2">
					<Skeleton className="h-16 w-full" />
					<Skeleton className="h-16 w-full" />
				</div>
			) : grouped.length === 0 ? (
				<p className="rounded border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
					لا جرعات مجدولة في هذا اليوم — أضِف أمرًا من لسان «الأوامر»
				</p>
			) : (
				<div className="space-y-3">
					{grouped.map(([hour, items]) => (
						<section key={hour}>
							<div className="mb-1.5 flex items-center gap-2">
								<span className="font-mono text-xs tabular-nums text-muted-foreground">
									{hour}
								</span>
								<span className="h-px flex-1 bg-border" />
							</div>
							<div className="space-y-2">
								{items.map((row) => (
									<AdministrationRow
										key={row.id}
										row={row}
										readOnly={readOnly}
										onAct={() => setActive(row)}
									/>
								))}
							</div>
						</section>
					))}
				</div>
			)}

			{active && (
				<GiveDoseDialog
					stayId={stayId}
					administration={active}
					open={Boolean(active)}
					onOpenChange={(open) => !open && setActive(null)}
				/>
			)}
		</div>
	);
}

function AdministrationRow({
	row,
	readOnly,
	onAct,
}: {
	row: Administration;
	readOnly: boolean;
	onAct: () => void;
}) {
	const meta = ADMIN_STATUS_META[row.status] ?? ADMIN_STATUS_META.PENDING;
	const StatusIcon = meta.icon;
	const kind = ORDER_KIND_META[row.order.kind];
	const KindIcon = kind.icon;
	const dueAt = new Date(row.dueAt);
	const isPending = row.status === "PENDING";
	const minutesLate = Math.floor((Date.now() - dueAt.getTime()) / 60_000);
	const isOverdue = isPending && minutesLate > 30;

	return (
		<div
			className={cn(
				"flex items-center gap-3 rounded border bg-card p-3",
				isOverdue && "border-destructive/40 bg-destructive/5",
			)}
		>
			<div className="flex size-9 shrink-0 items-center justify-center rounded bg-muted">
				<KindIcon className="size-4 text-muted-foreground" />
			</div>

			<div className="min-w-0 flex-1">
				<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
					<span className="truncate text-sm font-medium">{row.order.nameSnapshot}</span>
					{row.order.doseAmount != null && (
						<span className="font-mono text-xs tabular-nums text-muted-foreground">
							{String(row.order.doseAmount)} {row.order.doseUnit ?? ""}
							{row.order.route ? ` · ${row.order.route}` : ""}
						</span>
					)}
					{row.order.rateMlPerHour != null && (
						<span className="font-mono text-xs tabular-nums text-muted-foreground">
							{String(row.order.rateMlPerHour)} مل/س
						</span>
					)}
					{row.order.prn && (
						<Badge
							variant="outline"
							className="h-4 px-1 text-[10px]"
						>
							عند اللزوم
						</Badge>
					)}
				</div>

				<div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-muted-foreground">
					<span className="font-mono tabular-nums">
						{dueAt.toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" })}
					</span>
					{isOverdue && <span className="text-destructive">تأخّر {minutesLate} دقيقة</span>}
					{row.status === "GIVEN" && row.performedBy && (
						<span>
							أعطاه {row.performedBy.name}
							{row.witness ? ` · شهد ${row.witness.name}` : ""}
						</span>
					)}
					{row.skipReasonAr && <span className="truncate">{row.skipReasonAr}</span>}
					{row.order.instructionsAr && (
						<Tooltip>
							<TooltipTrigger asChild>
								<span className="cursor-help truncate underline decoration-dotted">
									تعليمات
								</span>
							</TooltipTrigger>
							<TooltipContent dir="rtl">{row.order.instructionsAr}</TooltipContent>
						</Tooltip>
					)}
				</div>
			</div>

			<span
				className={cn(
					"inline-flex shrink-0 items-center gap-1 rounded px-2 py-1 text-[11px]",
					meta.className,
				)}
			>
				<StatusIcon className="size-3.5" />
				{meta.label}
			</span>

			{isPending && !readOnly && (
				// هدف لمس كبير — الزرّ يُضغط بإبهامٍ وقفّاز على جانب القفص
				<Button
					size="sm"
					className="h-9 shrink-0 px-4"
					onClick={onAct}
				>
					تنفيذ
				</Button>
			)}
		</div>
	);
}

/**
 * شريط اليوم — ٢٤ ساعة أفقيًا، وكل جرعة علامة في موضعها.
 *
 * يجيب سؤالًا لا تجيبه القائمة: أين تتكدّس الجرعات عبر اليوم؟ وهو ما يُخطَّط به
 * تسليم الورديّة. الألوان دلالية: الأخضر أُعطي، والأحمر فات، والرمادي بانتظار.
 */
function DayRibbon({
	rows,
	day,
	isRtl,
}: {
	rows: Administration[];
	day: Date;
	isRtl: boolean;
}) {
	const width = 720;
	const height = 44;
	const padX = 8;
	const trackY = 22;
	const innerW = width - padX * 2;

	const dayStart = new Date(day);
	dayStart.setHours(0, 0, 0, 0);

	const xOf = (at: Date) => {
		const ratio = Math.min(
			1,
			Math.max(0, (at.getTime() - dayStart.getTime()) / (24 * HOUR_MS)),
		);
		return padX + (isRtl ? innerW - ratio * innerW : ratio * innerW);
	};

	const now = new Date();
	const showNow =
		now.getTime() >= dayStart.getTime() && now.getTime() < dayStart.getTime() + 24 * HOUR_MS;

	if (rows.length === 0) return null;

	return (
		<div className="overflow-x-auto rounded border bg-card/50 p-2">
			<svg
				viewBox={`0 0 ${width} ${height}`}
				width="100%"
				style={{ minWidth: 480 }}
				role="img"
				aria-label="توزيع جرعات اليوم على الساعات"
			>
				<title>توزيع جرعات اليوم على الساعات</title>
				{/* مسار الساعات */}
				<line
					x1={padX}
					y1={trackY}
					x2={width - padX}
					y2={trackY}
					className="stroke-border"
					strokeWidth={1}
				/>
				{Array.from({ length: 5 }, (_, i) => i * 6).map((hour) => {
					const at = new Date(dayStart.getTime() + hour * HOUR_MS);
					const x = xOf(at);
					return (
						<g key={hour}>
							<line
								x1={x}
								y1={trackY - 4}
								x2={x}
								y2={trackY + 4}
								className="stroke-border"
								strokeWidth={1}
							/>
							<text
								x={x}
								y={height - 3}
								textAnchor="middle"
								className="fill-muted-foreground text-[9px]"
							>
								{String(hour).padStart(2, "0")}
							</text>
						</g>
					);
				})}

				{showNow && (
					<line
						x1={xOf(now)}
						y1={6}
						x2={xOf(now)}
						y2={trackY + 8}
						className="stroke-primary"
						strokeWidth={1.5}
						strokeDasharray="3 2"
					/>
				)}

				{rows.map((row) => {
					const at = new Date(row.dueAt);
					const x = xOf(at);
					const pending = row.status === "PENDING";
					const late = pending && Date.now() - at.getTime() > 30 * 60_000;
					return (
						<circle
							key={row.id}
							cx={x}
							cy={trackY}
							r={late ? 5 : 4}
							className={cn(
								late
									? "fill-destructive"
									: row.status === "GIVEN"
										? "fill-emerald-500"
										: pending
											? "fill-muted-foreground/50"
											: "fill-muted-foreground/25",
							)}
						/>
					);
				})}
			</svg>
			<div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
				<Legend
					className="bg-emerald-500"
					label="أُعطي"
					icon={IconCheck}
				/>
				<Legend
					className="bg-muted-foreground/50"
					label="بانتظار"
					icon={IconClock}
				/>
				<Legend
					className="bg-destructive"
					label="فات موعده"
					icon={IconX}
				/>
				<Legend
					className="bg-muted-foreground/25"
					label="تُخطّي أو أُوقف"
					icon={IconPlayerPause}
				/>
			</div>
		</div>
	);
}

function Legend({
	className,
	label,
	icon: Icon,
}: {
	className: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
}) {
	return (
		<span className="inline-flex items-center gap-1">
			<span className={cn("size-2 rounded-full", className)} />
			<Icon className="size-3" />
			{label}
		</span>
	);
}
