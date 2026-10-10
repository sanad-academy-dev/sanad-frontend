import { useMemo } from "react";

import type { WeightHistoryPoint } from "@/features/care/nutrition/hooks/use-nutrition";
import { cn } from "@/lib/utils";

// منحنى الوزن — SVG مباشر لا مكتبة رسوم.
//
// السبب: هذه ليست لوحة تحليلات بل خطّ واحد مع خطّ هدف، ويعيش داخل لوح جانبي.
// وأهمّ من ذلك أن المقياس الرأسي هنا **لا يبدأ من صفر**: فقد ٢٪ من الوزن تقدّم
// سريري حقيقي، وحشره في مقياس يبدأ من الصفر يجعله خطًّا مسطّحًا يقرؤه وليّ الأمر
// «لم يحدث شيء». المدى مبنيّ على البيانات، والخطّ المرجعي يحمل الهدف.

const WIDTH = 600;
const HEIGHT = 140;
const PAD_X = 8;
const PAD_Y = 12;

const dateFmt = new Intl.DateTimeFormat("ar", { month: "short", day: "numeric" });

export function WeightTrend({
	points,
	idealWeightKg,
	className,
}: {
	points: WeightHistoryPoint[];
	idealWeightKg: number | null;
	className?: string;
}) {
	const chart = useMemo(() => {
		if (points.length < 2) return null;

		const weights = points.map((p) => p.weightKg);
		const candidates = idealWeightKg ? [...weights, idealWeightKg] : weights;
		const rawMin = Math.min(...candidates);
		const rawMax = Math.max(...candidates);
		// هامش ١٠٪ من المدى (أو ٠٫٥ كجم إن كان المدى معدومًا) ليتنفّس الخطّ
		const span = rawMax - rawMin || 1;
		const min = rawMin - span * 0.1;
		const max = rawMax + span * 0.1;

		const times = points.map((p) => new Date(p.at).getTime());
		const tMin = Math.min(...times);
		const tMax = Math.max(...times);
		const tSpan = tMax - tMin || 1;

		const x = (t: number) => PAD_X + ((t - tMin) / tSpan) * (WIDTH - PAD_X * 2);
		const y = (w: number) => HEIGHT - PAD_Y - ((w - min) / (max - min)) * (HEIGHT - PAD_Y * 2);

		return {
			min,
			max,
			path: points
				.map((p, i) => `${i === 0 ? "M" : "L"} ${x(times[i])} ${y(p.weightKg)}`)
				.join(" "),
			dots: points.map((p, i) => ({
				cx: x(times[i]),
				cy: y(p.weightKg),
				point: p,
			})),
			idealY: idealWeightKg ? y(idealWeightKg) : null,
			first: points[0],
			last: points[points.length - 1],
		};
	}, [points, idealWeightKg]);

	if (!chart) return null;

	const change = chart.last.weightKg - chart.first.weightKg;

	return (
		<div className={cn("flex flex-col gap-2 rounded-[4px] border p-3", className)}>
			<div className="flex flex-wrap items-baseline justify-between gap-2">
				<span className="text-sm font-semibold">منحنى الوزن</span>
				<span className="text-xs tabular-nums text-muted-foreground">
					{chart.first.weightKg} ← {chart.last.weightKg} كجم ({change > 0 ? "+" : ""}
					{Math.round(change * 100) / 100})
				</span>
			</div>

			{/* الرسم LTR داخل صفحة RTL: محور الزمن يمضي يسار←يمين في كل الرسوم البيانية،
			    وعكسه يجعل «التقدّم» يقرأ نحو الخلف */}
			<div dir="ltr">
				<svg
					viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
					className="h-[140px] w-full"
					role="img"
					aria-label={`منحنى وزن من ${chart.first.weightKg} إلى ${chart.last.weightKg} كيلوجرام`}
				>
					<title>منحنى الوزن</title>

					{chart.idealY != null && (
						<>
							<line
								x1={PAD_X}
								x2={WIDTH - PAD_X}
								y1={chart.idealY}
								y2={chart.idealY}
								stroke="currentColor"
								strokeDasharray="4 4"
								strokeWidth={1}
								className="text-emerald-500"
							/>
							<text
								x={WIDTH - PAD_X}
								y={chart.idealY - 4}
								textAnchor="end"
								className="fill-emerald-600 text-[10px]"
							>
								الهدف {idealWeightKg}
							</text>
						</>
					)}

					<path
						d={chart.path}
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinejoin="round"
						strokeLinecap="round"
						className="text-primary"
					/>

					{chart.dots.map((dot) => (
						<circle
							key={`${dot.point.at}-${dot.point.source}`}
							cx={dot.cx}
							cy={dot.cy}
							r={dot.point.source === "recheck" ? 4 : 2.5}
							// المراجعات المقصودة تُميَّز عن الوزنات العارضة في زيارات أخرى
							className={
								dot.point.source === "recheck"
									? "fill-primary"
									: "fill-background stroke-primary"
							}
							strokeWidth={1.5}
						>
							<title>
								{dateFmt.format(new Date(dot.point.at))} — {dot.point.weightKg} كجم
							</title>
						</circle>
					))}
				</svg>
			</div>

			<div className="flex items-center gap-4 text-[11px] text-muted-foreground">
				<span className="flex items-center gap-1.5">
					<span className="size-2 rounded-full bg-primary" />
					مراجعة تغذية
				</span>
				<span className="flex items-center gap-1.5">
					<span className="size-2 rounded-full border border-primary bg-background" />
					وزن من زيارة أخرى
				</span>
			</div>
		</div>
	);
}
