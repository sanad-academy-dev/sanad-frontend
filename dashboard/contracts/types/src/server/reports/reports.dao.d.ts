import type { ReportId } from "@/server/reports/reports.catalog";
import type { ReportPayload, ReportRange } from "@/server/reports/reports.type";
export declare const reportsDao: {
    run(reportId: ReportId, clinicId: string, range: ReportRange): Promise<ReportPayload>;
};
