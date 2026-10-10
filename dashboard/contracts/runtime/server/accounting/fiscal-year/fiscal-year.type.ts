import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";

export const fiscalYearSelect = {
	id: true,
	clinicId: true,
	year: true,
	yearStartDate: true,
	yearEndDate: true,
	isShortYear: true,
	disabled: true,
	autoCreated: true,
	createdAt: true,
	updatedAt: true,
} as const satisfies Prisma.FiscalYearSelect;

export type FiscalYearResponse = Prisma.FiscalYearGetPayload<{
	select: typeof fiscalYearSelect;
}>;

const dateString = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, "التاريخ يجب أن يكون بصيغة YYYY-MM-DD");

export const createFiscalYearSchema = z.object({
	year: z.string({ error: "اسم السنة مطلوب" }).trim().min(1, "اسم السنة مطلوب"),
	yearStartDate: dateString,
	yearEndDate: dateString,
	isShortYear: z.boolean().optional().default(false),
	disabled: z.boolean().optional().default(false),
});
export type CreateFiscalYearFormInput = z.input<typeof createFiscalYearSchema>;
export type CreateFiscalYearFormValues = z.output<typeof createFiscalYearSchema>;

export const updateFiscalYearSchema = createFiscalYearSchema.partial();
export type UpdateFiscalYearFormInput = z.infer<typeof updateFiscalYearSchema>;

export type CreateFiscalYearInput = Pick<
	Prisma.FiscalYearUncheckedCreateInput,
	"clinicId" | "year" | "yearStartDate" | "yearEndDate"
> &
	Partial<
		Pick<
			Prisma.FiscalYearUncheckedCreateInput,
			"isShortYear" | "disabled" | "autoCreated" | "createdById"
		>
	>;
