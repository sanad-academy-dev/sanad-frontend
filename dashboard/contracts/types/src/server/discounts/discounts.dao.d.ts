import type { DiscountStatus } from "@/generated/prisma/enums";
import { type CreateDiscountInput, type DiscountResponse, type DiscountStatsResponse, type UpdateDiscountInput } from "@/server/discounts/discounts.type";
type DaoResult<T> = T | "not-found" | "duplicate-coupon";
export declare const discountsDao: {
    list(clinicId: string): Promise<DiscountResponse[]>;
    getStats(clinicId: string): Promise<DiscountStatsResponse>;
    create(clinicId: string, input: CreateDiscountInput): Promise<DaoResult<DiscountResponse>>;
    update(id: string, clinicId: string, input: UpdateDiscountInput): Promise<DaoResult<DiscountResponse>>;
    setStatus(id: string, clinicId: string, status: DiscountStatus): Promise<DiscountResponse | "not-found">;
    remove(id: string, clinicId: string): Promise<DiscountResponse | "not-found">;
};
export {};
