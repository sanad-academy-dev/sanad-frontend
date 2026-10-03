import type { ReportBuilder } from "@/server/reports/reports.type";
/**
 * Attendance compliance and hours worked. `attendance.date` is a Postgres `date`, so every
 * comparison here stays in UTC (see `reports.range.ts`) to keep a day's rows in their own day.
 */
export declare const buildStaff: ReportBuilder;
