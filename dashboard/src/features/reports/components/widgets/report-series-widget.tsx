import { useMemo } from "react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from "recharts";

import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { seriesColor } from "@/features/reports/data/report-palette";
import {
	formatAxisTick,
	formatReportValue,
} from "@/features/reports/utils/format-report-value";
import { useI18n } from "@/hooks/use-i18n";
import type { ReportSeriesWidget as SeriesWidget } from "@/server/reports/reports.type";

/**
 * Trends over the report's date window.
 *
 * RTL handling is the only subtle part: recharts lays a cartesian chart out left-to-right
 * regardless of `dir`, so in Arabic the x-axis is `reversed` (oldest on the right) and the
 * y-axis moves to the right edge — matching how the rest of the app reads.
 */
export function ReportSeriesWidget({ widget }: { widget: SeriesWidget }) {
	const { lang, isRtl } = useI18n();

	const config = useMemo<ChartConfig>(
		() =>
			Object.fromEntries(
				widget.series.map((series, index) => [
					series.key,
					{ label: series.label[lang], color: seriesColor(series.tone, index) },
				]),
			),
		[widget.series, lang],
	);

	// recharts wants one flat object per point; the payload keeps values nested to stay typed.
	const data = useMemo(
		() => widget.points.map((point) => ({ label: point.label, ...point.values })),
		[widget.points],
	);

	// A grid with an axis and no marks reads as "chart failed to draw", not as "nothing
	// happened" — so an all-zero window says so in words, like the other widget kinds do.
	const hasData = useMemo(
		() =>
			widget.points.some((point) => Object.values(point.values).some((value) => value !== 0)),
		[widget.points],
	);

	const showLegend = widget.series.length > 1;

	if (!hasData) {
		return (
			<p className="flex h-full items-center justify-center text-muted-foreground text-sm">
				{lang === "ar" ? "لا بيانات في النطاق." : "No data in this window."}
			</p>
		);
	}

	const axes = (
		<>
			<CartesianGrid vertical={false} />
			<YAxis
				orientation={isRtl ? "right" : "left"}
				tickLine={false}
				axisLine={false}
				width={48}
				// عدّ الأشياء لا يقبل الكسور — بدونه يرسم recharts «0.5 موعد» ويكرّر «2»
				allowDecimals={widget.format !== "number"}
				tickFormatter={(value) => formatAxisTick(Number(value), widget.format)}
			/>
			<XAxis
				dataKey="label"
				reversed={isRtl}
				tickLine={false}
				axisLine={false}
				tickMargin={8}
				minTickGap={12}
			/>
			<ChartTooltip
				cursor={false}
				content={
					<ChartTooltipContent
						indicator="line"
						formatter={(value, name) => (
							<div className="flex w-full items-center justify-between gap-3">
								<span className="text-muted-foreground">
									{config[String(name)]?.label ?? String(name)}
								</span>
								<span className="font-medium tabular-nums">
									{formatReportValue(Number(value), widget.format, lang)}
								</span>
							</div>
						)}
					/>
				}
			/>
			{showLegend && <ChartLegend content={<ChartLegendContent />} />}
		</>
	);

	const margin = { top: 8, right: 8, left: 8, bottom: 0 };

	return (
		<ChartContainer
			config={config}
			className="aspect-auto h-full w-full"
		>
			{widget.chart === "area" ? (
				<AreaChart
					accessibilityLayer
					data={data}
					margin={margin}
				>
					{axes}
					{widget.series.map((series) => (
						<Area
							key={series.key}
							dataKey={series.key}
							type="monotone"
							stackId={undefined}
							stroke={`var(--color-${series.key})`}
							fill={`var(--color-${series.key})`}
							fillOpacity={0.2}
							strokeWidth={2}
						/>
					))}
				</AreaChart>
			) : widget.chart === "line" ? (
				<LineChart
					accessibilityLayer
					data={data}
					margin={margin}
				>
					{axes}
					{widget.series.map((series) => (
						<Line
							key={series.key}
							dataKey={series.key}
							type="monotone"
							dot={false}
							stroke={`var(--color-${series.key})`}
							strokeWidth={2}
						/>
					))}
				</LineChart>
			) : (
				<BarChart
					accessibilityLayer
					data={data}
					margin={margin}
				>
					{axes}
					{widget.series.map((series) => (
						<Bar
							key={series.key}
							dataKey={series.key}
							// A stacked bar answers "what made up the total"; a grouped one compares
							// series against each other. The builder picks, the renderer obeys.
							stackId={widget.chart === "stackedBar" ? "a" : undefined}
							fill={`var(--color-${series.key})`}
							radius={2}
						/>
					))}
				</BarChart>
			)}
		</ChartContainer>
	);
}
