import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import type { ReportBarsWidget, ReportKpi, ReportLabel, ReportPieWidget, ReportSeriesPoint, ReportText, ReportValueFormat } from "@/server/reports/reports.type";
/** Shared shaping helpers so every builder emits payloads the renderer treats identically. */
/** Prisma `Decimal | null` → plain number. Report figures are display aggregates, not ledger
 * postings, so a float here is safe — the accounting ledger keeps its own decimal maths. */
export declare const num: (value: Decimal | number | string | null | undefined) => number;
/** Money and hours are shown to two decimals; counts stay integers. */
export declare const round2: (value: number) => number;
export declare const pct: (part: number, whole: number) => number;
/** Adds `amount` to `key` in a counter map. */
export declare function bump<K>(map: Map<K, number>, key: K, amount?: number): void;
/**
 * Builds a donut payload from a counter map. Zero-valued slices are dropped — an enum member
 * that never occurred is noise in a legend, not information.
 */
export declare function pieOf<K extends string>(counts: Map<K, number>, labels: Record<K, ReportLabel>, format?: ReportValueFormat): ReportPieWidget;
/** Same as `pieOf` but for keys whose labels are data (branch names, course titles). */
export declare function pieOfEntries(entries: {
    key: string;
    label: ReportLabel;
    value: number;
}[], format?: ReportValueFormat): ReportPieWidget;
/** Default length of a ranked bar list — enough to be useful, short enough to stay readable. */
export declare const TOP_N = 8;
/** Ranked horizontal bars, highest first, capped at `limit`. */
export declare function barsOf(entries: {
    key: string;
    label: ReportText;
    value: number;
}[], format?: ReportValueFormat, limit?: number): ReportBarsWidget;
export declare const kpi: (key: string, label: ReportLabel, tooltip: ReportLabel, value: number, format?: ReportValueFormat) => ReportKpi;
/** Rounds every accumulated series value once, at the end of a builder. */
export declare const roundPoints: (points: ReportSeriesPoint[]) => ReportSeriesPoint[];
/** Hours between two instants, or null when either end is missing. */
export declare const hoursBetween: (from: Date | null, to: Date | null) => number | null;
export declare const average: (values: number[]) => number;
