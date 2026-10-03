import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { type DiscountStatus, DiscountType } from "@/generated/prisma/enums";
export type { DiscountStatus, DiscountType };
declare const discountSelect: {
    id: true;
    code: true;
    clinicId: true;
    couponCode: true;
    name: true;
    type: true;
    value: true;
    validFrom: true;
    validTo: true;
    usageLimit: true;
    perCustomerLimit: true;
    customerType: true;
    usedCount: true;
    status: true;
    notes: true;
    editsCount: true;
    createdAt: true;
    updatedAt: true;
    services: {
        select: {
            id: true;
            name: true;
        };
    };
};
export declare const discountSelectShape: {
    id: true;
    code: true;
    clinicId: true;
    couponCode: true;
    name: true;
    type: true;
    value: true;
    validFrom: true;
    validTo: true;
    usageLimit: true;
    perCustomerLimit: true;
    customerType: true;
    usedCount: true;
    status: true;
    notes: true;
    editsCount: true;
    createdAt: true;
    updatedAt: true;
    services: {
        select: {
            id: true;
            name: true;
        };
    };
};
export type DiscountResponse = Prisma.DiscountGetPayload<{
    select: typeof discountSelect;
}>;
export type DiscountStatsResponse = {
    total: number;
    usages: number;
    active: number;
    savings: number;
    expired: number;
};
export type CreateDiscountInput = Pick<Prisma.DiscountUncheckedCreateInput, "couponCode" | "name" | "type" | "value" | "usageLimit" | "perCustomerLimit" | "customerType" | "notes"> & {
    validFrom?: Date | null;
    validTo?: Date | null;
    serviceIds?: string[];
};
export type UpdateDiscountInput = Partial<CreateDiscountInput>;
export declare const discountFormSchema: z.ZodObject<{
    name: z.ZodString;
    couponCode: z.ZodString;
    type: z.ZodEnum<{
        readonly PERCENTAGE: "PERCENTAGE";
        readonly FIXED: "FIXED";
    }>;
    value: z.ZodCoercedNumber<unknown>;
    validFrom: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    validTo: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    usageLimit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    perCustomerLimit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    customerType: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        readonly ALL: "ALL";
        readonly VIP: "VIP";
        readonly LOYALTY: "LOYALTY";
        readonly NEW: "NEW";
        readonly CURRENT: "CURRENT";
    }>>>;
    serviceIds: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type DiscountFormInput = z.input<typeof discountFormSchema>;
export type DiscountFormValues = z.output<typeof discountFormSchema>;
