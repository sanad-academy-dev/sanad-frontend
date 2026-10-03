/**
 * The client half of the report date window. Kept in `YYYY-MM-DD` strings — the same shape
 * `DateField` stores and the API accepts — so the value moves between the picker, the query
 * key, the saved view and the request without a single conversion.
 */

const pad = (n: number) => String(n).padStart(2, "0");

export const toIsoDay = (date: Date): string =>
	`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** Trailing 12 months, ending today — what a report opens on before any saved view. */
export function defaultReportRange(now: Date = new Date()): { from: string; to: string } {
	const from = new Date(now.getFullYear(), now.getMonth() - 11, 1);
	return { from: toIsoDay(from), to: toIsoDay(now) };
}

/** Named windows offered next to the date pickers. */
export type ReportPreset = "30d" | "90d" | "ytd" | "12m";

export function presetRange(
	preset: ReportPreset,
	now: Date = new Date(),
): { from: string; to: string } {
	const to = toIsoDay(now);
	switch (preset) {
		case "30d":
			return { from: toIsoDay(new Date(now.getTime() - 29 * 86_400_000)), to };
		case "90d":
			return { from: toIsoDay(new Date(now.getTime() - 89 * 86_400_000)), to };
		case "ytd":
			return { from: toIsoDay(new Date(now.getFullYear(), 0, 1)), to };
		default:
			return defaultReportRange(now);
	}
}
