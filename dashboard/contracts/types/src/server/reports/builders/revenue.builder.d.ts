import type { ReportBuilder } from "@/server/reports/reports.type";
/**
 * Invoiced versus collected. Two different questions are answered on two different clocks:
 * what was *billed* is keyed on the invoice's creation, what was *collected* on `paidAt` —
 * mixing them is the classic way to make a collection gap disappear.
 */
export declare const buildRevenue: ReportBuilder;
