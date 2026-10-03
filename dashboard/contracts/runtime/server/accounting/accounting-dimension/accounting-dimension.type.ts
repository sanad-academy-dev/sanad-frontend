import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";

/** [P10.4] Accounting Dimension types (BRD §4.5). */

export const accountingDimensionSelect = {
	id: true,
	clinicId: true,
	slot: true,
	dimensionName: true,
	referenceDoctype: true,
	disabled: true,
	mandatoryForBalanceSheet: true,
	mandatoryForProfitAndLoss: true,
	defaultDimensionValue: true,
	autoPostBalancingEntry: true,
	offsettingAccountId: true,
	createdById: true,
	createdAt: true,
	updatedAt: true,
	offsettingAccount: { select: { accountName: true } },
	filters: {
		where: { disabled: false },
		select: {
			id: true,
			allowOnly: true,
			disabled: true,
			accounts: { select: { accountId: true } },
			values: { select: { dimValue: true } },
		},
	},
} as const satisfies Prisma.AccountingDimensionSelect;

export type AccountingDimensionResponse = Prisma.AccountingDimensionGetPayload<{
	select: typeof accountingDimensionSelect;
}>;

export const upsertAccountingDimensionSchema = z.object({
	slot: z.coerce.number({ error: "رقم الخانة مطلوب" }).int().min(1).max(4),
	dimensionName: z.string({ error: "اسم البعد مطلوب" }).trim().min(1),
	referenceDoctype: z.string().trim().min(1).nullish(),
	disabled: z.boolean().optional().default(false),
	mandatoryForBalanceSheet: z.boolean().optional().default(false),
	mandatoryForProfitAndLoss: z.boolean().optional().default(false),
	defaultDimensionValue: z.string().trim().min(1).nullish(),
	autoPostBalancingEntry: z.boolean().optional().default(false),
	offsettingAccountId: z.string().trim().min(1).nullish(),
});

export type UpsertAccountingDimensionFormInput = z.infer<
	typeof upsertAccountingDimensionSchema
>;

export const upsertDimensionFilterSchema = z.object({
	allowOnly: z.boolean().optional().default(true),
	disabled: z.boolean().optional().default(false),
	accountIds: z.array(z.string().trim().min(1)).min(1, "اختر حسابًا واحدًا على الأقل"),
	dimValues: z.array(z.string().trim().min(1)).min(1, "أضف قيمة واحدة على الأقل"),
});

export type UpsertDimensionFilterFormInput = z.infer<typeof upsertDimensionFilterSchema>;
