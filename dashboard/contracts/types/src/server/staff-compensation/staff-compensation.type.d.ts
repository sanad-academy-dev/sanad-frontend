import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { AllowanceType, PayrollPaymentMethod } from "@/generated/prisma/enums";
export { AllowanceType, PayrollPaymentMethod };
export declare const staffAllowanceSelect: {
    id: true;
    type: true;
    amount: true;
    note: true;
};
export type StaffAllowanceResponse = Prisma.StaffAllowanceGetPayload<{
    select: typeof staffAllowanceSelect;
}>;
export declare const staffCompensationSelect: {
    id: true;
    staffId: true;
    baseSalary: true;
    iban: true;
    bankName: true;
    defaultPaymentMethod: true;
    effectiveFrom: true;
    notes: true;
    updatedAt: true;
    allowances: {
        select: {
            id: true;
            type: true;
            amount: true;
            note: true;
        };
        orderBy: {
            createdAt: "asc";
        };
    };
};
export type StaffCompensationResponse = Prisma.StaffCompensationGetPayload<{
    select: typeof staffCompensationSelect;
}>;
export declare const staffAllowanceFormSchema: z.ZodObject<{
    type: z.ZodEnum<{
        readonly HOUSING: "HOUSING";
        readonly TRANSPORT: "TRANSPORT";
        readonly FOOD: "FOOD";
        readonly PHONE: "PHONE";
        readonly OTHER: "OTHER";
    }>;
    amount: z.ZodCoercedNumber<unknown>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const staffCompensationFormSchema: z.ZodObject<{
    baseSalary: z.ZodCoercedNumber<unknown>;
    iban: z.ZodOptional<z.ZodString>;
    bankName: z.ZodOptional<z.ZodString>;
    defaultPaymentMethod: z.ZodEnum<{
        readonly TRANSFER: "TRANSFER";
        readonly CASH: "CASH";
        readonly CHECK: "CHECK";
    }>;
    effectiveFrom: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    allowances: z.ZodDefault<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<{
            readonly HOUSING: "HOUSING";
            readonly TRANSPORT: "TRANSPORT";
            readonly FOOD: "FOOD";
            readonly PHONE: "PHONE";
            readonly OTHER: "OTHER";
        }>;
        amount: z.ZodCoercedNumber<unknown>;
        note: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type StaffCompensationFormInput = z.input<typeof staffCompensationFormSchema>;
export type StaffCompensationFormValues = z.output<typeof staffCompensationFormSchema>;
export type StaffAllowanceFormInput = z.input<typeof staffAllowanceFormSchema>;
export type UpsertStaffAllowanceInput = Pick<Prisma.StaffAllowanceUncheckedCreateInput, "type" | "amount"> & Partial<Pick<Prisma.StaffAllowanceUncheckedCreateInput, "note">>;
export type UpsertStaffCompensationInput = Pick<Prisma.StaffCompensationUncheckedCreateInput, "baseSalary"> & Partial<Pick<Prisma.StaffCompensationUncheckedCreateInput, "iban" | "bankName" | "defaultPaymentMethod" | "effectiveFrom" | "notes">> & {
    allowances?: UpsertStaffAllowanceInput[];
};
export declare const PAYROLL_PAYMENT_METHOD_LABEL: Record<PayrollPaymentMethod, string>;
export declare const ALLOWANCE_TYPE_LABEL: Record<AllowanceType, string>;
