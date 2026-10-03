import { useMemo } from "react";

import { ChartPieDonut } from "@/components/ui/chart-pie-donut";
import { colorAt } from "@/features/reports/data/report-palette";
import { formatReportValue } from "@/features/reports/utils/format-report-value";
import { useI18n } from "@/hooks/use-i18n";
import type { ReportPieWidget as PieWidget } from "@/server/reports/reports.type";

/**
 * Composition of a whole. The donut reuses the app's shared `ChartPieDonut`; the legend is
 * drawn here rather than inside the chart so long Arabic labels wrap in normal flow instead
 * of being clipped by the SVG viewport.
 */
export function ReportPieWidget({ widget }: { widget: PieWidget }) {
	const { lang } = useI18n();

	const data = useMemo(
		() =>
			widget.slices.map((slice, index) => ({
				key: slice.key,
				label: slice.label[lang],
				value: slice.value,
				fill: colorAt(index),
			})),
		[widget.slices, lang],
	);

	if (data.length === 0) {
		return (
			<p className="flex h-full items-center justify-center text-muted-foreground text-sm">
				{lang === "ar" ? "لا بيانات في النطاق." : "No data in this window."}
			</p>
		);
	}

	return (
		<div className="flex h-full min-h-0 flex-col gap-2">
			<div className="min-h-0 flex-1">
				<ChartPieDonut
					data={data}
					className="h-full max-w-[190px]"
					centerValue={formatReportValue(widget.total, widget.format, lang)}
				/>
			</div>
			{/* الأسطورة أسفل الرسم — نقطة ملوّنة ثم التسمية ثم القيمة */}
			<ul className="flex shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-1">
				{data.map((slice) => (
					<li
						key={slice.key}
						className="flex items-center gap-1.5 text-xs"
					>
						<span
							aria-hidden
							className="size-2 shrink-0 rounded-[2px]"
							style={{ background: slice.fill }}
						/>
						<span className="text-muted-foreground">{slice.label}</span>
						<span className="font-medium tabular-nums">
							{formatReportValue(slice.value, widget.format, lang)}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
