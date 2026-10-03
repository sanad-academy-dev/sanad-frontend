import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { DocStatus } from "@/generated/prisma/enums";

export { DocStatus };

/**
 * [P1.6] Types for Cost Center Allocation (BRD §4.4). A submittable voucher: it rides the
 * generic P0.2 lifecycle, so its response carries the standard docstatus/documentNo/audit
 * columns plus its own `mainCostCenter`, `validFrom` and child percentage rows.
 */

export const costCenterAllocationSelect = {
	id: true,
	clinicId: true,
	documentNo: true,
	docstatus: true,
	amendedFromId: true,
	mainCostCenterId: true,
	validFrom: true,
	createdById: true,
	submittedAt: true,
	submittedById: true,
	cancelledAt: true,
	cancelledById: true,
	createdAt: true,
	updatedAt: true,
	mainCostCenter: {
		select: { id: true, costCenterName: true, costCenterNumber: true },
	},
	percentages: {
		select: {
			id: true,
			costCenterId: true,
			percentage: true,
			costCenter: { select: { costCenterName: true, costCenterNumber: true } },
		},
	},
} as const satisfies Prisma.CostCenterAllocationSelect;

export type CostCenterAllocationResponse = Prisma.CostCenterAllocationGetPayload<{
	select: typeof costCenterAllocationSelect;
}>;

/**
 * The shape the generic lifecycle sees. A Cost Center Allocation has no posting date of its
 * own — its effective date is `validFrom` — but {@link BaseVoucher} keys numbering off
 * `postingDate`, so the service exposes `validFrom` under that name (see the service's
 * `toVoucher`). No extra DB column is stored.
 */
export type CostCenterAllocationVoucher = CostCenterAllocationResponse & { postingDate: Date };

/** Percentages travel as strings so decimal precision survives JSON (contract C2). */
const percentageString = z
	.string({ error: "النسبة مطلوبة" })
	.regex(/^\d+(\.\d{1,9})?$/, "النسبة يجب أن تكون رقمًا موجبًا بحد أقصى 9 منازل عشرية");

const allocationRowSchema = z.object({
	costCenterId: z.string({ error: "مركز التكلفة مطلوب" }).trim().min(1, "مركز التكلفة مطلوب"),
	percentage: percentageString,
});

export const createCostCenterAllocationSchema = z.object({
	mainCostCenterId: z
		.string({ error: "مركز التكلفة الرئيسي مطلوب" })
		.trim()
		.min(1, "مركز التكلفة الرئيسي مطلوب"),
	validFrom: z
		.string({ error: "تاريخ السريان مطلوب" })
		.regex(/^\d{4}-\d{2}-\d{2}$/, "تاريخ السريان مطلوب"),
	rows: z.array(allocationRowSchema).min(1, "أضف صفًا واحدًا على الأقل"),
});
export type CreateCostCenterAllocationFormInput = z.infer<
	typeof createCostCenterAllocationSchema
>;

export const updateCostCenterAllocationSchema = createCostCenterAllocationSchema;
export type UpdateCostCenterAllocationFormInput = z.infer<
	typeof updateCostCenterAllocationSchema
>;

/** A single {cost center, percentage} row as it enters the service (percentage as string). */
export type AllocationRowInput = { costCenterId: string; percentage: string };

export type CreateCostCenterAllocationInput = Pick<
	Prisma.CostCenterAllocationUncheckedCreateInput,
	"clinicId" | "mainCostCenterId"
> & {
	validFrom: Date;
	rows: AllocationRowInput[];
} & Partial<Pick<Prisma.CostCenterAllocationUncheckedCreateInput, "createdById">>;

export type UpdateCostCenterAllocationInput = {
	mainCostCenterId: string;
	validFrom: Date;
	rows: AllocationRowInput[];
};
