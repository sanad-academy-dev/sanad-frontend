import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
export declare const costCenterSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly costCenterName: true;
    readonly costCenterNumber: true;
    readonly parentCostCenterId: true;
    readonly isGroup: true;
    readonly disabled: true;
    readonly lft: true;
    readonly rgt: true;
    readonly createdAt: true;
    readonly updatedAt: true;
};
export type CostCenterResponse = Prisma.CostCenterGetPayload<{
    select: typeof costCenterSelect;
}>;
export declare const createCostCenterSchema: z.ZodObject<{
    costCenterName: z.ZodString;
    costCenterNumber: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    parentCostCenterId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isGroup: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    disabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type CreateCostCenterFormInput = z.input<typeof createCostCenterSchema>;
export type CreateCostCenterFormValues = z.output<typeof createCostCenterSchema>;
export declare const updateCostCenterSchema: z.ZodObject<{
    costCenterName: z.ZodOptional<z.ZodString>;
    costCenterNumber: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isGroup: z.ZodOptional<z.ZodBoolean>;
    disabled: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type UpdateCostCenterFormInput = z.infer<typeof updateCostCenterSchema>;
type CostCenterCreateFields = Prisma.CostCenterUncheckedCreateInput;
export type CreateCostCenterInput = Pick<CostCenterCreateFields, "clinicId" | "costCenterName"> & Partial<Pick<CostCenterCreateFields, "costCenterNumber" | "parentCostCenterId" | "isGroup" | "disabled" | "createdById">>;
export type UpdateCostCenterInput = Partial<Pick<CostCenterCreateFields, "costCenterName" | "costCenterNumber" | "isGroup" | "disabled">>;
export {};
