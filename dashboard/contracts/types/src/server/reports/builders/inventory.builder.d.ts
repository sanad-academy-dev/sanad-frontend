import type { ReportBuilder } from "@/server/reports/reports.type";
/**
 * Stock health: what the shelf is worth, what moved, what is about to run out and what is
 * about to expire. Value uses the moving-average `valuationRate` the stock ledger maintains,
 * which is the same number the inventory valuation screen shows — not the sale price.
 */
export declare const buildInventory: ReportBuilder;
