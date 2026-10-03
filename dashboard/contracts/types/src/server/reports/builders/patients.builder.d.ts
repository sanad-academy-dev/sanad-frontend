import type { ReportBuilder } from "@/server/reports/reports.type";
/**
 * Growth and shape of the patient base. Registrations are counted on `createdAt` (when the
 * record entered the system), while the mix widgets describe the *whole* active base — a
 * species split of one month's sign-ups says very little about who the clinic actually treats.
 */
export declare const buildPatients: ReportBuilder;
