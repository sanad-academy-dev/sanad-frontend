import { type CreateEosInput, type EosSettlementResponse } from "@/server/end-of-service/end-of-service.type";
type DaoResult<T> = T | "not-found";
export declare class SettlementLockedError extends Error {
    constructor();
}
export declare const eosDao: {
    list(clinicId: string): Promise<EosSettlementResponse[]>;
    getById(id: string, clinicId: string): Promise<EosSettlementResponse | null>;
    create(clinicId: string, createdById: string | null, input: CreateEosInput): Promise<DaoResult<EosSettlementResponse>>;
    approve(id: string, clinicId: string): Promise<DaoResult<EosSettlementResponse>>;
    markPaid(id: string, clinicId: string): Promise<DaoResult<EosSettlementResponse>>;
    cancel(id: string, clinicId: string): Promise<DaoResult<EosSettlementResponse>>;
};
export {};
