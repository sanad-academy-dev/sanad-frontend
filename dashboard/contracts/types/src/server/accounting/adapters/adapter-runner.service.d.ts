import type { AdapterAccountLegs, AdapterKey, AdapterRunResult, SourceModuleAdapter } from "@/server/accounting/adapters/adapter.type";
import type { AccountingActor } from "@/server/accounting/permissions/accounting-permissions.guard";
export declare const ADAPTERS: Record<AdapterKey, SourceModuleAdapter>;
export declare function adapterOf(key: string): SourceModuleAdapter;
export declare function assertAdapterEnabled(clinicId: string, adapter: SourceModuleAdapter): Promise<void>;
export declare function resolveAdapterLegs(clinicId: string): Promise<AdapterAccountLegs>;
/** run one adapter over a range: reversals first, then pending postings, chunked */
export declare function runAdapter(clinicId: string, key: string, range: {
    fromDate: Date;
    toDate: Date;
}, actor: AccountingActor): Promise<AdapterRunResult>;
