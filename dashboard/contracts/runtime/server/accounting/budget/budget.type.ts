import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { BudgetAction, BudgetAgainst, DocStatus } from "@/generated/prisma/enums";

export { BudgetAction, BudgetAgainst, DocStatus };

/** [P10.3] Budget types (BRD §13). */

export const budgetSelect = {
	id: true,
	clinicId: true,
	docstatus: true,
	amendedFromId: true,
	fiscalYear: true,
	budgetAgainst: true,
	costCenterId: true,
	project: true,
	monthlyDistributionId: true,
	applicableOnBookingActualExpenses: true,
	actionIfAnnualExceeded: true,
	actionIfAccumulatedMonthlyExceeded: true,
	applicableOnMaterialRequest: true,
	actionIfAnnualExceededOnMr: true,
	actionIfAccumulatedMonthlyExceededOnMr: true,
	applicableOnPurchaseOrder: true,
	actionIfAnnualExceededOnPo: true,
	actionIfAccumulatedMonthlyExceededOnPo: true,
	createdById: true,
	submittedAt: true,
	submittedById: true,
	cancelledAt: true,
	cancelledById: true,
	createdAt: true,
	updatedAt: true,
	costCenter: { select: { costCenterName: true } },
	monthlyDistribution: {
		select: {
			distributionName: true,
			percentages: {
				orderBy: { month: "asc" },
				select: { month: true, percentage: true },
			},
		},
	},
	accounts: {
		orderBy: { idx: "asc" },
		select: {
			id: true,
			idx: true,
			accountId: true,
			budgetAmount: true,
			account: { select: { accountName: true, accountNumber: true, rootType: true } },
		},
	},
} as const satisfies Prisma.BudgetSelect;

export type BudgetResponse = Prisma.BudgetGetPayload<{ select: typeof budgetSelect }>;

const amountString = z
	.string()
	.regex(/^\d+(\.\d{1,9})?$/, "المبلغ يجب أن يكون رقمًا موجبًا بحد أقصى 9 منازل عشرية");

const budgetActionSchema = z.enum(BudgetAction);

export const createBudgetSchema = z
	.object({
		fiscalYear: z.string({ error: "السنة المالية مطلوبة" }).trim().min(1),
		budgetAgainst: z.enum(BudgetAgainst).default("COST_CENTER"),
		costCenterId: z.string().trim().min(1).nullish(),
		project: z.string().trim().min(1).nullish(),
		monthlyDistributionId: z.string().trim().min(1).nullish(),
		applicableOnBookingActualExpenses: z.boolean().optional().default(true),
		actionIfAnnualExceeded: budgetActionSchema.optional().default("STOP"),
		actionIfAccumulatedMonthlyExceeded: budgetActionSchema.optional().default("WARN"),
		accounts: z
			.array(
				z.object({
					accountId: z.string().trim().min(1),
					budgetAmount: amountString,
				}),
			)
			.min(1, "أضف حساب موازنة واحدًا على الأقل"),
	})
	.refine(
		(value) =>
			value.budgetAgainst === "COST_CENTER" ? !!value.costCenterId : !!value.project,
		{ error: "حدد مركز التكلفة أو المشروع بحسب نوع الموازنة", path: ["costCenterId"] },
	);

export type CreateBudgetFormInput = z.infer<typeof createBudgetSchema>;

export type CreateBudgetInput = Pick<
	Prisma.BudgetUncheckedCreateInput,
	| "clinicId"
	| "fiscalYear"
	| "budgetAgainst"
	| "costCenterId"
	| "project"
	| "monthlyDistributionId"
	| "applicableOnBookingActualExpenses"
	| "actionIfAnnualExceeded"
	| "actionIfAccumulatedMonthlyExceeded"
	| "createdById"
> & {
	accounts: { accountId: string; budgetAmount: string }[];
};
