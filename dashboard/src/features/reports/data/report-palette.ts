import type { ReportTone } from "@/server/reports/reports.type";

/**
 * Chart colours for the reports module — design tokens only, never literals.
 *
 * `--chart-1..5` are ONE blue at five lightnesses (a sequential ramp), so handing them to
 * five different categories would encode "more blue = more what?" and read as an ordering
 * that isn't there. Categorical series therefore lead with the four distinct hues the token
 * set actually provides (blue, amber, green, red) before falling back into the ramp, which
 * only comes into play for a legend long enough that exact identification needs the tooltip
 * anyway.
 */
export const CATEGORICAL_COLORS = [
	"var(--chart-2)",
	"var(--chart-7)",
	"var(--chart-6)",
	"var(--chart-8)",
	"var(--chart-4)",
	"var(--chart-1)",
	"var(--chart-5)",
	"var(--chart-3)",
] as const;

/** A single-series chart carries no category, so it takes the one primary accent. */
export const SINGLE_SERIES_COLOR = "var(--chart-2)";

/**
 * Tones for series whose meaning is not arbitrary. `--chart-6/7/8` are the token set's
 * green/amber/red, which is exactly the good/attention/bad reading these need.
 */
const TONE_COLORS: Record<ReportTone, string> = {
	positive: "var(--chart-6)",
	warning: "var(--chart-7)",
	negative: "var(--chart-8)",
	neutral: "var(--chart-2)",
};

export const colorAt = (index: number): string =>
	CATEGORICAL_COLORS[index % CATEGORICAL_COLORS.length];

/** A declared tone wins; otherwise the series falls back to its position in the palette. */
export const seriesColor = (tone: ReportTone | undefined, index: number): string =>
	tone ? TONE_COLORS[tone] : colorAt(index);
