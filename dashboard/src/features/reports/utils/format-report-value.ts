import type { Language } from "@/lib/data/constants";
import type {
	ReportLabel,
	ReportText,
	ReportValueFormat,
} from "@/server/reports/reports.type";

/**
 * Value + label formatting for report widgets.
 *
 * Digits stay Latin in both languages: the mockups show `32,528` / `25/02/2026`, the tables
 * elsewhere in the app render `tabular-nums`, and Arabic-Indic digits would break column
 * alignment against them. Only the unit ("ر.س", "س") is translated.
 */

const UNITS: Record<ReportValueFormat, Record<Language, string>> = {
	number: { ar: "", en: "" },
	money: { ar: "ر.س", en: "SAR" },
	percent: { ar: "%", en: "%" },
	hours: { ar: "س", en: "h" },
	days: { ar: "يوم", en: "d" },
};

const decimal = (value: number, max: number) =>
	value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: max });

/** Resolves a bilingual label, passing plain data strings (names, codes) straight through. */
export const reportText = (text: ReportText | undefined, lang: Language): string => {
	if (text == null) return "";
	return typeof text === "string" ? text : text[lang];
};

export const isReportLabel = (value: unknown): value is ReportLabel =>
	typeof value === "object" && value !== null && "ar" in value && "en" in value;

export function formatReportValue(
	value: number,
	format: ReportValueFormat,
	lang: Language,
): string {
	const unit = UNITS[format][lang];
	// Money and hours read cleanly at whole numbers once they are large; below that the
	// fraction is the information (0.75 h is not "1 h").
	const digits = format === "number" ? 0 : Math.abs(value) >= 1000 ? 0 : 2;
	const formatted = decimal(value, digits);
	if (format === "percent") return `${formatted}%`;
	return unit ? `${formatted} ${unit}` : formatted;
}

/** Axis ticks trade precision for width — thousands collapse to `k`, millions to `M`. */
export function formatAxisTick(value: number, format: ReportValueFormat): string {
	const abs = Math.abs(value);
	if (abs >= 1_000_000) return `${decimal(value / 1_000_000, 1)}M`;
	if (abs >= 1_000) return `${decimal(value / 1_000, abs >= 10_000 ? 0 : 1)}k`;
	if (format === "percent") return `${decimal(value, 0)}%`;
	return decimal(value, abs > 0 && abs < 1 ? 2 : 0);
}

/** A table cell: bilingual label, number in its column's format, or raw data string. */
export function formatCell(
	value: ReportText | number | null | undefined,
	format: ReportValueFormat | undefined,
	lang: Language,
): string {
	if (value == null || value === "") return "—";
	if (typeof value === "number") return formatReportValue(value, format ?? "number", lang);
	return reportText(value, lang);
}

/** `2026-08-12` → `12/08/2026`, matching the date style the rest of the app prints. */
export const formatIsoDay = (iso: string): string => {
	const [year, month, day] = iso.split("-");
	return year && month && day ? `${day}/${month}/${year}` : iso;
};
