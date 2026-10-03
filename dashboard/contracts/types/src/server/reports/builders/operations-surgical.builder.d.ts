import type { ReportBuilder } from "@/server/reports/reports.type";
/**
 * The surgical board: case volume by tier and urgency, how many were cancelled, and the
 * complications recorded against them.
 *
 * Cases are placed on the timeline by `scheduledAt` where it exists and by `createdAt`
 * otherwise — an unscheduled case still belongs in the period it was raised in.
 */
export declare const buildSurgicalOperations: ReportBuilder;
