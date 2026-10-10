import { SINGLE_SERIES_COLOR } from "@/features/reports/data/report-palette";
import { formatReportValue, reportText } from "@/features/reports/utils/format-report-value";
import { useI18n } from "@/hooks/use-i18n";
import type { ReportBarsWidget as BarsWidget } from "@/server/reports/reports.type";

/**
 * A ranked list — top doctors, categories by value, branches by load.
 *
 * Built from plain elements rather than recharts: the bars are one series (rank, not
 * category) so they share one colour, and letting the label sit in normal flow means a long
 * Arabic staff name wraps instead of being truncated inside an SVG tick.
 */
export function ReportBarsWidget({ widget }: { widget: BarsWidget }) {
	const { lang } = useI18n();

	if (widget.bars.length === 0) {
		return (
			<p className="flex h-full items-center justify-center text-muted-foreground text-sm">
				{lang === "ar" ? "لا بيانات في النطاق." : "No data in this window."}
			</p>
		);
	}

	return (
		<ul className="flex h-full flex-col justify-center gap-2 overflow-y-auto">
			{widget.bars.map((bar) => (
				<li
					key={bar.key}
					className="flex flex-col gap-1"
				>
					{/* في RTL: التسمية يمينًا والقيمة يسارًا — ترتيب DOM هو ما يحدّد الجهة */}
					<div className="flex items-baseline justify-between gap-2 text-xs">
						<span className="truncate text-foreground">{reportText(bar.label, lang)}</span>
						<span className="shrink-0 font-medium tabular-nums text-muted-foreground">
							{formatReportValue(bar.value, widget.format, lang)}
						</span>
					</div>
					<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
						<div
							className="h-full rounded-full"
							style={{
								width: `${widget.max > 0 ? (bar.value / widget.max) * 100 : 0}%`,
								background: SINGLE_SERIES_COLOR,
							}}
						/>
					</div>
				</li>
			))}
		</ul>
	);
}
