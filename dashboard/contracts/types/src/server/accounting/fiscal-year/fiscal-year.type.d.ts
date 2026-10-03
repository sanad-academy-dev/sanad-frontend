import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
export declare const fiscalYearSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly year: true;
    readonly yearStartDate: true;
    readonly yearEndDate: true;
    readonly isShortYear: true;
    readonly disabled: true;
    readonly autoCreated: true;
    readonly createdAt: true;
    readonly updatedAt: true;
};
export type FiscalYearResponse = Prisma.FiscalYearGetPayload<{
    select: typeof fiscalYearSelect;
}>;
export declare const createFiscalYearSchema: z.ZodObject<{
    year: z.ZodString;
    yearStartDate: z.ZodString;
    yearEndDate: z.ZodString;
    isShortYear: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    disabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type CreateFiscalYearFormInput = z.input<typeof createFiscalYearSchema>;
export type CreateFiscalYearFormValues = z.output<typeof createFiscalYearSchema>;
export declare const updateFiscalYearSchema: z.ZodObject<{
    year: z.ZodOptional<z.ZodString>;
    yearStartDate: z.ZodOptional<z.ZodString>;
    yearEndDate: z.ZodOptional<z.ZodString>;
    isShortYear: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    disabled: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
}, z.core.$strip>;
export type UpdateFiscalYearFormInput = z.infer<typeof updateFiscalYearSchema>;
export type CreateFiscalYearInput = Pick<Prisma.FiscalYearUncheckedCreateInput, "clinicId" | "year" | "yearStartDate" | "yearEndDate"> & Partial<Pick<Prisma.FiscalYearUncheckedCreateInput, "isShortYear" | "disabled" | "autoCreated" | "createdById">>;
