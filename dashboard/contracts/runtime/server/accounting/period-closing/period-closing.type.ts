import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { DocStatus } from "@/generated/prisma/enums";

export { DocStatus };

/** [P10.2] Period Closing Voucher types (BRD FR-12.3, §5.3). */

export const periodClosingVoucherSelect = {
	id: true,
	clinicId: true,
	documentNo: true,
	docstatus: true,
	postingDate: true,
	amendedFromId: true,
	fiscalYear: true,
	periodStartDate: true,
	periodEndDate: true,
	closingAccountHeadId: true,
	remarks: true,
	granularByDimensions: true,
	gleProcessingStatus: true,
	errorMessage: true,
	createdById: true,
	submittedAt: true,
	submittedById: true,
	cancelledAt: true,
	cancelledById: true,
	createdAt: true,
	updatedAt: true,
	closingAccountHead: { select: { accountName: true, accountNumber: true, rootType: true } },
} as const satisfies Prisma.PeriodClosingVoucherSelect;

export type PeriodClosingVoucherResponse = Prisma.PeriodClosingVoucherGetPayload<{
	select: typeof periodClosingVoucherSelect;
}>;

const dateString = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, "التاريخ يجب أن يكون بصيغة YYYY-MM-DD");

export const createPeriodClosingVoucherSchema = z
	.object({
		periodStartDate: dateString,
		periodEndDate: dateString,
		closingAccountHeadId: z.string({ error: "حساب الإقفال مطلوب" }).trim().min(1),
		remarks: z.string().trim().min(1).nullish(),
		granularByDimensions: z.boolean().optional().default(true),
	})
	.refine((value) => value.periodStartDate <= value.periodEndDate, {
		error: "بداية الفترة يجب ألا تتجاوز نهايتها",
		path: ["periodEndDate"],
	});

export type CreatePeriodClosingVoucherFormInput = z.infer<
	typeof createPeriodClosingVoucherSchema
>;

export type CreatePeriodClosingVoucherInput = Pick<
	Prisma.PeriodClosingVoucherUncheckedCreateInput,
	"clinicId" | "closingAccountHeadId" | "remarks" | "createdById"
> & {
	periodStartDate: Date;
	periodEndDate: Date;
	granularByDimensions?: boolean;
};
