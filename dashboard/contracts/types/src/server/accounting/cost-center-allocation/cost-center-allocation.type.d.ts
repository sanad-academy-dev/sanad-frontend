import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { DocStatus } from "@/generated/prisma/enums";
export { DocStatus };
/**
 * [P1.6] Types for Cost Center Allocation (BRD §4.4). A submittable voucher: it rides the
 * generic P0.2 lifecycle, so its response carries the standard docstatus/documentNo/audit
 * columns plus its own `mainCostCenter`, `validFrom` and child percentage rows.
 */
export declare const costCenterAllocationSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly documentNo: true;
    readonly docstatus: true;
    readonly amendedFromId: true;
    readonly mainCostCenterId: true;
    readonly validFrom: true;
    readonly createdById: true;
    readonly submittedAt: true;
    readonly submittedById: true;
    readonly cancelledAt: true;
    readonly cancelledById: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly mainCostCenter: {
        readonly select: {
            readonly id: true;
            readonly costCenterName: true;
            readonly costCenterNumber: true;
        };
    };
    readonly percentages: {
        readonly select: {
            readonly id: true;
            readonly costCenterId: true;
            readonly percentage: true;
            readonly costCenter: {
                readonly select: {
                    readonly costCenterName: true;
                    readonly costCenterNumber: true;
                };
            };
        };
    };
};
export type CostCenterAllocationResponse = Prisma.CostCenterAllocationGetPayload<{
    select: typeof costCenterAllocationSelect;
}>;
/**
 * The shape the generic lifecycle sees. A Cost Center Allocation has no posting date of its
 * own — its effective date is `validFrom` — but {@link BaseVoucher} keys numbering off
 * `postingDate`, so the service exposes `validFrom` under that name (see the service's
 * `toVoucher`). No extra DB column is stored.
 */
export type CostCenterAllocationVoucher = CostCenterAllocationResponse & {
    postingDate: Date;
};
export declare const createCostCenterAllocationSchema: z.ZodObject<{
    mainCostCenterId: z.ZodString;
    validFrom: z.ZodString;
    rows: z.ZodArray<z.ZodObject<{
        costCenterId: z.ZodString;
        percentage: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateCostCenterAllocationFormInput = z.infer<typeof createCostCenterAllocationSchema>;
export declare const updateCostCenterAllocationSchema: z.ZodObject<{
    mainCostCenterId: z.ZodString;
    validFrom: z.ZodString;
    rows: z.ZodArray<z.ZodObject<{
        costCenterId: z.ZodString;
        percentage: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type UpdateCostCenterAllocationFormInput = z.infer<typeof updateCostCenterAllocationSchema>;
/** A single {cost center, percentage} row as it enters the service (percentage as string). */
export type AllocationRowInput = {
    costCenterId: string;
    percentage: string;
};
export type CreateCostCenterAllocationInput = Pick<Prisma.CostCenterAllocationUncheckedCreateInput, "clinicId" | "mainCostCenterId"> & {
    validFrom: Date;
    rows: AllocationRowInput[];
} & Partial<Pick<Prisma.CostCenterAllocationUncheckedCreateInput, "createdById">>;
export type UpdateCostCenterAllocationInput = {
    mainCostCenterId: string;
    validFrom: Date;
    rows: AllocationRowInput[];
};
