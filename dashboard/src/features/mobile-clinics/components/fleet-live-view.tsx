import {
	IconAlertTriangle,
	IconBattery1,
	IconClock,
	IconMapOff,
	IconTruck,
} from "@tabler/icons-react";
import { lazy, Suspense, useEffect, useState } from "react";

import { Spinner } from "@/components/common/spinner";
import { env } from "@/env";
import { MobileUnitSheet } from "@/features/mobile-clinics/components/mobile-unit-sheet";
import { MOBILE_UNIT_STATUS_META } from "@/features/mobile-clinics/data/status-meta";
import {
	type FleetUnit,
	isStale,
	useFleetLive,
} from "@/features/mobile-clinics/hooks/use-fleet-stream";
import { cn } from "@/lib/utils";

/**
 * MapLibre وحده ‎~١٫٢ ميغابايت. تحميله كسولًا يعني أنّ فتح الشاشة بلا إعداد خريطة (بند O1)
 * أو الاكتفاء بالقائمة لا يجرّ الحزمة أصلًا — والاستيراد لا يحدث إلّا بعد التحقّق من الرابط.
 */
const FleetMap = lazy(() => import("@/features/mobile-clinics/components/fleet-map"));

/**
 * بند مفتوح O1: خوادم بلاطات OSM العامّة تمنع الاستخدام الإنتاجي، فلا قيمة افتراضية.
 * الرسالة تجعل القرار مرئيًّا في المنتج بدل لوحة رمادية يظنّها المستخدم عطلًا.
 */
function MapNotConfigured() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-2 border-t bg-muted/20 p-8 text-center">
			<IconMapOff className="size-10 text-muted-foreground" />
			<span className="text-sm font-medium">الخريطة غير مُعدَّة</span>
			<span className="max-w-md text-xs text-muted-foreground">
				اضبط المتغيّر <code dir="ltr">VITE_MAP_STYLE_URL</code> على رابط نمط خرائط (MapLibre
				style JSON) من مزوّد بلاطات. مواقع المركبات وحالتها تعمل الآن ويمكن متابعتها من القائمة.
			</span>
		</div>
	);
}

const timeFmt = new Intl.DateTimeFormat("ar-EG", { timeStyle: "short" });

/** «منذ كم» بصيغة مختصرة — التوقيت المطلق أقلّ فائدة من عمر آخر إشارة. */
function ago(iso: string | null, now: number): string {
	if (!iso) return "لا إشارة";
	const seconds = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
	if (seconds < 60) return "الآن";
	const minutes = Math.round(seconds / 60);
	if (minutes < 60) return `قبل ${minutes} د`;
	const hours = Math.round(minutes / 60);
	return `قبل ${hours} س`;
}

function UnitRow({
	unit,
	now,
	selected,
	onSelect,
	onOpen,
}: {
	unit: FleetUnit;
	now: number;
	selected: boolean;
	onSelect: () => void;
	onOpen: () => void;
}) {
	const meta = MOBILE_UNIT_STATUS_META[unit.status];
	const Icon = meta.icon;
	const stale = isStale(unit.lastLocationAt, now);

	return (
		<button
			type="button"
			onClick={onSelect}
			onDoubleClick={onOpen}
			className={cn(
				"flex w-full flex-col gap-1 border-b px-3 py-2 text-start transition-colors hover:bg-muted/40",
				selected && "bg-muted/60",
			)}
		>
			<div className="flex items-center gap-2">
				<Icon
					className={cn("size-4 shrink-0", stale ? "text-muted-foreground" : meta.color)}
				/>
				<span className="min-w-0 flex-1 truncate text-sm font-medium">{unit.name}</span>
				{/* المتأخّرة تُعلَّم صراحةً: علامة ثابتة على الخريطة تبدو كمركبة واقفة، لا كجهاز
				    انقطع — والفرق بينهما هو كل شيء لمنسّق الحركة. */}
				{stale && (
					<span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600">
						<IconAlertTriangle className="size-3" />
						إشارة متأخّرة
					</span>
				)}
			</div>

			<div className="flex items-center gap-3 text-[11px] text-muted-foreground">
				<span>{stale ? "غير معروفة" : meta.label}</span>
				<span className="inline-flex items-center gap-1">
					<IconClock className="size-3" />
					{ago(unit.lastLocationAt, now)}
				</span>
				{unit.batteryPct !== null && (
					<span
						className={cn(
							"inline-flex items-center gap-1",
							unit.batteryPct <= 15 && "text-destructive",
						)}
					>
						<IconBattery1 className="size-3" />
						{unit.batteryPct}%
					</span>
				)}
			</div>

			{unit.openShift && (
				<span className="text-[11px] text-muted-foreground">
					وردية منذ {timeFmt.format(new Date(unit.openShift.startedAt))} ·{" "}
					{unit.openShift.openedBy}
				</span>
			)}
		</button>
	);
}

