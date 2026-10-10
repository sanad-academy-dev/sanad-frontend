import type { ReportBuilder } from "@/server/reports/reports.type";
/**
 * Training uptake: what was assigned, what actually finished, and who is behind.
 *
 * Assignments are plotted twice — once on `assignedAt` and once on `completedAt` — so the
 * gap between "handed out" and "finished" is visible on the same axis instead of being
 * flattened into one number.
 */
export declare const buildTraining: ReportBuilder;
