import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
export declare const patientPolicySchema: z.ZodObject<{
    patientId: z.ZodString;
    productId: z.ZodString;
    policyNumber: z.ZodString;
    policyStart: z.ZodCoercedDate<unknown>;
    policyEnd: z.ZodCoercedDate<unknown>;
    status: z.ZodDefault<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        CANCELLED: "CANCELLED";
        SUSPENDED: "SUSPENDED";
    }>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type PatientPolicyFormInput = z.infer<typeof patientPolicySchema>;
export declare const patientPolicySelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly patientId: true;
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly owner: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
    readonly productId: true;
    readonly product: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly coveragePercentDefault: true;
            readonly annualCap: true;
            readonly insurer: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
    readonly policyNumber: true;
    readonly policyStart: true;
    readonly policyEnd: true;
    readonly status: true;
    readonly capConsumed: true;
    readonly notes: true;
    readonly createdAt: true;
};
export type PatientPolicyResponse = Prisma.PatientPolicyGetPayload<{
    select: typeof patientPolicySelect;
}>;
