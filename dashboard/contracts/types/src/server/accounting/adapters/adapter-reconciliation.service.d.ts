import type { AdapterReconciliationReport } from "@/server/accounting/adapters/adapter.type";
export declare function adapterReconciliationReport(params: {
    clinicId: string;
    adapterKey: string;
    fromDate: Date;
    toDate: Date;
}): Promise<AdapterReconciliationReport>;
