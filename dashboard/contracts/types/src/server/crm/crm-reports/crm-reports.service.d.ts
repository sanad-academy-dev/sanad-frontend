import type { CrmReportFilterInput, CrmReportsResponse } from "@/server/crm/crm-reports/crm-reports.type";
export declare function buildCrmReports(clinicId: string, filters: CrmReportFilterInput): Promise<CrmReportsResponse>;
