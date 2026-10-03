import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
/**
 * [MI-P3] Insurer resource types (MI §8.1, FR-I8.1). The table itself landed in MI-P0;
 * these are the shapes for its endpoints. Correction #8 binds: NO account field anywhere
 * here — a per-insurer AR override is a `party_account` row managed by the party screen
 * («حسابات الأطراف»), and the fall-back is the side default. Zero new account machinery.
 */
export declare const insurerSchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    email: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    contactPerson: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    address: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    settlementDays: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type InsurerFormInput = z.infer<typeof insurerSchema>;
export declare const insurerSelect: {
    readonly id: true;
    readonly code: true;
    readonly name: true;
    readonly phone: true;
    readonly email: true;
    readonly contactPerson: true;
    readonly address: true;
    readonly settlementDays: true;
    readonly notes: true;
    readonly active: true;
    readonly createdAt: true;
    readonly _count: {
        readonly select: {
            readonly products: true;
        };
    };
};
export type InsurerResponse = Prisma.InsurerGetPayload<{
    select: typeof insurerSelect;
}>;
