import type { ReportBuilder } from "@/server/reports/reports.type";
/**
 * Lab and radiology throughput side by side — both modules share the order → item → status
 * shape, so one report covers them and turnaround is comparable across the two.
 *
 * Turnaround is measured per *item*, from when the order was raised to `completedAt`; an
 * item still open contributes nothing rather than a misleading "so far" figure.
 */
export declare const buildDiagnostics: ReportBuilder;
