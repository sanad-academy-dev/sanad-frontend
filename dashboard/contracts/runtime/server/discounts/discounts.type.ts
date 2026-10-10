import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { type DiscountStatus, DiscountType, OwnerType } from "@/generated/prisma/enums";

export type { DiscountStatus, DiscountType };

// ─── Response shapes ─────────────────────────────────────

const discountSelect = {
	id: true,
	code: true,
	clinicId: true,
	couponCode: true,
	name: true,
	type: true,
	value: true,
	validFrom: true,
	validTo: true,
	usageLimit: true,
	perCustomerLimit: true,
	customerType: true,
	usedCount: true,
	status: true,
	notes: true,
	editsCount: true,
	createdAt: true,
	updatedAt: true,
	services: { select: { id: true, name: true } },
} satisfies Prisma.DiscountSelect;

export const discountSelectShape = discountSelect;

export type DiscountResponse = Prisma.DiscountGetPayload<{
	select: typeof discountSelect;
}>;

export type DiscountStatsResponse = {
	total: number;
	usages: number;
	active: number;
	savings: number;
	expired: number;
};

// ─── DAO input types (derived from Prisma) ───────────────

export type CreateDiscountInput = Pick<
	Prisma.DiscountUncheckedCreateInput,
	| "couponCode"
	| "name"
	| "type"
	| "value"
	| "usageLimit"
	| "perCustomerLimit"
	| "customerType"
	| "notes"
> & {
	validFrom?: Date | null;
	validTo?: Date | null;
	serviceIds?: string[];
};

export type UpdateDiscountInput = Partial<CreateDiscountInput>;

// ─── Form schema (Zod, source of truth for the create/edit sheet) ─

export const discountFormSchema = z
	.object({
		name: z.string({ error: "اسم الخصم مطلوب" }).min(1, "اسم الخصم مطلوب"),
		couponCode: z.string({ error: "كود الخصم مطلوب" }).min(1, "كود الخصم مطلوب"),
		type: z.enum(DiscountType, { error: "نوع الخصم مطلوب" }),
		value: z.coerce
			.number({ error: "قيمة الخصم مطلوبة" })
			.gt(0, "قيمة الخصم يجب أن تكون أكبر من صفر"),
		validFrom: z.date().optional().nullable(),
		validTo: z.date().optional().nullable(),
		usageLimit: z.coerce
			.number({ error: "يجب أن يكون رقمًا" })
			.int("يجب أن يكون عددًا صحيحًا")
			.min(0, "لا يمكن أن يكون سالبًا")
			.optional()
			.default(0),
		perCustomerLimit: z.coerce
			.number({ error: "يجب أن يكون رقمًا" })
			.int("يجب أن يكون عددًا صحيحًا")
			.min(0, "لا يمكن أن يكون سالبًا")
			.optional()
			.default(0),
		customerType: z.enum(OwnerType).optional().default("ALL"),
		serviceIds: z.array(z.string()).optional().default([]),
		notes: z.string().optional().nullable(),
	})
	.refine((data) => !data.validFrom || !data.validTo || data.validTo >= data.validFrom, {
		error: "تاريخ نهاية الصلاحية يجب أن يكون بعد تاريخ البداية",
		path: ["validTo"],
	});

// input = القيم أثناء تعبئة النموذج (قبل الـ coerce)، output = القيم بعد التحقّق
export type DiscountFormInput = z.input<typeof discountFormSchema>;
export type DiscountFormValues = z.output<typeof discountFormSchema>;
