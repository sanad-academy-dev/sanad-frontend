import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { DueDateBasis, PaymentDiscountType } from "@/generated/prisma/enums";

/** [P3.5] Types for Payment Terms + Templates (BRD §4.9). BROWSER-SAFE (no Prisma values). */

export { DueDateBasis, PaymentDiscountType };

export const paymentTermSelect = {
	id: true,
	clinicId: true,
	paymentTermName: true,
	invoicePortion: true,
	dueDateBasedOn: true,
	creditDays: true,
	creditMonths: true,
	modeOfPaymentId: true,
	discountType: true,
	discount: true,
	discountValidityBasedOn: true,
	discountValidity: true,
	createdAt: true,
	updatedAt: true,
	modeOfPayment: { select: { modeOfPaymentName: true } },
} as const satisfies Prisma.PaymentTermSelect;

export type PaymentTermResponse = Prisma.PaymentTermGetPayload<{
	select: typeof paymentTermSelect;
}>;

export const paymentTermsTemplateSelect = {
	id: true,
	clinicId: true,
	templateName: true,
	allocatePaymentBasedOnPaymentTerms: true,
	createdAt: true,
	updatedAt: true,
	rows: {
		orderBy: { idx: "asc" },
		select: {
			id: true,
			idx: true,
			termId: true,
			term: { select: { paymentTermName: true, invoicePortion: true } },
		},
	},
} as const satisfies Prisma.PaymentTermsTemplateSelect;

export type PaymentTermsTemplateResponse = Prisma.PaymentTermsTemplateGetPayload<{
	select: typeof paymentTermsTemplateSelect;
}>;

/* ── zod (forms) ──────────────────────────────────────────────────────────────────────── */

const portionString = z
	.string()
	.regex(/^\d+(\.\d{1,9})?$/, "النسبة يجب أن تكون رقمًا موجبًا")
	.refine((v) => Number(v) > 0 && Number(v) <= 100, "النسبة بين 0 و100");

export const createPaymentTermSchema = z.object({
	paymentTermName: z.string({ error: "اسم الشرط مطلوب" }).trim().min(1, "اسم الشرط مطلوب"),
	invoicePortion: portionString.default("100"),
	dueDateBasedOn: z.enum(DueDateBasis).default("DAYS_AFTER_INVOICE_DATE"),
	creditDays: z.coerce.number().int("أيام صحيحة").min(0).default(0),
	creditMonths: z.coerce.number().int("شهور صحيحة").min(0).default(0),
	modeOfPaymentId: z.string().trim().min(1).nullish(),
	discountType: z.enum(PaymentDiscountType).default("PERCENTAGE"),
	discount: z
		.string()
		.regex(/^\d+(\.\d{1,9})?$/, "قيمة غير صالحة")
		.default("0"),
	discountValidityBasedOn: z.enum(DueDateBasis).default("DAYS_AFTER_INVOICE_DATE"),
	discountValidity: z.coerce.number().int().min(0).default(0),
});
export type CreatePaymentTermFormInput = z.input<typeof createPaymentTermSchema>;
export type CreatePaymentTermFormValues = z.output<typeof createPaymentTermSchema>;

export const createPaymentTermsTemplateSchema = z.object({
	templateName: z.string({ error: "اسم القالب مطلوب" }).trim().min(1, "اسم القالب مطلوب"),
	allocatePaymentBasedOnPaymentTerms: z.boolean().optional().default(false),
	termIds: z.array(z.string().trim().min(1)).min(1, "أضف شرطًا واحدًا على الأقل"),
});
export type CreatePaymentTermsTemplateFormInput = z.input<
	typeof createPaymentTermsTemplateSchema
>;
export type CreatePaymentTermsTemplateFormValues = z.output<
	typeof createPaymentTermsTemplateSchema
>;
