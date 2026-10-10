import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { DocStatus } from "@/generated/prisma/enums";

export { DocStatus };

/** [P10.1] Accounting Period types (BRD FR-12.2). */

export const accountingPeriodSelect = {
	id: true,
	clinicId: true,
	periodName: true,
	startDate: true,
	endDate: true,
	docstatus: true,
	amendedFromId: true,
	createdById: true,
	submittedAt: true,
	submittedById: true,
	cancelledAt: true,
	cancelledById: true,
	createdAt: true,
	updatedAt: true,
	closedDocuments: {
		orderBy: { documentType: "asc" },
		select: { id: true, documentType: true, closed: true },
	},
} as const satisfies Prisma.AccountingPeriodSelect;

export type AccountingPeriodResponse = Prisma.AccountingPeriodGetPayload<{
	select: typeof accountingPeriodSelect;
}>;

const dateString = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, "التاريخ يجب أن يكون بصيغة YYYY-MM-DD");

export const createAccountingPeriodSchema = z
	.object({
		periodName: z.string({ error: "اسم الفترة مطلوب" }).trim().min(1, "اسم الفترة مطلوب"),
		startDate: dateString,
		endDate: dateString,
		closedDocumentTypes: z
			.array(z.string().trim().min(1))
			.min(1, "اختر نوع مستند واحدًا على الأقل لإقفاله"),
	})
	.refine((value) => value.startDate <= value.endDate, {
		error: "تاريخ البداية يجب ألا يتجاوز تاريخ النهاية",
		path: ["endDate"],
	});

export type CreateAccountingPeriodFormInput = z.infer<typeof createAccountingPeriodSchema>;

export type CreateAccountingPeriodInput = Pick<
	Prisma.AccountingPeriodUncheckedCreateInput,
	"clinicId" | "periodName" | "createdById"
> & {
	startDate: Date;
	endDate: Date;
	closedDocumentTypes: string[];
};
