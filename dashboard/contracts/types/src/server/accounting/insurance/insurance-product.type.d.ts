import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
export declare const coverageRowSchema: z.ZodObject<{
    serviceId: z.ZodString;
    coveragePercent: z.ZodString;
}, z.core.$strip>;
export declare const insuranceProductSchema: z.ZodObject<{
    insurerId: z.ZodString;
    name: z.ZodString;
    coveragePercentDefault: z.ZodString;
    annualCap: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    perClaimCap: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    deductibleFixed: z.ZodDefault<z.ZodString>;
    deductiblePercent: z.ZodDefault<z.ZodString>;
    coverageRows: z.ZodDefault<z.ZodArray<z.ZodObject<{
        serviceId: z.ZodString;
        coveragePercent: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type InsuranceProductFormInput = z.infer<typeof insuranceProductSchema>;
export type CoverageRowFormInput = z.infer<typeof coverageRowSchema>;
export declare const insuranceProductSelect: {
    readonly id: true;
    readonly code: true;
    readonly name: true;
    readonly insurerId: true;
    readonly insurer: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly coveragePercentDefault: true;
    readonly annualCap: true;
    readonly perClaimCap: true;
    readonly deductibleFixed: true;
    readonly deductiblePercent: true;
    readonly active: true;
    readonly createdAt: true;
    readonly coverageRows: {
        readonly select: {
            readonly id: true;
            readonly idx: true;
            readonly serviceId: true;
            readonly coveragePercent: true;
            readonly service: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                    readonly level: true;
                };
            };
        };
        readonly orderBy: {
            readonly idx: "asc";
        };
    };
    readonly _count: {
        readonly select: {
            readonly policies: true;
        };
    };
};
export type InsuranceProductResponse = Prisma.InsuranceProductGetPayload<{
    select: typeof insuranceProductSelect;
}>;
