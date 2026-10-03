import type { CarePlanStatus } from "@/generated/prisma/enums";
import { type CarePlanDetailResponse, type CarePlanListItemResponse, type CarePlanResponse, type CarePlanStatsResponse, type CreateCarePlanInput, type UpdateCarePlanInput } from "@/server/care-plans/care-plans.type";
type DaoResult<T> = T | "not-found";
export declare const carePlansDao: {
    list(clinicId: string): Promise<CarePlanListItemResponse[]>;
    getById(id: string, clinicId: string): Promise<DaoResult<CarePlanDetailResponse>>;
    getStats(clinicId: string): Promise<CarePlanStatsResponse>;
    create(clinicId: string, input: CreateCarePlanInput): Promise<DaoResult<CarePlanResponse>>;
    update(id: string, clinicId: string, input: UpdateCarePlanInput): Promise<DaoResult<CarePlanResponse>>;
    setStatus(id: string, clinicId: string, status: CarePlanStatus): Promise<DaoResult<CarePlanResponse>>;
    remove(id: string, clinicId: string): Promise<DaoResult<CarePlanResponse>>;
    duplicate(id: string, clinicId: string): Promise<DaoResult<CarePlanResponse>>;
};
export {};
