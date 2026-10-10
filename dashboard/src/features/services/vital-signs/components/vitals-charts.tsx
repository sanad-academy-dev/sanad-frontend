import { IconChevronRight, IconPin, IconPinFilled } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	VITALS_CHART_COLOR,
	VITALS_FIELDS,
	type VitalsFieldSpec,
} from "@/features/services/vital-signs/data/vitals-fields";
import { cn } from "@/lib/utils";
import type {
	VitalSignsRecordResponse,
	VitalsMetricKey,
} from "@/server/vital-signs/vital-signs.type";

const RANGES = [
	{ key: "3m", label: "٣ أشهر", days: 90 },
	{ key: "6m", label: "٦ أشهر", days: 180 },
	{ key: "1y", label: "سنة", days: 365 },
	{ key: "all", label: "الكل", days: Number.POSITIVE_INFINITY },
] as const;

type RangeKey = (typeof RANGES)[number]["key"];

interface VitalsChartsProps {
	records: VitalSignsRecordResponse[];
	/** العودة إلى قائمة القياسات — الرسوم تشغل التبويب وحدها */
	onBack: () => void;
}

/**
 * شاشة الرسوم البيانية — تشغل التبويب وحدها ويُخرج منها زر «رجوع». إفرادها بالمساحة
 * كاملةً هو ما يجعل الرسم المثبَّت كبيرًا بما يكفي لقراءة اتجاه فعلي.
 *
 * مضاعفات صغيرة: مقاييس بوحدات مختلفة (كجم مقابل نبضة/د) لا تُجمع على محورين في رسم
 * واحد — المحور المزدوج يجعل التقاطعات تبدو ذات معنى وهي من صنع المقياس. كل رسم
 * سلسلة واحدة، وعنوانه هو هويّته لا لونه.
 *
 * واحد منها مثبَّت وكبير في الأعلى والبقية مصغّرة تحته؛ تثبيت رسم آخر يبادله مكان
 * المثبَّت. الغرض أن يقرأ المدرّب المقياس الذي يتابعه بحجم مفيد دون أن يفقد نظرة
 * سريعة على البقية.
 */