/**
 * [MC3.5] الشاشة الحيّة: خريطة + قائمة جانبية.
 *
 * القائمة ليست زينة بجانب الخريطة — هي ما يعمل حين لا تكون الخريطة مُعدَّة (بند O1)، وما
 * يُظهر المركبات التي لم تُرسل موقعًا بعد ولا وجود لها على الخريطة أصلًا.
 */
export function FleetLiveView() {
	const { units, located, isLoading, connected } = useFleetLive();
	const styleUrl = env.VITE_MAP_STYLE_URL;
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [detailId, setDetailId] = useState<string | null>(null);

	// ساعة خفيفة تُحدِّث «قبل كم» وشارة التأخّر بلا وصول أي حدث — مركبة صمتت لا تُصدر
	// حدثًا يُعيد الرسم، وهي بالضبط الحالة التي يجب أن تظهر.
	const [now, setNow] = useState(() => Date.now());
	useEffect(() => {
		const timer = setInterval(() => setNow(Date.now()), 15_000);
		return () => clearInterval(timer);
	}, []);

	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<Spinner />
			</div>
		);
	}

	return (
		<>
			<MobileUnitSheet
				unitId={detailId}
				onClose={() => setDetailId(null)}
			/>

			<div className="flex min-h-0 flex-1">
				<aside className="flex w-[280px] shrink-0 flex-col border-e">
					<div className="flex items-center justify-between border-b px-3 py-2">
						<span className="text-xs font-semibold text-muted-foreground">
							المركبات ({units.length})
						</span>
						<span
							className={cn(
								"inline-flex items-center gap-1 text-[11px]",
								connected ? "text-emerald-600" : "text-muted-foreground",
							)}
						>
							<span
								className={cn(
									"size-1.5 rounded-full",
									connected ? "bg-emerald-500" : "bg-muted-foreground",
								)}
							/>
							{connected ? "مباشر" : "غير متصل"}
						</span>
					</div>

					<div className="min-h-0 flex-1 overflow-y-auto">
						{units.length === 0 ? (
							<div className="flex flex-col items-center gap-2 p-6 text-center">
								<IconTruck className="size-8 text-muted-foreground" />
								<span className="text-xs text-muted-foreground">
									لا توجد وحدات مفعّلة. أضف وحدة من تبويب «الأسطول».
								</span>
							</div>
						) : (
							units.map((unit) => (
								<UnitRow
									key={unit.id}
									unit={unit}
									now={now}
									selected={selectedId === unit.id}
									onSelect={() => setSelectedId(unit.id)}
									onOpen={() => setDetailId(unit.id)}
								/>
							))
						)}
					</div>
				</aside>

				{styleUrl ? (
					<Suspense
						fallback={
							<div className="flex flex-1 items-center justify-center border-t">
								<Spinner />
							</div>
						}
					>
						<FleetMap
							units={located}
							styleUrl={styleUrl}
							selectedUnitId={selectedId}
							onSelectUnit={(id) => {
								setSelectedId(id);
								setDetailId(id);
							}}
						/>
					</Suspense>
				) : (
					<MapNotConfigured />
				)}
			</div>
		</>
	);
}
