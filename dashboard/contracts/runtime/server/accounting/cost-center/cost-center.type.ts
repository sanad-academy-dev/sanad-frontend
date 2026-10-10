import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";

export const costCenterSelect = {
	id: true,
	clinicId: true,
	costCenterName: true,
	costCenterNumber: true,
	parentCostCenterId: true,
	isGroup: true,
	disabled: true,
	lft: true,
	rgt: true,
	createdAt: true,
	updatedAt: true,
} as const satisfies Prisma.CostCenterSelect;

export type CostCenterResponse = Prisma.CostCenterGetPayload<{
	select: typeof costCenterSelect;
}>;

export const createCostCenterSchema = z.object({
	costCenterName: z.string({ error: "اسم مركز التكلفة مطلوب" }).trim().min(1, "الاسم مطلوب"),
	costCenterNumber: z.string().trim().min(1).nullish(),
	parentCostCenterId: z.string().trim().min(1).nullish(),
	isGroup: z.boolean().optional().default(false),
	disabled: z.boolean().optional().default(false),
});
export type CreateCostCenterFormInput = z.input<typeof createCostCenterSchema>;
export type CreateCostCenterFormValues = z.output<typeof createCostCenterSchema>;

export const updateCostCenterSchema = z.object({
	costCenterName: z.string().trim().min(1).optional(),
	costCenterNumber: z.string().trim().min(1).nullish(),
	isGroup: z.boolean().optional(),
	disabled: z.boolean().optional(),
});
export type UpdateCostCenterFormInput = z.infer<typeof updateCostCenterSchema>;

type CostCenterCreateFields = Prisma.CostCenterUncheckedCreateInput;
export type CreateCostCenterInput = Pick<
	CostCenterCreateFields,
	"clinicId" | "costCenterName"
> &
	Partial<
		Pick<
			CostCenterCreateFields,
			"costCenterNumber" | "parentCostCenterId" | "isGroup" | "disabled" | "createdById"
		>
	>;
export type UpdateCostCenterInput = Partial<
	Pick<CostCenterCreateFields, "costCenterName" | "costCenterNumber" | "isGroup" | "disabled">
>;