export function VitalsCharts({ records, onBack }: VitalsChartsProps) {
	const [range, setRange] = useState<RangeKey>("6m");
	const [pinned, setPinned] = useState<VitalsMetricKey | null>(null);

	const cutoff = useMemo(() => {
		const days = RANGES.find((r) => r.key === range)?.days ?? Number.POSITIVE_INFINITY;
		if (!Number.isFinite(days)) return null;
		return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
	}, [range]);

	// السجلات تصل بترتيب تنازلي؛ الرسم يحتاج تصاعديًا حتى يسير الزمن للأمام
	const points = useMemo(() => {
		return records
			.filter((r) => !r.correction) // المُصحَّح لا يُرسم — التصحيح يمثّله
			.filter((r) => (cutoff ? new Date(r.recordedAt) >= cutoff : true))
			.slice()
			.sort((a, b) => +new Date(a.recordedAt) - +new Date(b.recordedAt));
	}, [records, cutoff]);

	const charted = VITALS_FIELDS.filter((spec) => points.some((p) => p[spec.key] != null));

	// المثبَّت مشتق لا مخزَّن وحده: تضييق المدة قد يُفرغ المقياس المثبَّت من نقاطه،
	// فيسقط الاختيار إلى أول مقياس له بيانات بدل ترك مساحة كبيرة فارغة في الأعلى
	const pinnedSpec = charted.find((s) => s.key === pinned) ?? charted[0];
	const rest = charted.filter((s) => s.key !== pinnedSpec?.key);

	return (
		<div className="flex flex-col gap-3">
			{/* ترتيب DOM في RTL: سهم الرجوع يمينًا، ثم العنوان، ومحدّد المدة يسارًا */}
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						className="size-7"
						onClick={onBack}
						aria-label="رجوع إلى سجل القياسات"
					>
						<IconChevronRight className="size-4" />
					</Button>
					<p className="font-semibold text-sm">الرسوم البيانية</p>
				</div>

				<ToggleGroup
					type="single"
					size="sm"
					value={range}
					onValueChange={(v) => v && setRange(v as RangeKey)}
					variant="outline"
				>
					{RANGES.map((r) => (
						<ToggleGroupItem
							key={r.key}
							value={r.key}
							className="px-2.5 text-xs"
						>
							{r.label}
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</div>

			{charted.length === 0 ? (
				<p className="rounded-[4px] border p-6 text-center text-sm text-muted-foreground">
					لا توجد قياسات في هذه الفترة
				</p>
			) : (
				<div className="flex flex-col gap-3">
					{pinnedSpec && (
						<MetricChart
							key={pinnedSpec.key}
							spec={pinnedSpec}
							points={points}
							isPinned
						/>
					)}

					{rest.length > 0 && (
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
							{rest.map((spec) => (
								<MetricChart
									key={spec.key}
									spec={spec}
									points={points}
									onPin={() => setPinned(spec.key)}
								/>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

/** يوسّع المجال إلى مضاعفات خطوة مرتّبة (1/2/5 × قوة عشرة) فيصير التدريج مقروءًا */
function niceDomain(lo: number, hi: number): [number, number] {
	const span = hi - lo || 1;
	const mag = 10 ** Math.floor(Math.log10(span));
	const ratio = span / mag;
	const step = ratio < 2 ? mag / 4 : ratio < 5 ? mag / 2 : mag;
	return [Math.max(0, Math.floor(lo / step) * step), Math.ceil(hi / step) * step];
}

function MetricChart({
	spec,
	points,
	isPinned = false,
	onPin,
}: {
	spec: VitalsFieldSpec;
	points: VitalSignsRecordResponse[];
	isPinned?: boolean;
	onPin?: () => void;
}) {
	const data = points
		.map((p) => ({
			at: new Date(p.recordedAt).getTime(),
			value: p[spec.key] == null ? null : Number(p[spec.key]),
		}))
		.filter((d) => d.value != null);

	const config = {
		value: { label: spec.label, color: VITALS_CHART_COLOR },
	} satisfies ChartConfig;

	// المجال محسوب هنا لا متروكًا لـ recharts: مجاله التلقائي يهبط تحت الصفر مع
	// السلسلة الثابتة فيظهر تدريج مثل «1-» لا معنى له لقياس حيوي. والحشو يمنع
	// انهيار المجال إلى نقطة واحدة حين تتساوى كل القيم. ثم يُقرَّب الحدّان إلى
	// مضاعفات خطوة مرتّبة وإلا ولّد recharts تدريجًا بكسور طويلة غير مقروءة.
	const values = data.map((d) => d.value as number);
	const lo = values.length ? Math.min(...values) : 0;
	const hi = values.length ? Math.max(...values) : 1;
	const pad = hi === lo ? Math.max(1, Math.abs(hi) * 0.1) : (hi - lo) * 0.15;
	const domain = niceDomain(Math.max(0, lo - pad), hi + pad);

	const latest = values.at(-1);

	return (
		<div
			className={cn("flex flex-col gap-2 rounded-[4px] border p-3", isPinned && "bg-muted/20")}
		>
			<div className="flex items-center justify-between gap-2">
				{/* العنوان يحمل الهوية — فسلسلة واحدة لا تحتاج مفتاح ألوان */}
				<div className="flex items-baseline gap-2">
					<p className={cn("font-medium", isPinned ? "text-base" : "text-sm")}>{spec.label}</p>
					{isPinned && latest != null && (
						<span className="text-sm tabular-nums text-muted-foreground">
							{latest.toFixed(spec.precision)}
							{spec.unit && ` ${spec.unit}`}
						</span>
					)}
				</div>

				<div className="flex items-center gap-1">
					{!isPinned && <span className="text-xs text-muted-foreground">{spec.unit}</span>}
					{isPinned ? (
						<span
							className="flex size-7 items-center justify-center text-primary"
							title="مثبَّت — ثبّت رسمًا آخر ليحلّ محلّه"
						>
							<IconPinFilled className="size-4" />
							<span className="sr-only">مثبَّت</span>
						</span>
					) : (
						<Button
							size="icon"
							variant="ghost"
							className="size-7"
							onClick={onPin}
							aria-label={`تثبيت ${spec.label} في الأعلى`}
							title={`تثبيت ${spec.label} في الأعلى`}
						>
							<IconPin className="size-4" />
						</Button>
					)}
				</div>
			</div>

			<ChartContainer
				config={config}
				className={cn("w-full aspect-auto", isPinned ? "h-72" : "h-36")}
			>
				<LineChart
					accessibilityLayer
					data={data}
					margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
				>
					<CartesianGrid
						vertical={false}
						strokeOpacity={0.4}
					/>
					<XAxis
						dataKey="at"
						type="number"
						scale="time"
						domain={["dataMin", "dataMax"]}
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						minTickGap={32}
						fontSize={11}
						tickFormatter={(v: number) =>
							new Date(v).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" })
						}
					/>
					<YAxis
						orientation="right"
						tickLine={false}
						axisLine={false}
						tickMargin={6}
						width={38}
						fontSize={11}
						domain={domain}
						// بلا هذا يولّد recharts تدريجًا كسريًا لمقياس صحيح، فيطبع
						// التقريب قيمًا مكرّرة (٣، ٣، ٢، ٢) على محور واحد
						allowDecimals={spec.precision > 0}
						tickFormatter={(v: number) => v.toFixed(spec.precision)}
					/>
					<ChartTooltip
						content={
							<ChartTooltipContent
								labelFormatter={(_, payload) => {
									const at = payload?.[0]?.payload?.at as number | undefined;
									return at ? new Date(at).toLocaleString("en-GB") : "";
								}}
								formatter={(value) => [
									`${Number(value).toFixed(spec.precision)}${spec.unit ? ` ${spec.unit}` : ""}`,
									spec.label,
								]}
							/>
						}
					/>
					<Line
						dataKey="value"
						type="monotone"
						stroke="var(--color-value)"
						strokeWidth={2}
						dot={{ r: isPinned ? 3 : 2, strokeWidth: 0, fill: "var(--color-value)" }}
						activeDot={{ r: 5 }}
						connectNulls
						isAnimationActive={false}
					/>
				</LineChart>
			</ChartContainer>
		</div>
	);
}
