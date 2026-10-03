import type { ReportBuilder } from "@/server/reports/reports.type";
/**
 * Where the money went. Expenses are placed on the timeline by `expenseDate` (the accounting
 * date) when the requester set one, falling back to `createdAt` — the same precedence the
 * expenses module itself uses for its periods.
 */
export declare const buildExpenses: ReportBuilder;
