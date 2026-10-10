import { formatReportValue } from "@/features/reports/utils/format-report-value";
import { useI18n } from "@/hooks/use-i18n";
import type { ReportBigStatWidget as BigStatWidget } from "@/server/reports/reports.type";

/**
 * One headline number with the figures that qualify it — the «32.528 ساعة» tile from the
 * design. The breakdown row keeps the number honest: a total with no denominator invites the
 * wrong reading.
 */
export function ReportBigStatWidget({ widget }: { widget: BigStatWidget }) {
	const { lang } = useI18n();

	return (
		<div className="flex h-full flex-col items-center justify-center gap-6 px-4">
			<div className="flex flex-col items-center gap-1">
				<p className="font-bold text-4xl text-primary tabular-nums">
					{formatReportValue(widget.value, widget.format, lang)}
				</p>
				<p className="text-muted-foreground text-sm">{widget.caption[lang]}</p>
			</div>

			{widget.breakdown && widget.breakdown.length > 0 ? (
				<dl className="flex w-full flex-wrap items-start justify-center gap-x-8 gap-y-3">
					{widget.breakdown.map((entry) => (
						<div
							key={entry.key}
							className="flex min-w-24 flex-col items-center gap-0.5"
						>
							<dt className="text-muted-foreground text-xs">{entry.label[lang]}</dt>
							<dd className="font-semibold text-sm tabular-nums">
								{formatReportValue(entry.value, entry.format, lang)}
							</dd>
						</div>
					))}
				</dl>
			) : null}
		</div>
	);
}
