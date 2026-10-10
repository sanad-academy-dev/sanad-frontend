import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
export declare const membershipBenefitRowSchema: z.ZodObject<{
    benefitType: z.ZodEnum<{
        readonly SERVICE_DISCOUNT: "SERVICE_DISCOUNT";
        readonly PRODUCT_DISCOUNT: "PRODUCT_DISCOUNT";
        readonly INCLUDED_UNITS: "INCLUDED_UNITS";
        readonly PRIORITY_BOOKING: "PRIORITY_BOOKING";
        readonly PERK: "PERK";
    }>;
    serviceId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    discountPercent: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    discountAmount: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    unitsPerPeriod: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    labelAr: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const createMembershipPlanSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tierRank: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    billingInterval: z.ZodEnum<{
        YEAR: "YEAR";
        MONTH: "MONTH";
    }>;
    intervalCount: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    fee: z.ZodString;
    enrollmentFee: z.ZodDefault<z.ZodString>;
    deferRevenue: z.ZodDefault<z.ZodBoolean>;
    maxPatients: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    autoRenew: z.ZodDefault<z.ZodBoolean>;
    graceDays: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    benefits: z.ZodDefault<z.ZodArray<z.ZodObject<{
        benefitType: z.ZodEnum<{
            readonly SERVICE_DISCOUNT: "SERVICE_DISCOUNT";
            readonly PRODUCT_DISCOUNT: "PRODUCT_DISCOUNT";
            readonly INCLUDED_UNITS: "INCLUDED_UNITS";
            readonly PRIORITY_BOOKING: "PRIORITY_BOOKING";
            readonly PERK: "PERK";
        }>;
        serviceId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        discountPercent: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        discountAmount: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        unitsPerPeriod: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
        labelAr: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type CreateMembershipPlanFormInput = z.infer<typeof createMembershipPlanSchema>;
export type MembershipBenefitRowInput = z.infer<typeof membershipBenefitRowSchema>;
export declare const membershipPlanBenefitSelect: {
    readonly id: true;
    readonly idx: true;
    readonly benefitType: true;
    readonly serviceId: true;
    readonly service: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly discountPercent: true;
    readonly discountAmount: true;
    readonly unitsPerPeriod: true;
    readonly labelAr: true;
};
export declare const membershipPlanSelect: {
    readonly id: true;
    readonly code: true;
    readonly name: true;
    readonly description: true;
    readonly tierRank: true;
    readonly billingInterval: true;
    readonly intervalCount: true;
    readonly fee: true;
    readonly enrollmentFee: true;
    readonly deferRevenue: true;
    readonly maxPatients: true;
    readonly autoRenew: true;
    readonly graceDays: true;
    readonly status: true;
    readonly createdAt: true;
    readonly benefits: {
        readonly select: {
            readonly id: true;
            readonly idx: true;
            readonly benefitType: true;
            readonly serviceId: true;
            readonly service: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly discountPercent: true;
            readonly discountAmount: true;
            readonly unitsPerPeriod: true;
            readonly labelAr: true;
        };
        readonly orderBy: {
            readonly idx: "asc";
        };
    };
    readonly _count: {
        readonly select: {
            readonly memberships: true;
        };
    };
};
export type MembershipPlanResponse = Prisma.MembershipPlanGetPayload<{
    select: typeof membershipPlanSelect;
}>;
