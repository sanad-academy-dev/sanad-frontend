import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { ModeOfPaymentType } from "@/generated/prisma/enums";
export { ModeOfPaymentType };
/**
 * [P1.7] Types for Mode of Payment (BRD §4.8). Clinic-scoped master; the per-company default
 * account collapses to one nullable `defaultAccountId` (company = clinicId, contract C5).
 */
export declare const modeOfPaymentSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly modeOfPaymentName: true;
    readonly type: true;
    readonly enabled: true;
    readonly defaultAccountId: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly defaultAccount: {
        readonly select: {
            readonly id: true;
            readonly accountName: true;
            readonly accountNumber: true;
        };
    };
};
export type ModeOfPaymentResponse = Prisma.ModeOfPaymentGetPayload<{
    select: typeof modeOfPaymentSelect;
}>;
export declare const createModeOfPaymentSchema: z.ZodObject<{
    modeOfPaymentName: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<{
        readonly CASH: "CASH";
        readonly BANK: "BANK";
        readonly GENERAL: "GENERAL";
        readonly PHONE: "PHONE";
    }>>;
    enabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    defaultAccountId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type CreateModeOfPaymentFormInput = z.input<typeof createModeOfPaymentSchema>;
export type CreateModeOfPaymentFormValues = z.output<typeof createModeOfPaymentSchema>;
export declare const updateModeOfPaymentSchema: z.ZodObject<{
    modeOfPaymentName: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        readonly CASH: "CASH";
        readonly BANK: "BANK";
        readonly GENERAL: "GENERAL";
        readonly PHONE: "PHONE";
    }>>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    defaultAccountId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type UpdateModeOfPaymentFormInput = z.infer<typeof updateModeOfPaymentSchema>;
type ModeOfPaymentCreateFields = Prisma.ModeOfPaymentUncheckedCreateInput;
export type CreateModeOfPaymentInput = Pick<ModeOfPaymentCreateFields, "clinicId" | "modeOfPaymentName"> & Partial<Pick<ModeOfPaymentCreateFields, "type" | "enabled" | "defaultAccountId" | "createdById">>;
export type UpdateModeOfPaymentInput = Partial<Pick<ModeOfPaymentCreateFields, "modeOfPaymentName" | "type" | "enabled" | "defaultAccountId">>;
