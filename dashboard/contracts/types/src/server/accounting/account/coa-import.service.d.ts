import { type ImportPlan } from "@/server/accounting/account/coa-import";
export declare function previewCoaImport(clinicId: string, csv: string): Promise<ImportPlan>;
export declare function commitCoaImport(clinicId: string, csv: string): Promise<{
    created: number;
}>;
/** Apply the built-in Standard seed chart (idempotent — no-op if the chart isn't empty). */
export declare function applyStandardChart(clinicId: string): Promise<{
    created: number;
}>;
