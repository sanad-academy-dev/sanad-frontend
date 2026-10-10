import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { AllowanceType, PayrollPaymentMethod } from "@/generated/prisma/enums";

export { AllowanceType, PayrollPaymentMethod };

export const staffAllowanceSelect = {
	id: true,
	type: true,
	amount: true,
	note: true,
} satisfies Prisma.StaffAllowanceSelect;

export type StaffAllowanceResponse = Prisma.StaffAllowanceGetPayload<{
	select: typeof staffAllowanceSelect;
}>;

export const staffCompensationSelect = {
	id: true,
	staffId: true,
	baseSalary: true,
	iban: true,
	bankName: true,
	defaultPaymentMethod: true,
	effectiveFrom: true,
	notes: true,
	updatedAt: true,
	allowances: { select: staffAllowanceSelect, orderBy: { createdAt: "asc" } },
} satisfies Prisma.StaffCompensationSelect;

export type StaffCompensationResponse = Prisma.StaffCompensationGetPayload<{
	select: typeof staffCompensationSelect;
}>;

// ─── مخططات النماذج (Zod) ─────────────────────────────────────

// آيبان سعودي: SA + رقمان تحقق + 18 خانة = 24 محرفاً
const SAUDI_IBAN = /^SA\d{22}$/;

export const staffAllowanceFormSchema = z.object({
	type: z.enum(AllowanceType, { error: "نوع البدل مطلوب" }),
	amount: z.coerce.number({ error: "المبلغ مطلوب" }).min(0, "المبلغ لا يمكن أن يكون سالبًا"),
	note: z.string().optional(),
});

export const staffCompensationFormSchema = z.object({
	baseSalary: z.coerce
		.number({ error: "الراتب الأساسي مطلوب" })
		.min(0, "الراتب الأساسي لا يمكن أن يكون سالبًا"),
	iban: z
		.string()
		.optional()
		.refine(
			(v) => !v || SAUDI_IBAN.test(v.replace(/\s/g, "")),
			"الآيبان غير صحيح (SA ثم 22 رقمًا)",
		),
	bankName: z.string().optional(),
	defaultPaymentMethod: z.enum(PayrollPaymentMethod, { error: "طريقة الصرف مطلوبة" }),
	effectiveFrom: z.string().optional(),
	notes: z.string().optional(),
	allowances: z.array(staffAllowanceFormSchema).default([]),
});

// المدخلات قبل التحويل (z.coerce يقبل نصوص حقول الأرقام)
export type StaffCompensationFormInput = z.input<typeof staffCompensationFormSchema>;
// القيم بعد التحقق والتحويل — ما يُرسل للخادم
export type StaffCompensationFormValues = z.output<typeof staffCompensationFormSchema>;
export type StaffAllowanceFormInput = z.input<typeof staffAllowanceFormSchema>;

// ─── مدخلات طبقة الوصول للبيانات ──────────────────────────────

export type UpsertStaffAllowanceInput = Pick<
	Prisma.StaffAllowanceUncheckedCreateInput,
	"type" | "amount"
> &
	Partial<Pick<Prisma.StaffAllowanceUncheckedCreateInput, "note">>;

export type UpsertStaffCompensationInput = Pick<
	Prisma.StaffCompensationUncheckedCreateInput,
	"baseSalary"
> &
	Partial<
		Pick<
			Prisma.StaffCompensationUncheckedCreateInput,
			"iban" | "bankName" | "defaultPaymentMethod" | "effectiveFrom" | "notes"
		>
	> & { allowances?: UpsertStaffAllowanceInput[] };

// ─── تسميات العرض ─────────────────────────────────────────────

export const PAYROLL_PAYMENT_METHOD_LABEL: Record<PayrollPaymentMethod, string> = {
	TRANSFER: "تحويل بنكي",
	CASH: "نقدي",
	CHECK: "شيك",
};

export const ALLOWANCE_TYPE_LABEL: Record<AllowanceType, string> = {
	HOUSING: "بدل سكن",
	TRANSPORT: "بدل مواصلات",
	FOOD: "بدل إعاشة",
	PHONE: "بدل هاتف",
	OTHER: "أخرى",
};
