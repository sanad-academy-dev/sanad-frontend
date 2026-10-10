import { downloadCsv } from "@/features/accounting/utils/export-csv";
import { reportText } from "@/features/reports/utils/format-report-value";
import type { Language } from "@/lib/data/constants";
import type { ReportWidgetDef } from "@/server/reports/reports.catalog";
import type { ReportPayload, ReportWidgetPayload } from "@/server/reports/reports.type";

/**
 * CSV export for reports — the toolbar's «تصدير» on both screens.
 *
 * Every widget kind flattens to a header row plus data rows, so one report exports as a
 * single sheet with a titled section per widget rather than one file per chart. Numbers are
 * written raw (no thousands separators, no unit suffix) because the destination is a
 * spreadsheet, not a reader.
 */

type Section = { title: string; headers: string[]; rows: (string | number)[][] };

function widgetSection(
	title: string,
	widget: ReportWidgetPayload,
	lang: Language,
): Section | null {
	switch (widget.kind) {
		case "series":
			return {
				title,
				headers: ["", ...widget.series.map((series) => series.label[lang])],
				rows: widget.points.map((point) => [
					point.label,
					...widget.series.map((series) => point.values[series.key] ?? 0),
				]),
			};
		case "pie":
			return {
				title,
				headers: [lang === "ar" ? "البند" : "Item", lang === "ar" ? "القيمة" : "Value"],
				rows: widget.slices.map((slice) => [slice.label[lang], slice.value]),
			};
		case "bars":
			return {
				title,
				headers: [lang === "ar" ? "البند" : "Item", lang === "ar" ? "القيمة" : "Value"],
				rows: widget.bars.map((bar) => [reportText(bar.label, lang), bar.value]),
			};
		case "table":
			return {
				title,
				headers: widget.columns.map((column) => column.label[lang]),
				rows: widget.rows.map((row) =>
					widget.columns.map((column) => {
						const value = row[column.key];
						if (value == null) return "";
						return typeof value === "number" ? value : reportText(value, lang);
					}),
				),
			};
		case "bigStat":
			return {
				title,
				headers: [lang === "ar" ? "البند" : "Item", lang === "ar" ? "القيمة" : "Value"],
				rows: [
					[widget.caption[lang], widget.value],
					...(widget.breakdown ?? []).map(
						(entry) => [entry.label[lang], entry.value] as (string | number)[],
					),
				],
			};
		default:
			return null;
	}
}

/** Exports one widget on its own — the widget card's «تصدير CSV» menu item. */
export function exportWidgetCsv(
	fileName: string,
	title: string,
	widget: ReportWidgetPayload,
	lang: Language,
): void {
	const section = widgetSection(title, widget, lang);
	if (!section) return;
	downloadCsv(fileName, section.headers, section.rows);
}

/** Exports the whole report: KPI strip first, then one titled section per visible widget. */
export function exportReportCsv(
	fileName: string,
	reportTitle: string,
	payload: ReportPayload,
	defs: readonly ReportWidgetDef[],
	lang: Language,
): void {
	const rows: (string | number)[][] = [];

	rows.push([lang === "ar" ? "المؤشرات" : "Key figures"]);
	for (const kpi of payload.kpis) rows.push([kpi.label[lang], kpi.value]);

	for (const def of defs) {
		const widget = payload.widgets[def.key];
		if (!widget) continue;
		const section = widgetSection(def.title[lang], widget, lang);
		if (!section) continue;
		rows.push([]);
		rows.push([section.title]);
		rows.push(section.headers);
		rows.push(...section.rows);
	}

	downloadCsv(fileName, [reportTitle, `${payload.range.from} → ${payload.range.to}`], rows);
}
