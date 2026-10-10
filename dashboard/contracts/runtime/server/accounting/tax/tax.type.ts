import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { TaxAddDeduct, TaxChargeType, TaxRowCategory } from "@/generated/prisma/enums";

/** [P4.1] Types for the §4.11 tax masters. BROWSER-SAFE (no Prisma values). */

export { TaxAddDeduct, TaxChargeType, TaxRowCategory };

const rate = z.string().regex(/^\d+(\.\d{1,9})?$/, "قيمة غير صالحة");

/* ── selects ──────────────────────────────────────────────────────────────────────────── */

const taxRowSelect = {
	id: true,
	idx: true,
	chargeType: true,
	accountHeadId: true,
	rate: true,
	taxAmount: true,
	rowId: true,
	description: true,
	includedInPrintRate: true,
	costCenterId: true,
	accountHead: { select: { accountName: true } },
} as const;

export const salesTaxTemplateSelect = {
	id: true,
	clinicId: true,
	title: true,
	isDefault: true,
	disabled: true,
	taxCategoryId: true,
	createdAt: true,
	updatedAt: true,
	taxes: { orderBy: { idx: "asc" }, select: taxRowSelect },
} as const satisfies Prisma.SalesTaxesAndChargesTemplateSelect;

export type SalesTaxTemplateResponse = Prisma.SalesTaxesAndChargesTemplateGetPayload<{
	select: typeof salesTaxTemplateSelect;
}>;

export const purchaseTaxTemplateSelect = {
	id: true,
	clinicId: true,
	title: true,
	isDefault: true,
	disabled: true,
	taxCategoryId: true,
	createdAt: true,
	updatedAt: true,
	taxes: {
		orderBy: { idx: "asc" },
		select: { ...taxRowSelect, category: true, addDeductTax: true },
	},
} as const satisfies Prisma.PurchaseTaxesAndChargesTemplateSelect;

export type PurchaseTaxTemplateResponse = Prisma.PurchaseTaxesAndChargesTemplateGetPayload<{
	select: typeof purchaseTaxTemplateSelect;
}>;

export const itemTaxTemplateSelect = {
	id: true,
	clinicId: true,
	title: true,
	disabled: true,
	createdAt: true,
	updatedAt: true,
	rows: {
		select: {
			id: true,
			taxTypeAccountId: true,
			taxRate: true,
			taxType: { select: { accountName: true } },
		},
	},
} as const satisfies Prisma.ItemTaxTemplateSelect;

export type ItemTaxTemplateResponse = Prisma.ItemTaxTemplateGetPayload<{
	select: typeof itemTaxTemplateSelect;
}>;

export const taxCategorySelect = {
	id: true,
	clinicId: true,
	title: true,
	disabled: true,
	createdAt: true,
	updatedAt: true,
} as const satisfies Prisma.TaxCategorySelect;

export type TaxCategoryResponse = Prisma.TaxCategoryGetPayload<{
	select: typeof taxCategorySelect;
}>;

export const taxRuleSelect = {
	id: true,
	clinicId: true,
	taxType: true,
	salesTaxTemplateId: true,
	purchaseTaxTemplateId: true,
	partyType: true,
	partyId: true,
	itemId: true,
	itemCategory: true,
	taxCategoryId: true,
	fromDate: true,
	toDate: true,
	priority: true,
	createdAt: true,
	updatedAt: true,
	salesTemplate: { select: { title: true } },
	purchaseTemplate: { select: { title: true } },
} as const satisfies Prisma.TaxRuleSelect;

export type TaxRuleResponse = Prisma.TaxRuleGetPayload<{ select: typeof taxRuleSelect }>;

/* ── zod (forms) ──────────────────────────────────────────────────────────────────────── */

export const taxRowSchema = z.object({
	chargeType: z.enum(TaxChargeType).default("ON_NET_TOTAL"),
	accountHeadId: z.string({ error: "حساب الضريبة مطلوب" }).trim().min(1, "حساب الضريبة مطلوب"),
	rate: rate.default("0"),
	taxAmount: rate.default("0"),
	rowId: z.coerce.number().int().min(1).nullish(),
	description: z.string({ error: "الوصف مطلوب" }).trim().min(1, "الوصف مطلوب"),
	includedInPrintRate: z.boolean().optional().default(false),
	costCenterId: z.string().trim().min(1).nullish(),
	// purchase-only — ignored for sales templates; the service defaults them
	category: z.enum(TaxRowCategory).optional(),
	addDeductTax: z.enum(TaxAddDeduct).optional(),
});
export type TaxRowFormValues = z.output<typeof taxRowSchema>;

export const createTaxTemplateSchema = z.object({
	title: z.string({ error: "اسم القالب مطلوب" }).trim().min(1, "اسم القالب مطلوب"),
	isDefault: z.boolean().optional().default(false),
	disabled: z.boolean().optional().default(false),
	taxCategoryId: z.string().trim().min(1).nullish(),
	taxes: z.array(taxRowSchema).min(1, "أضف سطر ضريبة واحدًا على الأقل"),
});
export type CreateTaxTemplateFormInput = z.input<typeof createTaxTemplateSchema>;
export type CreateTaxTemplateFormValues = z.output<typeof createTaxTemplateSchema>;

export const createItemTaxTemplateSchema = z.object({
	title: z.string({ error: "اسم القالب مطلوب" }).trim().min(1, "اسم القالب مطلوب"),
	disabled: z.boolean().optional().default(false),
	rows: z
		.array(
			z.object({ taxTypeAccountId: z.string().trim().min(1), taxRate: rate.default("0") }),
		)
		.min(1, "أضف حسابًا واحدًا على الأقل"),
});
export type CreateItemTaxTemplateFormInput = z.input<typeof createItemTaxTemplateSchema>;
export type CreateItemTaxTemplateFormValues = z.output<typeof createItemTaxTemplateSchema>;

export const createTaxCategorySchema = z.object({
	title: z.string({ error: "الاسم مطلوب" }).trim().min(1, "الاسم مطلوب"),
	disabled: z.boolean().optional().default(false),
});
export type CreateTaxCategoryFormValues = z.output<typeof createTaxCategorySchema>;

export const createTaxRuleSchema = z
	.object({
		taxType: z.enum(["SALES", "PURCHASE"]).default("SALES"),
		salesTaxTemplateId: z.string().trim().min(1).nullish(),
		purchaseTaxTemplateId: z.string().trim().min(1).nullish(),
		partyType: z.string().trim().min(1).nullish(),
		partyId: z.string().trim().min(1).nullish(),
		itemId: z.string().trim().min(1).nullish(),
		itemCategory: z.string().trim().min(1).nullish(),
		taxCategoryId: z.string().trim().min(1).nullish(),
		fromDate: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/)
			.nullish(),
		toDate: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/)
			.nullish(),
		priority: z.coerce.number().int().min(1).default(1),
	})
	.refine(
		(rule) =>
			rule.taxType === "SALES" ? !!rule.salesTaxTemplateId : !!rule.purchaseTaxTemplateId,
		{ error: "قالب الضريبة مطلوب لنوع القاعدة" },
	);
export type CreateTaxRuleFormInput = z.input<typeof createTaxRuleSchema>;
export type CreateTaxRuleFormValues = z.output<typeof createTaxRuleSchema>;
