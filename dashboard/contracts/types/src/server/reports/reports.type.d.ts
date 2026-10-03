/**
 * Payload shapes returned by the reports module.
 *
 * A report is a *dev-authored* definition (see `reports.catalog.ts`) plus a builder that
 * turns the clinic's operational tables into these payloads. The screen renders whatever
 * shape it receives — it never knows which report it is drawing — so adding a report means
 * adding a catalog entry + a builder, never touching the UI.
 */
/** Every user-facing string in a payload ships both languages (design contract §5). */
export type ReportLabel = {
    ar: string;
    en: string;
};
/** How the client renders a raw number. */
export type ReportValueFormat = "number" | "money" | "percent" | "hours" | "days";
/**
 * What a series *means*, when it means something.
 *
 * Most breakdowns are merely different (payment methods, species) and take positional
 * colours. But «مكتملة» vs «ملغاة» is not an arbitrary split — a reader expects completed to
 * be green and cancelled red, and a positional palette that paints cancelled green is
 * actively misleading. A builder declares a tone only where the reading is unambiguous.
 */
export type ReportTone = "positive" | "warning" | "negative" | "neutral";
/** One plotted series inside a `series` widget. */
export type ReportSeriesDef = {
    key: string;
    label: ReportLabel;
    tone?: ReportTone;
};
/**
 * One point on the x-axis. Values are kept in a nested record rather than spread onto the
 * point so the shape stays typed; the chart renderer flattens it for recharts.
 */
export type ReportSeriesPoint = {
    label: string;
    values: Record<string, number>;
};
/** Trend over time — area / bar / stacked bar / line, decided by the builder. */
export type ReportSeriesWidget = {
    kind: "series";
    chart: "area" | "bar" | "stackedBar" | "line";
    series: ReportSeriesDef[];
    points: ReportSeriesPoint[];
    format: ReportValueFormat;
};
/** Composition of a whole — rendered as a donut with a legend. */
export type ReportPieWidget = {
    kind: "pie";
    slices: {
        key: string;
        label: ReportLabel;
        value: number;
    }[];
    total: number;
    format: ReportValueFormat;
};
/**
 * A label that is either clinic *data* (a staff name, an item name — one language by nature)
 * or a translatable term the builder derived from an enum.
 */
export type ReportText = string | ReportLabel;
/** A ranked list drawn as horizontal bars (top N staff, categories, branches…). */
export type ReportBarsWidget = {
    kind: "bars";
    bars: {
        key: string;
        label: ReportText;
        value: number;
    }[];
    max: number;
    format: ReportValueFormat;
};
/** Tabular detail — the rows a chart summarises. */
export type ReportTableWidget = {
    kind: "table";
    columns: {
        key: string;
        label: ReportLabel;
        align?: "start" | "end";
        format?: ReportValueFormat;
    }[];
    rows: Record<string, ReportText | number | null>[];
};
/** A single headline number with an optional supporting breakdown. */
export type ReportBigStatWidget = {
    kind: "bigStat";
    value: number;
    format: ReportValueFormat;
    caption: ReportLabel;
    breakdown?: {
        key: string;
        label: ReportLabel;
        value: number;
        format: ReportValueFormat;
    }[];
};
export type ReportWidgetPayload = ReportSeriesWidget | ReportPieWidget | ReportBarsWidget | ReportTableWidget | ReportBigStatWidget;
/** One of the four cards in the stats strip above every report. */
export type ReportKpi = {
    key: string;
    label: ReportLabel;
    tooltip: ReportLabel;
    value: number;
    format: ReportValueFormat;
};
/** What a builder produces; the controller wraps it with range + timestamp. */
export type ReportResult = {
    kpis: ReportKpi[];
    widgets: Record<string, ReportWidgetPayload>;
};
export type ReportPayload = ReportResult & {
    reportId: string;
    /** ISO days, echoed back so the screen can label an exported file. */
    range: {
        from: string;
        to: string;
    };
    generatedAt: string;
};
/**
 * Resolved date window a builder aggregates over — `to` is exclusive.
 *
 * `tzOffsetMinutes` is the viewer's `Date#getTimezoneOffset()`. Buckets themselves are cut
 * in UTC (see `reports.range.ts`), but anything read off the *clock* rather than the
 * calendar — peak hour of day, above all — has to be shifted into the viewer's zone or a
 * Riyadh clinic reads its 9am rush as 6am.
 */
export type ReportRange = {
    from: Date;
    to: Date;
    tzOffsetMinutes: number;
};
/** One x-axis slot: `[start, end)` in server-local time. */
export type ReportBucket = {
    key: string;
    label: string;
    start: Date;
    end: Date;
};
export type ReportBuckets = {
    granularity: "day" | "week" | "month";
    buckets: ReportBucket[];
};
/** Signature every report builder implements. */
export type ReportBuilder = (clinicId: string, range: ReportRange) => Promise<ReportResult>;
